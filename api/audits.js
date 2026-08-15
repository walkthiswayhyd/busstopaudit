export default async function handler(req, res) {
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

    res.status(200).json({
      count: allResults.length,
      results: allResults,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch audits",
    });
  }
}