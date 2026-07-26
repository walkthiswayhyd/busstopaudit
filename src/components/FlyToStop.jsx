import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function FlyToStop({
  selectedStop,
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedStop) return;

    map.flyTo(
      [
        selectedStop.stop_lat,
        selectedStop.stop_lon,
      ],
      18
    );
  }, [selectedStop, map]);

  return null;
}