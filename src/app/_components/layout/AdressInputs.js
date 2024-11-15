"use client";
import { useState } from "react";
import Dialog from "../Dialog";
import Time from "../icons/Time";
import ChevronRight from "../icons/ChevronRight";
import Cash from "../icons/Cash";
import Paypal from "../icons/Paypal";
import Credit from "../icons/Credit";

export default function AddressInputs({
  addressProps,
  setAddressProp,
  deliveryPrices,
  timeOptions,
  disabled = false,
  orderPage = false,
  selectedPaymentMethod,
}) {
  const {
    phone,
    streetAdress,
    postalCode,
    buildNumber,
    deliveryTime,
    name,
    email,
    city,
    paymentMethod
  } = addressProps;

  const cities = Object.keys(deliveryPrices || []);
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></div>
      </div>
      <label>First and last name</label>
      <input
        disabled={disabled}
        type="text"
        placeholder="First and last name"
        value={name || ""}
        onChange={(ev) => setAddressProp("name", ev.target.value)}
      />
      <label>E-mail</label>
      <input
        disabled={disabled}
        type="email"
        placeholder="email"
        value={email || ""}
        onChange={(ev) => setAddressProp("email", ev.target.value)}
      />
      <label>Phone</label>
      <input
        disabled={disabled}
        type="tel"
        placeholder="Phone number"
        value={phone || ""}
        onChange={(ev) => setAddressProp("phone", ev.target.value)}
      />
      <label>Street address</label>
      <input
        disabled={disabled}
        type="text"
        placeholder="Street address"
        value={streetAdress || ""}
        onChange={(ev) => setAddressProp("streetAdress", ev.target.value)}
      />
      <label>Build number</label>
      <input
        disabled={disabled}
        type="text"
        placeholder="Build bumber"
        value={buildNumber || ""}
        onChange={(ev) => setAddressProp("buildNumber", ev.target.value)}
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label>Postal code</label>
          <input
            disabled={disabled}
            type="text"
            placeholder="Postal code"
            value={postalCode || ""}
            onChange={(ev) => setAddressProp("postalCode", ev.target.value)}
          />
        </div>
        <div>
          <label>City</label>
          {orderPage ? (
            <input
              disabled={disabled}
              type="text"
              placeholder="City"
              value={city || ""}
            />
          ) : (
            <select
              disabled={disabled}
              value={city || ""}
              onChange={(ev) => setAddressProp("city", ev.target.value)}
            >
              <option value={""}>Select a city</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      <div className="-mt-4 w-full">
        {!orderPage && (
          <button
            type="button"
            className="button flex justify-between items-center my-4"
            onClick={() => setShowPopup(true)}
          >
            <div className="flex items-center gap-4">
              <Time />
              <div>
                <h3 className="text-sm sm:text-xl text-left text-gray-900 font-semibold">
                  Delivery time
                </h3>
                <div className="text-left"> {deliveryTime}</div>
              </div>
            </div>
            <ChevronRight />
          </button>
        )}
        {showPopup && (
          <>
            <Dialog setShowPopup={setShowPopup}>
              <label
                htmlFor="deliveryTime"
                className="text-2xl text-gray-950 font-semibold block mt-4 mb-4"
              >
                Delivery time
              </label>
              {!orderPage && (
                <select
                  id="deliveryTime"
                  value={deliveryTime}
                  onChange={(e) =>
                    setAddressProp("deliveryTime", e.target.value)
                  }
                  className="block w-full mt-2 p-2 border"
                >
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time}>
                      {time === "ASAP" ? "As soon as possible" : time}
                    </option>
                  ))}
                </select>
              )}
            </Dialog>
          </>
        )}
        {orderPage && (
          <>
            <button
              type="button"
              disabled
              className="button flex justify-between items-center my-4"
            >
              <div className="flex items-center gap-4">
                <Time />
                <div>
                  <h3 className="text-xl text-left text-gray-900 font-semibold">
                    Delivery time
                  </h3>
                  <div className="text-left"> {deliveryTime}</div>
                </div>
              </div>
            </button>
            <button
              type="button"
              disabled
              className="button flex justify-between items-center my-4 !py-5"
            >
              <div className="flex items-center gap-4">
                {paymentMethod === "cash" ? (
                  <Cash />
                ) : paymentMethod === "paypal" ? (
                  <Paypal />
                ) : (
                  <Credit />
                )}
                <div>
                  <p className="text-xs">Selected payment method</p>
                  <h3 className="text-xl text-left text-gray-900 font-semibold">
                  {paymentMethod === "cash" ? (
                 "Cash"
                ) : paymentMethod === "paypal" ? (
                  "Paypal"
                ) : (
                  "Credit card"
                )}
                  </h3>
                </div>
              </div>
            </button>
          </>
        )}
      </div>
    </>
  );
}
