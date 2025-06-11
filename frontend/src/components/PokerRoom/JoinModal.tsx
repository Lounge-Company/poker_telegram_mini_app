import { Room } from "colyseus.js";
import Modal from "react-modal";

interface JoinModalProps {
  modalIsOpen: boolean;
  closeModal: () => void;
  seatNumber: number | undefined;
  room: Room | null;
}

const JoinModal = ({
  modalIsOpen,
  closeModal,
  seatNumber,
  room,
}: JoinModalProps) => {
  const handleJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    console.log("seatNumber", seatNumber);
    room?.send("leaveGame");
    const seatIndex = seatNumber;
    if (typeof seatNumber == "number" && name)
      room?.send("joinGame", { seatIndex, name });
    closeModal();
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      className="bg-white rounded-2xl shadow-xl p-6 w-96 text-black"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.1)", // Полупрозрачный черный фон
        },
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Join the Table</h2>
        <button
          onClick={closeModal}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          ✕
        </button>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleJoin}>
        <label className="flex flex-col">
          <span className="text-sm text-gray-600">Your Name</span>
          <input
            name="name"
            type="text"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
          />
        </label>

        {/* <label className="flex flex-col">
          <span className="text-sm text-gray-600">Intended Stack</span>
          <input
            name="stack"
            type="number"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label> */}

        <button
          type="submit"
          className="bg-green-500 text-white rounded-md py-2 font-medium hover:bg-green-600 transition"
        >
          Join
        </button>
      </form>
    </Modal>
  );
};

export default JoinModal;
