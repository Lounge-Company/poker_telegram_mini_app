import { Schema, Context, type, MapSchema, ArraySchema } from '@colyseus/schema'
import { PlayerState } from './PlayerState'
import { Card } from './Card'
import { Seat } from './Seat'
import { RoundType } from '../../types/GameTypes'

export class GameState extends Schema {
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>()
  @type({ map: PlayerState }) waitingQueue = new MapSchema<PlayerState>()
  @type({ map: PlayerState }) spectators = new MapSchema<PlayerState>()
  @type([Seat]) seats = new ArraySchema<Seat>()
  @type([Card]) communityCards = new Array<Card>()
  @type('number') readyPlayers = 0
  @type('string') currentTurn: PlayerState['id']
  @type('string') dealerId: PlayerState['id']
  @type('boolean') gameStarted = false
  @type('number') pot = 0
  @type('number') currentBet = 0
  @type('number') smallBlind: number = 5
  @type('number') bigBlind: number = 10
  @type('number') gamePhase: RoundType = RoundType.PREFLOP // preFlop, flop, turn, river
}
