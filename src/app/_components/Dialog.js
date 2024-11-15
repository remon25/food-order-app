"useClient";
export default function Dialog({ children, setShowPopup }) {
  return (
    <div
      onClick={() => setShowPopup(false)}
      className="fixed z-30 top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center"
    >
      <div
        onClick={(ev) => ev.stopPropagation()}
        className="bg-white w-96 p-8 rounded-lg flex flex-col items-center overflow-auto -webkit-overflow-scrolling: touch;"
        style={{ maxHeight: "80vh" }}
      >
        {children}
        <button
          type="button"
          className="button Dialog_button"
          onClick={() => setShowPopup(false)}
        >
          Done
        </button>
      </div>
    </div>
  );
}
