// States
import { MyRoom } from '../rooms/MyRoom'
import { GameState } from '../rooms/schema/GameState'
import { PlayerState } from '../rooms/schema/PlayerState'
import { Card } from '../rooms/schema/Card'

// Managers
import { TurnManager } from '../managers/TurnManager'
import { GameManager } from '../managers/GameManager'
import { RoundManager } from '../managers/RoundManager'
import { PlayerManager } from '../managers/PlayerManager'
import { BetManager } from '../managers/BetManager'
import { DeckManager } from '../managers/DeckManager'
import { SeatManager } from '../managers/SeatManager'

// Repositories
import { GameStateRepository } from '../repositories/GameState.repository'
import { PlayerRepository } from '../repositories/Player.repository'
import { BetRepository } from '../repositories/Bet.repository'
import { SeatRepository } from '../repositories/Seat.repository'
import { TurnRepository } from '../repositories/Turn.repository'

// Services
import { ClientService } from '../services/clientService'
import { PlayerActionService } from '../services/PlayerActionService'

// Events
import { GameEventEmitter } from '../events/gameEventEmitter'
import { createGameEventHandlers } from '../events/gameEventHandlers'
import { EventSubscriber } from '../events/eventSubscriber'

// Types
import { GameEventTypes } from '../types/GameEventsTypes'
import { PlayerCards } from '../types/PlayerCards'
// Utils
import { CardDealer } from '../utils/CardDealer'
import { GameEvaluator } from '../utils/GameEvaluator'
import { isAllPlayersAllIn } from '../utils/game/isAllPlayersAllIn'
import { shouldContinueGame } from '../utils/game/shouldContinueGame'
import { hasOnlyOneActivePlayer } from '../utils/game/hasOnlyOneActivePlayer'
import { RoomManager } from '../managers/RoomManager'

export class GameLoop {
  private playerCards: PlayerCards = new Map()
  private deck: Card[] = []

  state: GameState
  room: MyRoom

  // Core managers
  turnManager: TurnManager
  gameManager: GameManager
  deckManager: DeckManager
  roundManager: RoundManager
  playerManager: PlayerManager
  betManager: BetManager
  seatManager: SeatManager
  RoomManager: RoomManager
  // Repositories
  gameStateRepository: GameStateRepository
  seatRepository: SeatRepository
  playerRepository: PlayerRepository
  betRepository: BetRepository
  turnRepository: TurnRepository

  // Services
  cardDealer: CardDealer
  PlayerActionService: PlayerActionService
  clientService: ClientService
  gameEvaluator: GameEvaluator
  // Events
  eventEmitter: GameEventEmitter
  eventSubscriber: EventSubscriber
  eventHandlers: ReturnType<typeof createGameEventHandlers>

  constructor(room: MyRoom, clientService: ClientService) {
    this.room = room
    this.state = this.room.state
    this.clientService = clientService

    this.initializeRepositories()
    this.initializeManagers()
    this.initializeServices()
    this.initializeEvents()
  }
  private initializeRepositories() {
    this.gameStateRepository = new GameStateRepository(this.state)
    this.seatRepository = new SeatRepository(this.state)
    this.playerRepository = new PlayerRepository(this.state.players)
    this.betRepository = new BetRepository(this.state)
    this.turnRepository = new TurnRepository(this.state)
  }
  private initializeManagers() {
    this.RoomManager = new RoomManager(this.state)
    this.deckManager = new DeckManager(this.deck)
    this.turnManager = new TurnManager(
      this.state,
      this.clientService,
      this.playerRepository,
      this.seatRepository,
      () => this.gameStateRepository.getDealerId()
    )

    this.roundManager = new RoundManager(this.gameStateRepository, () =>
      this.playerRepository.getPlayerCount()
    )

    this.playerManager = new PlayerManager(
      this.RoomManager,
      this.gameStateRepository,
      this.playerRepository,
      this.betRepository,
      this.seatRepository,
      (count: number) => this.gameStateRepository.setActivePlayers(count),
      () => this.gameStateRepository.getActivePlayers(),
      () => this.gameStateRepository.getDealerId(),
      this.clientService
    )

    this.betManager = new BetManager(
      this.playerManager,
      this.betRepository,
      () => this.playerRepository.getAllPlayers(),
      () => this.gameStateRepository.getBinds()
    )

    this.gameManager = new GameManager(
      this.seatRepository,
      () => this.playerRepository.getAllPlayers(),
      (count) => this.gameStateRepository.setActivePlayers(count),
      (status) => (this.state.gameStarted = status),
      (dealerId) => this.gameStateRepository.setDealerId(dealerId),
      this.gameLoop.bind(this)
    )
    this.seatManager = new SeatManager(
      this.state,
      this.playerManager,
      this.playerRepository,
      this.seatRepository
    )
  }
  private initializeServices() {
    this.cardDealer = new CardDealer(
      this.deckManager,
      this.clientService,
      () => this.gameStateRepository.getCommunityCards(),
      (card: Card) => this.gameStateRepository.addCommunityCard(card)
    )
    this.PlayerActionService = new PlayerActionService(
      this.clientService,
      this.playerManager,
      () => this.betRepository.getCurrentBet()
    )
    this.gameEvaluator = new GameEvaluator()
  }
  private initializeEvents() {
    this.eventEmitter = GameEventEmitter.getInstance()
    this.eventSubscriber = new EventSubscriber(this.eventEmitter)
    this.eventHandlers = createGameEventHandlers(
      this.gameManager,
      this.playerManager
    )

    for (const [event, handler] of Object.entries(this.eventHandlers)) {
      this.eventSubscriber.subscribe(event as keyof GameEventTypes, handler)
    }
  }

