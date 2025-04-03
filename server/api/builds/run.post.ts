import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  // Expect a buildId in the request body
  const body = await readBody(event);
  const { buildId } = body;
  if (!buildId) {
    throw createError({
      statusCode: 400,
      statusMessage: t("Missing buildId in request body"),
    });
  }

  // Initialize DB connection
  const { DB } = event.context.cloudflare.env;
  const db = drizzle(DB);

  // Get the build record
  const build = await db
    .select()
    .from(builds)
    .where(eq(builds.id, buildId))
    .get();
  if (!build) {
    throw createError({
      statusCode: 404,
      statusMessage: t("Build not found"),
    });
  }

  // Fetch all commits for the build
  const buildCommits = await db
    .select()
    .from(commits)
    .where(eq(commits.buildId, buildId))
    .all();

  if (!buildCommits.length) {
    throw createError({
      statusCode: 404,
      statusMessage: t("No commits found for this build"),
    });
  }

  // Aggregate commit messages (you could also aggregate other info as needed)
  const aggregatedMessage = buildCommits
    .map((c) => `- ${c.message}`)
    .join("\n");

  // --- GitHub API integration below ---

  // Get GitHub credentials from environment
  const githubToken = process.env.GITHUB_TOKEN;
  const githubOwner = process.env.GITHUB_OWNER;
  const githubRepo = process.env.GITHUB_REPO;
  if (!githubToken || !githubOwner || !githubRepo) {
    throw createError({
      statusCode: 500,
      statusMessage: t("GitHub credentials are missing"),
    });
  }

  // Step 1: Get the current master branch reference
  const refResponse = await fetch(
    `https://api.github.com/repos/${githubOwner}/${githubRepo}/git/ref/heads/master`,
    {
      headers: { Authorization: `token ${githubToken}` },
    }
  );
  if (!refResponse.ok) {
    throw createError({
      statusCode: refResponse.status,
      statusMessage: t("Failed to get master branch ref"),
    });
  }
  const refData = await refResponse.json();
  const currentSha = refData.object.sha;

  // Step 2: Get the commit object for the current master commit
  const commitResponse = await fetch(
    `https://api.github.com/repos/${githubOwner}/${githubRepo}/git/commits/${currentSha}`,
    {
      headers: { Authorization: `token ${githubToken}` },
    }
  );
  if (!commitResponse.ok) {
    throw createError({
      statusCode: commitResponse.status,
      statusMessage: t("Failed to get current commit"),
    });
  }
  const commitData = await commitResponse.json();
  const baseTreeSha = commitData.tree.sha;

  // Step 3: Create a new tree
  // (For simplicity, we assume no file changes – the tree remains the same.)
  const treeResponse = await fetch(
    `https://api.github.com/repos/${githubOwner}/${githubRepo}/git/trees`,
    {
      method: "POST",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: [],
      }),
    }
  );
  if (!treeResponse.ok) {
    throw createError({
      statusCode: treeResponse.status,
      statusMessage: t("Failed to create new tree"),
    });
  }
  const treeData = await treeResponse.json();
  const newTreeSha = treeData.sha;

  // Step 4: Create a new commit using the aggregated message
  const commitPayload = {
    message: `Build ${build.buildName}\n\n${aggregatedMessage}`,
    tree: newTreeSha,
    parents: [currentSha],
  };
  const newCommitResponse = await fetch(
    `https://api.github.com/repos/${githubOwner}/${githubRepo}/git/commits`,
    {
      method: "POST",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commitPayload),
    }
  );
  if (!newCommitResponse.ok) {
    throw createError({
      statusCode: newCommitResponse.status,
      statusMessage: t("Failed to create new commit"),
    });
  }
  const newCommitData = await newCommitResponse.json();
  const newCommitSha = newCommitData.sha;

  // Step 5: Update the master branch to point to the new commit
  const updateRefResponse = await fetch(
    `https://api.github.com/repos/${githubOwner}/${githubRepo}/git/refs/heads/master`,
    {
      method: "PATCH",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sha: newCommitSha,
      }),
    }
  );
  if (!updateRefResponse.ok) {
    throw createError({
      statusCode: updateRefResponse.status,
      statusMessage: t("Failed to update master branch ref"),
    });
  }

  return {
    message: t("Build committed and pushed successfully"),
    commitSha: newCommitSha,
  };
});
