import { Room, Client } from '@colyseus/core'
import { PlayerState } from './schema/PlayerState'
import { GameState } from './schema/GameState'
import { GameManager } from '../managers/GameManager'
import { MessageHandler } from '../handlers/MessageHandler'
export class MyRoom extends Room<GameState> {
  private GameManager: GameManager
  private MessageHandler: MessageHandler

  onCreate(options: any) {
    this.setState(new GameState())
    this.GameManager = new GameManager(this.state)
    this.MessageHandler = new MessageHandler(this.state)

    this.onMessage('message', (client, message) => {
      const chatMessage = this.MessageHandler.handleChatMessage(
        client.sessionId,
        message
      )
      if (chatMessage) {
        this.broadcast('message', chatMessage)
      }
    })
    this.onMessage('action', (client, data) => {
      const { action, amount } = data
      this.GameManager.handlePlayerAction(client.sessionId, action, amount)
    })
  }

  onJoin(client: Client) {
    console.log(`${client.sessionId} joined the room`)

    // Создаем нового игрока, используя PlayerState
    const newPlayer = new PlayerState()
    newPlayer.id = client.sessionId

    // Добавляем нового игрока в список игроков в состоянии игры
    this.state.players.push(newPlayer)

    const systemMessage = this.MessageHandler.createSystemMessage(
      `Player ${client.sessionId} joined the game`
    )
    this.broadcast('message', systemMessage)
    // Если в комнате достаточно игроков, начинаем игру
    if (this.state.players.length >= 2 && !this.state.gameStarted) {
      this.startGame() // Запуск игры
    }
  }

  onLeave(client: Client) {
    console.log(client.sessionId, 'left!')
    this.state.players = this.state.players.filter(
      (p) => p.id !== client.sessionId
    )
    const systemMessage = this.MessageHandler.createSystemMessage(
      `Player ${client.sessionId} left the game`
    )
    this.broadcast('message', systemMessage)
    // Если в комнате осталось менее двух игроков, завершаем игру
    if (this.state.players.length < 2) {
      this.GameManager.endGame()
    }
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
