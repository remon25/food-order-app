export default function AddToCartButton({
  handleAddToCartButtonClick,
  price,
  hasSizesOrExtras,
}) {
  if (!hasSizesOrExtras) {
    return (
      <div className="flying-button-parent mt-4">
        <button
          className="bg-primary text-white text-sm rounded-full px-6 py-2"
          onClick={handleAddToCartButtonClick}
        >
          Add to cart ${price}
        </button>
      </div>
    );
  }

  return (
    <button
      className="bg-primary text-white text-sm rounded-full px-6 py-2 mt-4"
      onClick={handleAddToCartButtonClick}
    >
      {hasSizesOrExtras
        ? `Start from $ ${price}`
        : `In den Warenkorb legen ${price}`}
    </button>
  );
}
