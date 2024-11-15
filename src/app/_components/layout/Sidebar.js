"use client";
import React, { useContext, useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";
import CartProduct from "../menu/CartProduct";
import { cartContext, cartProductPrice } from "../AppContext";
import Cart from "../icons/Cart";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { cartProducts, removeCartProduct } = useContext(cartContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  let totalPrice = 0;
  const pathname = usePathname();

  for (const p of cartProducts) {
    totalPrice += cartProductPrice(p);
  }

  useEffect(() => {
    if (pathname === "/" || pathname === "/menu") {
      setShowSidebar(true);
    } else {
      setShowSidebar(false);
    }
  }, [pathname]);

  useEffect(() => {
    const headerHeight = document.getElementById("header").scrollHeight;
    setIsScrolled(window.scrollY > headerHeight);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > headerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <aside
      id="sidebar"
      className={`sidebar ${
        showSidebar ? "translate-x-0" : "translate-x-full"
      } fixed top-0 bottom-0 right-0 h-screen w-[330px] z-10 px-6 ${
        isScrolled ? "pt-1" : "pt-20"
      } flex flex-col bg-white transition-all`}
    >
      <div className="text-center">
        <SectionHeader subtitle={"Basket"} />
      </div>

      {cartProducts?.length !== 0 ? (
        <div className="relative grid md:grid-cols-1 gap-4 mt-8 overflow-auto">
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
              <div className="text-gray-500">Subtotal :</div>
              <div className="font-semibold">${totalPrice}</div>
            </div>
          </div>
          <Link href={"/cart"}>
            <button type="button" className="mt-6 sidebar_button button">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      ) : (
        <div className="text-center grow flex flex-col items-center justify-center">
          <Cart className="text-gray-900 w-10 h-10" />
          <h3 className="text-3xl text-gray-800 font-semibold">
            Fill your Basket
          </h3>
          <p className="text-gray-700 text-lg"> Your Basket is empty</p>
        </div>
      )}
    </aside>
  );
}
