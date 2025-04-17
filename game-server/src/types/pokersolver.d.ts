declare module 'pokersolver' {
  export interface SolvedHand {
    cards: string[]
    descr: string
    rank: number
    isPossible: () => boolean
    toString: () => string
  }

  export class Hand {
    static solve(
      cards: string[],
      gameType?: 'texas-holdem' | 'omaha' | 'five-card-draw'
    ): SolvedHand
    static winners(hands: SolvedHand[]): SolvedHand[]
  }
}
