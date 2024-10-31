
export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="text-center mt-16">
      <h3 className="uppercase text-gray-600 font-semibold leading-6">
        {title}
      </h3>
      <h2 className="text-primary font-bold text-4xl">{subtitle}</h2>
    </div>
  );
}
