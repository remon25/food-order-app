import MenuItem from "../menu/MenuItem";

export default async function HomeMenu() {
  // Fetch menu items
  let menu = [];
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/menu-items`, {
      cache: "no-store",
    });
    if (response.ok) {
      menu = await response.json();
    }
  } catch (error) {
    console.error("Error fetching menu items:", error);
  }

  // Fetch categories
  let categories = [];
  try {
    const Categoryresponse = await fetch(
      `${process.env.NEXTAUTH_URL}/api/categories`,
      {
        cache: "no-store",
      }
    );
    if (Categoryresponse.ok) {
      const jsonResponse = await Categoryresponse.json();
      categories = Array.isArray(jsonResponse) ? jsonResponse : [];
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  // Reorder categories to make "offers" the first category
  const reorderedCategories = categories?.length
    ? categories.sort((a, b) => {
        if (a.name.toLowerCase() === "offers") return -1;
        if (b.name.toLowerCase() === "offers") return 1;
        return 0;
      })
    : [];

  return (
    <section className="home-menu pr-[330px] mr-4">
      <h1 className="text-[#222] text-center font-bold text-2xl md:text-3xl mb-10 p-2">
        🍕 Antalya Speisekarte 🍕
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
                <h2 className="text-gray-800 font-bold text-[1.3rem] md:text-3xl mt-14 mb-4">
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
