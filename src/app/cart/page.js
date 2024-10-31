"use client";
import { useContext, useEffect, useState } from "react";
import { cartContext } from "../_components/AppContext";
import { cartProductPrice } from "../_components/AppContext";
import { useProfile } from "../_components/useProfile";
import AddressInputs from "../_components/layout/AdressInputs";
import SectionHeader from "../_components/layout/SectionHeader";
import Image from "next/image";
import DeleteIcon from "../_components/icons/DeleteIcon";
export default function CartPage() {
  const { cartProducts, removeCartProduct } = useContext(cartContext);
  let totalPrice = 0;
  for (const p of cartProducts) {
    totalPrice += cartProductPrice(p);
  }
  const [address, setAddress] = useState({});
  const { data: profileData } = useProfile();
  useEffect(() => {
    if (profileData?.city) {
      const { phone, streetAdress, city, postalCode, country } = profileData;
      const addressFromProfile = {
        phone,
        streetAdress,
        city,
        postalCode,
        country,
      };
      setAddress(addressFromProfile);
    }
  }, [profileData]);
  function handleAddressChange(propName, value) {
    setAddress((prevAddress) => ({ ...prevAddress, [propName]: value }));
  }

  async function proceedToCheckout(ev) {
    ev.preventDefault();
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartProducts,
        address,
      }),
    });
    window.location = await response.json();
  }
  return (
    <section className="mt-24 max-w-4xl mx-auto">
      <div className="text-center">
        <SectionHeader subtitle={"Cart"} />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-8">
        <div>
          {cartProducts?.length === 0 && <div>No products in your cart!</div>}
          {cartProducts?.length > 0 &&
            cartProducts.map((product, index) => (
              <div
                key={product._id * Math.random() * Math.random()}
                className="flex gap-4 items-center mb-2 border-b py-4"
              >
                <div className="w-24">
                  <Image
                    src={product?.image}
                    alt={product?.name}
                    width={240}
                    height={240}
                  />
                </div>
                <div className="grow">
                  <h3 className="font-semibold">{product.name}</h3>
                  {product.size && (
                    <div className="text-sm">
                      Size: <span>{product.size.name}</span>
                    </div>
                  )}
                  {product.extras?.length > 0 && (
                    <div className="text-sm text-gray-500">
                      {product.extras.map((extra) => (
                        <div key={extra.name}>
                          {extra.name} ${extra.price}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-lg font-semibold">
                  ${cartProductPrice(product)}
                </div>
                <div className="ml-2">
                  <button
                    type="button"
                    className="button"
                    onClick={() => removeCartProduct(index)}
                  >
                    <DeleteIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
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
        </div>
      </div>
    </section>
  );
}
