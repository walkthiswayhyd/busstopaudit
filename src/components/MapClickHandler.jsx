import { useMapEvents } from "react-leaflet";

export default function MapClickHandler({
  isAddingStop,
  setSelectedStop,
  setIsAddingStop,
}) {
  useMapEvents({
    click(e) {
      if (!isAddingStop) return;

      setSelectedStop({
        stop_id: null,
        stop_name: "Custom Stop",

        stop_lat: e.latlng.lat,
        stop_lon: e.latlng.lng,

        audit_type: "manual",
      });

      setIsAddingStop(false);
    },
  });

  return null;
}