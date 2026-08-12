import { useEffect, useState } from "react";

export default function useAudits() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audits")
      .then((res) => res.json())
      .then((data) => {
        setAudits(data.results);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return { audits, loading };
}