import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";

import { userIcon, stopIcon, auditedStopIcon } from "../utils/icons";

import FlyToStop from "./FlyToStop";
import FlyToUser from "./FlyToUser";
import RecenterMap from "./RecenterMap";
import MapClickHandler from "./MapClickHandler";

export default function BusMap({
  selectedStop,
  setSelectedStop,
  userLocation,
  nearbyStops,
  isAddingStop,
  setIsAddingStop,
  audits,
  viewMode,
}) {
  return (
    <MapContainer
      center={[17.45, 78.38]}
      zoom={15}
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <MapClickHandler
        isAddingStop={isAddingStop}
        setSelectedStop={setSelectedStop}
        setIsAddingStop={setIsAddingStop}
      />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains={"abcd"}
      />

      <FlyToUser userLocation={userLocation} />
      <RecenterMap userLocation={userLocation} />
      {/* <FlyToStop selectedStop={selectedStop} /> */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
          <Popup>Your Location</Popup>
        </Marker>
      )}
      {userLocation && (
        <Circle center={[userLocation.lat, userLocation.lon]} radius={1000} />
      )}
      {viewMode === "public" &&
        nearbyStops?.map((stop) => (
          <Marker
            key={stop.stop_id}
            position={[Number(stop.stop_lat), Number(stop.stop_lon)]}
            icon={stopIcon}
            eventHandlers={{
              click: () => {
                setSelectedStop(stop);
              },
            }}
          >
            <Popup>
              <strong>{stop.stop_name}</strong>
              <br />
              {stop.distance.toFixed(2)} km
            </Popup>
          </Marker>
        ))}
      {viewMode === "audit" &&
        (audits ?? []).map((audit) => (
          <Marker
            key={audit._uuid}
            position={[
              Number(audit._geolocation[0]),
              Number(audit._geolocation[1]),
            ]}
            icon={auditedStopIcon}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <strong style={{ display: "block", marginBottom: 6 }}>
                  {audit.Name_of_Bus_Stop}
                </strong>
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                  <div>
                    <strong>Roof:</strong> {audit.Roof || "Not available"}
                  </div>
                  <div>
                    <strong>Lighting:</strong> {audit.Lighting || "Not available"}
                  </div>
                  <div>
                    <strong>Seating:</strong> {audit.Seating || "Not available"}
                  </div>
                  <div>
                    <strong>Route Map:</strong> {audit.Route_map_available || "Not available"}
                  </div>
                  <div>
                    <strong>Schedule:</strong> {audit.Schedule_available || "Not available"}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      {selectedStop?.stop_lat && selectedStop?.stop_lon && (
        <Marker
          position={[
            Number(selectedStop.stop_lat),
            Number(selectedStop.stop_lon),
          ]}
        />
      )}
      {selectedStop?.audit_type === "manual" && (
        <Marker position={[selectedStop.stop_lat, selectedStop.stop_lon]}>
          <Popup>Custom Stop</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
