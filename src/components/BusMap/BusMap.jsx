import { useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
} from "react-leaflet";

import { userIcon, auditedStopIcon, stopIcon } from "../../utils/icons";
import useStops from "../../hooks/useStops";
import { distanceKm } from "../../utils/distance";

import FlyToStop from "../FlyToStop";
import RecenterMap from "../RecenterMap";
import MapClickHandler from "../MapClickHandler";

const PROXIMITY_RADIUS_M = 100;

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
  const stops = useStops();

  // GTFS stops that fall inside the user's proximity circle.
  const nearbyStops = useMemo(() => {
    if (!userLocation) return [];

    return stops.filter((stop) => {
      const lat = Number(stop.stop_lat);
      const lon = Number(stop.stop_lon);

      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return false;

      return (
        distanceKm(userLocation.lat, userLocation.lon, lat, lon) * 1000 <=
        PROXIMITY_RADIUS_M
      );
    });
  }, [stops, userLocation]);

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
            radius={PROXIMITY_RADIUS_M}
          />
        </>
      )}

      {/* GTFS stops within the proximity circle */}
      {nearbyStops.map((stop) => (
        <Marker
          key={stop.stop_id}
          position={[Number(stop.stop_lat), Number(stop.stop_lon)]}
          icon={stopIcon}
        >
          <Popup>{stop.stop_name}</Popup>
        </Marker>
      ))}

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