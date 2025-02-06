import image from "src/assets/images/table-vertical.png";
import Seat from "./Seat";

import PokerActions from "./PokerActions";
import usePokerRoom from "src/hooks/usePokerRoom";
import { useEffect, useState } from "react";
import { SeatType } from "src/types/game";
import Modal from "react-modal";

const positions = [
  { x: 50, y: 0, dx: -50, dy: 0, idx: 0 },
  { x: 0, y: 10, dx: 0, dy: 0, idx: 1 },
  { x: 0, y: 30, dx: 0, dy: 0, idx: 2 },
  { x: 0, y: 70, dx: 0, dy: -100, idx: 3 },
  { x: 0, y: 90, dx: 0, dy: -100, idx: 4 },
  { x: 50, y: 100, dx: -50, dy: -100, idx: 5 },
  { x: 100, y: 90, dx: -100, dy: -100, idx: 6 },
  { x: 100, y: 70, dx: -100, dy: -100, idx: 7 },
  { x: 100, y: 30, dx: -100, dy: 0, idx: 8 },
  { x: 100, y: 10, dx: -100, dy: 0, idx: 9 }
];

const rotateArray = (arr: typeof positions, steps: number) => {
  return [...arr.slice(steps), ...arr.slice(0, steps)];
};

const PokerRoom = () => {
  const { gameState, roomRef } = usePokerRoom();
  const [rotatedPositions, setRotatedPositions] = useState(positions);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [seatNumber, setSeatNumber] = useState<number | undefined>(undefined);

  useEffect(() => {
    const playerSeatIndex = gameState.seats.findIndex(
      (seat: SeatType) => seat.playerId === roomRef.current?.sessionId
    );
    if (playerSeatIndex !== -1)
      setRotatedPositions(rotateArray(positions, 5 - playerSeatIndex));
  }, [gameState.seats, roomRef]);

  const handleSeatClick = (seatNumber: number) => {
    setSeatNumber(seatNumber);
    setModalIsOpen(!modalIsOpen);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const stack = formData.get("stack") as string;
    console.log(`name ${name}\n stack ${stack}`);
    roomRef.current?.send("leaveGame");
    if (seatNumber && name && stack)
      roomRef.current?.send("joinGame", seatNumber);
    closeModal();
  };
  return (
    <div className={"flex flex-col h-full w-full"}>
      <div className="relative flex-grow flex items-center justify-center w-full min-h-0">
        <div className="relative max-w-full max-h-full h-full flex items-center justify-center">
          <img
            src={image}
            className="w-auto h-auto max-w-full max-h-full object-contain"
          />
        </div>
        {rotatedPositions.map((position, idx) => (
          <Seat
            key={idx}
            x={position.x}
            y={position.y}
            dx={position.dx}
            dy={position.dy}
            num={idx}
            onClick={handleSeatClick}
            isOccupied={
              gameState.seats[idx] !== undefined &&
              gameState.seats[idx].playerId !== ""
            }
            player={
              gameState.players.get(gameState.seats[idx]?.playerId)?.name || ""
            }
          />
        ))}
      </div>
      <div className="h-20 w-full flex items-center justify-center">
        <PokerActions room={roomRef.current} />
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="bg-white rounded-2xl shadow-xl p-6 w-96 text-black"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.1)" // Полупрозрачный черный фон
          }
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
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-gray-600">Intended Stack</span>
            <input
              name="stack"
              type="number"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>

          <button
            type="submit"
            className="bg-green-500 text-white rounded-md py-2 font-medium hover:bg-green-600 transition"
          >
            Join
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default PokerRoom;
