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

export default function CartPage() {
  const { cartProducts, removeCartProduct } = useContext(cartContext);
  let totalPrice = 0;
  for (const p of cartProducts) {
    totalPrice += cartProductPrice(p);
  }
  const [address, setAddress] = useState({});
  const { data: profileData } = useProfile();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.href.includes("canceled=1")) {
        toast.error("Payment failed!");
      }
    }
  }, []);

  useEffect(() => {
    if (profileData?.city) {
      const { phone, streetAdress, city, postalCode } = profileData;
      const addressFromProfile = { phone, streetAdress, city, postalCode };
      setAddress(addressFromProfile);
    }
  }, [profileData]);

  function handleAddressChange(propName, value) {
    setAddress((prevAddress) => ({ ...prevAddress, [propName]: value }));
  }

  const requiredFields = ["phone", "streetAdress", "postalCode", "city"];
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
          paid: true,
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
          {cartProducts?.length === 0 && <div>No products in your cart!</div>}
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
              ${totalPrice} <br />${5} <br />${totalPrice + 5}
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2>Checkout</h2>
          <form onSubmit={proceedToCheckout}>
            <AddressInputs
              addressProps={address}
              setAddressProp={handleAddressChange}
            />
            <button className="button" type="submit">
              Pay ${totalPrice + 5}
            </button>
          </form>

          {/* PayPal Integration */}
          <div className="mt-4">
            <PayPalScriptProvider
              options={{
                "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                currency: "USD",
              }}
            >
              <PayPalButtons
                disabled={!isComplete}
                fundingSource={FUNDING.PAYPAL}
                style={{ layout: "vertical", color: "blue" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: (totalPrice + 5).toString(),
                        },
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order
                    .capture()
                    .then(handlePayPalSuccess)
                    .catch((error) => {
                      toast.error("Payment capture failed. Please try again.");
                    });
                }}
                onError={(err) => toast.error("PayPal payment failed")}
              />
            </PayPalScriptProvider>
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
