import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function RecenterMap({
  userLocation,
  recenterRequest,
}) {
  const map = useMap();

  useEffect(() => {
    if (!userLocation || recenterRequest === 0) return;

    map.flyTo(
      [userLocation.lat, userLocation.lon],
      16,
      {
        duration: 0.8,
      }
    );
  }, [recenterRequest, userLocation, map]);

  return null;
}