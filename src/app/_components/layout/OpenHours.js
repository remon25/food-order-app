"use client";

import { useEffect, useState } from "react";

export default function OpenHours() {
  const [times, setTimes] = useState({ start: "10:00", end: "22:00" });
  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const res = await fetch("/api/times");
        if (!res.ok) {
          throw new Error("Failed to fetch times");
        }
        const data = await res.json();
        setTimes(data);
      } catch (err) {
        console.log(err);
        setTimes({ start: "10:00", end: "22:00" });
      }
    };

    fetchTimes();
  }, []);
  return (
    <div>
      <h4 className="uppercase font-bold">Öffnungszeiten</h4>
      <p>
        {times.start} - {times.end}
      </p>
    </div>
  );
}
