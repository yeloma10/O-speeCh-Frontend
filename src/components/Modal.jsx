function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-5 rounded shadow-lg">
        {children}
        <div className="flex justify-center items-center mt-4 gap-4">
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Fermer
          </button>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
