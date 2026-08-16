import { useState } from "react";
import styles from "./StopSearch.module.css";

export default function StopSearch({ stops, onSelect }) {
  const [query, setQuery] = useState("");

  const results = stops
    .filter((stop) =>
      stop.stop_name?.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 10);

  return (
    <div className={styles.container}>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="Search bus stop..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {query && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={() => setQuery("")}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

     {query && results.length > 0 && (
  <div className={styles.results}>
    {results.map((stop) => (
      <div
        key={stop.stop_id}
        className={styles.resultItem}
        onClick={() => {
          onSelect(stop);
          setQuery(stop.stop_name);
        }}
      >
        {stop.stop_name}
      </div>
    ))}
  </div>
)}
    </div>
  );
}