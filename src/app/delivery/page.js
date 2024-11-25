"use client";
import { useState, useEffect } from "react";
import AdminTabs from "../_components/layout/AdminTabs";
import Spinner from "../_components/layout/Spinner";
import { useProfile } from "../_components/useProfile";
import { toast } from "react-hot-toast";
import withAdminAuth from "../_components/withAdminAuth";

function DeliveryPage() {
  const { loading, status, isAdmin } = useProfile();
  const [deliveryPrices, setDeliveryPrices] = useState([]);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [editingPrice, setEditingPrice] = useState(null); // Track the currently editing item
  const [updatedPrice, setUpdatedPrice] = useState("");

  useEffect(() => {
    async function fetchDeliveryPrices() {
      try {
        const response = await fetch("/api/delivery-prices");
        if (!response.ok) throw new Error("Fehler beim Abrufen der Lieferpreise");
        const data = await response.json();
        setDeliveryPrices(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingPrices(false);
      }
    }

    fetchDeliveryPrices();
  }, []);

  async function handleSavePrice(id) {
    const savePromise = fetch("/api/delivery-prices", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: id, price: Number(updatedPrice) }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Fehler beim Aktualisieren des Preises");
        return response.json();
      })
      .then((updatedItem) => {
        setDeliveryPrices((prevPrices) =>
          prevPrices.map((item) => (item._id === id ? updatedItem : item))
        );
        setEditingPrice(null); // Exit edit mode
        setUpdatedPrice("");
      });

    toast.promise(savePromise, {
      loading: "Preis wird gespeichert...",
      success: "Preis erfolgreich aktualisiert!",
      error: "Fehler beim Aktualisieren des Preises.",
    });
  }

  async function toggleFreeDelivery(isFreeDelivery) {
    const togglePromise = fetch("/api/delivery-prices", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isFreeDelivery }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Fehler beim Umschalten der Lieferpreise");
        return response.json();
      })
      .then(() => {
        setDeliveryPrices((prevPrices) =>
          prevPrices.map((item) => ({
            ...item,
            isFreeDelivery,
            price: isFreeDelivery ? 0 : item.price, // Adjust UI display only
          }))
        );
      });

    toast.promise(togglePromise, {
      loading: isFreeDelivery
        ? "Alle auf kostenlose Lieferung setzen..."
        : "Preise werden zurückgesetzt...",
      success: isFreeDelivery
        ? "Alle Lieferungen sind jetzt kostenlos!"
        : "Preise wurden erfolgreich zurückgesetzt!",
      error: "Fehler beim Umschalten der Lieferpreise.",
    });
  }

  if (loading || status === "loading" || loadingPrices) {
    return (
      <div className="w-full h-screen flex items-center justify-center overflow-hidden">
        <Spinner />
      </div>
    );
  }

  if (isAdmin === null) return null;

  return (
    <section className="mt-24 max-w-2xl mx-auto">
      <AdminTabs />
      <h1 className="text-2xl font-bold my-4">Lieferpreise</h1>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => toggleFreeDelivery(true)} // Make all free
          className="button bg-green-500 !text-white"
        >
          Alle kostenlos machen
        </button>
        <button
          onClick={() => toggleFreeDelivery(false)} // Revert to original prices
          className="button bg-red-500 !text-white"
        >
          Preise zurücksetzen
        </button>
      </div>

      <ul className="space-y-4">
        {deliveryPrices.map((price) => (
          <li
            key={price._id}
            className="p-4 border rounded-md shadow-md flex justify-between items-center"
          >
            {editingPrice === price._id ? (
              <div className="flex items-center">
                <input
                  type="number"
                  value={updatedPrice}
                  onChange={(e) => setUpdatedPrice(e.target.value)}
                  className="input"
                />
                <button
                  onClick={() => handleSavePrice(price._id)}
                  className="button bg-green-500 ml-2"
                >
                  Speichern
                </button>
                <button
                  onClick={() => setEditingPrice(null)}
                  className="button ml-2"
                >
                  Abbrechen
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                <h2 className="text-lg font-medium">{price.name}</h2>
                <p className="text-gray-800 font-semibold">
                  Preis: {price.price === 0 ? "Kostenlos" : price.price + "€"}
                </p>
              </div>
            )}
            <button
              onClick={() => {
                setEditingPrice(price._id);
                setUpdatedPrice(price.price);
              }}
              className="button !w-auto"
            >
              Bearbeiten
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default withAdminAuth(DeliveryPage);
