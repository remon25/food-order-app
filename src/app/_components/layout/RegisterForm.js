"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setphone] = useState("");
  const [streetAdress, setstreetAdress] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [error, setError] = useState(false);

  async function handleFormSubmit(e) {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setCreatingUser(true);
    setError(false);
    setUserCreated(false);

    toast.promise(
      (async () => {
        try {
          const response = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({ name, email, password, phone, streetAdress }),
            headers: { "Content-Type": "application/json" },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Registration failed");
          }

          setUserCreated(true);
        } catch (err) {
          setError(true);
          throw err;
        } finally {
          setCreatingUser(false);
        }
      })(),
      {
        loading: "Creating user...",
        success: "User created! You can now log in.",
        error: "Error. Please try again.",
      }
    );
  }

  return (
    <>
      {error && (
        <div className="my-4 text-center">
          Error. <br /> Please try again.
        </div>
      )}
      {userCreated ? (
        <div className="my-4 text-center">
          User created. <br /> You can now log in.{" "}
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
            required
            disabled={creatingUser}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            name="email"
            type="email"
            placeholder="E-Mail"
            value={email}
            required
            disabled={creatingUser}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={phone}
            required
            disabled={creatingUser}
            onChange={(e) => setphone(e.target.value)}
          />
          <input
            name="streetAdress"
            type="text"
            placeholder="Street Address"
            value={streetAdress}
            required
            disabled={creatingUser}
            onChange={(e) => setstreetAdress(e.target.value)}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            required
            disabled={creatingUser}
            minLength={8}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={creatingUser}
            className="bg-primary text-white px-6 py-2 rounded"
          >
            Register
          </button>
          <div className="text-center my-4 text-gray-500">
            Or sign up with a provider
          </div>
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="mybutton mt-4 flex justify-center items-center gap-4"
          >
            <Image
              src="/google-logo.png"
              alt="Sign in with Google"
              width={32}
              height={32}
            />
            Sign in with Google
          </button>
          <div className="text-center text-gray-700 my-4">
            Already have an account?{" "}
            <Link className="underline" href="/login">
              Login
            </Link>
          </div>
        </form>
      )}
    </>
  );
}
