import { FC, useState } from 'react'
import { Card } from '@/components/ui/card'
import { useCard } from '@/hooks'
import { Button } from '@/components/ui/button'

interface Props {
  id: string
  onReviewCompleted: () => void
}

const AnkiCard: FC<Props> = ({ id, onReviewCompleted }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const cardResp = useCard(id)

  if (cardResp.isPending) {
    return (
      <Card variant="plain" className="flex items-center justify-center h-[300px]">
        Loading...
      </Card>
    )
  }

  if (cardResp.data === null) {
    return (
      <Card variant="plain" className="flex items-center justify-center h-[300px]">
        Card not found
      </Card>
    )
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  type Difficulty = 'again' | 'hard' | 'good' | 'easy'
  type Quality = 1 | 2 | 3 | 4

  const handleReview = async (difficulty: Difficulty) => {
    const difficultyToQuality: Record<Difficulty, Quality> = {
      again: 1,
      hard: 2,
      good: 3,
      easy: 4,
    }

    await cardResp.review(difficultyToQuality[difficulty])
    onReviewCompleted()
    handleFlip()
  }

  return (
    <Card variant="plain" className="p-6 relative min-h-[300px] flex flex-col justify-between">
      <div className="flex-grow flex flex-col items-center justify-center text-center text-lg">
        <div>{cardResp.data.front}</div>
        {isFlipped && (
          <>
            <hr className="w-full my-4" />
            <div>{cardResp.data.back}</div>
          </>
        )}
      </div>

      {isFlipped ? (
        <div className="mt-4 flex justify-center">
          <div className="flex gap-2">
            <Button
              onClick={() => handleReview('again')}
              variant="outline"
              className="flex items-center"
            >
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              Again
            </Button>
            <Button
              onClick={() => handleReview('hard')}
              variant="outline"
              className="flex items-center"
            >
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
              Hard
            </Button>
            <Button
              onClick={() => handleReview('good')}
              variant="outline"
              className="flex items-center"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Good
            </Button>
            <Button
              onClick={() => handleReview('easy')}
              variant="outline"
              className="flex items-center"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Easy
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <Button onClick={handleFlip} className="mt-4">
            Show Answer
          </Button>
        </div>
      )}
    </Card>
  )
}

export default AnkiCard
