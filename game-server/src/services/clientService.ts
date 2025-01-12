import { GameState } from '../rooms/schema/GameState'

export class ClientService {
  constructor() {}
  sendMessage(client: any, message: string) {
    client.send('message', message)
  }
}
