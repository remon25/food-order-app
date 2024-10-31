import AddToCartButton from "./AddToCartButton";
import Image from "next/image";

export default function MenuItemTile({
  menuItemInfo,
  handleAddToCartButtonClick,
}) {
  const { name, description, image, price, sizes, extraIngredientPrice } =
    menuItemInfo;
  const hasSizesOrExtras =
    sizes?.length > 0 || extraIngredientPrice?.length > 0;
  return (
    <div className="flex flex-col items-center bg-gray-300 hover:bg-gray-100 transition-all hover:shadow-2xl  p-4 rounded-lg text-center">
      <Image
        width={200}
        height={200}
        src={image || "/default-menu.png"}
        alt="sushi"
        style={{ height: "200px", width: "200px" }}
      />
      <h4 className="font-semibold my-2 text-xl">{name}</h4>
      <p className="text-gray-600 text-sm leading-8">{description}</p>
      <AddToCartButton
        handleAddToCartButtonClick={handleAddToCartButtonClick}
        hasSizesOrExtras={hasSizesOrExtras}
        price={price}
        image={image}
      />
    </div>
  );
}
