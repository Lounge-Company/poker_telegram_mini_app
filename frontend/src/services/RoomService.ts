import { Client, Room } from "colyseus.js";

class RoomService {
  private client: Client;
  public room: Room | null = null;
  constructor() {
    this.client = new Client("ws://localhost:2567");
  }
  //

  async init(roomName: string): Promise<void> {
    try {
      this.room = await this.createRoom(roomName);
    } catch (error) {
      console.error("Error initializing room:", error);
    }
  }

  private async createRoom(roomName: string): Promise<Room> {
    try {
      const room = await this.client.joinOrCreate(roomName);
      return room;
    } catch (error) {
      console.error("Error creating room:", error);
      throw new Error(`Failed to create/connect room: ${roomName}`);
    }
  }
}
export default RoomService;
