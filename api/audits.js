// Netlify Function handler
export const handler = async (event, context) => {
  try {
    const response = await fetch(
      `https://kf.kobotoolbox.org/api/v2/assets/${process.env.KOBO_ASSET_UID}/data/`,
      {
        headers: {
          Authorization: `Token ${process.env.KOBO_API_TOKEN}`,
        },
      }
    );

    const data = await response.json();
    const results = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];

    console.log("audits function results", results);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
      body: JSON.stringify({ results }),
    };
  } catch (err) {
    console.error("audits function error", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch audits" }),
    };
  }
};