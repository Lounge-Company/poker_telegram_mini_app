import { TurnManager } from '../managers/TurnManager'
import { Card } from '../rooms/schema/Card'
import { PlayerState } from '../rooms/schema/PlayerState'
import { GameState } from '../rooms/schema/GameState'
export class GameLogic {
  private state: GameState
  private turnManager: TurnManager
  private playerCards: Map<PlayerState, Card[]> = new Map()
  private deck: Card[] = []

  constructor(state: GameState, turnManager: TurnManager) {
    this.state = state
    this.turnManager = turnManager
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
        return this.handleBet(playerId, amount)
      case 'fold':
        return this.handleFold(playerId)
      case 'check':
        return this.handleCheck(playerId)
      case 'call':
        return this.handleCall(playerId)
      case 'raise':
        return this.handleRaise(playerId, amount)
    }
  }

  public initializeDeck() {
    // Логика инициализации колоды
    const suits = ['hearts', 'diamonds', 'clubs', 'spades']
    const ranks = [
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      'J',
      'Q',
      'K',
      'A'
    ]
    this.deck = []
    for (const suit of suits) {
      for (const rank of ranks) {
        const card = new Card()
        card.suit = suit
        card.rank = rank
        this.deck.push(card)
      }
    }

    this.shuffleDeck()
  }
  private shuffleDeck() {
    // Логика перемешивания колоды
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]
    }
  }
  public dealInitialCards() {
    // Логика раздачи карт
    this.state.players.forEach((player) => {
      const playerHand: Card[] = []
      // Раздаем 2 карты каждому игроку
      for (let i = 0; i < 2; i++) {
        const card = this.deck.pop()
        playerHand.push(card)
      }
      // Сохраняем карты в Map
      this.playerCards.set(player, playerHand)
    })
  }
  private dealCommunityCards(numCards: number) {
    // Логика раздачи общих карт
    for (let i = 0; i < numCards; i++) {
      const card = this.deck.pop()
      this.state.communityCards.push(card)
    }
  }
  private handleBet(playerId: string, amount: number): boolean {
    // Логика обработки ставки
    const player = this.state.players.find((p) => p.id === playerId)
    if (player && player.chips >= amount) {
      player.chips -= amount
      this.state.pot += amount
      this.state.currentBet = amount
      return true
    }
    return false
  }
  private handleFold(playerId: string): boolean {
    // Логика обработки сброса карт
    const player = this.state.players.find((p) => p.id === playerId)
    if (player) {
      player.hasFolded = true
      this.checkRoundEnd()
      return true
    }
    return false
  }
  private checkRoundEnd() {
    // Проверяем, все ли игроки сбросили карты или сделали ставку
    const activePlayers = this.state.players.filter((p) => !p.hasFolded)
    if (activePlayers.length === 1) {
      this.endRound(activePlayers[0])
    }
  }
  private handleCheck(playerId: string): boolean {
    // Логика обработки проверки
    const player = this.state.players.find((p) => p.id === playerId)
    if (player && this.state.currentBet === 0) {
      this.turnManager.nextTurn()
      return true
    }
    return false
  }
  private handleCall(playerId: string): boolean {
    const player = this.state.players.find((p) => p.id === playerId)
    if (player && player.chips >= this.state.currentBet) {
      player.chips -= this.state.currentBet
      this.state.pot += this.state.currentBet
      this.turnManager.nextTurn()
      return true
    }
    return false
  }
  private handleRaise(playerId: string, amount: number): boolean {
    const player = this.state.players.find((p) => p.id === playerId)
    if (player && amount > this.state.currentBet && player.chips >= amount) {
      player.chips -= amount
      this.state.pot += amount
      this.state.currentBet = amount
      this.turnManager.nextTurn()
      return true
    }
    return false
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
