import { useMapEvents } from "react-leaflet";

export default function MapClickHandler({
  isAddingStop,
  setSelectedStop,
  setIsAddingStop,
}) {
  useMapEvents({
    click(e) {
      if (!isAddingStop) return;

      const confirmed = window.confirm(
        "Are you sure you want to add a custom bus stop at this location?"
      );

      // Cancelled: nothing is created and the user stays in add-stop mode,
      // so they can pick another spot or cancel from the menu.
      if (!confirmed) return;

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