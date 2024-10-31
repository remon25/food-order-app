import SectionHeader from "./SectionHeader";

export default function Contact() {
  return (
    <section className="text-center mt-24">
      <SectionHeader title={"Zögere nicht"} subtitle={"Kontaktieren Sie uns"} />
      <div className="mt-4">
        <a href="tel:+49 40 78053764" className="text-xl">
          +49 40 78053764
        </a>
        
      </div>
    </section>
  );
}
