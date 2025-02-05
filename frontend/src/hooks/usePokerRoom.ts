import { useEffect, useRef, useState } from "react";

import { Room } from "colyseus.js";
import { ColyseusState } from "src/types/game";
import RoomService from "src/services/RoomService";

const usePokerRoom = () => {
  const [gameState, setGameState] = useState<ColyseusState>({
    seats: [],
    players: new Map()
  });
  const roomRef = useRef<Room | null>(null);
  const roomService = useRef(new RoomService());
  const [roomReady, setRoomReady] = useState(false);

  useEffect(() => {
    const initializeRoom = async () => {
      if (roomRef.current) return;
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

  useEffect(() => {
    if (!roomReady || !roomRef.current) return;
    const room = roomRef.current;

    const handleStateChange = (state: ColyseusState) => {
      setGameState({
        seats: state.seats.map((seat) => ({
          index: seat.index,
          playerId: seat.playerId
        })),
        players: new Map(state.players)
      });
    };

    room.onStateChange(handleStateChange);
    return () => {
      room.removeAllListeners();
    };
  }, [roomReady]);

  return { gameState, roomRef, roomReady };
};

export default usePokerRoom;
