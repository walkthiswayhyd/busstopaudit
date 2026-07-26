import styles from "./NearbyStops.module.css";

export default function NearbyStops({
  nearbyStops,
  onSelect,
}) {
  return (
    <div className={styles.container}>
      <h3>Nearby Stops</h3>

      {nearbyStops.length === 0 && (
        <p>No stops found nearby</p>
      )}

      {nearbyStops.map((stop) => (
        <div
          key={stop.stop_id}
          className={styles.stop}
          onClick={() => onSelect(stop)}
        >
          <div>{stop.stop_name}</div>

          <div className={styles.distance}>
            {stop.distance.toFixed(2)} km
          </div>
        </div>
      ))}
    </div>
  );
}