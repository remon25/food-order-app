import FilteredMenu from "./FilteredMenu";

export default async function Page() {
  // Fetch data server-side
  let menu = [];
  let categories = [];

  try {
    const [menuRes, categoryRes] = await Promise.all([
      fetch(`${process.env.NEXTAUTH_URL}/api/menu-items`, {
        cache: "no-store",
      }),
      fetch(`${process.env.NEXTAUTH_URL}/api/categories`, {
        cache: "no-store",
      }),
    ]);

    if (menuRes.ok) menu = await menuRes.json();
    if (categoryRes.ok) categories = await categoryRes.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return <FilteredMenu menu={menu} categories={categories} />;
}
