import Image from "next/image";
import DeleteIcon from "../icons/DeleteIcon";
import { cartProductPrice } from "../AppContext";

export default function CartProduct({ product, onRemove, index }) {
  return (
    <div className="grid grid-cols-2 place-items-center md:flex md:items-center gap-4 border-b py-4">
      <div className="w-24">
        <Image
          width={240}
          height={240}
          src={product.image || "/default-menu.png"}
          alt={product.name}
        />
      </div>
      <div className="grow">
        <h3 className="font-semibold text-[11px]">{product.name}</h3>
        {product.size && (
          <div className="text-sm">
            Size: <span>{product.size.name}</span>
          </div>
        )}
        {product.extras?.length > 0 && (
          <div className="text-sm text-gray-500">
            {product.extras.map((extra) => (
              <div key={extra.name}>
                {extra.name} {extra.price} &euro;
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="text-[13px] font-bold text-nowrap">
        {cartProductPrice(product)} &euro;
      </div>
      {!!onRemove && (
        <div className="ml-2">
          <button type="button" onClick={() => onRemove(index)} className="p-2">
            <DeleteIcon />
          </button>
        </div>
      )}
    </div>
  );
}
