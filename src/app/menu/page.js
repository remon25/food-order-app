import Sidebar from "../_components/layout/Sidebar";
import MenuItem from "../_components/menu/MenuItem";

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

  // Reorder categories to make "offers" the first category
  const reorderedCategories = categories.sort((a, b) => {
    if (a.name.toLowerCase() === "offers") return -1;
    if (b.name.toLowerCase() === "offers") return 1;
    return 0; // Keep the other categories in the same order
  });

  return (
    <section className="home-menu pr-[330px] mr-4">
      <Sidebar />
      <h1 className="text-[#222] text-center font-bold text-3xl mb-10 p-2">
        🍕 Antalya Menu 🍕
      </h1>
      {reorderedCategories.length > 0 &&
        reorderedCategories.map((c) => {
          const isOffersCategory = c.name.toLowerCase() === "offers";

          return (
            <div
              key={c._id}
              className={isOffersCategory ? "offers-category" : ""}
            >
              <div
                className={`pl-7 ${
                  isOffersCategory ? "custom-offers-header" : ""
                }`}
              >
                <h2 className="text-gray-800 font-bold text-3xl mt-14 mb-4">
                  {c.name}
                </h2>
              </div>
              <div
                className={`grid md:grid-cols-1 md:justify-center gap-6 mt-6 mb-12 px-5 ${
                  isOffersCategory ? "custom-offers-grid" : ""
                }`}
              >
                {menu
                  .filter((item) => item.category === c._id)
                  .map((item) => (
                    <MenuItem
                      key={item._id}
                      menuItemInfo={item}
                      isOffersCategory={isOffersCategory}
                    />
                  ))}
              </div>
            </div>
          );
        })}
    </section>
  );
}
