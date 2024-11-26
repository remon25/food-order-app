"use client";
import { useContext, useEffect, useState } from "react";
import { cartContext } from "../_components/AppContext";
import { cartProductPrice } from "../_components/AppContext";
import { useProfile } from "../_components/useProfile";
import AddressInputs from "../_components/layout/AdressInputs";
import toast from "react-hot-toast";
import ChevronRight from "../_components/icons/ChevronRight";
import Dialog from "../_components/Dialog";
import CartProduct from "../_components/menu/CartProduct";
import {
  PayPalScriptProvider,
  PayPalButtons,
  FUNDING,
} from "@paypal/react-paypal-js";
import Paypal from "../_components/icons/Paypal";
import Cash from "../_components/icons/Cash";
import Credit from "../_components/icons/Credit";
import Check from "../_components/icons/Check";
import Cart from "../_components/icons/Cart";
import Spinner from "../_components/layout/Spinner";
import { useSession } from "next-auth/react";

function generateTimeSlots() {
  const timeSlots = [];
  const now = new Date();

  // Set time to 1 hour from now and round to the next 15-minute interval
  now.setMinutes(Math.ceil((now.getMinutes() + 60) / 15) * 15, 0, 0);

  for (let i = 0; i < 16; i++) {
    // Generate 16 time slots (4 hours)
    const localTime = now.toLocaleTimeString("en-GB", {
      timeZone: "Europe/Berlin",
      hour: "2-digit",
      minute: "2-digit",
    });
    timeSlots.push(localTime);
    now.setMinutes(now.getMinutes() + 15); // Increment by 15 minutes
  }
  return timeSlots;
}

