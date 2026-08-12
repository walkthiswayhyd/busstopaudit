import { useState } from "react";
import BusMap from "./components/BusMap";
import useLocation from "./hooks/useLocation";
import useAudits from "./hooks/useAudits";
import { distanceKm } from "./utils/distance";
import AuditForm from "./components/AuditForm";
import AddStopButton from "./components/AddStopButton";
import AppHeader from "./components/AppHeader";

function App() {
  const location = useLocation();
  const { audits, loading } = useAudits();
  const [viewMode, setViewMode] = useState("audit");
  const [selectedStop, setSelectedStop] = useState(null);
  const [isAddingStop, setIsAddingStop] = useState(false);
  const auditList = audits ?? [];

  const nearbyStops = location
    ? auditList
        .map((stop) => ({
          ...stop,
          distance: distanceKm(
            location.lat,
            location.lon,
            stop.stop_lat,
            stop.stop_lon,
          ),
        }))
        .filter((stop) => stop.distance <= 3)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 20)
    : [];

  return (
    <>
      <BusMap
        selectedStop={selectedStop}
        setSelectedStop={setSelectedStop}
        userLocation={location}
        nearbyStops={nearbyStops}
        isAddingStop={isAddingStop}
        setIsAddingStop={setIsAddingStop}
        audits={auditList}
        viewMode={viewMode}
      />
      <AppHeader
        stops={auditList}
        onSelect={setSelectedStop}
        viewMode={viewMode}
        onViewModeChange={() =>
          setViewMode(viewMode === "audit" ? "public" : "audit")
        }
        auditCount={auditList.length}
      />
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 1000,
            padding: "10px 14px",
            background: "rgba(255,255,255,0.95)",
            border: "1px solid #ddd",
            borderRadius: 10,
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
          }}
        >
          Loading audit data...
        </div>
      )}
      <AddStopButton
        isAddingStop={isAddingStop}
        setIsAddingStop={setIsAddingStop}
        viewMode={viewMode}
      />
      <AuditForm
        key={
          selectedStop
            ? `${selectedStop.stop_id}-${selectedStop.stop_lat}-${selectedStop.stop_lon}`
            : "none"
        }
        selectedStop={selectedStop}
        setSelectedStop={setSelectedStop}
      />
    </>
  );
}

export default App;
