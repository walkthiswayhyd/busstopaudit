import styles from "./Menu.module.css";

export default function Menu({
  menuOpen,
  setMenuOpen,
  setIsAddingStop,
  recenterMap,
  isAddingStop,
  onOpenReport,
}) {
  const handleAction = (action) => {
    action();
    setMenuOpen(false);
  };

  return (
    <div
      className={`${styles.container} ${isAddingStop ? styles.addingStop : ""}`}
    >
      <div className={`${styles.actions} ${menuOpen ? styles.open : ""}`}>
        <button
          className={styles.action}
          onClick={() => handleAction(onOpenReport)}
        >
          <span>📊</span>
          <span>Report</span>
        </button>

        <button
          className={styles.action}
          onClick={() =>
            handleAction(() => {
              setIsAddingStop(true);
            })
          }
        >
          <span>Audit</span>
          <span>Stop</span>
        </button>

        <button
          className={styles.action}
          onClick={() => handleAction(recenterMap)}
        >
          <span>Recenter</span>
        </button>
      </div>

      <button
        className={`${styles.hamburger} ${
          menuOpen ? styles.hamburgerOpen : ""
        }`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  );
}
