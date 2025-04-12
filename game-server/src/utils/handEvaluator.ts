import { Hand, SolvedHand } from 'pokersolver'
import { Card } from '../rooms/schema/Card'

interface WinnersResult {
  winningPlayerIds: string[]
  winningHand: string
}

interface CompareHandsResult {
  winner: 0 | 1 | 2
  hand1Description: string
  hand2Description: string
}

export class HandEvaluator {
  static convertToPokerSolverFormat(cards: Card[]): string[] {
    return cards.map((card) => `${card.rank}${card.suit}`)
  }

  static evaluateHand(playerCards: Card[], communityCards: Card[]): SolvedHand {
    const allCards = [...playerCards, ...communityCards]
    const formattedCards = this.convertToPokerSolverFormat(allCards)
    return Hand.solve(formattedCards)
  }

  static findWinners(
    hands: Map<string, Card[]>,
    communityCards: Card[]
  ): WinnersResult {
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

  static compareHands(
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
