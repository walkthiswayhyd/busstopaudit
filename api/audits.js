export default async function handler(request) {
  try {
    let url = `https://kf.kobotoolbox.org/api/v2/assets/${process.env.KOBO_ASSET_UID}/data/`;

    let allResults = [];

    while (url) {
      const response = await fetch(url, {
        headers: {
          Authorization: `Token ${process.env.KOBO_API_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Kobo API returned ${response.status}`);
      }

      const data = await response.json();

      allResults = [...allResults, ...(data.results || [])];

      url = data.next;
    }

    return new Response(
      JSON.stringify({
        count: allResults.length,
        results: allResults,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Failed to fetch audits:", err);

    return new Response(
      JSON.stringify({
        error: "Failed to fetch audits",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}