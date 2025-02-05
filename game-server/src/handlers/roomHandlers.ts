import { Room } from "colyseus";
import { MessageService } from "../services/messageService";
import { RoomManager } from "../managers/RoomManager";
import { ClientService } from "../services/clientService";
import { GameLoop } from "../core/GameLoop";
import { GameEventEmitter } from "../events/gameEvents";
import { PlayerState } from "../rooms/schema/PlayerState";

export class RoomHandlers {
  eventEmitter: GameEventEmitter;
  MessageService: MessageService;
  clientService: ClientService;
  constructor(private room: Room, private roomManager: RoomManager) {
    this.MessageService = new MessageService();
    this.clientService = new ClientService();
    this.eventEmitter = GameEventEmitter.getInstance();
  }

  public registerHandlers() {
    this.room.onMessage("message", this.handleChatMessage.bind(this));
    this.room.onMessage("joinGame", this.handlePlayerJoin.bind(this));
    this.room.onMessage("leaveGame", this.handlePlayerLeave.bind(this));
    this.room.onMessage("ready", this.handlePlayerReady.bind(this));
    this.room.onMessage("unready", this.handlePlayerUnready.bind(this));

    console.log("room handlers registered successfully");
  }

  private handleChatMessage(client: any, message: string) {
    // refactor this
    const player =
      this.room.state.players.get(client.sessionId) ||
      this.room.state.spectators.get(client.sessionId);
    this.clientService.broadcastMessage(this.room, message, player);
  }

  private handlePlayerReady(client: any) {
    const player: PlayerState = this.room.state.players.get(client.sessionId);
    if (!player) return;
    if (!player.ready) {
      player.ready = true;
      this.room.state.readyPlayers++;

      if (this.canStartGame()) {
        this.room.state.readyPlayers = 0;
        this.eventEmitter.emit("gameStart");
        this.clientService.broadcastSystemMessage(this.room, "Game started!");
      }
    }
  }

  private handlePlayerUnready(client: any) {
    const player = this.room.state.players.get(client.sessionId);
    if (!player) return;
    player.ready = false;
    this.room.state.readyPlayers -= 1;
  }
  private handlePlayerJoin(client: any, seatNumber: number) {
    if (typeof seatNumber !== "number") {
      this.clientService.sendSystemMessage(client, "Invalid seat number");
      return;
    }
    const success = this.roomManager.handlePlayerJoinToGame(
      client.sessionId,
      seatNumber
    );
    if (!success) {
      this.clientService.sendSystemMessage(
        client,
        `seat ${seatNumber} is already taken`
      );
      return;
    }
    this.clientService.broadcastSystemMessage(
      this.room,
      `Player ${client.sessionId} joined to at seat ${seatNumber}`
    );
  }
  private handlePlayerLeave(client: any) {
    const seatNumber = this.room.state.seats.find(
      (s: { playerId: any }) => s.playerId === client.sessionId
    )?.index;
    const success = this.roomManager.handlePlayerLeaveGame(client.sessionId);

    if (success) {
      this.clientService.broadcastSystemMessage(
        this.room,
        `Player ${client.sessionId} left seat ${seatNumber + 1}`
      );
    }
  }
  private canStartGame(): boolean {
    return (
      this.room.state.readyPlayers === this.room.state.players.size &&
      this.room.state.players.size >= this.room.state.MIN_PLAYERS
    );
  }
}
