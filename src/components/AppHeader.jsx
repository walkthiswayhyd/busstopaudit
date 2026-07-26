import { Switch, Typography } from "@mui/material";
import StopSearch from "./StopSearch";
import styles from "./AppHeader.module.css";

export default function AppHeader({ stops, onSelect, viewMode, onViewModeChange, auditCount }) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <img src="/logo.png" alt="Walk This Way" className={styles.logo} />

        <div className={styles.searchArea}>
          <StopSearch stops={stops} onSelect={onSelect} />
        </div>

        <div className={styles.toggleArea}>
          <Typography variant="body2" className={styles.toggleLabel}>
            Audit View
          </Typography>
          <Switch
            checked={viewMode === "public"}
            onChange={onViewModeChange}
            color="primary"
          />
          <Typography variant="body2" className={styles.toggleLabel}>
            Public View
          </Typography>
        </div>

        <div className={styles.auditCounter}>
          <span className={styles.busIcon}>🚌</span>
          <span className={styles.auditCount}>{auditCount}</span>
        </div>
      </div>
    </header>
  );
}
