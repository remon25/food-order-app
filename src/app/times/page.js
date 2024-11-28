"use client";
import { useState, useEffect } from "react";
import AdminTabs from "../_components/layout/AdminTabs";
import withAdminAuth from "../_components/withAdminAuth";
import toast from "react-hot-toast";

function TimesPage() {
  const [times, setTimes] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch the times data on page load
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
        setError(err.message);
      }
    };

    fetchTimes();
  }, []);

  const handleSave = async () => {
    setError("");
    toast.promise(
      (async () => {
        const res = await fetch("/api/times", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(times),
        });

        if (!res.ok) {
          throw new Error("Fehler beim Aktualisieren der Zeiten.");
        }

        const updatedTimes = await res.json();
        setTimes(updatedTimes.times);
      })(),
      {
        loading: "Speichern läuft...",
        success: "Zeiten erfolgreich aktualisiert!",
        error: "Fehler beim Speichern!",
      }
    );
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTimes((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="mt-24 max-w-2xl mx-auto">
    <AdminTabs />
    <h1 className="font-bold p-4">Zeiten verwalten</h1>
    {error && <p style={{ color: "red" }}>{error}</p>}
  
    <div className="mt-4 p-4">
      <label>
        Startzeit:
        <input
          type="text"
          name="start"
          value={times.start}
          onChange={handleChange}
          placeholder="z. B., 08:00"
        />
      </label>
    </div>
  
    <div className="p-4">
      <label>
        Endzeit:
        <input
          type="text"
          name="end"
          value={times.end}
          onChange={handleChange}
          placeholder="z. B., 18:00"
        />
      </label>
    </div>
  <div className="p-4">
  <button
      className="button bg-green-500"
      onClick={handleSave}
      disabled={loading}
    >
      {loading ? "Speichern läuft..." : "Speichern"}
    </button>
  </div>
   
  </section>
  
  );
}

export default withAdminAuth(TimesPage);
