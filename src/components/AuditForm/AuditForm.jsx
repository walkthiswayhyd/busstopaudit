import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import styles from "./AuditForm.module.css";

export default function AuditForm({ selectedStop, setSelectedStop }) {
  const containerRef = useRef(null);
   const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    stop_name:
      selectedStop?.audit_type === "manual"
        ? ""
        : selectedStop?.stop_name || "",

    roof: "",
    lighting: "",
    name_displayed: "",
    Seating: "",
    route_map: "",
    schedule: "",
    pedestrian_access: [],
    bus_stop: "",
  });
 useEffect(() => {
  if (!containerRef.current) return;

  // Prevent Leaflet from receiving clicks from the form
  L.DomEvent.disableClickPropagation(containerRef.current);

  // Prevent the map from reacting to scrolling over the form
  L.DomEvent.disableScrollPropagation(containerRef.current);
}, []);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePedestrianAccess = (value) => {
    setForm((prev) => ({
      ...prev,
      pedestrian_access: prev.pedestrian_access.includes(value)
        ? prev.pedestrian_access.filter((item) => item !== value)
        : [...prev.pedestrian_access, value],
    }));
  };

const handleSubmit = async () => {
  console.log("SUBMIT CLICKED");

  if (!selectedStop) {
    console.error("No selected stop");
    alert("No stop selected");
    return;
  }

  if (!form.stop_name?.trim()) {
    alert("Please enter a bus stop name");
    return;
  }

  if (submitting) return;

  setSubmitting(true);

  const payload = {
    stop_name: form.stop_name.trim(),

    stop_lat: Number(selectedStop.stop_lat),
    stop_lon: Number(selectedStop.stop_lon),

    roof: form.roof,
    lighting: form.lighting,
    name_displayed: form.name_displayed,
    Seating: form.Seating,
    route_map: form.route_map,
    schedule: form.schedule,
    pedestrian_access: form.pedestrian_access,
    bus_stop: form.bus_stop,
  };

  console.log("Submitting:", payload);

  try {
    const response = await fetch("/api/submit-audit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("Response status:", response.status);

    const text = await response.text();

    console.log("Response:", text);

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      console.error("Submission failed:", data);

      alert(
        data?.error ||
        data?.details ||
        "Failed to submit audit"
      );

      return;
    }

    alert("Audit saved");

    setSelectedStop(null);
  } catch (error) {
    console.error("Submission error:", error);

    alert(`Submission error: ${error.message}`);
  } finally {
    setSubmitting(false);
  }
};
  if (!selectedStop) return null;

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          {selectedStop.audit_type === "manual" && (
            <>
              <label>Stop Name</label>

              <input
                type="text"
                value={form.stop_name}
                onChange={(e) =>
                  updateField("stop_name", e.target.value)
                }
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
        </div>

        <button onClick={() => setSelectedStop(null)}>✕</button>
      </div>

      {/* Roof */}
      <div className={styles.section}>
        <h4>Does the bus stand have a roof?</h4>

        {[
          ["yes", "Yes"],
          ["no", "No"],
          ["partial", "Partial"],
        ].map(([value, label]) => (
          <label key={value} className={styles.optionRow}>
            <input
              type="radio"
              name="roof"
              value={value}
              checked={form.roof === value}
              onChange={(e) =>
                updateField("roof", e.target.value)
              }
            />

            {label}
          </label>
        ))}
      </div>

      {/* Lighting */}
      <div className={styles.section}>
        <h4>Lighting?</h4>

        {[
          ["dedicated_lighting", "Dedicated lighting"],
          [
            "lighting_from_surroundings",
            "Lighting from surroundings",
          ],
          [
            "lighting_from_billboards",
            "Lighting from billboards",
          ],
          ["no_light", "No light"],
        ].map(([value, label]) => (
          <label key={value} className={styles.optionRow}>
            <input
              type="radio"
              name="lighting"
              value={value}
              checked={form.lighting === value}
              onChange={(e) =>
                updateField("lighting", e.target.value)
              }
            />

            {label}
          </label>
        ))}
      </div>

      {/* Name displayed */}
      <div className={styles.section}>
        <h4>Is the name of the bus stand clearly displayed?</h4>

        {[
          ["yes", "Yes"],
          ["partially", "Partially"],
          ["no", "No"],
        ].map(([value, label]) => (
          <label key={value} className={styles.optionRow}>
            <input
              type="radio"
              name="name_displayed"
              value={value}
              checked={form.name_displayed === value}
              onChange={(e) =>
                updateField("name_displayed", e.target.value)
              }
            />

            {label}
          </label>
        ))}
      </div>

      {/* Seating */}
      <div className={styles.section}>
        <h4>Seating?</h4>

        {[
          ["no_seating", "No seating"],
          [
            "broken_seating_hostile_seating",
            "Broken seating / hostile seating",
          ],
          ["usable_seating", "Usable seating"],
          ["good_seating", "Good seating"],
        ].map(([value, label]) => (
          <label key={value} className={styles.optionRow}>
            <input
              type="radio"
              name="Seating"
              value={value}
              checked={form.Seating === value}
              onChange={(e) =>
                updateField("Seating", e.target.value)
              }
            />

            {label}
          </label>
        ))}
      </div>

      {/* Route map */}
      <div className={styles.section}>
        <h4>Route map available?</h4>

        {[
          ["yes", "Yes"],
          ["partially_visible", "Partially visible"],
          ["visible_but_outdated", "Visible but outdated"],
          ["no", "No"],
        ].map(([value, label]) => (
          <label key={value} className={styles.optionRow}>
            <input
              type="radio"
              name="route_map"
              value={value}
              checked={form.route_map === value}
              onChange={(e) =>
                updateField("route_map", e.target.value)
              }
            />

            {label}
          </label>
        ))}
      </div>

      {/* Schedule */}
      <div className={styles.section}>
        <h4>Schedule available?</h4>

        {[
          ["yes", "Yes"],
          ["partially_visible", "Partially visible"],
          ["visible_but_outdated", "Visible but outdated"],
          ["no", "No"],
        ].map(([value, label]) => (
          <label key={value} className={styles.optionRow}>
            <input
              type="radio"
              name="schedule"
              value={value}
              checked={form.schedule === value}
              onChange={(e) =>
                updateField("schedule", e.target.value)
              }
            />

            {label}
          </label>
        ))}
      </div>

      {/* Pedestrian access */}
      <div className={styles.section}>
        <h4>Quality of pedestrian access</h4>

        <p className={styles.hint}>Select all that apply</p>

        {[
          ["footoverbridge", "Footoverbridge"],
          ["zebra_crossing", "Zebra crossing"],
          [
            "well_built_footpath",
            "Well-built footpath",
          ],
          [
            "well_built_footpath_with_ramp_wheelchair",
            "Well-built footpath with ramp / wheelchair access",
          ],
          ["broken_footpath", "Broken footpath"],
        ].map(([value, label]) => (
          <label key={value} className={styles.optionRow}>
            <input
              type="checkbox"
              checked={form.pedestrian_access.includes(value)}
              onChange={() => togglePedestrianAccess(value)}
            />

            {label}
          </label>
        ))}
      </div>

      {/* Bus stop position */}
      <div className={styles.section}>
        <h4>How is the bus stop positioned?</h4>

        {[
          ["on_the_road", "On the road"],
          [
            "a_few_feet_away_from_the_road",
            "A few feet away from the road",
          ],
          [
            "has_separate_designated_area",
            "Has separate designated area",
          ],
        ].map(([value, label]) => (
          <label key={value} className={styles.optionRow}>
            <input
              type="radio"
              name="bus_stop"
              value={value}
              checked={form.bus_stop === value}
              onChange={(e) =>
                updateField("bus_stop", e.target.value)
              }
            />

            {label}
          </label>
        ))}
      </div>

      {/* Submit */}
     <button
  type="button"
  className={styles.submitButton}
  onClick={handleSubmit}
  disabled={submitting}
>
  {submitting ? "Submitting..." : "Submit Audit"}
</button>
    </div>
  );
}