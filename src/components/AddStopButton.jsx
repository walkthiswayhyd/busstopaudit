export default function AddStopButton({
  isAddingStop,
  setIsAddingStop,
}) {
  return (
    <button
      onClick={() =>
        setIsAddingStop(!isAddingStop)
      }
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
  );
}