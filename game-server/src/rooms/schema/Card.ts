import { Schema, type } from '@colyseus/schema'

export class Card extends Schema {
  @type('string') suit: string
  @type('string') rank: string
}
