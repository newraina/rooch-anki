'use client'

import { useDeck, useDeckCards } from '@/hooks'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from './data-table'

export default function DeckPage({ params }: { params: { id: string } }) {
  const { id } = params

  const deck = useDeck(id)
  const cards = useDeckCards(id)

  interface Card {
    front: string
    back: string
    id: string
    createdAtString: string
    dueDateString: string
    dueDateDistanceToNow: string
    interval: number
    easeFactor: number
  }

  const columns: ColumnDef<Card>[] = [
    {
      accessorKey: 'front',
      header: 'Front',
    },
    {
      accessorKey: 'back',
      header: 'Back',
    },
    {
      accessorKey: 'interval',
      header: 'Interval',
    },
    {
      accessorKey: 'reviewCount',
      header: 'Review Count',
    },
    {
      accessorKey: 'easeFactor',
      header: 'Ease Factor',
      cell: ({ row }) => {
        const { easeFactor } = row.original
        return <span>{easeFactor / 1000}</span>
      },
    },
    {
      accessorKey: 'dueDateString',
      header: 'Due Date',
      cell: ({ row }) => {
        const { dueDateString, dueDateDistanceToNow } = row.original
        return (
          <div>
            <span>{dueDateDistanceToNow}</span>
            <span className="text-xs text-gray-500 pl-1">({dueDateString})</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'createdAtString',
      header: 'Created At',
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-primary">
        {deck.data?.name}
        <span className="text-xl font-normal text-gray-500 ml-2">Deck Details</span>
      </h1>

      <div className="mt-4">
        <DataTable columns={columns} data={cards.data} />
      </div>
    </div>
  )
}

export { DeckPage }
