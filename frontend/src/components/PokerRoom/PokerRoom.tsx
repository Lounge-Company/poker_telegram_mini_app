import { useEffect, useRef, useState } from "react";
import image from "../../assets/images/table-vertical.png";
import Seat from "./Seat";
import RoomService from "../../services/RoomService";
import { Room } from "colyseus.js";

type SeatType = {
  index: number;
  playerId: string;
};

type Position = {
  x: number;
  y: number;
  dx: number;
  dy: number;
};

const PokerRoom = () => {
  const [seatPositions, setSeatPositions] = useState<Position[]>([]);
  // const [roomService, setRoomService] = useState<RoomService | null>(null);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [seats, setSeats] = useState<any>([]);
  const [room, setRoom] = useState<Room | null>(null);
  const roomService = useRef(new RoomService());

  useEffect(() => {
    const initializeRoom = async () => {
      try {
        await roomService.current.init("my_room");
        console.log(roomService.current.room?.name);

        setRoom(roomService.current.room);
      } catch (error) {
        console.error("Error initializing room:", error);
      }
    };
    initializeRoom();
    console.log();
  }, []);

  // listeneres
  useEffect(() => {
    if (room) {
      room.onStateChange((state) => {
        console.log("State updated:", state);
        // Обновляем состояние сидений, например, получая их из room.state.seats
        console.log("seat values", state.seats.toArray());
        setSeats(state.seats);
        state.seats.forEach((seat: SeatType, index: number) => {
          if (seat.playerId) {
            console.log("seat: ", index);
            const player = state.players.get(seat.playerId);
            console.log(player);
          }
        });
      });
      room.onMessage("message", (message) => {
        console.log("Received message:", message);
      });
    }
    return () => {
      room?.removeAllListeners();
    };
  }, [room]);

  useEffect(() => {
    const positions = [
      { x: 50, y: 0, dx: -50, dy: 0 },
      { x: 0, y: 10, dx: 0, dy: 0 },
      { x: 0, y: 30, dx: 0, dy: 0 },
      { x: 0, y: 70, dx: 0, dy: -100 },
      { x: 0, y: 90, dx: 0, dy: -100 },
      { x: 50, y: 100, dx: -50, dy: -100 },
      { x: 100, y: 90, dx: -100, dy: -100 },
      { x: 100, y: 70, dx: -100, dy: -100 },
      { x: 100, y: 30, dx: -100, dy: 0 },
      { x: 100, y: 10, dx: -100, dy: 0 }
    ];

    setSeatPositions(positions);
  }, []);

  const handleSeatClick = (seatNumber: number) => {
    room?.send("leaveGame");
    room?.send("joinGame", seatNumber);

    console.log(`Seat ${seatNumber} clicked`);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }}
    >
      {seatPositions.map((position, index) => (
        <Seat
          key={index}
          x={position.x}
          y={position.y}
          dx={position.dx}
          dy={position.dy}
          num={index}
          onClick={handleSeatClick}
          isOccupied={seats[index]?.isOccupied}
        />
      ))}
      <img
        src={image}
        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

export default PokerRoom;
