import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
} from "react-leaflet";

import { userIcon, auditedStopIcon } from "../../utils/icons";

import FlyToStop from "../FlyToStop";
import RecenterMap from "../RecenterMap";
import MapClickHandler from "../MapClickHandler";

export default function BusMap({
  selectedStop,
  setSelectedStop,
  selectedAudit,
  setSelectedAudit,
  userLocation,
  isAddingStop,
  setIsAddingStop,
  audits,
  recenterRequest,
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

     

      <RecenterMap
        userLocation={userLocation}
        recenterRequest={recenterRequest}
      />

      <FlyToStop selectedStop={selectedAudit} />

      {/* User location */}
      {userLocation && (
        <>
          <Marker
            position={[userLocation.lat, userLocation.lon]}
            icon={userIcon}
          >
            <Popup>Your Location</Popup>
          </Marker>

          <Circle
            center={[userLocation.lat, userLocation.lon]}
            radius={100}
          />
        </>
      )}

      {/* Audited bus stops */}
      {audits.map((audit) => {
        if (!audit._geolocation) return null;

        const lat = Number(audit._geolocation[0]);
        const lon = Number(audit._geolocation[1]);

        if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
          return null;
        }

        return (
          <Marker
            key={audit._uuid}
            position={[lat, lon]}
            icon={auditedStopIcon}
            eventHandlers={{
              click: () => {
                setSelectedAudit(audit);
              },
            }}
          >
            <Popup>
              <strong>{audit.Bus_Stop_Name}</strong>
              <br />
              Roof: {audit.roof || "—"}
              <br />
              Lighting: {audit.lighting || "—"}
              <br />
              Seating: {audit.Seating || "—"}
              <br />
              Route Map: {audit.route_map || "—"}
              <br />
              Schedule: {audit.schedule || "—"}
            </Popup>
          </Marker>
        );
      })}

      {/* Marker for a newly added stop */}
      {selectedStop?.stop_lat != null &&
        selectedStop?.stop_lon != null && (
          <Marker
            position={[
              Number(selectedStop.stop_lat),
              Number(selectedStop.stop_lon),
            ]}
          >
            <Popup>New Bus Stop</Popup>
          </Marker>
        )}
    </MapContainer>
  );
}