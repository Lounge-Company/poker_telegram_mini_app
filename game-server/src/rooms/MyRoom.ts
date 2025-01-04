import { Room, Client } from '@colyseus/core'
import { PlayerState } from './schema/PlayerState'
import { GameState } from './schema/GameState'
import { GameManager } from '../managers/GameManager'
import { RoomHandlers } from '../handlers/roomHandlers'
import { MessageService } from '../services/MessageService'

export class MyRoom extends Room<GameState> {
  private GameManager: GameManager
  private RoomHandlers: RoomHandlers
  private MessageService: MessageService

  onCreate(options: any) {
    this.setState(new GameState())
    this.GameManager = new GameManager(this.state)
    this.RoomHandlers = new RoomHandlers(this, this.GameManager)
    this.MessageService = new MessageService(this.state)
    this.RoomHandlers.registerHandlers()
  }

  onJoin(client: Client) {
    console.log(`${client.sessionId} joined the room`)

    // Создаем нового игрока, используя PlayerState
    const newPlayer = new PlayerState()
    newPlayer.id = client.sessionId

    // Добавляем нового игрока в список игроков в состоянии игры
    this.state.players.set(client.sessionId, newPlayer)

    const systemMessage = this.MessageService.createSystemMessage(
      `Player ${client.sessionId} joined the game`
    )
    console.log('systemMessage :', systemMessage)
    this.broadcast('message', systemMessage)
    // Если в комнате достаточно игроков, начинаем игру
    // if (this.state.players.size >= 2 && !this.state.gameStarted) {
    //   this.startGame() // Запуск игры
    // }
  }
  onLeave(client: Client) {
    console.log(client.sessionId, 'left!')
    this.state.players.delete(client.sessionId)
    const systemMessage = this.MessageService.createSystemMessage(
      `Player ${client.sessionId} left the game`
    )
    this.broadcast('message', systemMessage)
    // Если в комнате осталось менее двух игроков, завершаем игру
    // if (this.state.players.size < 2) {
    //   this.GameManager.endGame()
    // }
  }
  onDispose() {
    console.log('room', this.roomId, 'disposing...')
  }
  private startGame() {
    console.log('Game started')
    // Логика начала игры
    this.state.gameStarted = true
    this.GameManager.startNewRound()
  }
}
