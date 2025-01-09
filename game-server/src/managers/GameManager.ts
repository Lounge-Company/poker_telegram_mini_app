import { TurnManager } from './TurnManager'
import { Card } from '../rooms/schema/Card'
import { PlayerState } from '../rooms/schema/PlayerState'
import { GameState } from '../rooms/schema/GameState'
import { actionService } from '../services/actionService'
import { DeckManager } from './DeckManager'
import { GameLoop } from '../core/GameLoop'

export class GameManager {
  private playerCards: Map<PlayerState, Card[]> = new Map()
  private deck: Card[] = []
  state: GameState
  turnManager: TurnManager
  actionService: actionService
  gameLoop: GameLoop
  deckManager: DeckManager

  constructor(state: GameState) {
    this.state = state
    this.turnManager = new TurnManager(state)
    this.gameLoop = new GameLoop(this.state, this.turnManager, this)
    this.deckManager = new DeckManager()
  }
  startGame() {
    this.state.gameStarted = true
    this.gameLoop.startGameLoop()
  }
  initializeDeck() {
    this.deck = this.deckManager.createDeck()
    console.log('Deck initialized:', this.deck)
  }
  handlePlayerAction(
    playerId: string,
    action: string,
    amount?: number
  ): boolean {
    if (!this.turnManager.isPlayerTurn(playerId)) return false

    switch (action) {
      case 'bet':
        this.actionService.handleBet(playerId, amount)
      case 'fold':
        this.actionService.handleFold(playerId)
      case 'check':
        this.actionService.handleCheck(playerId)
      case 'call':
        this.actionService.handleCall(playerId)
      case 'raise':
        this.actionService.handleRaise(playerId, amount)
    }
    this.turnManager.nextTurn()
  }

  private dealCommunityCards(numCards: number) {
    // Логика раздачи общих карт
    for (let i = 0; i < numCards; i++) {
      const card = this.deck.pop()
      this.state.communityCards.push(card)
    }
  }
  private checkRoundEnd() {
    let activePlayersCount = 0
    let lastActivePlayer = null

    this.state.players.forEach((player) => {
      if (!player.hasFolded) {
        activePlayersCount++
        lastActivePlayer = player
      }
    })

    if (activePlayersCount === 1 && lastActivePlayer) {
      this.endRound(lastActivePlayer)
    }
  }

  private endRound(winner: PlayerState) {
    winner.chips += this.state.pot
    this.state.pot = 0
    // Подготовка к следующему раунду
    setTimeout(() => this.startNewRound(), 3000)
  }

  public shouldContinueRound(): boolean {
    let activePlayersCount = 0

    this.state.players.forEach((player) => {
      if (!player.hasFolded) {
        activePlayersCount++
        if (activePlayersCount > 1) return true
      }
    })

    return activePlayersCount > 1
  }

  public allPlayersActed(): boolean {
    let allActed = true

    this.state.players.forEach((player) => {
      if (
        !player.hasFolded &&
        player.currentBet !== this.state.currentBet &&
        !player.isAllIn
      ) {
        allActed = false
        return
      }
    })

    return allActed
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
