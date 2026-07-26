import { useEffect, useState } from "react";
import { kml } from "@tmcw/togeojson";

export default function useKmlData() {
  const [geojson, setGeojson] = useState(null);

  useEffect(() => {
    async function loadKml() {
      try {
        const response = await fetch("/Audit 24 May.kml");

        const text = await response.text();

        const xml = new DOMParser().parseFromString(
          text,
          "text/xml"
        );

        const converted = kml(xml);

        setGeojson(converted);
      } catch (error) {
        console.error(error);
      }
    }

    loadKml();
  }, []);

  return geojson;
}