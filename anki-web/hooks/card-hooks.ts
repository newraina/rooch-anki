import { useAppSession, useDeck } from '@/hooks'
import { MODULE_ADDRESS } from '@/utils/constants'
import { getDueCardIds } from '@/utils/kit'
import { Args, Transaction } from '@roochnetwork/rooch-sdk'
import { useRoochClient, useRoochClientQuery } from '@roochnetwork/rooch-sdk-kit'
import {
  addHours,
  differenceInDays,
  formatDistanceToNow,
  formatDistanceToNowStrict,
} from 'date-fns'
import { format } from 'date-fns/format'
import { useCallback, useEffect, useState } from 'react'
import { useAppStore } from '@/store'

export function useCard(id: string) {
  const client = useRoochClient()
  const { sessionKey } = useAppSession()
  const testMode = useAppStore((state) => state.isTestMode)

  const resp = useRoochClientQuery('queryObjectStates', {
    filter: { object_id: id },
    queryOption: { decode: true },
  })

  async function review(quality: 1 | 2 | 3 | 4) {
    const tx = new Transaction()

    if (testMode) {
      tx.callFunction({
        target: `${MODULE_ADDRESS}::card::review_card_entry_for_testing`,
        args: [
          Args.objectId(id),
          Args.u8(quality),
          Args.u64(BigInt((Date.now() / 1000).toFixed(0))),
        ],
      })
    } else {
      tx.callFunction({
        target: `${MODULE_ADDRESS}::card::review_card_entry`,
        args: [Args.objectId(id), Args.u8(quality)],
      })
    }

    const result = await client.signAndExecuteTransaction({
      transaction: tx,
      signer: sessionKey!,
    })

    if (result.execution_info.status.type !== 'executed') {
      alert('Transaction failed')
      return
    }
  }

  if (!resp.data?.data[0]) {
    return {
      data: null,
      review,
      refetch: resp.refetch,
      isPending: resp.isPending,
    }
  }

  return {
    data: formatCardRespDataItem(resp.data?.data[0]),
    review,
    refetch: resp.refetch,
    isPending: resp.isPending,
  }
}

export function useCardList(ids: string[]) {
  const resp = useRoochClientQuery('queryObjectStates', {
    filter: { object_id: ids.join(',') },
    queryOption: { decode: true },
  })

  if (!resp.data?.data.length) {
    return {
      data: null,
      refetch: resp.refetch,
      isPending: resp.isPending,
    }
  }

  return {
    data: resp.data?.data.map(formatCardRespDataItem),
    refetch: resp.refetch,
    isPending: resp.isPending,
  }
}

export function useDeckCards(deckId: string) {
  const deckInfo = useDeck(deckId)

  const cards = deckInfo.data?.cards.map((id) => ({ id, deckId }))
  const cardList = useCardList(cards?.map((card) => card.id) || [])

  return {
    data: cardList.data || [],
    refetch() {
      deckInfo.refetch()
      cardList.refetch()
    },
  }
}

function formatCardRespDataItem(d: any) {
  const decodedValue = d.decoded_value!.value
  const createdAt = new Date(Number(d.created_at))
  const dueDate = new Date(Number(decodedValue.due_date * 1000))

  const localDueDate = addHours(dueDate, -8)
  const dueDateString = format(localDueDate, 'yyyy-MM-dd')
  const rawDueDateDistanceToNow = differenceInDays(localDueDate, new Date())
  const formattedDueDateDistanceToNow =
    rawDueDateDistanceToNow === 0
      ? 'today'
      : formatDistanceToNowStrict(localDueDate, {
          addSuffix: true,
          unit: 'day',
        })

  return {
    id: d.id,
    front: decodedValue.front as string,
    back: decodedValue.back as string,
    dueDate,
    dueDateString,
    dueDateDistanceToNow: formattedDueDateDistanceToNow,
    easeFactor: Number(decodedValue.ease_factor),
    interval: Number(decodedValue.interval),
    reviewCount: Number(decodedValue.review_count),
    createdAt,
    createdAtString: format(createdAt, 'yyyy-MM-dd HH:mm:ss'),
  }
}

export function useDueCardIds(deckId: string) {
  const client = useRoochClient()
  const deckResp = useDeck(deckId)
  const [isPending, setIsPending] = useState(false)
  const dueCardIds = useAppStore((state) => state.deck2DueCardIds[deckId] || [])
  const setDeck2DueCardIds = useAppStore((state) => state.setDeck2DueCardIds)
  const testMode = useAppStore((state) => state.isTestMode)

  const fetchDueCardIds = useCallback(
    async (deckId: string) => {
      try {
        setIsPending(true)
        const ids = await getDueCardIds(client, deckId)
        setDeck2DueCardIds(deckId, ids)
      } catch (e) {
        console.error(e)
      } finally {
        setIsPending(false)
      }
    },
    [deckId, setDeck2DueCardIds],
  )

  useEffect(() => {
    fetchDueCardIds(deckId)
  }, [deckId])

  return {
    ids: testMode ? deckResp.data?.cards || [] : dueCardIds,
    isPending: isPending,
    refetch() {
      return fetchDueCardIds(deckId)
    },
  }
}

export function useLastCardReviewTime() {
  const resp = useRoochClientQuery('getEvents', {
    eventHandleType: `${MODULE_ADDRESS}::card::CardReviewEvent`,
    eventOptions: { decode: true },
    descendingOrder: true,
  })

  // seconds
  const lastCardReviewTime = resp.data?.data[0]!.decoded_event_data!.value.current_time as
    | string
    | null
    | undefined

  if (!lastCardReviewTime) {
    return {
      timestamp: null,
      formatted: null,
    }
  }

  return {
    timestamp: lastCardReviewTime,
    formatted: formatDistanceToNow(new Date(Number(lastCardReviewTime) * 1000), {
      addSuffix: true,
    }),
  }
}
