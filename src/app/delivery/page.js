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
  const [editingPrice, setEditingPrice] = useState(null);
  const [updatedPrice, setUpdatedPrice] = useState("");
  const [updatedPostalCode, setUpdatedPostalCode] = useState("");
  const [updatedMinimumOrder, setUpdatedMinimumOrder] = useState("");

  useEffect(() => {
    async function fetchDeliveryPrices() {
      try {
        const response = await fetch("/api/delivery-prices");
        if (!response.ok)
          throw new Error("Fehler beim Abrufen der Lieferpreise");
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
      body: JSON.stringify({
        _id: id,
        price: Number(updatedPrice),
        postalCode: updatedPostalCode,
        minimumOrder: Number(updatedMinimumOrder),
      }),
    })
      .then(async (response) => {
        if (!response.ok)
          throw new Error("Fehler beim Aktualisieren der Lieferpreise");
        return response.json();
      })
      .then((updatedItem) => {
        setDeliveryPrices((prevPrices) =>
          prevPrices.map((item) => (item._id === id ? updatedItem : item))
        );
        setEditingPrice(null);
        setUpdatedPrice("");
        setUpdatedPostalCode("");
        setUpdatedMinimumOrder("");
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
        if (!response.ok)
          throw new Error("Fehler beim Umschalten der Lieferpreise");
        return response.json();
      })
      .then(() => {
        // Re-fetch delivery prices to ensure the state is up-to-date
        fetchDeliveryPrices();

      }).then(() => {
        window.location.reload();
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
  
  // Add fetchDeliveryPrices function to re-fetch data
  async function fetchDeliveryPrices() {
    try {
      const response = await fetch("/api/delivery-prices");
      if (!response.ok) throw new Error("Fehler beim Abrufen der Lieferpreise");
      const data = await response.json();
      setDeliveryPrices(data);
    } catch (error) {
      console.error(error);
    }
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
      <h1 className="text-2xl font-bold my-4 p-4">Lieferpreise</h1>
      <div className="flex gap-2 mb-4 p-4">
        <button
          onClick={() => toggleFreeDelivery(true)}
          className="button bg-green-500 !text-white"
        >
          Alle kostenlos machen
        </button>
        <button
          onClick={() => toggleFreeDelivery(false)}
          className="button bg-red-500 !text-white"
        >
          Preise zurücksetzen
        </button>
      </div>
      <ul className="space-y-4 p-4">
        {deliveryPrices.map((price) => (
          <li
            key={price._id}
            className="p-4 border rounded-md shadow-md flex justify-between items-center"
          >
            {editingPrice === price._id ? (
              <div className="flex flex-col items-center mr-1">
                <div>
                  <label>Preis:</label>
                  <input
                    type="number"
                    value={updatedPrice}
                    onChange={(e) => setUpdatedPrice(e.target.value)}
                    className="input"
                  />
                  <label>Postleitzahl:</label>
                  <input
                    type="text"
                    value={updatedPostalCode}
                    onChange={(e) => setUpdatedPostalCode(e.target.value)}
                    className="input"
                    placeholder="Postleitzahl"
                  />
                  <label>Mindestbestellung:</label>
                  <input
                    type="number"
                    value={updatedMinimumOrder}
                    onChange={(e) => setUpdatedMinimumOrder(e.target.value)}
                    className="input"
                    placeholder="Mindestbestellung"
                  />
                </div>

                <div className="flex gap-1">
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
              </div>
            ) : (
              <div className="flex flex-col">
                <h2 className="text-lg font-bold">{price.name}</h2>
                <p className="text-gray-800 font-semibold">
                  Preis: {price.price === 0 ? "Kostenlos" : price.price + "€"}
                </p>
                <p className="text-gray-800 font-semibold">
                  Postleitzahl: {price.postalCode}
                </p>
                <p className="text-gray-800 font-semibold">
                  Mindestbestellung: {price.minimumOrder}€
                </p>
              </div>
            )}
            <button
              onClick={() => {
                setEditingPrice(price._id);
                setUpdatedPrice(price.price);
                setUpdatedPostalCode(price.postalCode);
                setUpdatedMinimumOrder(price.minimumOrder);
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
