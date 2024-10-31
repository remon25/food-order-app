"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [error, setError] = useState(false);
  async function handleFormSubmit(e) {
    e.preventDefault();
    setCreatingUser(true);
    setError(false);
    setUserCreated(false);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
  
      setUserCreated(true);
    } catch (err) {
      setError(true);
    } finally {
      setCreatingUser(false); 
    }
  }
  
  return (
    <>
      {error && (
        <div className="my-4 text-center">
          Error. <br /> please try again.
        </div>
      )}
      {userCreated ? (
        <div className="my-4 text-center">
          User created. <br /> you can now log in.{" "}
          <Link className="underline" href="/login">
            Login &raquo;
          </Link>
        </div>
      ) : (
        <form className="block max-w-sm mx-auto" onSubmit={handleFormSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={name}
            disabled={creatingUser}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            name="email"
            type="email"
            placeholder="E-Mail"
            value={email}
            disabled={creatingUser}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            name="password"
            type="password"
            placeholder="Passwort"
            value={password}
            disabled={creatingUser}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={creatingUser}
            className="bg-primary text-white px-6 py-2 rounded"
          >
            Registrieren
          </button>
          <div className="text-center my-4 text-gray-500">
            Oder mit Anbieter anmelden
          </div>
          <button type="button" onClick={() => signIn("google",{callbackUrl: "/"})} className="mybutton mt-4 flex justify-center items-center gap-4">
            <Image
              src="/google-logo.png"
              alt="Mit Google anmelden"
              width={32}
              height={32}
            />
            Mit Google anmelden
          </button>
          <div className="text-center text-gray-700 my-4">Already have an account? <Link className="underline" href="/login">Login</Link></div>
        </form>
      )}
    </>
  );
}
