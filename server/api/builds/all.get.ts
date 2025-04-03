import { drizzle } from "drizzle-orm/d1";
import { sql } from "drizzle-orm/sql";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  // Check that the user has permission to create a commit
  if (await denies(event, readBuild)) {
    throw createError({
      statusCode: 403,
      statusMessage: t("Forbidden: You do not have permission to get builds."),
    });
  }
  try {
    const { DB } = event.context.cloudflare.env;
    const db = drizzle(DB);

    // Get pagination parameters from query
    const query = getQuery(event);
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    // Query the total count of builds
    const totalResult = await db.select({ count: sql`COUNT(*)` }).from(builds);
    const total = Number(totalResult[0].count);

    // Query builds with pagination and order by createdAt descending
    const buildsData = await db
      .select()
      .from(builds)
      .orderBy(builds.createdAt, "desc")
      .limit(pageSize)
      .offset(offset);

    // If no builds, return empty array with total count
    if (!buildsData.length) {
      return { builds: [], total, page, pageSize };
    }

    // Get build IDs from the fetched builds
    const buildIds = buildsData.map((b) => b.id);

    // Fetch all commits for these build IDs
    const commitsData = await db
      .select()
      .from(commits)
      .where(sql`build_id IN (${buildIds.join(",")})`);

    // Group commits by buildId
    const commitsByBuild: Record<number, any[]> = {};
    buildIds.forEach((id) => (commitsByBuild[id] = []));
    for (const commit of commitsData) {
      if (commitsByBuild[commit.buildId]) {
        commitsByBuild[commit.buildId].push(commit);
      }
    }

    // Attach the commits array to each build
    const buildsWithCommits = buildsData.map((build) => ({
      ...build,
      commits: commitsByBuild[build.id] || [],
    }));

    return {
      builds: buildsWithCommits,
      total,
      page,
      pageSize,
    };
  } catch (error: any) {
    console.error("Error fetching builds:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || t("Internal Server Error"),
    });
  }
});
