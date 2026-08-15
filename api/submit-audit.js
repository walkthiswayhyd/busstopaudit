import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const {
      stop_name,
      stop_lat,
      stop_lon,
      roof,
      lighting,
      name_displayed,
      Seating,
      route_map,
      schedule,
      pedestrian_access,
      bus_stop,
    } = req.body;

    if (!stop_name) {
      return res.status(400).json({
        error: "Stop name is required",
      });
    }

    if (stop_lat == null || stop_lon == null) {
      return res.status(400).json({
        error: "Location is required",
      });
    }

    /*
     * Get the current Kobo asset information.
     */
    const assetResponse = await fetch(
      `https://kf.kobotoolbox.org/api/v2/assets/${process.env.KOBO_ASSET_UID}/`,
      {
        headers: {
          Authorization: `Token ${process.env.KOBO_API_TOKEN}`,
        },
      }
    );

    if (!assetResponse.ok) {
      const errorText = await assetResponse.text();

      console.error("Kobo asset lookup failed:", errorText);

      return res.status(500).json({
        error: "Could not retrieve Kobo form information",
      });
    }

    const asset = await assetResponse.json();

    console.log("Kobo asset:", asset);

    /*
     * The deployed form UUID is needed by OpenRosa.
     */
    const formhubUuid =
      asset.deployment__uuid ||
      asset.deployment?.uuid ||
      asset.uuid;

    if (!formhubUuid) {
      console.error("Could not determine Kobo form UUID");

      return res.status(500).json({
        error: "Could not determine Kobo form UUID",
      });
    }

    /*
     * Version information.
     *
     * Kobo's deployment metadata can vary slightly,
     * so use whichever current version field exists.
     */
    const version =
      asset.version__content_hash ||
      asset.version ||
      "";

    /*
     * pedestrian_access is select_multiple.
     * OpenRosa expects the selected values separated by spaces.
     */
    const pedestrianAccessValue = Array.isArray(pedestrian_access)
      ? pedestrian_access.join(" ")
      : "";

    const instanceId = `uuid:${crypto.randomUUID()}`;

    /*
     * Build the exact Kobo form XML.
     */
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<a7nmHAxYyG4SGVRkST6JZB
  xmlns:jr="http://openrosa.org/javarosa"
  xmlns:orx="http://openrosa.org/xforms"
  id="a7nmHAxYyG4SGVRkST6JZB"
  ${version ? `version="${escapeXml(version)}"` : ""}
>
  <formhub>
    <uuid>${escapeXml(formhubUuid)}</uuid>
  </formhub>

  <Bus_Stop_Name>${escapeXml(stop_name)}</Bus_Stop_Name>

  <Location>${escapeXml(
    `${Number(stop_lat)} ${Number(stop_lon)}`
  )}</Location>

  <roof>${escapeXml(roof || "")}</roof>

  <lighting>${escapeXml(lighting || "")}</lighting>

  <name_displayed>${escapeXml(name_displayed || "")}</name_displayed>

  <Seating>${escapeXml(Seating || "")}</Seating>

  <route_map>${escapeXml(route_map || "")}</route_map>

  <schedule>${escapeXml(schedule || "")}</schedule>

  <pedestrian_access>${escapeXml(
    pedestrianAccessValue
  )}</pedestrian_access>

  <bus_stop>${escapeXml(bus_stop || "")}</bus_stop>

  <meta>
    <instanceID>${instanceId}</instanceID>
  </meta>
</a7nmHAxYyG4SGVRkST6JZB>`;

    console.log("Kobo XML:", xml);

    /*
     * Submit through Kobo's OpenRosa submission endpoint.
     */
    const submissionUrl =
      `https://kc.kobotoolbox.org/` +
      `${process.env.KOBO_USERNAME}/submission`;

    const formData = new FormData();

    formData.append(
      "xml_submission_file",
      new Blob([xml], {
        type: "text/xml",
      }),
      "submission.xml"
    );

    const submissionResponse = await fetch(
      submissionUrl,
      {
        method: "POST",
        headers: {
          Authorization:
            `Token ${process.env.KOBO_API_TOKEN}`,
        },
        body: formData,
      }
    );

    const responseText =
      await submissionResponse.text();

    console.log(
      "Kobo submission response:",
      submissionResponse.status,
      responseText
    );

    if (!submissionResponse.ok) {
      return res.status(500).json({
        error: "Kobo rejected the submission",
        status: submissionResponse.status,
        details: responseText,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Audit submitted successfully",
      koboResponse: responseText,
    });
  } catch (error) {
    console.error("Kobo submission error:", error);

    return res.status(500).json({
      error: "Failed to submit audit",
      details: error.message,
    });
  }
}


/*
 * Escape values before putting them inside XML.
 */
function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}