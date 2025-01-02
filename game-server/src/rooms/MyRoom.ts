import { Room, Client } from '@colyseus/core'
import { PlayerState } from './schema/PlayerState'
import { GameState } from './schema/GameState'
import { TurnManager } from '../managers/TurnManager'
import { GameManager } from '../managers/GameManager'
export class MyRoom extends Room<GameState> {
  private GameManager: GameManager
  private turnManager: TurnManager

  onCreate(options: any) {
    this.setState(new GameState())
    this.turnManager = new TurnManager(this.state)
    this.GameManager = new GameManager(this.state, this.turnManager)
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
    this.broadcast('playerLeft', client.sessionId)
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
