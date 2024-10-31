import MenuItem from "../_components/menu/MenuItem";
import SectionHeader from "../_components/layout/SectionHeader";

export default async function page() {
  // Fetch data directly in the Server Component
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/menu-items`, {
    cache: "no-store",
  });
  const menu = await response.json();
  // Fetch data directly in the Server Component
  const Categoryresponse = await fetch(
    `${process.env.NEXTAUTH_URL}/api/categories`,
    {
      cache: "no-store",
    }
  );
  const categories = await Categoryresponse.json();
  return (
    <section className="mt-24">
      {categories?.length > 0 &&
        categories.map((c) => (
          <div key={c._id}>
            <div className="text-center">
             <h2 className="text-gray-600 font-bold text-4xl mt-10 mb-8">{c.name}</h2>
            </div>
            <div className="grid sm:grid-cols-3 justify-center gap-6 mt-6 mb-12">
              {menu
                .filter((item) => item.category === c._id)
                .map((item) => (
                  <MenuItem key={item._id} menuItemInfo={item} />
                ))}
            </div>
          </div>
        ))}
    </section>
  );
}
