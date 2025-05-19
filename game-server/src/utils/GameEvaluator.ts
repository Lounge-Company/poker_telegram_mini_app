import { Hand, SolvedHand } from 'pokersolver'
import { Card } from '../rooms/schema/Card'
import { WinnersResult } from '../types/winnerResult'
import { IGameEvaluator } from '../interfaces/IGameEvaluator'
import { PlayerHandEvaluation } from '../types/PlayerHandEvaluation'
import { PlayerCards } from '../types/PlayerCards'

export class GameEvaluator implements IGameEvaluator {
  convertToPokerSolverFormat(cards: Card[]): string[] {
    return cards.map((card) => `${card.rank}${card.suit}`)
  }

  findWinners(hands: PlayerCards, communityCards: Card[]): WinnersResult {
    const evaluatedHands = [] as PlayerHandEvaluation[]
    const result: WinnersResult = {
      winner: { playerId: '', solvedHand: {} as SolvedHand },
      otherHands: [] as PlayerHandEvaluation[],
    }

    // Evaluate each player's hand
    for (const [playerId, cards] of hands) {
      const concatedCards = [
        ...this.convertToPokerSolverFormat(cards),
        ...communityCards.map((card) => `${card.rank}${card.suit}`),
      ]
      const solvedHand = Hand.solve(concatedCards)
      evaluatedHands.push({ playerId, solvedHand })
    }

    // Find winners using pokersolver
    const winningHands = Hand.winners(evaluatedHands.map((hand) => hand.solvedHand))

    // Find the winning player
    const winningHand = evaluatedHands.find(
      (hand) => hand.solvedHand === winningHands[0]
    )

    if (winningHand) {
      result.winner = {
        playerId: winningHand.playerId,
        solvedHand: winningHand.solvedHand,
      }

      // Add other hands to results
      result.otherHands = evaluatedHands.filter(
        (hand) => hand.playerId !== winningHand.playerId
      )
    }

    return result
  }
}
