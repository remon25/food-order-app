import Image from "next/image";
import DeleteIcon from "../icons/DeleteIcon";
import { cartProductPrice } from "../AppContext";

export default function CartProduct({ product, onRemove, index }) {
  return (
    <div className="grid grid-cols-2 place-items-center md:flex md:items-center gap-2 border-b py-4">
      <div className="w-16">
        <Image
          width={240}
          height={240}
          src={product.image || "/default-menu.png"}
          alt={product.name}
        />
      </div>
      <div className="grow">
        <h3 className="font-bold text-[12px]">{product.name}</h3>
        {product.size && (
          <div className="text-xs">
            Größe: <span>{product.size.name}</span>
          </div>
        )}
        {product.extras?.length > 0 && (
          <div className="text-xs text-gray-500">
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
            <DeleteIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
