import { useEffect, useState } from "react";
import Papa from "papaparse";

export default function useStops() {
  const [stops, setStops] = useState([]);

  useEffect(() => {
    fetch("/stops.txt")
      .then((res) => res.text())
      .then((csv) => {
        const result = Papa.parse(csv, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        });

        setStops(result.data);
      });
  }, []);

  return stops;
}