import RegisterForm from "../_components/layout/RegisterForm";
export const metadata = {
  title: "Registrieren",
};

export default function RegisterPage() {
  return (
    <section className="mt-16">
      <h1 className="text-center text-primary text-4xl font-bold mb-6">
        Registrieren
      </h1>
      <RegisterForm />
    </section>
  );
}
