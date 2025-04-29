import { object, parse, string } from "valibot";

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  // Check permission to read dashboard
  if (await denies(event, readDashboard)) {
    throw createError({
      statusCode: 403,
      statusMessage: t(
        "Forbidden: You do not have permission to read dashboard."
      ),
    });
  }

  // Get Cloudflare API token and zone ID from runtime config
  const { flareToken, flareZoneId } = useRuntimeConfig(event);
  if (!flareToken || !flareZoneId) {
    throw createError({
      statusCode: 500,
      statusMessage: t("Cloudflare API token or zone ID is missing."),
    });
  }

  // Define query parameter schema
  const querySchema = object({
    pageRoute: string(),
  });

  // Parse and validate query parameters
  const query = getQuery(event);
  const { pageRoute } = parse(querySchema, query);

  // Decode pageRoute to handle URL-encoded values (e.g., blog%2Ftest%2FtileOne -> blog/test/tileOne)
  let decodedPageRoute: string;
  try {
    decodedPageRoute = decodeURIComponent(pageRoute);
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: t("Invalid page route encoding."),
    });
  }

  // Validate decoded pageRoute (non-empty and valid URL path characters, including slashes)
  const validPathRegex = /^[a-zA-Z0-9-_\/]+$/;
  if (!decodedPageRoute || !validPathRegex.test(decodedPageRoute)) {
    throw createError({
      statusCode: 400,
      statusMessage: t(
        "Page route must be a valid path (e.g., 'blog/test/tileOne')."
      ),
    });
  }

  // Construct the clientRequestPath by prepending '/' if not already present
  const clientRequestPath = decodedPageRoute.startsWith("/")
    ? decodedPageRoute
    : `/${decodedPageRoute}`;

  console.log(clientRequestPath);

  const expath = "/about";
  // Construct GraphQL query
  const graphqlQuery = `
    query GetPageViews($path: String!) {
      viewer {
        zones(filter: { zoneTag: "${flareZoneId}" }) {
          httpRequestsAdaptiveGroups(
            filter: { clientRequestPath: $path }
            limit: 1
          ) {
            count
          }
        }
      }
    }
  `;

  // Fetch data from Cloudflare API
  const response = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${flareToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: graphqlQuery,
      variables: { path: expath },
    }),
  });
  // Check for HTTP errors
  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: t("Failed to fetch data from Cloudflare API."),
    });
  }

  // Parse response and check for GraphQL errors
  const { data, errors } = await response.json();

  if (errors || !data?.viewer?.zones?.[0]) {
    throw createError({
      statusCode: 500,
      statusMessage: t(
        errors?.[0]?.message || "No data available for the specified zone."
      ),
    });
  }

  // Extract total page views (default to 0 if no data)
  const totalPageViews =
    data.viewer.zones[0].httpRequestsAdaptiveGroups[0]?.sum?.pageViews || 0;

  // Return total page views
  return { totalPageViews };
});
