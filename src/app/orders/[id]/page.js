"use client";

import { cartContext } from "@/app/_components/AppContext";
import Delivery from "@/app/_components/icons/Delivery";
import Pickup from "@/app/_components/icons/Pickup";
import AddressInputs from "@/app/_components/layout/AdressInputs";
import SectionHeader from "@/app/_components/layout/SectionHeader";
import Spinner from "@/app/_components/layout/Spinner";
import CartProduct from "@/app/_components/menu/CartProduct";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

function OrderPage() {
  const { clearCart } = useContext(cartContext);
  const [isCleared, setIsCleared] = useState(false);
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [error, setError] = useState(null); // Error state
  const { id } = useParams();
  const searchParams = useSearchParams();
  const clearCartParam = searchParams.get("clear-cart");
  const { data: session, status } = useSession(); // Destructure session and status

  useEffect(() => {
    if (id && session) {
      setLoadingOrder(true);
      setError(null); // Reset error state on retry

      fetch("/api/orders?_id=" + id)
        .then((res) => {
          if (!res.ok) {
            // If the response is not ok, throw an error
            throw new Error(`Order not found (status: ${res.status})`);
          }
          return res.json();
        })
        .then((orderData) => {
          setOrder(orderData);
          setLoadingOrder(false);
        })
        .catch((err) => {
          // Handle errors gracefully
          setError(err.message);
          setLoadingOrder(false);
        });

      if (
        !isCleared &&
        typeof window !== "undefined" &&
        clearCartParam === "1"
      ) {
        clearCart();
        setIsCleared(true);
      }
    }
  }, [isCleared, clearCart, id, clearCartParam, session]);

  if (status === "loading") {
    return (
      <div className="text-center p-4">
        <div className="w-full h-[90vh] flex items-center justify-center overflow-hidden">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center p-4">
        <SectionHeader subtitle="Your order" />
        <div className="mt-4 mb-8">
          <p>Danke für deine Bestellung.</p>
          <p>Wir rufen dich an, wenn deine Bestellung auf dem Weg ist.</p>
          <p>
            Du kannst dich registrieren oder einloggen, um alle deine bisherigen
            Bestellungen in deinem Profil zu sehen.
          </p>
        </div>
      </div>
    );
  }

  // Show error message if order is not found
  if (error) {
    return (
      <div className="text-center p-4">
        <SectionHeader subtitle="Order Not Found" />
        <div className="mt-4 mb-8">
          <p>{error}</p>
          <p>Bitte überprüfe die Bestell-ID und versuche es erneut.</p>
        </div>
      </div>
    );
  }

  // Show loading indicator while fetching order data
  if (loadingOrder) {
    return (
      <div className="w-full h-[90vh] flex items-center justify-center overflow-hidden">
        <Spinner />
      </div>
    );
  }

  console.log(order);

  // Render order details if order is found
  return (
    <section className="max-w-4xl mx-auto mt-4 p-4">
      <div className="text-center">
        <SectionHeader subtitle="Ihre Bestellung" />
        <div className="mt-4 mb-8">
          <p>Danke für deine Bestellung.</p>
          <p className="italic font-semibold">Your order id is {order?._id}</p>
        </div>
      </div>
      {order && (
        <div className="grid md:grid-cols-2 md:gap-16">
          <div>
            {order.cartProducts.map((product, index) => (
              <CartProduct key={`${product._id}-${index}`} product={product} />
            ))}
            <div className="text-left py-2 text-gray-500">
              Zwischensumme:{" "}
              <span className="text-black font-bold inline-block w-8">
                {order?.subtotal}€
              </span>
              <br />
              {order?.orderType === "delivery" ? "Lieferung: " : ""}
              {order?.orderType === "delivery" && (
                <>
                  <span className="text-black font-bold inline-block w-8">
                    {order?.deliveryPrice === 0 &&
                      order?.orderType === "delivery" &&
                      "Kostenlos"}
                    {order?.deliveryPrice !== 0 && order?.deliveryPrice + "€"}
                    {order?.deliveryPrice == null &&
                      rder?.deliveryPrice == undefined &&
                      "_"}
                  </span>
                  <br />
                </>
              )}
              Gesamt:{" "}
              <span className="text-black font-bold inline-block w-8">
                {order?.finalTotalPrice}€
              </span>
            </div>
          </div>
          <div>
            <div className="bg-gray-100 p-4 rounded-lg">
              {order.orderType === "delivery" ? (
                <div className="flex justify-center items-center gap-2 bg-white rounded-full py-2 px-4 shadow-lg mb-2">
                  <Delivery
                    className={`${
                      order?.orderType == "delivery"
                        ? "w-6 h-6 stroke-primary"
                        : "w-6 h-6 stroke-black"
                    } transition-all duration-300 ease-in-out`}
                  />
                  <div className={`font-semibold`}>Lieferung</div>
                </div>
              ) : (
                <div className="flex justify-center items-center gap-2 bg-white rounded-full py-2 px-4 shadow-lg mb-2">
                  <Pickup
                    className={`${
                      order?.orderType == "pickup"
                        ? "w-6 h-6 fill-primary"
                        : "w-6 h-6 fill-black"
                    } transition-all duration-300 ease-in-out`}
                  />
                  <div className={`font-semibold`}>Abholung</div>
                </div>
              )}
              <AddressInputs
                disabled={true}
                addressProps={order}
                orderPage={true}
                orderType={order?.orderType}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default OrderPage;
