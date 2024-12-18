import RegisterForm from "../_components/layout/RegisterForm";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Registrieren",
};

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect("/profile");
  }

  return (
    <section className="mt-16 p-4">
      <h1 className="text-center text-primary text-4xl font-bold mb-6">
        Registrieren
      </h1>
      <RegisterForm />
    </section>
  );
}
