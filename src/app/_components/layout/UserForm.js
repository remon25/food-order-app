"use client";
import { useState } from "react";
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
  const citiesWithDeliveryPrices = [
    { name: "Harsefeld", price: 10 },
    { name: "Ahlerstedt", price: 20 },
    { name: "Bargstdet", price: 20 },
    { name: "Griemshorst", price: 20 },
    { name: "Issendorf", price: 20 },
    { name: "Hollenbeck", price: 20 },
    { name: "Kakerbeck", price: 20 },
    { name: "Ohrensen", price: 20 },
    { name: "Ahrensmoor", price: 30 },
    { name: "Ahrenswohlde", price: 30 },
    { name: "Apensen", price: 30 },
    { name: "Aspe", price: 30 },
    { name: "Beckdorf Bokel", price: 30 },
    { name: "Brest", price: 30 },
    { name: "Bliedersdorf", price: 30 },
    { name: "Deinste", price: 30 },
    { name: "Frankenmoor", price: 30 },
    { name: "Grundoldendorf", price: 30 },
    { name: "Hedendorf", price: 30 },
    { name: "Helmste", price: 30 },
    { name: "Horneburg", price: 30 },
    { name: "Kammerbusch", price: 30 },
    { name: "Kutenholz", price: 30 },
    { name: "Nottensdorf", price: 30 },
    { name: "Oersdorf", price: 30 },
    { name: "Ottendorf", price: 30 },
    { name: "Revenahe", price: 30 },
    { name: "Ruschwedet", price: 30 },
    { name: "Sauensiek", price: 30 },
    { name: "Wangersen", price: 30 },
    { name: "Wiegersen", price: 30 },
    { name: "Wohlerst", price: 30 },
  ];

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
              admin,
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
                {citiesWithDeliveryPrices.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
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

          {isAdmin && (
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
          )}

          <button type="submit" className="p-2 rounded">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
