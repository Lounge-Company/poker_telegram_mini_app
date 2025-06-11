export interface Room {
  id: number;
  connectID: number;
  players: number;
  maxPlayers: number;
  heartBeat: Date | null;
  containerId?: string;
}
