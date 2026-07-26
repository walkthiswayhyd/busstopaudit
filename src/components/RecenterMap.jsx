import { useMap } from "react-leaflet";

export default function RecenterMap({
  userLocation,
}) {
  const map = useMap();

  const handleClick = () => {
    if (!userLocation) return;

    map.flyTo(
      [
        userLocation.lat,
        userLocation.lon,
      ],
      16
    );
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,

        width: "48px",
        height: "48px",

        borderRadius: "50%",
        border: "none",

        background: "white",

        boxShadow:
          "0 2px 8px rgba(0,0,0,.2)",

        cursor: "pointer",
      }}
    >
      📍
    </button>
  );
}