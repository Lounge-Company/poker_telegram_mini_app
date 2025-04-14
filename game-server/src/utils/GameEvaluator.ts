import { Hand, SolvedHand } from 'pokersolver'
import { Card } from '../rooms/schema/Card'
import { WinnersResult } from '../types/winnerResult'
import { IGameEvaluator } from '../interfaces/IGameEvaluator'
import { CompareHandsResult } from '../types/compareHandsResult'

export class GameEvaluator implements IGameEvaluator {
  convertToPokerSolverFormat(cards: Card[]): string[] {
    return cards.map((card) => `${card.rank}${card.suit}`)
  }

  evaluateHand(playerCards: Card[], communityCards: Card[]): SolvedHand {
    const allCards = [...playerCards, ...communityCards]
    const formattedCards = this.convertToPokerSolverFormat(allCards)
    return Hand.solve(formattedCards)
  }

  findWinners(hands: Map<string, Card[]>, communityCards: Card[]): WinnersResult {
    const solvedHands: SolvedHand[] = []
    const playerIds: string[] = []

    hands.forEach((cards, playerId) => {
      const hand = this.evaluateHand(cards, communityCards)
      solvedHands.push(hand)
      playerIds.push(playerId)
    })

    const winners = Hand.winners(solvedHands)
    return {
      winningPlayerIds: winners.map((hand) => playerIds[solvedHands.indexOf(hand)]),
      winningHand: winners[0].descr,
    }
  }

  compareHands(
    hand1: Card[],
    hand2: Card[],
    communityCards: Card[]
  ): CompareHandsResult {
    const solvedHand1: SolvedHand = this.evaluateHand(hand1, communityCards)
    const solvedHand2: SolvedHand = this.evaluateHand(hand2, communityCards)

    const winner = Hand.winners([solvedHand1, solvedHand2])
    return {
      winner: winner[0] === solvedHand1 ? 1 : winner[0] === solvedHand2 ? 2 : 0,
      hand1Description: solvedHand1.descr,
      hand2Description: solvedHand2.descr,
    }
  }
}
