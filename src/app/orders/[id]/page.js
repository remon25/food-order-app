"use client";
import { cartContext, cartProductPrice } from "@/app/_components/AppContext";
import isAuth from "@/app/_components/isAuth";
import AddressInputs from "@/app/_components/layout/AdressInputs";
import SectionHeader from "@/app/_components/layout/SectionHeader";
import CartProduct from "@/app/_components/menu/CartProduct";
import { useParams, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

function OrderPage() {
  const { clearCart } = useContext(cartContext);
  const [isCleared, setIsCleared] = useState(false);
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const { id } = useParams();
  const searchParams = useSearchParams();
  const clearCartParam = searchParams.get("clear-cart");

  useEffect(() => {
    if (id) {
      setLoadingOrder(true);
      fetch("/api/orders?_id=" + id)
        .then((res) => {
          res.json().then((orderData) => {
            setOrder(orderData);
            setLoadingOrder(false);
          });
        })
        .then(() => {
          if (
            !isCleared &&
            typeof window !== "undefined" &&
            clearCartParam === "1"
          ) {
            clearCart();
            setIsCleared(true);
          }
        });
    }
  }, [isCleared, clearCart, id, clearCartParam]);

  let subtotal = 0;
  if (order?.cartProducts) {
    for (const product of order?.cartProducts) {
      subtotal += cartProductPrice(product);
    }
  }

  return (
    <section className="max-w-2xl mx-auto mt-8">
      <div className="text-center">
        <SectionHeader subtitle="Your order" />
        <div className="mt-4 mb-8">
          <p>Thanks for your order.</p>
          <p>We will call you when your order will be on the way.</p>
        </div>
      </div>
      {loadingOrder && <div>Loading order...</div>}
      {order && (
        <div className="grid md:grid-cols-2 md:gap-16">
          <div>
            {order.cartProducts.map((product, index) => (
              <CartProduct key={`${product._id}-${index}`} product={product} />
            ))}
            <div className="text-right py-2 text-gray-500">
              Subtotal:
              <span className="text-black font-bold inline-block w-8">
                ${subtotal}
              </span>
              <br />
              Delivery:
              <span className="text-black font-bold inline-block w-8">$5</span>
              <br />
              Total:
              <span className="text-black font-bold inline-block w-8">
                ${subtotal + 5}
              </span>
            </div>
          </div>
          <div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <AddressInputs disabled={true} addressProps={order} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default isAuth(OrderPage);
