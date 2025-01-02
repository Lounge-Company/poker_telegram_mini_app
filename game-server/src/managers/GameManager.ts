import { TurnManager } from './TurnManager'
import { Card } from '../rooms/schema/Card'
import { PlayerState } from '../rooms/schema/PlayerState'
import { GameState } from '../rooms/schema/GameState'
import { ActionHandler } from '../handlers/ActionHandler'
import { DeckManager } from './DeckManager'
export class GameManager {
  private state: GameState
  private turnManager: TurnManager
  private actionHandler: ActionHandler
  private playerCards: Map<PlayerState, Card[]> = new Map()
  private deck: Card[] = []

  constructor(state: GameState) {
    this.state = state
    this.actionHandler = new ActionHandler(state, this.turnManager)
  }

  startNewRound() {
    this.initializeDeck()
    this.dealInitialCards()
  }

  handlePlayerAction(
    playerId: string,
    action: string,
    amount?: number
  ): boolean {
    if (!this.turnManager.isPlayerTurn(playerId)) return false

    switch (action) {
      case 'bet':
        return this.actionHandler.handleBet(playerId, amount)
      case 'fold':
        return this.actionHandler.handleFold(playerId)
      case 'check':
        return this.actionHandler.handleCheck(playerId)
      case 'call':
        return this.actionHandler.handleCall(playerId)
      case 'raise':
        return this.actionHandler.handleRaise(playerId, amount)
      default:
        return false
    }
  }

  private dealCommunityCards(numCards: number) {
    // Логика раздачи общих карт
    for (let i = 0; i < numCards; i++) {
      const card = this.deck.pop()
      this.state.communityCards.push(card)
    }
  }
  private checkRoundEnd() {
    // Проверяем, все ли игроки сбросили карты или сделали ставку
    const activePlayers = this.state.players.filter((p) => !p.hasFolded)
    if (activePlayers.length === 1) {
      this.endRound(activePlayers[0])
    }
  }

  private endRound(winner: PlayerState) {
    winner.chips += this.state.pot
    this.state.pot = 0
    // Подготовка к следующему раунду
    setTimeout(() => this.startNewRound(), 3000)
  }
  public shouldContinueRound(): boolean {
    // Получаем массив только активных игроков (не сделавших фолд)
    const activePlayers = this.state.players.filter((p) => !p.hasFolded)

    // Продолжаем раунд если активных игроков больше 1
    return activePlayers.length > 1
  }
  public allPlayersActed(): boolean {
    const activePlayers = this.state.players.filter(
      (player) => !player.hasFolded
    )

    // Check if all active players have matched the current bet
    return activePlayers.every(
      (player) =>
        player.currentBet === this.state.currentBet ||
        player.hasFolded ||
        player.isAllIn
    )
  }
  private resettGameState() {
    // Логика сброса игровых состояний
    this.state.players.forEach((player) => {
      player.chips = 1000
      player.hasFolded = false
    })
    this.state.pot = 0
    this.state.currentBet = 0
    this.state.communityCards = []
    this.playerCards.clear()
    this.deck = []
  }
  public endGame() {
    // Логика завершения игры
    this.state.gameStarted = false
  }
}
