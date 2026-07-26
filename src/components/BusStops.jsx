import { Marker, Popup } from "react-leaflet";
import useKmlData from "../hooks/useKmlData";

export default function BusStops() {
  const geojson = useKmlData();

  if (!geojson) return null;

  return (
    <>
      {geojson.features.map((feature, index) => {
        if (!feature.geometry || feature.geometry.type !== "Point") {
          return null;
        }
        const [lng, lat] = feature.geometry.coordinates;

        return (
          <Marker key={index} position={[lat, lng]}>
            <Popup>{feature.properties.name}</Popup>
          </Marker>
        );
      })}
    </>
  );
}
