import { Room, Client } from '@colyseus/core'
import { PlayerState } from './schema/PlayerState'
import { GameState } from './schema/GameState'
import { RoomHandlers } from '../handlers/roomHandlers'
import { MessageService } from '../services/messageService'
import { RoomManager } from '../managers/RoomManager'
import { GameLoop } from '../core/GameLoop'
import { ClientService } from '../services/clientService'
import { GameHandlers } from '../handlers/gameHandlers'

export class MyRoom extends Room<GameState> {
  private RoomHandlers: RoomHandlers
  private RoomManager: RoomManager
  private GameLoop: GameLoop
  private ClientService: ClientService
  private GameHandlers: GameHandlers

  onCreate(options: any) {
    this.setState(new GameState())
    this.setSeatReservationTime(60)
    this.RoomManager = new RoomManager(this.state)
    this.GameLoop = new GameLoop(this, this.state)
    this.RoomHandlers = new RoomHandlers(this, this.RoomManager, this.GameLoop)
    this.GameHandlers = new GameHandlers(this, this.state)
    this.ClientService = new ClientService()

    this.RoomHandlers.registerHandlers()
    this.GameHandlers.registerHandlers()
  }

  onJoin(client: Client) {
    console.log(`${client.sessionId} joined the room`)

    // Создаем нового игрока, используя PlayerState
    const newPlayer = new PlayerState()
    newPlayer.id = client.sessionId
    newPlayer.name = `Player ${Math.floor(Math.random() * 1000)}`
    // Добавляем нового игрока в список наблюдателей в состоянии игры
    this.state.spectators.set(client.sessionId, newPlayer)

    this.ClientService.broadcastSystemMessage(
      this,
      `Player ${client.sessionId} joined the room`
    )
  }
  onLeave(client: Client) {
    console.log(client.sessionId, 'left!')
    const seat = this.state.seats.find((s) => s.playerId === client.sessionId)
    if (seat) {
      seat.playerId = ''
    }
    const player = this.state.players.get(client.sessionId)
    if (player) this.state.players.delete(client.sessionId)
    const spectator = this.state.spectators.get(client.sessionId)
    if (spectator) this.state.spectators.delete(client.sessionId)
    this.ClientService.broadcastSystemMessage(
      this,
      `Player ${client.sessionId} left the game`
    )
    // Если в комнате осталось менее двух игроков, завершаем игру
    // if (this.state.players.size < 2) {
    //   this.GameManager.endGame()
    // }
  }
  onDispose() {
    console.log('room', this.roomId, 'disposing...')
  }
}
