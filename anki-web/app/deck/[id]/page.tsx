import DeckPage from '@/components/deck-page'

export default function DeckPageContainer({ params }: { params: { id: string } }) {
  return <DeckPage params={params} />
}
