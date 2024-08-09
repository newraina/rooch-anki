export interface Deck {
  id: string
  name: string
  description: string
  cards: string[]
}

export interface FormattedDeck extends Deck {
  cardCount: number
  createdAt: Date
  createdAtString: string
}
