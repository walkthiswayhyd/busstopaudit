import { useState } from "react";
import { Snackbar, Alert } from "@mui/material";

export default function AddStopButton({
  isAddingStop,
  setIsAddingStop,
  viewMode,
}) {
  const [notification, setNotification] = useState(false);

  const handleClick = () => {
    if (!isAddingStop) {
      setNotification(true);
    }
    setIsAddingStop(!isAddingStop);
  };

  // Only show button in audit view
  if (viewMode !== "audit") {
    return null;
  }

  return (
    <>
      <button
        onClick={handleClick}
        style={{
          position: "absolute",

          right: "20px",
          bottom: "90px",

          zIndex: 1000,

          padding: "12px 18px",

          border: "none",

          borderRadius: "20px",

          background: isAddingStop
            ? "#dc2626"
            : "#2563eb",

          color: "white",

          cursor: "pointer",
        }}
      >
        {isAddingStop
          ? "Cancel"
          : "Add Missing Stop"}
      </button>

      <Snackbar
        open={notification}
        autoHideDuration={4000}
        onClose={() => setNotification(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setNotification(false)}
          severity="info"
          sx={{ width: "100%" }}
        >
          Drop the pin on the map to add a new bus stop
        </Alert>
      </Snackbar>
    </>
  );
}
