import { useAppStore } from '@/store'
import { MODULE_ADDRESS } from '@/utils/constants'
import { FormattedDeck } from '@/utils/types'
import { useCurrentWallet, useRoochClientQuery } from '@roochnetwork/rooch-sdk-kit'
import { format } from 'date-fns/format'
import { useEffect } from 'react'

export function useDeck(id: string) {
  const decks = useAppStore((state) => state.decks)
  const setDecks = useAppStore((state) => state.setDecks)

  const deck = decks.find((deck) => deck.id === id)

  const resp = useRoochClientQuery('queryObjectStates', {
    filter: { object_id: id },
    queryOption: { decode: true },
  })

  useEffect(() => {
    if (!resp.data?.data[0]) return
    setDecks(
      decks.map((deck) => (deck.id === id ? formatDeckRespDataItem(resp.data.data[0]) : deck)),
    )
  }, [resp.data])

  return {
    data: deck,
    refetch: resp.refetch,
    isPending: resp.isPending,
  }
}

export function useDecks() {
  const { wallet } = useCurrentWallet()

  const decks = useAppStore((state) => state.decks)
  const setDecks = useAppStore((state) => state.setDecks)

  const resp = useRoochClientQuery('queryObjectStates', {
    filter: {
      object_type_with_owner: {
        owner: wallet?.getRoochAddress().toStr() || '',
        // @ts-ignore
        filter_out: false,
        object_type: `${MODULE_ADDRESS}::deck::Deck`,
      },
    },
    // @ts-ignore
    queryOption: { decode: true },
    descending_order: true,
  })

  useEffect(() => {
    if (!resp.data) return
    setDecks(resp.data.data.map(formatDeckRespDataItem))
  }, [resp.data])

  return {
    data: decks,
    refetch() {
      resp.refetch()
    },
    isPending: resp.isPending,
  }
}

function formatDeckRespDataItem(d: any): FormattedDeck {
  const decodedValue = d.decoded_value!.value
  const createdAt = new Date(Number(d.created_at))

  return {
    id: d.id,
    name: decodedValue.name as string,
    description: decodedValue.description as string,
    cards: decodedValue.cards as string[],
    cardCount: decodedValue.cards.length,
    createdAt,
    createdAtString: format(createdAt, 'yyyy-MM-dd HH:mm:ss'),
  }
}