  async gameLoop() {
    while (
      shouldContinueGame(
        this.state.gameStarted,
        this.state.players.size,
        this.state.MIN_PLAYERS
      )
    ) {
      console.log('Game loop running...')
      this.seatManager.freeEmptySeats()
      this.roundManager.resetRound()
      this.deckManager.resetDeck()
      this.playerManager.resetPlayers()
      this.playerCards = new Map<string, Card[]>()

      const curentPlayers = this.playerRepository.getPlayerCount()
      this.gameStateRepository.setActivePlayers(curentPlayers)

      const startingPlayerId = this.turnManager.getStartingPlayer()
      console.log('Starting player:', startingPlayerId)
      this.turnRepository.setCurrentTurn(startingPlayerId)

      // initialize blinds
      this.betManager.initializeBlinds()

      // create deck
      this.deck = this.deckManager.createDeck()

      // // deal cards
      this.playerCards = this.cardDealer.dealPlayerCards(
        this.deck,
        this.state.players
      )
      // test 2
      // start betting round

      await this.playRounds()

      this.turnManager.moveDealerPosition()

      await new Promise((resolve) =>
        setTimeout(resolve, this.state.GAME_LOOP_DELAY)
      )
    }
    console.log('Game loop stopped.')
  }

  async playRounds() {
    // Continue rounds while game is in progress
    while (this.roundManager.shouldContinueRounds()) {
      // Play current betting round
      await this.playBettingRound()

      // Prepare for next round

      // Deal cards for current game phase
      await this.cardDealer.dealRoundCards(
        this.deck,
        this.gameStateRepository.getGamePhase()
      )
      this.roundManager.switchRound()
      this.playerManager.resetPlayersBetweenRounds()
      this.betManager.resetBet()
      this.turnManager.resetCurrentTurn()
    }

    // Get current game state
    const activePlayers = this.gameStateRepository.getActivePlayers()
    const allInPlayersCount = this.gameStateRepository.getAllInPlayersCount()

    // Handle end game scenarios
    if (hasOnlyOneActivePlayer(activePlayers)) {
      this.playerManager.findLastActivePlayerAndAwardPot()
    }

    if (isAllPlayersAllIn(allInPlayersCount, activePlayers)) {
      this.cardDealer.dealRemainingCommunityCards(this.deck)
    }
    // Determine winners and award pot
    const winnersResult = this.gameEvaluator.findWinners(
      this.playerCards,
      this.gameStateRepository.getCommunityCards()
    )
    this.playerManager.awardPotToWinners(winnersResult)
  }

  async playBettingRound(): Promise<boolean> {
    while (
      !this.turnManager.allPlayersActed() &&
      this.roundManager.shouldContinueRounds()
    ) {
      const currentTurnPlayerId = this.getCurrentTurnPlayerId()
      this.turnRepository.setCurrentTurn(currentTurnPlayerId)
      console.log('currentTurnPlayerId :', currentTurnPlayerId)
      const currentPlayer = this.playerRepository.getPlayer(currentTurnPlayerId)
      await this.handlePlayerAction(currentPlayer)

      const activePlayers = this.gameStateRepository.getActivePlayers()

      if (hasOnlyOneActivePlayer(activePlayers)) {
        console.log('only one active player')
        return
      }
      const nextTurn = this.turnManager.getNextPlayerTurn()
      if (!nextTurn) {
        return
      }
    }

    console.log('betting round finished')
    return
  }

  private getCurrentTurnPlayerId(): string | null {
    let currentTurnPlayerId = this.turnRepository.getCurrentTurn()
    if (!currentTurnPlayerId) {
      currentTurnPlayerId = this.turnManager.getNextActivePlayerAfterDealer()
    }
    return currentTurnPlayerId
  }

  private async handlePlayerAction(player: PlayerState): Promise<void> {
    await this.PlayerActionService.waitForPlayerAction(this.state, player)
  }
}
