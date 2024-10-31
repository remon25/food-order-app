import Image from "next/image";

import MenuItem from "../menu/MenuItem";
import SectionHeader from "./SectionHeader";

export default async function HomeMenu() {
 // Fetch data directly in the Server Component
 const response = await fetch(`${process.env.NEXTAUTH_URL}/api/menu-items`, {
  cache: 'no-store', // Optional: 'no-store' disables caching for fresh data on each request
});
const menu = await response.json();
  return (
    <section>
      <div className="absolute left-0">
        <div className="h-48 absolute left-0 top-0 w-48">
          <Image
            src="/menu1.png"
            layout="fill"
            objectFit="cover"
            alt="menu-item"
          />
        </div>
      </div>
      <div className="absolute right-0">
        <div className="h-48 absolute right-0 -top-12 w-48">
          <Image
            src="/menu2.png"
            layout="fill"
            objectFit="cover"
            alt="menu-item"
          />
        </div>
      </div>
      <SectionHeader title={"Schau dir an"} subtitle={"Menü"} />
      <div className="grid grid-cols-3 gap-8 mt-20">
        {menu.map((item) => (
          <MenuItem key={item.id} menuItemInfo={item} />
        ))}
      </div>
    </section>
  );
}
