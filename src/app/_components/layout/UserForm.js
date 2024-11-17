"use client";
import { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

export default function UserForm({ user, onSave, isAdmin = false }) {
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || null);
  const [phone, setPhone] = useState(user?.phone || "");
  const [streetAdress, setStreetAdress] = useState(user?.streetAdress || "");
  const [postalCode, setPostalCode] = useState(user?.postalCode || "");
  const [city, setCity] = useState(user?.city || "");
  const [admin, setAdmin] = useState(user?.admin || false);
  const [verified, setVerified] = useState(user?.verified || false);
  const [citiesWithDeliveryPrices, setCitiesWithDeliveryPrices] = useState([]);

  useEffect(() => {
    const fetchDeliveryPrices = async () => {
      try {
        const response = await fetch("/api/delivery-prices");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        const prices = {};
        data.forEach((price) => (prices[price.name] = price.price));
        setCitiesWithDeliveryPrices(prices);
        setLoadingDeliveryPrices(false);
      } catch (error) {
        console.error("Error fetching");
      }
    };
    fetchDeliveryPrices();
  }, []);
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row p-4">
        <div>
          <div className="p-2 rounded-lg flex flex-col items-center">
            <Image
              className="rounded-lg"
              src={image || "/avatar.png"}
              alt="avatar"
              width={120}
              height={120}
            />

            <CldUploadWidget
              options={{
                sources: ["local"],
                maxFiles: 1,
                resourceType: "image",
              }}
              onSuccess={(results) => {
                setImage(results?.info?.secure_url);
              }}
              signatureEndpoint="/api/upload"
            >
              {({ open }) => {
                return (
                  <button
                    className="block border border-gray-300 mt-2 cursor-pointer rounded-lg p-2 text-center"
                    onClick={() => open()}
                  >
                    Upload an Image
                  </button>
                );
              }}
            </CldUploadWidget>
          </div>
        </div>
        <form
          className="grow"
          onSubmit={(ev) =>
            onSave(ev, {
              name,
              image,
              phone,
              streetAdress,
              postalCode,
              city,
              ...(isAdmin ? { admin, verified } : {}),
            })
          }
        >
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={user?.email} disabled={true} />
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            placeholder="phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <label htmlFor="streetAdress">Street Adress</label>
          <input
            id="streetAdress"
            type="text"
            placeholder="street address"
            value={streetAdress}
            onChange={(e) => setStreetAdress(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4 justify-between">
            <div>
              <label htmlFor="city">City</label>
              <select
                id="city"
                value={city}
                onChange={(ev) => setCity(ev.target.value)}
              >
                <option value="">Select a city</option>
                {Object.keys(citiesWithDeliveryPrices).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="postalCode">Postal Code</label>
              <input
                id="postalCode"
                className="mt-0"
                type="text"
                placeholder="Postal Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-8">
            {isAdmin && (
              <>
                <div>
                  <label
                    htmlFor="admin"
                    className="inline-flex items-center gap-2 p-2 mb-2"
                  >
                    <input
                      id="admin"
                      type="checkbox"
                      value={"1"}
                      checked={admin}
                      onChange={(e) => setAdmin(e.target.checked)}
                    />
                    <span>Admin</span>
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="verified"
                    className="inline-flex items-center gap-2 p-2 mb-2"
                  >
                    <input
                      id="verified"
                      type="checkbox"
                      value={"1"}
                      checked={verified}
                      onChange={(e) => setVerified(e.target.checked)}
                    />
                    <span>Verified</span>
                  </label>
                </div>
              </>
            )}
          </div>

          <button type="submit" className="p-2 rounded">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
