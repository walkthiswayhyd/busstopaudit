import { useState } from "react";
import BusMap from "./components/BusMap/BusMap";
import useLocation from "./hooks/useLocation";
import useAudits from "./hooks/useAudits";
import AuditForm from "./components/AuditForm/AuditForm";
import AppHeader from "./components/AppHeader/AppHeader";
import Menu from "./components/Menu/Menu";
import Report from "./components/Report/Report";
import styles from "./App.module.css";

function App() {
  const location = useLocation();
  const { audits, auditCount } = useAudits();
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [isAddingStop, setIsAddingStop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [recenterRequest, setRecenterRequest] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);


  return (
     <div className={styles.app}>
      <AppHeader
        audits={audits}
        onSelect={setSelectedAudit}
        auditCount={auditCount}
      />

      <div className={styles.mapContainer}>
        <BusMap
          selectedStop={selectedStop}
          setSelectedStop={setSelectedStop}
          selectedAudit={selectedAudit}
          setSelectedAudit={setSelectedAudit}
          userLocation={location}
          isAddingStop={isAddingStop}
          setIsAddingStop={setIsAddingStop}
          audits={audits}
          recenterRequest={recenterRequest}
        />

        <Menu
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          setIsAddingStop={setIsAddingStop}
          recenterMap={() => {
            setRecenterRequest((prev) => prev + 1);
          }}
          isAddingStop={isAddingStop}
          onOpenReport={() => setReportOpen(true)}
        />
        {reportOpen && (
          <Report audits={audits} onClose={() => setReportOpen(false)} />
        )}

        <AuditForm
          key={
            selectedStop
              ? `${selectedStop.stop_lat}-${selectedStop.stop_lon}`
              : "none"
          }
          selectedStop={selectedStop}
          setSelectedStop={setSelectedStop}
        />
      </div>
    </div>
  );
}

export default App;
