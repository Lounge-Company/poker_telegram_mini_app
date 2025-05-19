import { useEffect, useRef, useState } from "react";

import { Room } from "colyseus.js";
import { CardType, ColyseusState, RoundType } from "src/types/game";
import RoomService from "src/services/RoomService";

const usePokerRoom = () => {
  const [gameState, setGameState] = useState<ColyseusState>({
    seats: [],
    players: new Map(),
    communityCards: [],
    currentTurn: "",
    gameStarted: false,
    pot: 0,
    currentBet: 0,
    TURN_TIME: 20000,
    gamePhase: RoundType.PREFLOP,
    playerCards: [],
    dealerId: "",
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
      console.log("State changed:", state);
      setGameState((prevState) => ({
        players: new Map(state.players),
        seats: state.seats.map((seat) => ({
          index: seat.index,
          playerId: seat.playerId,
        })),
        communityCards: state.communityCards.map((card) => ({
          suit: card.suit,
          rank: card.rank,
        })),

        currentTurn: state.currentTurn,
        dealerId: state.dealerId,
        gameStarted: state.gameStarted,
        pot: state.pot,
        currentBet: state.currentBet,
        TURN_TIME: state.TURN_TIME,
        gamePhase: state.gamePhase,
        // мои поля
        playerCards: prevState.playerCards,
      }));
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleServerMessages = (message: any) => {
      console.log("Server message:", message);
    };
    const handlePlayerCardsChange = (playerCards: CardType[]) => {
      console.log("Player cards changed:", playerCards);
      setGameState((prevState) => ({
        ...prevState,
        playerCards,
      }));
    };

    room.onMessage("message", handleServerMessages);
    room.onMessage("playerCards", handlePlayerCardsChange);
    room.onStateChange(handleStateChange);
    return () => {
      room.removeAllListeners();
    };
  }, [roomReady]);

  return { gameState, roomRef, roomReady };
};

export default usePokerRoom;
