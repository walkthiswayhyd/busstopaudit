import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

export default function FlyToUser({
  userLocation,
}) {
  const map = useMap();
  const hasCentered = useRef(false);

  useEffect(() => {
    if (
      !userLocation ||
      hasCentered.current
    )
      return;

    map.flyTo(
      [
        userLocation.lat,
        userLocation.lon,
      ],
      16
    );

    hasCentered.current = true;
  }, [userLocation, map]);

  return null;
}