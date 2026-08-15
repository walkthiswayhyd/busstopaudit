import { useState } from "react";
import BusMap from "./components/BusMap";
import useLocation from "./hooks/useLocation";
import useAudits from "./hooks/useAudits";
import useStops from "./hooks/useStops";
import { distanceKm } from "./utils/distance";
import AuditForm from "./components/AuditForm";
import AddStopButton from "./components/AddStopButton";
import AppHeader from "./components/AppHeader";

function App() {
  const location = useLocation();
  const { audits, auditCount } = useAudits();
  const [selectedAudit, setSelectedAudit] = useState(null);
  const stops = useStops();
  const [viewMode, setViewMode] = useState("audit");
  const [selectedStop, setSelectedStop] = useState(null);
  const [isAddingStop, setIsAddingStop] = useState(false);


  return (
    <>
      <AppHeader
        audits={audits}
        onSelect={setSelectedAudit}
        auditCount={auditCount}
      />
      <BusMap
        selectedStop={selectedStop}
        setSelectedStop={setSelectedStop}
        userLocation={location}
        isAddingStop={isAddingStop}
        setIsAddingStop={setIsAddingStop}
        audits={audits}
        viewMode={viewMode}
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
