"use client";
import React, { useContext, useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";
import CartProduct from "../menu/CartProduct";
import { cartContext, cartProductPrice } from "../AppContext";
import Cart from "../icons/Cart";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Xmark from "../icons/Xmark";
import ShoppingCart from "../icons/Cart";

export default function Sidebar() {
  const { cartProducts, removeCartProduct } = useContext(cartContext);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showCartButton, setShowCartButton] = useState(true);
  let totalPrice = 0;
  const pathname = usePathname();

  for (const p of cartProducts) {
    totalPrice += cartProductPrice(p);
  }

  useEffect(() => {
    if (showCartButton && cartProducts.length > 0) {
      document.getElementById("footer").classList.add("mobile");
    } else {
      document.getElementById("footer").classList.remove("mobile");
    }
  }, [showCartButton,cartProducts?.length]);
  useEffect(() => {
    if (showMobileSidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  });
  useEffect(() => {
    if (pathname === "/" || pathname === "/menu") {
      setShowCartButton(true);
    } else {
      setShowMobileSidebar(false);
      setShowCartButton(false);
    }
  }, [pathname]);
  return (
    <div className="mobile-sidebar hidden">
      {!showMobileSidebar && showCartButton && cartProducts.length > 0 && (
        <div className="mobile-cart-button hidden fixed bottom-0 right-0 left-0 w-full  z-[999] bg-white p-4">
          <button
            onClick={() => setShowMobileSidebar(true)}
            type="button"
            className="button sidebar_button flex justify-center gap-2 !p-3"
          >
            <Link href={"/cart"} className="relative">
              <ShoppingCart />
              {cartProducts?.length > 0 && (
                <span className="absolute w-[20px] h-[20px] -top-2 right-[1rem] bg-black text-white text-xs py-1 px-1 rounded-[50%] leading-3">
                  {cartProducts.length}
                </span>
              )}
            </Link>
            <span className="text-lg">Check out ({totalPrice} &euro;)</span>
          </button>
        </div>
      )}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-[999] min-h-full overflow-y-auto overflow-x-hidden transition bg-white p-4">
          <button
            onClick={() => setShowMobileSidebar(false)}
            className="absolute top-2 right-2 cursor-pointer"
          >
            <Xmark className="w-8 h-8" />
          </button>
          <div className="text-center">
            <SectionHeader subtitle={"Basket"} />
          </div>

          {cartProducts?.length !== 0 ? (
            <div className="grid md:grid-cols-1 gap-4 mt-8 overflow-auto pb-[84px]">
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
                <div className="mobile-cart-button hidden fixed bottom-0 right-0 left-0 w-full  z-[999] bg-white p-4">
                  <button
                    type="button"
                    className="button sidebar_button flex justify-center gap-2 !p-3"
                  >
                    <div className="relative">
                      <ShoppingCart />
                      {cartProducts?.length > 0 && (
                        <span className="absolute w-[20px] h-[20px] -top-2 right-[1rem] bg-black text-white text-xs py-1 px-1 rounded-[50%] leading-3">
                          {cartProducts.length}
                        </span>
                      )}
                    </div>
                    <span className="text-lg">
                      Check out ({totalPrice}&euro;)
                    </span>
                  </button>
                </div>
              </Link>
            </div>
          ) : (
            <div className="text-center grow flex flex-col items-center justify-center mt-[30%]">
              <Cart className="text-gray-900 w-10 h-10" />
              <h3 className="text-3xl text-gray-800 font-semibold">
                Fill your Basket
              </h3>
              <p className="text-gray-700 text-lg"> Your Basket is empty</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
