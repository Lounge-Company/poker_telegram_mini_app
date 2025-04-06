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
import { GameStateRepository } from '../repositories/gameState.repository'
import { BetManager } from '../managers/BetManager'
import { BetRepository } from '../repositories/Bet.repository'
import { SeatRepository } from '../repositories/Seat.repository'
import { TurnRepository } from '../repositories/turn.repository'

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
  betManager: BetManager
  gameStateRepository: GameStateRepository
  seatRepository: SeatRepository
  playerRepository: PlayerRepository
  betRepository: BetRepository
  turnRepository: TurnRepository

  constructor(room: MyRoom, private clientService: ClientService) {
    this.room = room
    this.state = this.room.state
    this.deckManager = new DeckManager(this.deck)
    this.gameStateRepository = new GameStateRepository(this.state)
    this.seatRepository = new SeatRepository(this.state)
    this.playerRepository = new PlayerRepository(this.state.players)
    this.betRepository = new BetRepository(this.state)
    this.turnRepository = new TurnRepository(this.state)
    this.turnManager = new TurnManager(
      this.state,
      this.clientService,
      this.playerRepository,
      this.seatRepository,
      () => this.gameStateRepository.getDealerId()
    )
    this.cardDealer = new CardDealer(this.deckManager, this.clientService)

    this.roundManager = new RoundManager(
      this.gameStateRepository,
      () => this.turnManager.getStartingPlayer(),
      () => Array.from(this.playerRepository.getAllPlayers().values()).length
    )

    this.playerManager = new PlayerManager(
      this.playerRepository,
      this.betRepository,
      this.seatRepository,
      (amount: number) => (this.state.pot = amount),
      () => this.state.pot,
      () => this.state.currentBet,
      () => this.gameStateRepository.getDealerId()
    )
    this.betManager = new BetManager(
      this.playerManager,
      this.betRepository,
      () => this.playerRepository.getAllPlayers(),
      () => this.gameStateRepository.getBinds()
    )
    this.gameManager = new GameManager(
      () => this.playerRepository.getAllPlayers(),
      (count: number) => this.gameStateRepository.setActivePlayers(count),
      (status: boolean) => (this.state.gameStarted = status),
      this.gameLoop.bind(this)
    )
    this.PlayerActionService = new PlayerActionService(
      this.clientService,
      this.playerManager
    )
    this.eventHandlers = createGameEventHandlers(
      this.gameManager,
      this.playerManager
    )

    this.eventEmitter = GameEventEmitter.getInstance()
    this.eventSubscriber = new EventSubscriber(this.eventEmitter)
    this.subscribeToEvents()
  }
  private subscribeToEvents() {
    const eventHandlers = createGameEventHandlers(
      this.gameManager,
      this.playerManager
    )
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      this.eventSubscriber.subscribe(event as keyof GameEventTypes, handler)
    })
  }

  async gameLoop() {
    while (
      this.state.gameStarted &&
      this.state.players.size >= this.state.MIN_PLAYERS
    ) {
      console.log('Game loop running...')

      const curentPlayers = Array.from(
        this.playerRepository.getAllPlayers().values()
      ).length
      this.gameStateRepository.setActivePlayers(curentPlayers)

      const turn = this.turnManager.getStartingPlayer()
      this.turnRepository.setCurrentTurn(turn)

      // initialize blinds
      this.betManager.initializeBlinds()

      // create deck
      this.deck = this.deckManager.createDeck()

      // // deal cards
      this.playerCards = this.cardDealer.dealPlayerCards(
        this.deck,
        this.state.players
      )

      // start betting round

      this.roundsCycle()

      this.turnManager.moveDealerPosition()
      this.playerManager.resetPlayers()

      this.roundManager.resetRound()

      await new Promise((resolve) => setTimeout(resolve, this.state.GAME_LOOP_DELAY))
    }
    console.log('Game loop stopped.')
  }
  async roundsCycle() {
    while (this.roundManager.shouldContinueRounds()) {
      await this.bettingRound()
      this.roundManager.switchRound(undefined)
    }
    if (
      this.gameStateRepository.getActivePlayers() >=
      this.gameStateRepository.getMinPlayers()
    ) {
      // one player left, other players folded
      this.playerManager.findLastActivePlayerAndAwardPot()
      return
    }
    if (
      this.gameStateRepository.getAllInPlayersCount() <
      this.gameStateRepository.getActivePlayers()
    ) {
      // all players are all in
      this.cardDealer.dealRemainingCommunityCards(
        this.deck,
        this.gameStateRepository.getCommunityCards()
      )
      return
    }
    // showdown
  }
  async bettingRound(): Promise<boolean> {
    while (!this.turnManager.allPlayersActed()) {
      let currentPlayer: PlayerState = this.playerRepository.getPlayer(
        this.turnRepository.getCurrentTurn()
      )
      if (!currentPlayer) {
        return
      }
      if (
        this.gameStateRepository.getActivePlayers() <
        this.gameStateRepository.getMinPlayers()
      ) {
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
