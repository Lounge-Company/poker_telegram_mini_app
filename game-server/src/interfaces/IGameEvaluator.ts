import { SolvedHand } from 'pokersolver'
import { Card } from '../rooms/schema/Card'
import { WinnersResult } from '../types/winnerResult'
import { CompareHandsResult } from '../types/compareHandsResult'

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
   * Evaluates a poker hand by combining player and community cards
   * @param playerCards Player's hole cards
   * @param communityCards Shared community cards
   * @returns A SolvedHand object representing the evaluated poker hand
   */
  evaluateHand(playerCards: Card[], communityCards: Card[]): SolvedHand

  /**
   * Determines the winners from a set of hands given community cards
   * @param hands Map of player IDs to their hole cards
   * @param communityCards Shared community cards
   * @returns WinnersResult containing winning player IDs and winning hand description
   */
  findWinners(hands: Map<string, Card[]>, communityCards: Card[]): WinnersResult

  /**
   * Compares two hands to determine the winner
   * @param hand1 First player's hole cards
   * @param hand2 Second player's hole cards
   * @param communityCards Shared community cards
   * @returns CompareHandsResult with winner and hand descriptions
   */
  compareHands(
    hand1: Card[],
    hand2: Card[],
    communityCards: Card[]
  ): CompareHandsResult
}
