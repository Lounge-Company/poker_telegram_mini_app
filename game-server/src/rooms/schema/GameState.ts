import { Schema, Context, type, MapSchema, ArraySchema } from '@colyseus/schema'
import { PlayerState } from './PlayerState'
import { Card } from './Card'
import { Seat } from './Seat'
import { RoundType } from '../../types/GameTypes'

export class GameState extends Schema {
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>()
  @type({ map: PlayerState }) spectators = new MapSchema<PlayerState>()
  @type([Seat]) seats = new ArraySchema<Seat>()
  @type([Card]) communityCards = new Array<Card>()
  @type('number') readyPlayers = 0
  @type('string') currentTurn: PlayerState['id']
  @type('string') dealerId: PlayerState['id']
  @type('boolean') gameStarted = false
  @type('number') activePlayers = 0
  @type('number') allInPlayersCount = 0
  @type('number') pot = 0
  @type('number') currentBet = 0
  @type('number') gamePhase: RoundType = RoundType.PREFLOP // preFlop, flop, turn, river
  @type('number') TURN_TIME = 5000
  @type('number') GAME_LOOP_DELAY = 10000
  @type('number') MAX_SEATS = 10
  @type('number') MIN_PLAYERS = 2
  @type('number') SMALL_BLIND = 1
  @type('number') BIG_BLIND = 2
}
