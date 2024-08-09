import { useDueCardIds } from '@/hooks'
import { FormattedDeck } from '@/utils/types'
import Link from 'next/link'
import { AddCardDialog } from './add-card-dialog'
import { StudyDialog } from './study-dialog'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'

interface DeckCardProps {
  deck: FormattedDeck
  onAddCard: () => void
}

export function DeckCard({ deck, onAddCard }: DeckCardProps) {
  const dueCards = useDueCardIds(deck.id)

  const notStudiedCardCount = dueCards.ids?.length ?? 0
  const totalCardCount = deck.cardCount
  const studiedPercentage = Math.round(
    ((totalCardCount - notStudiedCardCount) / totalCardCount) * 100,
  )

  const formattedPercentage = isNaN(studiedPercentage) ? 0 : studiedPercentage

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link className="hover:underline" href={`/deck/${deck.id}`}>
            {deck.name}
          </Link>
        </CardTitle>
        <CardDescription>{deck.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold">{deck.cardCount}</p>
          <p className="text-muted-foreground">Cards</p>
        </div>
        <div>
          {dueCards.isPending ? (
            <p className="text-2xl font-bold">-</p>
          ) : (
            <p className="text-2xl font-bold">{formattedPercentage}%</p>
          )}
          <p className="text-muted-foreground">Studied</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <AddCardDialog
          deckId={deck.id}
          onCreated={() => {
            dueCards.refetch()
            onAddCard()
          }}
        >
          <Button variant="secondary">Add Cards</Button>
        </AddCardDialog>

        <StudyDialog deckId={deck?.id}>
          <Button variant="outline">Start Learning</Button>
        </StudyDialog>
      </CardFooter>
    </Card>
  )
}
