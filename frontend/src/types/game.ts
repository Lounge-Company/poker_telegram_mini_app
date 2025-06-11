export type ColyseusState = {
  players: Map<string, PlayerState>;
  seats: SeatType[];
  communityCards: CardType[];
  currentTurn: string;
  dealerId: string;
  gameStarted: boolean;
  pot: number;
  currentBet: number;
  TURN_TIME: number;
  gamePhase: RoundType;
  // мои поля
  playerCards: CardType[];
};

export enum RoundType {
  PREFLOP,
  FLOP,
  TURN,
  RIVER,
  SHOWDOWN,
}

export type CardType = {
  suit: string;
  rank: string;
};

export type SeatType = {
  index: number;
  playerId: string;
};

export type PlayerState = {
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
