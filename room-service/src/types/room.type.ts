export interface Room {
  id: number;
  port: number;
  players: number;
  maxPlayers: number;
  heartBeat: Date | null;
  containerId?: string;
}
