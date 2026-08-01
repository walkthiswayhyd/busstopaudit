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
  const audits = useAudits();
  const [viewMode, setViewMode] = useState("audit");
  const [selectedStop, setSelectedStop] = useState(null);
  const [isAddingStop, setIsAddingStop] = useState(false);
  console.log("App audits", audits);
  const nearbyStops = location
    ? audits
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
        audits={audits}
        viewMode={viewMode}
      />
      <AppHeader
        stops={audits}
        onSelect={setSelectedStop}
        viewMode={viewMode}
        onViewModeChange={() =>
          setViewMode(viewMode === "audit" ? "public" : "audit")
        }
        auditCount={audits.length}
      />
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
