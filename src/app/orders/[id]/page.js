"use client";

import { cartContext } from "@/app/_components/AppContext";
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
          <p>Thanks for your order.</p>
          <p>We will call you when your order is on the way.</p>
          <p>
            You can register or login to see all your past orders from your
            profile.
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
          <p>Please check the order ID and try again.</p>
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

  // Render order details if order is found
  return (
    <section className="max-w-2xl mx-auto mt-8 p-4">
      <div className="text-center">
        <SectionHeader subtitle="Your order" />
        <div className="mt-4 mb-8">
          <p>Thanks for your order.</p>
          <p>We will call you when your order is on the way.</p>
        </div>
      </div>
      {order && (
        <div className="grid md:grid-cols-2 md:gap-16">
          <div>
            {order.cartProducts.map((product, index) => (
              <CartProduct
                key={`${product._id}-${index}`}
                product={product}
              />
            ))}
            <div className="text-right py-2 text-gray-500">
              Subtotal:
              <span className="text-black font-bold inline-block w-8">
                ${order?.subtotal}
              </span>
              <br />
              Delivery:
              <span className="text-black font-bold inline-block w-8">
                ${order?.deliveryPrice || "-"}
              </span>
              <br />
              Total:
              <span className="text-black font-bold inline-block w-8">
                ${order?.finalTotalPrice}
              </span>
            </div>
          </div>
          <div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <AddressInputs
                disabled={true}
                addressProps={order}
                orderPage={true}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default OrderPage;