export default function CartPage() {
  const { cartProducts, removeCartProduct } = useContext(cartContext);
  const [address, setAddress] = useState({});
  const {
    data: profileData,
    loading: profileLoading,
    error: profileError,
  } = useProfile();
  const [deliveryPrices, setDeliveryPrices] = useState({});
  const [loadingDeliveryPrices, setLoadingDeliveryPrices] = useState(true);
  const [finalTotalPrice, setFinalTotalPrice] = useState(0);
  const [timeOptions, setTimeOptions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit");
  const [loading, setLoading] = useState(true);
  const [cityInfo, setCityInfo] = useState([]);
  const { session } = useSession();

  let deliveryTime = "ASAP";
  let totalPrice = 0;
  let buildNumber = "";

  for (const p of cartProducts) {
    totalPrice += cartProductPrice(p);
  }

  useEffect(() => {
    if (profileLoading || !cartProducts || session) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [profileLoading, cartProducts, session]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.href.includes("canceled=1")) {
        toast.error("Zahlung fehlgeschlagen!");
      }
    }
  }, []);

  useEffect(() => {
    const fetchDeliveryPrices = async () => {
      try {
        const response = await fetch("/api/delivery-prices");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        const prices = {};
        data.forEach((price) => (prices[price.name] = price.price));
        setCityInfo(data);
        setDeliveryPrices(prices);
        setLoadingDeliveryPrices(false);
      } catch (error) {
        console.error("Error fetching");
      }
    };
    fetchDeliveryPrices();
  }, []);

  useEffect(() => {
    const calculateFinalPrice = () => {
      const deliveryPrice = deliveryPrices[address.city] || 0;
      if (deliveryPrices[address.city] !== undefined) {
        setFinalTotalPrice(totalPrice + deliveryPrice);
      } else {
        setFinalTotalPrice("");
      }
    };
    calculateFinalPrice();
  }, [totalPrice, address.city, deliveryPrices]);

  useEffect(() => {
    if (profileData) {
      const { phone, streetAdress, city, postalCode, name, email } =
        profileData;
      const addressFromProfile = {
        phone,
        streetAdress,
        city,
        postalCode,
        email,
        name,
      };
      setAddress({ ...addressFromProfile, buildNumber, deliveryTime });
    }
  }, [profileData, buildNumber, deliveryTime]);

  useEffect(() => {
    setTimeOptions(["ASAP", ...generateTimeSlots()]); // Populate with "ASAP" + 15-minute slots
  }, []);

  function handleAddressChange(propName, value) {
    setAddress((prevAddress) => ({ ...prevAddress, [propName]: value }));
  }

  const requiredFields = [
    "name",
    "email",
    "phone",
    "streetAdress",
    "postalCode",
    "city",
    "buildNumber",
  ];
  const isComplete = requiredFields.every((field) => address[field]);

  async function proceedToCheckout(ev) {
    ev.preventDefault();
    if (!isComplete) {
      toast.error(
        "Bitte vervollständige alle Adressfelder, bevor du fortfährst."
      );
      return;
    }
    const promise = new Promise((resolve, reject) => {
      fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartProducts,
          address,
          subtotal: totalPrice,
          deliveryPrice: deliveryPrices[address.city],
        }),
      }).then(async (response) => {
        if (response.ok) {
          resolve();
          window.location = await response.json();
        } else {
          reject();
        }
      });
    });

    await toast.promise(promise, {
      loading: "Bestellung wird erstellt...",
      success: "Weiterleitung zur Zahlung...",
      error: "Etwas ist schiefgelaufen! Bitte versuche es erneut.",
    });
  }

  const handlePayPalSuccess = async (details) => {
    const promise = new Promise((resolve, reject) => {
      fetch("/api/paypal_checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartProducts,
          address,
          subtotal: totalPrice,
          deliveryPrice: deliveryPrices[address.city],
        }),
      }).then(async (response) => {
        if (response.ok) {
          resolve();
          // window.location = await response.json();
        } else {
          reject();
        }
      });
    });
    await toast.promise(promise, {
      loading: "Bestellung wird erstellt...",
      success: "Bestellung erfolgreich erstellt",
      error: "Etwas ist schiefgelaufen! Bitte versuche es erneut.",
    });
  };
  const handlePayOnDelivery = async () => {
    const promise = new Promise((resolve, reject) => {
      fetch("/api/delivery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartProducts,
          address,
          subtotal: totalPrice,
          deliveryPrice: deliveryPrices[address.city],
        }),
      }).then(async (response) => {
        if (response.ok) {
          resolve();
          window.location = await response.json();
        } else {
          reject();
        }
      });
    });
    await toast.promise(promise, {
      loading: "Bestellung wird erstellt...",
      success: "Bestellung erfolgreich erstellt",
      error: "Etwas ist schiefgelaufen! Bitte versuche es erneut.",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (cartProducts?.length === 0) {
    return (
      <section className="mt-24 text-center">
        <div className="text-center">
          <h2 className="text-gray-950 font-bold text-4xl">Kasse</h2>
        </div>
        <div className="flex flex-col items-center gap-8">
          <p className="mt-4">Keine Produkte in deinem Warenkorb!</p>
          <Cart className="w-16 h-16" />
        </div>
      </section>
    );
  }
  return (
    <section className="mt-24 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-gray-950 font-bold text-4xl">Kasse</h2>
      </div>
      <div className="grid md:grid-cols-1 gap-4 mt-8">
        <div className="bg-gray-100 p-4 rounded-lg">
          <form onSubmit={proceedToCheckout}>
            <AddressInputs
              addressProps={address}
              setAddressProp={handleAddressChange}
              deliveryPrices={deliveryPrices}
              deliveryTime={deliveryTime}
              timeOptions={timeOptions}
              selectedPaymentMethod={selectedPaymentMethod}
              cityInfo={cityInfo}
            />
            <div className="w-full">
              <button
                type="button"
                className="button flex justify-between items-center my-4"
                onClick={() => setShowPopup(true)}
              >
                <div className="flex items-center gap-4">
                  {selectedPaymentMethod === "paypal" && <Paypal />}
                  {selectedPaymentMethod === "cash" && <Cash />}
                  {selectedPaymentMethod === "credit" && <Credit />}
                  <div>
                    <h3 className="text-sm sm:text-xl text-left text-gray-900 font-semibold">
                      Zahlung abschließen mit
                    </h3>
                    <div className="text-left">{selectedPaymentMethod}</div>
                  </div>
                </div>
                <ChevronRight />
              </button>
              {showPopup && (
                <>
                  <Dialog setShowPopup={setShowPopup}>
                    <h3>Zahlungsmethoden</h3>
                    <button
                      type="button"
                      className="button flex justify-between items-center my-4 !py-5"
                      onClick={() => setSelectedPaymentMethod("cash")}
                    >
                      <div className="flex items-center gap-4">
                        <Cash />
                        <div>
                          <h3 className="text-xl text-left text-gray-900 font-semibold">
                            Barzahlung
                          </h3>
                          <div className="text-left"></div>
                        </div>
                      </div>
                      {selectedPaymentMethod === "cash" && <Check />}
                    </button>

                    <button
                      type="button"
                      className="button flex justify-between items-center my-4 !py-5"
                      onClick={() => setSelectedPaymentMethod("credit")}
                    >
                      <div className="flex items-center gap-4">
                        <Credit />
                        <div>
                          <h3 className="text-xl text-left text-gray-900 font-semibold">
                            Kreditkarte
                          </h3>
                          <div className="text-left"></div>
                        </div>
                      </div>
                      {selectedPaymentMethod === "credit" && <Check />}
                    </button>

                    <button
                      type="button"
                      className="button flex justify-between items-center my-4 !py-5"
                      onClick={() => setSelectedPaymentMethod("paypal")}
                    >
                      <div className="h-full flex items-center gap-4">
                        <Paypal />
                        <div>
                          <h3 className="text-xl text-left text-gray-900 font-semibold">
                            Paypal
                          </h3>
                          <div className="text-left"></div>
                        </div>
                      </div>
                      {selectedPaymentMethod === "paypal" && <Check />}
                    </button>
                  </Dialog>
                </>
              )}
            </div>

            {selectedPaymentMethod === "credit" ? (
              <button disabled={!isComplete} className="button" type="submit">
                Bestellen & Bezahlen {finalTotalPrice && finalTotalPrice + " €"}
              </button>
            ) : selectedPaymentMethod === "paypal" ? (
              <div className="relatie z-1 mt-4">
                {!loadingDeliveryPrices && (
                  <div className="relative">
                    <button
                      disabled={!isComplete}
                      type="button"
                      className="button Dialog_button"
                    >
                      Bestellen & Bezahlen{" "}
                      {finalTotalPrice && finalTotalPrice + " €"}
                    </button>
                    <div className="absolute top-0 right-0 left-0 bottom-0 opacity-0">
                      {isComplete && (
                        <PayPalScriptProvider
                          options={{
                            "client-id":
                              process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                            currency: "EUR",
                          }}
                        >
                          <PayPalButtons
                            forceReRender={[finalTotalPrice, address]}
                            disabled={
                              !isComplete ||
                              loadingDeliveryPrices ||
                              !finalTotalPrice
                            }
                            fundingSource={FUNDING.PAYPAL}
                            style={{ layout: "vertical", color: "blue" }}
                            createOrder={(data, actions) => {
                              return actions.order.create({
                                purchase_units: [
                                  {
                                    amount: {
                                      value: finalTotalPrice.toFixed(2),
                                    },
                                  },
                                ],
                              });
                            }}
                            onApprove={(data, actions) => {
                              return actions.order
                                .capture()
                                .then(handlePayPalSuccess)
                                .catch(() =>
                                  toast.error(
                                    "Zahlungserfassung fehlgeschlagen. Bitte versuche es erneut."
                                  )
                                );
                            }}
                            onError={() =>
                              toast.error("PayPal-Zahlung fehlgeschlagen")
                            }
                          />
                        </PayPalScriptProvider>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4">
                <button
                  disabled={!isComplete}
                  onClick={handlePayOnDelivery}
                  type="button"
                  className="button Dialog_button"
                >
                  Bestellen & Bezahlen{" "}
                  {finalTotalPrice && finalTotalPrice + " €"}
                </button>
              </div>
            )}
          </form>
        </div>
        <div className="p-3">
          {cartProducts?.length > 0 &&
            cartProducts.map((product, index) => (
              <CartProduct
                key={`${product._id}-${index}`}
                product={product}
                onRemove={removeCartProduct}
                index={index}
              />
            ))}
          <div className="py-1 px-2 flex justify-end items-center">
            <div className="text-gray-500">
              Zwischensumme : &nbsp; <br /> Lieferung : <br /> Gesamt : &nbsp;
            </div>
            <div className="font-semibold">
              {totalPrice} € <br />
              {deliveryPrices[address.city] === 0 ? (
                "kostenlos"
              ) : deliveryPrices[address.city] == undefined ? (
                <span className="text-gray-500 text-xs">Stadt auswählen</span>
              ) : (
                deliveryPrices[address.city] + " €"
              )}
              <br />
              {totalPrice + (deliveryPrices[address.city] || 0)} €
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
