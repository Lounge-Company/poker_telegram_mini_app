import { useEffect, useRef, useState } from "react";
import image from "../../assets/images/table-vertical.png";
import Seat from "./Seat";
import RoomService from "../../services/RoomService";
import { Room } from "colyseus.js";

type ColyseusState = {
  seats: SeatType[];
  players: Map<string, PlayerState>;
};

type SeatType = {
  index: number;
  playerId: string;
};

type PlayerState = {
  id: string;
  name: string;
  chips: number;
  currentBet: number;
  hasFolded: boolean;
  isAllIn: boolean;
  ready: boolean;
  acted: boolean;
  seatIndex: number;
};

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

const PokerRoom = () => {
  const [gameState, setGameState] = useState<ColyseusState>({
    seats: [],
    players: new Map()
  });
  const roomRef = useRef<Room | null>(null);
  const roomService = useRef(new RoomService());
  const [roomReady, setRoomReady] = useState(false);

  useEffect(() => {
    const initializeRoom = async () => {
      if (roomRef.current) return; // если комната уже есть то выходим
      try {
        await roomService.current.init("my_room");
        roomRef.current = roomService.current.room;
        setRoomReady(true);
      } catch (error) {
        console.error("Error initializing room:", error);
      }
    };

    initializeRoom();
  }, []);

  // listeneres
  useEffect(() => {
    if (!roomReady || !roomRef.current) return;
    const room = roomRef.current;

    const handleStateChange = (state: ColyseusState) => {
      setGameState({
        ...gameState,
        seats: state.seats.map((seat) => ({
          index: seat.index,
          playerId: seat.playerId
        })),
        players: new Map(state.players)
      });
    };

    const handleMessage = (message: string) => {
      console.log("Received message:", message);
    };

    room.onStateChange(handleStateChange);
    room.onMessage("message", handleMessage);
    return () => {
      room?.removeAllListeners();
    };
  }, [roomReady]);

  const handleSeatClick = (seatNumber: number) => {
    roomRef.current?.send("leaveGame");
    roomRef.current?.send("joinGame", seatNumber);
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
      <p></p>
      {positions.map((position, index) => (
        <Seat
          key={index}
          x={position.x}
          y={position.y}
          dx={position.dx}
          dy={position.dy}
          num={index}
          onClick={handleSeatClick}
          isOccupied={
            gameState.seats[index] !== undefined &&
            gameState.seats[index].playerId !== ""
          }
          player={
            gameState.players.get(gameState.seats[index]?.playerId)?.name || ""
          }
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
