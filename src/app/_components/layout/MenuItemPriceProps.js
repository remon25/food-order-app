import { useState } from "react";
import DeleteIcon from "../icons/DeleteIcon";
import Plus from "../icons/Plus";
import ChevronDown from "../icons/ChevronDown";
import ChevronUp from "../icons/ChevronUp";

export default function MenuItemPriceProps({
  props,
  setProps,
  name,
  addLabel,
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  function addProp() {
    setProps((old) => [...old, { name: "", price: 0 }]);
  }

  function editProp(ev, index, prop) {
    const newValue = ev.target.value;
    setProps((prevProps) => {
      const newProps = [...prevProps];
      newProps[index][prop] = newValue;
      return newProps;
    });
  }

  function removeProp(indexToRemove) {
    setProps((prev) => prev.filter((_, index) => index !== indexToRemove));
  }

  return (
    <div className="bg-gray-200 p-2 rounded-md mb-4">
      <div className="flex gap-1 justify-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="button flex justify-center gap-2 shrink"
        >
          {!isOpen ? <ChevronDown /> : <ChevronUp />}
          <span className="text-gray-700">{name}</span>
          <span>{props?.length}</span>
        </button>
      </div>
      <div className={isOpen ? "block" : "hidden"}>
        {props.length > 0 &&
          props.map((size, index) => (
            <div key={size._id} className="flex items-center gap-2">
              <div>
                <label>Größe Name</label>
                <input
                  type="text"
                  placeholder="Größe Name"
                  value={size.name}
                  onChange={(e) => editProp(e, index, "name")}
                />
              </div>

              <div>
                <label>Zusatzpreis</label>
                <input
                  type="number"
                  placeholder="Zusatzpreis"
                  value={size.price}
                  onChange={(e) => editProp(e, index, "price")}
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => removeProp(index)}
                  className="bg-white button mt-3 px-2"
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>
          ))}
        <button
          type="button"
          onClick={addProp}
          className="bg-white button flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {addLabel}
        </button>
      </div>
    </div>
  );
}
