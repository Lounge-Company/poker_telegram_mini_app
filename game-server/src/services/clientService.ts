import { GameState } from "../rooms/schema/GameState";

export class ClientService {
  constructor(private state: GameState) {}
}
