import { useEffect, useState } from "react";

export default function useAudits() {
  const [audits, setAudits] = useState([]);
  const [auditCount, setAuditCount] = useState(0);

  useEffect(() => {
    fetch("/api/audits")
      .then((res) => res.json())
      .then((data) => {
        setAudits(data.results || []);
        setAuditCount(data.count || 0);
      })
      .catch(console.error);
  }, []);

  return {
    audits,
    auditCount,
  };
}