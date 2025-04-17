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
import { shouldContinueGame } from '../utils/game/shouldContinueGame'
import { hasOnlyOneActivePlayer } from '../utils/game/hasOnlyOneActivePlayer'
import { isAllPlayersAllIn } from '../utils/game/isAllPlayersAllIn'
import { GameEvaluator } from '../utils/GameEvaluator'

export class GameLoop {
  private playerCards: Map<string, Card[]> = new Map()
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
  }
  private initializeServices() {
    this.cardDealer = new CardDealer(this.deckManager, this.clientService)
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

      // start betting round

      await this.playRounds()

      this.turnManager.moveDealerPosition()
      this.playerManager.resetPlayers()

      this.roundManager.resetRound()
      await new Promise((resolve) => setTimeout(resolve, this.state.GAME_LOOP_DELAY))
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
      this.cardDealer.dealRoundCards(
        this.deck,
        this.gameStateRepository.getGamePhase()
      )
      this.roundManager.switchRound(undefined)
      this.playerManager.resetPlayersBetweenRounds()
    }

    // Get current game state
    const activePlayers = this.gameStateRepository.getActivePlayers()
    const allInPlayersCount = this.gameStateRepository.getAllInPlayersCount()

    // Handle end game scenarios
    if (hasOnlyOneActivePlayer(activePlayers)) {
      console.log('===================================================')
      console.log('Only one player left. Active player:', activePlayers)
      console.log('===================================================')
      this.playerManager.findLastActivePlayerAndAwardPot()
    } else if (isAllPlayersAllIn(allInPlayersCount, activePlayers)) {
      this.cardDealer.dealRemainingCommunityCards(
        this.deck,
        this.gameStateRepository.getCommunityCards()
      )
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
      const activePlayers = this.gameStateRepository.getActivePlayers()

      if (hasOnlyOneActivePlayer(activePlayers)) {
        console.log('only one active player')
        return
      }

      const currentTurnPlayerId = this.getCurrentTurnPlayerId()

      if (!currentTurnPlayerId) {
        console.log('current player not found')
        return
      }

      const currentPlayer = this.playerRepository.getPlayer(currentTurnPlayerId)
      await this.handlePlayerAction(currentPlayer)

      const nextTurn = this.turnManager.getNextPlayerTurn()
      if (!nextTurn) {
        return
      }
    }

    console.log('betting round finished')
    return
  }

  private getCurrentTurnPlayerId(): string | null {
    const currentTurnPlayerId = this.turnRepository.getCurrentTurn()
    if (!currentTurnPlayerId) {
      return this.turnManager.getNextActivePlayerAfterDealer()
    }
    return currentTurnPlayerId
  }

  private async handlePlayerAction(player: PlayerState): Promise<void> {
    await this.PlayerActionService.waitForPlayerAction(this.state, player)
  }
}
