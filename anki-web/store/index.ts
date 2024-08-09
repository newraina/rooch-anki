import { FormattedDeck } from '@/utils/types'
import { create } from 'zustand'

interface Store {
  isTestMode: boolean
  setIsTestMode: (isTestMode: boolean) => void

  decks: FormattedDeck[]
  setDecks: (decks: FormattedDeck[]) => void
  deck2DueCardIds: Record<string, string[]>
  setDeck2DueCardIds: (deckId: string, dueCardIds: string[]) => void
}

export const useAppStore = create<Store>((set) => ({
  isTestMode: false,
  setIsTestMode: (isTestMode: boolean) => set({ isTestMode }),

  decks: [],
  setDecks: (decks: FormattedDeck[]) => set({ decks }),

  deck2DueCardIds: {},
  setDeck2DueCardIds: (deckId: string, dueCardIds: string[]) =>
    set((state) => ({
      deck2DueCardIds: { ...state.deck2DueCardIds, [deckId]: dueCardIds },
    })),
}))
