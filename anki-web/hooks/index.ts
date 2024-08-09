import { useCurrentWallet, useRoochClientQuery } from '@roochnetwork/rooch-sdk-kit'
import { MODULE_ADDRESS } from '@/utils/constants'
import { format } from 'date-fns/format'

export function useDecks() {
  const { wallet } = useCurrentWallet()

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

  const desks = resp.data?.data.map(formatDeckRespDataItem)

  return { data: desks, refetch: resp.refetch, isPending: resp.isPending }
}

export function useDeck(id: string) {
  const resp = useRoochClientQuery('queryObjectStates', {
    filter: { object_id: id },
    queryOption: { decode: true },
  })

  if (!resp.data?.data[0]) {
    return {
      data: null,
      refetch: resp.refetch,
      isPending: resp.isPending,
    }
  }

  return {
    data: formatDeckRespDataItem(resp.data?.data[0]),
    refetch: resp.refetch,
    isPending: resp.isPending,
  }
}

export function useDeckCards(deckId: string) {
  const { wallet } = useCurrentWallet()
  const deckInfo = useDeck(deckId)

  const cards = deckInfo.data?.cards.map((id) => ({ id, deckId }))

  return {
    data: cards || [],
    refetch() {
      deckInfo.refetch()
    },
  }
}

function formatDeckRespDataItem(d: any) {
  const decodedValue = d.decoded_value!.value
  const createdAt = new Date(Number(d.created_at))
  return {
    id: d.id,
    name: decodedValue.name as string,
    cards: decodedValue.cards as string[],
    cardCount: decodedValue.cards.length,
    createdAt,
    createdAtString: format(createdAt, 'yyyy-MM-dd HH:mm:ss'),
  }
}
