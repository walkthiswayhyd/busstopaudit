import { useMemo } from "react";
import styles from "./Report.module.css";

function countValues(audits, field) {
  return audits.reduce((counts, audit) => {
    const value = audit[field];

    if (!value) return counts;

    counts[value] = (counts[value] || 0) + 1;

    return counts;
  }, {});
}

function BarChart({ title, data, labels = {} }) {
  const entries = Object.entries(data);

  if (entries.length === 0) {
    return (
      <div className={styles.chart}>
        <h3>{title}</h3>
        <p className={styles.noData}>No data available</p>
      </div>
    );
  }

  const max = Math.max(...entries.map(([, value]) => value));

  return (
    <div className={styles.chart}>
      <h3>{title}</h3>

      <div className={styles.bars}>
        {entries.map(([key, value]) => (
          <div className={styles.barRow} key={key}>
            <div className={styles.barLabel}>
              {labels[key] || key}
            </div>

            <div className={styles.barTrack}>
              <div
                className={styles.bar}
                style={{
                  width: `${(value / max) * 100}%`,
                }}
              />
            </div>

            <div className={styles.barValue}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Report({ audits, onClose }) {
  const roof = useMemo(
    () => countValues(audits, "roof"),
    [audits]
  );

  const lighting = useMemo(
    () => countValues(audits, "lighting"),
    [audits]
  );

  const seating = useMemo(
    () => countValues(audits, "Seating"),
    [audits]
  );

  const routeMap = useMemo(
    () => countValues(audits, "route_map"),
    [audits]
  );

  const schedule = useMemo(
    () => countValues(audits, "schedule"),
    [audits]
  );

  const pedestrianAccess = useMemo(
    () => countValues(audits, "pedestrian_access"),
    [audits]
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h2>Bus Stop Report</h2>
            <p>
              Summary of audited bus stops
            </p>
          </div>

          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close report"
          >
            ×
          </button>
        </header>

        <section className={styles.summary}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryIcon}>🚌</span>

            <div>
              <strong>{audits.length}</strong>
              <span>Audited Stops</span>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <span className={styles.summaryIcon}>🏠</span>

            <div>
              <strong>
                {Object.values(roof).reduce(
                  (a, b) => a + b,
                  0
                )}
              </strong>
              <span>Roof Responses</span>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <span className={styles.summaryIcon}>💡</span>

            <div>
              <strong>
                {Object.values(lighting).reduce(
                  (a, b) => a + b,
                  0
                )}
              </strong>
              <span>Lighting Responses</span>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <span className={styles.summaryIcon}>💺</span>

            <div>
              <strong>
                {Object.values(seating).reduce(
                  (a, b) => a + b,
                  0
                )}
              </strong>
              <span>Seating Responses</span>
            </div>
          </div>
        </section>

        <div className={styles.charts}>
          <BarChart
            title="Does the bus stand have a roof?"
            data={roof}
            labels={{
              yes: "Yes",
              no: "No",
              partial: "Partial",
            }}
          />

          <BarChart
            title="Lighting"
            data={lighting}
            labels={{
              dedicated_lighting: "Dedicated lighting",
              lighting_from_surroundings:
                "Lighting from surroundings",
              lighting_from_billboards:
                "Lighting from billboards",
              no_light: "No lighting",
            }}
          />

          <BarChart
            title="Seating"
            data={seating}
            labels={{
              no_seating: "No seating",
              broken_seating_hostile_seating:
                "Broken / hostile seating",
              usable_seating: "Usable seating",
              good_seating: "Good seating",
            }}
          />

          <BarChart
            title="Route Map"
            data={routeMap}
            labels={{
              yes: "Yes",
              partially_visible: "Partially visible",
              visible_but_outdated:
                "Visible but outdated",
              no: "No",
            }}
          />

          <BarChart
            title="Schedule"
            data={schedule}
            labels={{
              yes: "Yes",
              partially_visible: "Partially visible",
              visible_but_outdated:
                "Visible but outdated",
              no: "No",
            }}
          />

          <BarChart
            title="Pedestrian Access"
            data={pedestrianAccess}
            labels={{
              footoverbridge: "Foot overbridge",
              zebra_crossing: "Zebra crossing",
              well_built_footpath:
                "Well-built footpath",
              well_built_footpath_with_ramp_wheelchair:
                "Footpath + wheelchair ramp",
              broken_footpath: "Broken footpath",
            }}
          />
        </div>
      </div>
    </div>
  );
}