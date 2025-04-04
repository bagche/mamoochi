import { eq } from "drizzle-orm";
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

  // Aggregate commit messages for the commit message
  const aggregatedMessage = buildCommits
    .map((c) => `- ${c.message}`)
    .join("\n");

  // Build file changes from commits.
  // If multiple commits update the same file, the later one overwrites the earlier ones.
  const fileChanges = {};
  for (const commit of buildCommits) {
    // Ensure commit has both a valid path and content.
    if (commit.path && typeof commit.body === "string") {
      fileChanges[commit.path] = commit.body;
    }
  }

  // Create tree items for GitHub API.
  // Sanitize file paths to remove any trailing slashes.
  const treeItems = Object.keys(fileChanges).map((filePath) => {
    const sanitizedPath = filePath.replace(/\/+$/, "");
    return {
      path: sanitizedPath,
      mode: "100644", // Standard file mode for blobs
      type: "blob",
      content: fileChanges[filePath],
    };
  });

  if (!treeItems.length) {
    throw createError({
      statusCode: 400,
      statusMessage: t("No valid file changes found for this build"),
    });
  }

  // --- GitHub API integration below ---
  const { githubToken, githubOwner, githubRepo } = useRuntimeConfig(event);
  if (!githubToken || !githubOwner || !githubRepo) {
    throw createError({
      statusCode: 500,
      statusMessage: t("GitHub credentials are missing"),
    });
  }

  // Step 1: Get the current develop branch reference
  const refResponse = await fetch(
    `https://api.github.com/repos/${githubOwner}/${githubRepo}/git/ref/heads/develop`,
    { headers: { Authorization: `token ${githubToken}` } }
  );
  if (!refResponse.ok) {
    const err = await refResponse.json();
    throw createError({
      statusCode: refResponse.status,
      statusMessage: t(
        `Failed to get develop branch ref: ${err.message || ""}`
      ),
    });
  }
  const refData = await refResponse.json();
  const currentSha = refData.object.sha;

  // Step 2: Get the current develop commit object
  const commitResponse = await fetch(
    `https://api.github.com/repos/${githubOwner}/${githubRepo}/git/commits/${currentSha}`,
    { headers: { Authorization: `token ${githubToken}` } }
  );
  if (!commitResponse.ok) {
    const err = await commitResponse.json();
    throw createError({
      statusCode: commitResponse.status,
      statusMessage: t(`Failed to get current commit: ${err.message || ""}`),
    });
  }
  const commitData = await commitResponse.json();
  const baseTreeSha = commitData.tree.sha;

  // Step 3: Create a new tree with the file changes
  const treePayload = {
    base_tree: baseTreeSha,
    tree: treeItems,
  };
  const treeResponse = await fetch(
    `https://api.github.com/repos/${githubOwner}/${githubRepo}/git/trees`,
    {
      method: "POST",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(treePayload),
    }
  );
  if (!treeResponse.ok) {
    const err = await treeResponse.json();
    throw createError({
      statusCode: treeResponse.status,
      statusMessage: t(`Failed to create new tree: ${err.message || ""}`),
    });
  }
  const treeData = await treeResponse.json();
  const newTreeSha = treeData.sha;

  // Step 4: Create a new commit using the new tree
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
    const err = await newCommitResponse.json();
    throw createError({
      statusCode: newCommitResponse.status,
      statusMessage: t(`Failed to create new commit: ${err.message || ""}`),
    });
  }
  const newCommitData = await newCommitResponse.json();
  const newCommitSha = newCommitData.sha;

  // Step 5: Update the develop branch to point to the new commit
  const updateRefResponse = await fetch(
    `https://api.github.com/repos/${githubOwner}/${githubRepo}/git/refs/heads/develop`,
    {
      method: "PATCH",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sha: newCommitSha }),
    }
  );
  if (!updateRefResponse.ok) {
    const err = await updateRefResponse.json();
    throw createError({
      statusCode: updateRefResponse.status,
      statusMessage: t(
        `Failed to update develop branch ref: ${err.message || ""}`
      ),
    });
  }

  // Update build status to "success" after successful GitHub API calls
  await db
    .update(builds)
    .set({ status: "success" })
    .where(eq(builds.id, buildId))
    .run();

  return {
    message: t("Build committed and pushed successfully"),
    commitSha: newCommitSha,
  };
});
