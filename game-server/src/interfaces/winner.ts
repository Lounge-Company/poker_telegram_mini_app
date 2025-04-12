import { Hand } from 'pokersolver'
export interface Winner {
  playerId: string
  hand: Hand
  handName: string
  cards: string[]
}
