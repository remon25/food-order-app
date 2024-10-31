"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "/public/logo.png";
import { signOut, useSession } from "next-auth/react";
import { useContext } from "react";
import { cartContext } from "../AppContext";
import Cart from "../icons/Cart";

export default function Header() {
  const session = useSession();
  const status = session.status;
  let name =
    session.data?.user?.name?.split(" ")[0] ||
    session.data?.user?.email.split("@")[0];

  const { cartProducts } = useContext(cartContext);
  return (
    <header className="flex justify-between items-center h-[5.5rem] z-50 relative w-full">
      <nav className="flex items-center gap-8 text-gray-600 font-semibold">
        <Link href="/" className="text-primary font-semibold text-2xl">
          <Image src={Logo} alt="Logo" width={100} height={100} />
        </Link>
        <Link href="/">Startseite</Link>
        <Link href="/menu">Menü</Link>
        <Link href="/#about">Über uns</Link>
        <Link href="/#contact">Kontakt</Link>
      </nav>
      <nav className="flex items-center gap-4 font-semibold">
        {status === "authenticated" && (
          <>
            <Link className="text-gray-600 whitespace-nowrap" href={"/profile"}>
              Heloo, {name}
            </Link>
            <button
              onClick={() => signOut()}
              className="bg-primary text-white px-6 py-2 rounded"
            >
              Logout
            </button>
          </>
        )}
        {status === "unauthenticated" && (
          <>
            <Link href={"/login"}>Anmelden</Link>
            <Link
              href={"/register"}
              className="bg-primary text-white px-6 py-2 rounded"
            >
              Registrieren
            </Link>
          </>
        )}
        <Link href={"/cart"} className="relative">
          <Cart />
          <span
            style={{ width: "20px", borderRadius: "50%" }}
            className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 flex justify-center leading-3"
          >
            {cartProducts.length}
          </span>
        </Link>
      </nav>
    </header>
  );
}
