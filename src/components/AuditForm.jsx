import { useState } from "react";
import styles from "./AuditForm.module.css";

export default function AuditForm({ selectedStop, setSelectedStop }) {
  const [form, setForm] = useState({
  stop_name:
    selectedStop?.audit_type === "manual"
      ? ""
      : selectedStop?.stop_name || "",

  shelter: false,
  seating: false,
  route_map: false,
  schedule: false,
  pedestrian_access: false,
  lighting: false,
  bus_bay: false,
  accessibility_ramp: false,
  comments: "",
});

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const payload = {
      stop_id: selectedStop.stop_id,

      stop_name:
        selectedStop.audit_type === "manual"
          ? form.stop_name
          : selectedStop.stop_name,

      audit_type: selectedStop.audit_type || "gtfs",

      stop_lat: selectedStop.stop_lat,
      stop_lon: selectedStop.stop_lon,

      ...form,
    };

    fetch(
      "https://script.google.com/macros/s/AKfycbwCPecxCkxvUn1mx_MQOqdv8c10PGtUIA4DP_UsJ_WfkXHV0evbMTjl4Z2IIzzzrVVh/exec",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert("Audit saved");
        setSelectedStop(null);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to save");
      });
  };

  if (!selectedStop) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {selectedStop.audit_type === "manual" && (
          <>
            <label>Stop Name</label>

            <input
              type="text"
              value={form.stop_name}
              onChange={(e) => updateField("stop_name", e.target.value)}
              className={styles.input}
              placeholder="Enter stop name"
            />
          </>
        )}
        <h3>
          {selectedStop.audit_type === "manual"
            ? "Custom Stop"
            : selectedStop.stop_name}
        </h3>
        <button onClick={() => setSelectedStop(null)}>✕</button>
      </div>

      {[
        "shelter",
        "seating",
        "route_map",
        "schedule",
        "pedestrian_access",
        "lighting",
        "bus_bay",
        "accessibility_ramp",
      ].map((field) => (
        <label key={field} className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={form[field]}
            onChange={(e) => updateField(field, e.target.checked)}
          />

          {field.replaceAll("_", " ")}
        </label>
      ))}

      <textarea
        className={styles.comments}
        placeholder="Comments..."
        value={form.comments}
        onChange={(e) => updateField("comments", e.target.value)}
      />

      <button className={styles.submitButton} onClick={handleSubmit}>
        Submit Audit
      </button>
    </div>
  );
}
