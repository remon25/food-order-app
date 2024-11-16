"use client";
import { cartContext } from "../AppContext";
import { useContext, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Bars2 from "../icons/Bars2";
import ShoppingCart from "../icons/Cart";

function AuthLinks({ status, userName, image, mobile = false }) {
  if (status === "authenticated") {
    return (
      <>
        <Link href={"/profile"} className="whitespace-nowrap">
          <div className="flex flex-col gap-1 items-center justify-center">
            {!mobile && (
              <Image
                src={image || "/avatar.png"}
                alt={userName}
                className="rounded-full"
                width={40}
                height={40}
              />
            )}
          </div>
        </Link>
        <button
          onClick={() => signOut()}
          className="bg-primary rounded-full text-white px-8 py-2"
        >
          Logout
        </button>
      </>
    );
  }
  if (status === "unauthenticated") {
    return (
      <>
        <Link href={"/login"}>Login</Link>
        <Link
          href={"/register"}
          className="bg-primary rounded-full text-white px-8 py-2"
        >
          Register
        </Link>
      </>
    );
  }
}

export default function Header() {
  const session = useSession();
  const status = session?.status;
  const userData = session.data?.user;
  let userName = userData?.name || userData?.email;
  const { cartProducts } = useContext(cartContext);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  if (userName && userName.includes(" ")) {
    userName = userName.split(" ")[0];
  }
  return (
    <header
      id="header"
      className="fixed md:absolute top-0 left-0 bg-gray-950 right-0 px-8 py-2 w-full z-20"
    >
      <div className="flex items-center md:hidden justify-between">
        <Link className="text-primary font-semibold text-2xl" href={"/"}>
          <Image
            className="nav-logo"
            src="/antalya.png"
            width={75}
            height={75}
            alt="Antalya restaurant logo"
          />
        </Link>
        <div className="flex gap-8 items-center">
          {/* <Link href={"/cart"} className="relative">
            <ShoppingCart />
            {cartProducts?.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">
                {cartProducts.length}
              </span>
            )}
          </Link> */}
          <Link href={"/profile"}>
            <Image
              src={userData?.image || "/avatar.png"}
              alt={userName}
              className="rounded-full"
              width={40}
              height={40}
            />
          </Link>

          <button
            className="p-1 border"
            onClick={() => setMobileNavOpen((prev) => !prev)}
          >
            <Bars2 />
          </button>
        </div>
      </div>
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="md:hidden top-0 p-4 bg-gray-950 text-white rounded-lg mt-2 flex flex-col gap-2 text-center"
        >
          <Link href={"/"}>Home</Link>
          <Link href={"/menu"}>Menu</Link>
          <Link href={"/#about"}>About</Link>
          <Link href={"/#contact"}>Contact</Link>
          <AuthLinks status={status} userName={userName} mobile={true} />
        </div>
      )}
      <div className="hidden md:flex items-center justify-between">
        <nav className="flex items-center gap-8 text-white font-semibold">
          <Link className="text-primary font-semibold text-2xl" href={"/"}>
            <Image
              src="/antalya.png"
              width={80}
              height={80}
              alt="Antalya restaurant logo"
            />
          </Link>
          <Link href={"/"}>Home</Link>
          <Link href={"/menu"}>Menu</Link>
          <Link href={"/#about"}>About</Link>
          <Link href={"/#contact"}>Contact</Link>
        </nav>
        <nav className="flex items-center gap-4 text-white font-semibold">
          <AuthLinks
            status={status}
            userName={userName}
            image={userData?.image}
          />
          {/* <Link href={"/cart"} className="relative">
            <ShoppingCart />
            {cartProducts?.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">
                {cartProducts.length}
              </span>
            )}
          </Link> */}
        </nav>
      </div>
    </header>
  );
}
