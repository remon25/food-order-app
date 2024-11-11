import MenuItem from "../menu/MenuItem";

export default async function HomeMenu() {
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
    <section className="mt-24">
      {/* Render "offers" category first with a custom class */}
      {reorderedCategories?.length > 0 &&
        reorderedCategories.map((c) => {
          const isOffersCategory = c.name.toLowerCase() === "offers"; // Check if the category is "offers"

          return (
            <div
              key={c._id}
              className={isOffersCategory ? "offers-category" : ""}
            >
              <div
                className={`text-center ${
                  isOffersCategory ? "custom-offers-header" : ""
                }`}
              >
                <h2 className="text-gray-600 font-bold text-4xl mt-10 mb-8">
                  {c.name}
                </h2>
              </div>
              <div
                className={`grid md:grid-cols-2 lg:grid-cols-3 md:justify-center gap-6 mt-10 mb-12 px-5 ${
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
