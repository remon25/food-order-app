export default function AddressInputs({
  addressProps,
  setAddressProp,
  deliveryPrices,
  timeOptions,
  disabled = false,
  orderPage = false,
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
  } = addressProps;

  const cities = Object.keys(deliveryPrices || []);
  return (
    <>
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
        <label htmlFor="deliveryTime" className="block mt-4 font-medium">
          Delivery Time:
        </label>
        {!orderPage ? (
          <select
            id="deliveryTime"
            value={deliveryTime}
            onChange={(e) => setAddressProp("deliveryTime", e.target.value)}
            className="block w-full mt-2 p-2 border"
          >
            {timeOptions.map((time, index) => (
              <option key={index} value={time}>
                {time === "ASAP" ? "As soon as possible" : time}
              </option>
            ))}
          </select>
        ) : (
          <input id="deliveryTime" disabled type="text" value={deliveryTime} />
        )}
      </div>
    </>
  );
}
