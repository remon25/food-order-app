"use client";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";
import { createContext } from "react";
import toast from "react-hot-toast";

export const cartContext = createContext({});

export function cartProductPrice(cartProduct) {
  let price = cartProduct.price;
  if (cartProduct.size) {
    price += cartProduct.size.price;
  }
  if (cartProduct.extras?.length > 0) {
    for (const extra of cartProduct.extras) {
      price += extra.price;
    }
  }
  return price;
}

export default function AppProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [orderType, setOrderType] = useState("delivery");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedCart = window.localStorage.getItem("cart");
      if (storedCart) {
        setCartProducts(JSON.parse(storedCart));
      }
      const storedOrderType = window.localStorage.getItem("orderType");
      if (storedOrderType) {
        setOrderType(storedOrderType);
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      window.localStorage.setItem("orderType", orderType);
    }
  }, [orderType, isClient]);

  function clearCart() {
    setCartProducts([]);
    saveCartProductsToLocalStorage([]);
  }

  function removeCartProduct(index) {
    setCartProducts((prev) => {
      const newProducts = prev.filter((_, i) => i !== index);
      saveCartProductsToLocalStorage(newProducts);
      return newProducts;
    });
    toast.success("Product removed");
  }

  function saveCartProductsToLocalStorage(cartProducts) {
    if (isClient) {
      window.localStorage.setItem("cart", JSON.stringify(cartProducts));
    }
  }

  function addToCart(product, size = null, extras = []) {
    setCartProducts((prev) => {
      const cartProduct = { ...product, size, extras };
      const newProducts = [...prev, cartProduct];
      saveCartProductsToLocalStorage(newProducts);
      return newProducts;
    });
  }

  return (
    <SessionProvider>
      <cartContext.Provider
        value={{
          cartProducts,
          setCartProducts,
          addToCart,
          removeCartProduct,
          clearCart,
          orderType,
          setOrderType,
        }}
      >
        {children}
      </cartContext.Provider>
    </SessionProvider>
  );
}
