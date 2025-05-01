import { PlayerHandEvaluation } from './PlayerHandEvaluation'

export type WinnersResult = {
  winner: PlayerHandEvaluation
  otherHands: PlayerHandEvaluation[]
}
