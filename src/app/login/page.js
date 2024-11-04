"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import withAuthRedirect from "../_components/withAuthRedirect";
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  async function hadleFormSubmit(e) {
    e.preventDefault();
    setLoggingIn(true);

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });

    setLoggingIn(false);
  }
  return (
    <section className="mt-16">
      <h1 className="text-center text-primary text-4xl font-bold mb-6">
        Anmelden
      </h1>
      <form className="block max-w-sm mx-auto" onSubmit={hadleFormSubmit}>
        <input
          name="email"
          type="email"
          placeholder="E-Mail"
          value={email}
          disabled={loggingIn}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          name="password"
          type="password"
          placeholder="Passwort"
          value={password}
          disabled={loggingIn}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loggingIn}
          className="bg-primary text-white px-6 py-2 rounded"
        >
          Anmelden
        </button>
        <div className="text-center my-4 text-gray-500">
          Oder mit Anbieter anmelden
        </div>
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="mybutton mt-4 flex justify-center items-center gap-4"
        >
          <Image
            src="/google-logo.png"
            alt="Mit Google anmelden"
            width={32}
            height={32}
          />
          Mit Google anmelden
        </button>
        <div className="text-center text-gray-700 my-4">
          Noch nicht registriert?{" "}
          <Link className="underline" href="/login">
            Registrieren
          </Link>
        </div>
      </form>
    </section>
  );
}

export default withAuthRedirect(LoginPage);
