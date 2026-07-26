export default async function handler(req, res) {
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

    res.status(200).json(data);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch audits",
    });
  }
}