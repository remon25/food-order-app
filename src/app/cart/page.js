"use client";
import { useContext, useEffect, useState } from "react";
import { cartContext } from "../_components/AppContext";
import { cartProductPrice } from "../_components/AppContext";
import { useProfile } from "../_components/useProfile";
import AddressInputs from "../_components/layout/AdressInputs";
import SectionHeader from "../_components/layout/SectionHeader";
import toast from "react-hot-toast";
import CartProduct from "../_components/menu/CartProduct";
import {
  PayPalScriptProvider,
  PayPalButtons,
  FUNDING,
} from "@paypal/react-paypal-js";

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
  const { data: profileData } = useProfile();
  const [deliveryPrices, setDeliveryPrices] = useState({});
  const [loadingDeliveryPrices, setLoadingDeliveryPrices] = useState(true);
  const [finalTotalPrice, setFinalTotalPrice] = useState(0);
  const [timeOptions, setTimeOptions] = useState([]);

  let deliveryTime = "ASAP";
  let totalPrice = 0;
  let buildNumber = "";

  for (const p of cartProducts) {
    totalPrice += cartProductPrice(p);
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.href.includes("canceled=1")) {
        toast.error("Payment failed!");
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
        setDeliveryPrices(prices);
        setLoadingDeliveryPrices(false);
      } catch (error) {
        console.error("Error fetching");
      }
    };
    fetchDeliveryPrices();
  }, []);

  useEffect(() => {
    if (deliveryPrices[address.city]) {
      const deliveryPrice = deliveryPrices[address.city] || 0;
      setFinalTotalPrice(totalPrice + deliveryPrice);
    }
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
      toast.error("Please complete all address fields before proceeding.");
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
      loading: "Creating order...",
      success: "Redirecting to payment...",
      error: "Something went wrong! Please try again.",
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
          window.location = await response.json();
        } else {
          reject();
        }
      });
    });
    await toast.promise(promise, {
      loading: "Creating order...",
      success: "Order created successfully",
      error: "Something went wrong! Please try again.",
    });
  };
  console.log(address);
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
      loading: "Creating order...",
      success: "Order created successfully",
      error: "Something went wrong! Please try again.",
    });
  };

  if (cartProducts?.length === 0) {
    return (
      <section className="mt-24 text-center">
        <SectionHeader subtitle={"Cart"} />
        <p className="mt-4">No products in your cart!</p>
      </section>
    );
  }
  return (
    <section className="mt-24 max-w-4xl mx-auto">
      <div className="text-center">
        <SectionHeader subtitle={"Cart"} />
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <div>
          {cartProducts?.length > 0 &&
            cartProducts.map((product, index) => (
              <CartProduct
                key={`${product._id}-${index}`}
                product={product}
                onRemove={removeCartProduct}
                index={index}
              />
            ))}
          <div className="py-0 flex justify-end items-center">
            <div className="text-gray-500">
              Subtotal : <br /> Delivery : <br /> Total:
            </div>
            <div className="font-semibold">
              ${totalPrice} <br />${deliveryPrices[address.city] || 0} <br />$
              {totalPrice + (deliveryPrices[address.city] || 0)}
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2>Checkout</h2>
          <form onSubmit={proceedToCheckout}>
            <AddressInputs
              addressProps={address}
              setAddressProp={handleAddressChange}
              deliveryPrices={deliveryPrices}
              deliveryTime={deliveryTime}
              timeOptions={timeOptions}
            />
            <button className="button" type="submit">
              Pay ${finalTotalPrice}
            </button>
          </form>
          <div className="mt-4">
            {!loadingDeliveryPrices && (
              <PayPalScriptProvider
                options={{
                  "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                  currency: "USD",
                }}
              >
                <PayPalButtons
                  forceReRender={[finalTotalPrice, address]}
                  disabled={
                    !isComplete || loadingDeliveryPrices || !finalTotalPrice
                  }
                  fundingSource={FUNDING.PAYPAL}
                  style={{ layout: "vertical", color: "blue" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        { amount: { value: finalTotalPrice.toFixed(2) } },
                      ],
                    });
                  }}
                  onApprove={(data, actions) => {
                    return actions.order
                      .capture()
                      .then(handlePayPalSuccess)
                      .catch(() =>
                        toast.error("Payment capture failed. Please try again.")
                      );
                  }}
                  onError={() => toast.error("PayPal payment failed")}
                />
              </PayPalScriptProvider>
            )}
          </div>
          <div className="mt-4">
            <button
              disabled={!isComplete}
              onClick={handlePayOnDelivery}
              type="button"
              className="button"
            >
              Pay on delivery
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
