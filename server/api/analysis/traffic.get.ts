import { object, optional, parse, string } from "valibot";

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
    startDate: optional(string()),
    endDate: optional(string()),
  });

  // Parse and validate query parameters
  const query = getQuery(event);
  const { startDate, endDate } = parse(querySchema, query);

  // Validate and format dates (default to last 7 days if not provided)
  const today = new Date();
  const defaultEndDate = today.toISOString().split("T")[0];
  const defaultStartDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const formattedStartDate = startDate || defaultStartDate;
  const formattedEndDate = endDate || defaultEndDate;

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (
    !dateRegex.test(formattedStartDate) ||
    !dateRegex.test(formattedEndDate)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: t("Invalid date format. Use YYYY-MM-DD."),
    });
  }

  // Construct GraphQL query
  const graphqlQuery = `
    query {
      viewer {
        zones(filter: { zoneTag: "${flareZoneId}" }) {
          httpRequests1dGroups(
            filter: { date_geq: "${formattedStartDate}", date_leq: "${formattedEndDate}" }
            limit: 1000
            orderBy: [date_ASC]
          ) {
            dimensions {
              date
            }
            sum {
              pageViews
            }
            uniq {
              uniques
            }
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
    body: JSON.stringify({ query: graphqlQuery }),
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

  // Extract and format traffic data
  const trafficData = data.viewer.zones[0].httpRequests1dGroups.map((item) => ({
    date: item.dimensions.date,
    pageViews: item.sum.pageViews,
    uniqueVisits: item.uniq.uniques,
  }));

  return trafficData;
});
