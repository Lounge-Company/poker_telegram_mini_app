import { Schema, type } from '@colyseus/schema'

export class Seat extends Schema {
  @type('number') index: number
  @type('string') playerId: string
}
