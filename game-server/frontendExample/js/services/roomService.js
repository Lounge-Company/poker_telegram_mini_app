export class RoomService {
  constructor() {
    this.client = new Colyseus.Client('ws://localhost:2567')
    this.room = null
  }

  async joinRoom() {
    this.room = await this.client.joinOrCreate('my_room')
    return this.room
  }
}
