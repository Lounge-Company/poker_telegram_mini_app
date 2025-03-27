import { GameManager } from '../managers/GameManager'
import { GameState } from '../rooms/schema/GameState'
import { TurnManager } from '../managers/TurnManager'
import { Card } from '../rooms/schema/Card'
import { DeckManager } from '../managers/DeckManager'
import { MyRoom } from '../rooms/MyRoom'
import { RoundManager } from '../managers/RoundManager'
import { PlayerManager } from '../managers/PlayerManager'
import { PlayerState } from '../rooms/schema/PlayerState'
import { GameEventEmitter } from '../events/gameEventEmitter'
import { PlayerRepository } from '../repositories/player.repository'
import { CardDealer } from '../utils/CardDealer'
import { ClientService } from '../services/clientService'
import { EventSubscriber } from '../events/eventSubscriber'
import { createGameEventHandlers } from '../events/gameEventHandlers'
import { GameEventTypes } from '../types/GameEventsTypes'
import { PlayerActionService } from '../services/PlayerActionService'

export class GameLoop {
  private playerCards: Map<string, Card[]> = new Map()
  private deck: Card[] = []
  gameloopDelay: number = 0
  turnManager: TurnManager
  gameManager: GameManager
  deckManager: DeckManager
  roundManager: RoundManager
  playerManager: PlayerManager
  state: GameState
  room: MyRoom
  eventEmitter: GameEventEmitter
  cardDealer: CardDealer
  eventSubscriber: EventSubscriber
  eventHandlers: ReturnType<typeof createGameEventHandlers>
  PlayerActionService: PlayerActionService

  constructor(room: MyRoom, private clientService: ClientService) {
    this.room = room
    this.state = this.room.state
    this.deckManager = new DeckManager()
    this.turnManager = new TurnManager(this.state, this.clientService)
    this.roundManager = new RoundManager(this.state, this.turnManager)
    this.cardDealer = new CardDealer(this.deckManager, this.clientService)

    this.eventEmitter = GameEventEmitter.getInstance()
    this.eventSubscriber = new EventSubscriber(this.eventEmitter)
    const playerRepository = new PlayerRepository(this.state.players)
    this.gameManager = new GameManager(
      () => this.state.players,
      (count: number) => (this.state.activePlayers = count),
      (status: boolean) => (this.state.gameStarted = status),
      (turn: string) => (this.state.currentTurn = turn),
      this.turnManager,
      this.gameLoop.bind(this)
    )
    this.playerManager = new PlayerManager(
      playerRepository,
      () => this.state.currentBet,
      (amount: number) => (this.state.pot += amount),
      (amount: number) => (this.state.currentBet = amount),
      (count: number) => (this.state.activePlayers = count),
      () => this.state.activePlayers
    )
    this.PlayerActionService = new PlayerActionService(
      this.clientService,
      this.playerManager
    )
    this.eventHandlers = createGameEventHandlers(
      this.gameManager,
      this.playerManager
    )
    Object.entries(this.eventHandlers).forEach(([event, handler]) => {
      this.eventSubscriber.subscribe(event as keyof GameEventTypes, handler)
    })
  }

  async gameLoop() {
    while (
      this.state.gameStarted &&
      this.state.players.size >= this.state.MIN_PLAYERS
    ) {
      console.log('Game loop running...')

      // create deck
      this.deck = this.deckManager.createDeck()
      // console.log('deck :', this.deck)
      // // deal cards
      this.playerCards = this.cardDealer.dealPlayerCards(
        this.deck,
        this.state.players
      )

      // start betting round

      // this.roundsCycle()
      await this.bettingRound()

      // check if game is over

      this.playerManager.resetPlayers()
      console.log('players reseted')
      this.roundManager.resetRound()
      console.log('round reseted')
      await new Promise((resolve) => setTimeout(resolve, this.state.GAME_LOOP_DELAY))
    }
    console.log('Game loop stopped.')
  }
  async roundsCycle() {
    while (this.roundManager.shouldContinueRounds()) {
      await this.bettingRound()
      this.roundManager.switchRound(undefined)
    }
    if (this.state.activePlayers < this.state.MIN_PLAYERS) {
      return
    }
    if (this.state.allInPlayersCount === this.state.players.size) {
      return
    }
  }
  async bettingRound(): Promise<boolean> {
    while (!this.turnManager.allPlayersActed()) {
      console.log('test1')
      console.log('current turn : ', this.state.currentTurn)
      console.log('active players : ', this.state.activePlayers)
      let currentPlayer: PlayerState = this.state.players.get(this.state.currentTurn)
      if (!currentPlayer) {
        return
      }
      if (this.state.activePlayers < this.state.MIN_PLAYERS) {
        return
      }
      console.log('test')
      await this.PlayerActionService.waitForPlayerAction(this.state, currentPlayer)
      const nextTurn = this.turnManager.getNextPlayerTurn()

      if (!nextTurn) {
        return
      }
    }
    console.log('betting round finished')
    return
  }
}
