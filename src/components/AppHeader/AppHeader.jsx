import { useState } from "react";
import styles from "./AppHeader.module.css";

export default function AppHeader({ audits, onSelect, auditCount }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = audits
    .filter((audit) =>
      audit.Bus_Stop_Name?.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 8);

  const handleSelect = (audit) => {
    onSelect(audit);
    setQuery(audit.Bus_Stop_Name || "");
  };

  return (
    <header className={styles.header}>
      <img
        src="/logo.png"
        alt="Walk This Way"
        className={styles.logo}
      />

      <div className={styles.rightSection}>
        <div
          className={`${styles.searchContainer} ${
            searchOpen ? styles.searchOpen : ""
          }`}
        >
          {searchOpen && (
            <div className={styles.searchBox}>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search bus stop..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />

              {query && results.length > 0 && (
                <div className={styles.searchResults}>
                  {results.map((audit) => (
                    <button
                      key={audit._uuid}
                      className={styles.searchResult}
                      onClick={() => handleSelect(audit)}
                    >
                      {audit.Bus_Stop_Name}
                    </button>
                  ))}
                </div>
              )}

              {query && results.length === 0 && (
                <div className={styles.noResults}>
                  No audited stops found
                </div>
              )}
            </div>
          )}

          <button
            className={styles.searchButton}
            onClick={() => {
              setSearchOpen(!searchOpen);

              if (searchOpen) {
                setQuery("");
              }
            }}
            aria-label={searchOpen ? "Close search" : "Search"}
          >
            {searchOpen ? "×" : "⌕"}
          </button>
        </div>

        <div className={styles.auditCount}>
          <span className={styles.auditIcon}>🚌</span>
          <span>{auditCount}</span>
        </div>
      </div>
    </header>
  );
}