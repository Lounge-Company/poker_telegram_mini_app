import { Room, Client } from '@colyseus/core'
import { PlayerState } from './schema/PlayerState'
import { GameState } from './schema/GameState'
import { RoomHandlers } from '../handlers/roomHandlers'
import { MessageService } from '../services/messageService'
import { RoomManager } from '../managers/RoomManager'
import { GameLoop } from '../core/GameLoop'
import { ClientService } from '../services/clientService'

export class MyRoom extends Room<GameState> {
  private RoomHandlers: RoomHandlers
  private MessageService: MessageService
  private RoomManager: RoomManager
  private GameLoop: GameLoop
  private ClientService: ClientService

  onCreate(options: any) {
    this.setState(new GameState())
    this.RoomManager = new RoomManager(this.state)
    this.RoomHandlers = new RoomHandlers(this, this.RoomManager, this.GameLoop)
    this.MessageService = new MessageService()
    this.RoomHandlers.registerHandlers()
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

    // Если в комнате достаточно игроков, начинаем игру
    // if (this.state.players.size >= 2 && !this.state.gameStarted) {
    //   this.startGame() // Запуск игры
    // }
  }
  onLeave(client: Client) {
    console.log(client.sessionId, 'left!')
    this.state.players.delete(client.sessionId)
    this.state.spectators.delete(client.sessionId)
    this.ClientService.sendSystemMessage(
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
