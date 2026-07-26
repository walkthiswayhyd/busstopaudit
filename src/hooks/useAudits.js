import { useEffect, useState } from "react";

export default function useAudits() {
  const [audits, setAudits] = useState([]);

  useEffect(() => {
    fetch("/api/audits")
      .then((res) => res.json())
      .then((data) => {
        setAudits(data.results || []);
      })
      .catch(console.error);
  }, []);

  return audits;
}