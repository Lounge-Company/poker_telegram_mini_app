import { SolvedHand } from 'pokersolver'
import { Card } from '../rooms/schema/Card'
import { WinnersResult } from '../types/winnerResult'

/**
 * Utility class for evaluating poker hands and determining winners
 * Provides methods to convert cards, evaluate hands, and compare hands using pokersolver
 */
export interface IGameEvaluator {
  /**
   * Converts Card objects to pokersolver compatible string format
   * @param cards Array of Card objects to convert
   * @returns Array of card strings in 'ranksuit' format (e.g. 'AS' for Ace of Spades)
   */
  convertToPokerSolverFormat(cards: Card[]): string[]

  /**
   * Determines the winners from a set of hands given community cards
   * @param hands Map of player IDs to their hole cards
   * @param communityCards Shared community cards
   * @returns WinnersResult containing winning player IDs and winning hand description
   */
  findWinners(hands: Map<string, Card[]>, communityCards: Card[]): WinnersResult
}
