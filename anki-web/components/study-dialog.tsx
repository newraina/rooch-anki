import AnkiCard from '@/components/anki-card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useDeck, useDueCardIds } from '@/hooks'
import confetti from 'canvas-confetti'
import { PropsWithChildren, useEffect, useState } from 'react'

interface Props {
  deckId: string
}

export function StudyDialog({ children, deckId }: PropsWithChildren<Props>) {
  const [open, setOpen] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const dueCardIdsResp = useDueCardIds(deckId)
  const deckResp = useDeck(deckId)
  const [finished, setFinished] = useState(false)

  const currentCardId = dueCardIdsResp.ids[currentCardIndex]

  useEffect(() => {
    if (!open) {
      setFinished(false)
      setCurrentCardIndex(0)
      deckResp.refetch()
      dueCardIdsResp.refetch()
    } else {
      setCurrentCardIndex(0)
      dueCardIdsResp.refetch()
    }
  }, [open])

  if (deckResp.isPending || dueCardIdsResp.isPending) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="min-h-[300px] mx-auto">
          <DialogHeader>
            <DialogTitle>Loading</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-lg font-medium">Preparing your study session...</p>
            <p className="text-sm text-gray-500">This may take a moment</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (deckResp.data?.cardCount === 0) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="min-h-[300px] mx-auto">
          <DialogHeader>
            <DialogTitle>Notice</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center px-6">
            <p className="text-lg font-medium text-center mb-4">
              😢 You haven't created any cards yet.
            </p>
            <p className="text-sm text-gray-500 text-center">
              Please add some cards to this deck first.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!dueCardIdsResp.isPending && !dueCardIdsResp.ids?.length) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="min-h-[300px] mx-auto">
          <DialogHeader>
            <DialogTitle>Study</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center px-6">
            <p className="text-lg font-medium text-center mb-4">
              🎉 Great job! You've completed all your cards for today.
            </p>
            <p className="text-sm text-gray-500 text-center">Come back tomorrow for more review.</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-h-[300px]">
        <DialogHeader>
          <DialogTitle>Study</DialogTitle>
        </DialogHeader>
        {currentCardId !== null && !finished && (
          <>
            <AnkiCard
              id={currentCardId}
              onReviewCompleted={() => {
                const nextIndex = currentCardIndex + 1
                if (nextIndex < dueCardIdsResp.ids.length) {
                  setCurrentCardIndex(nextIndex)
                } else {
                  setFinished(true)
                  window.setTimeout(() => {
                    confetti({
                      particleCount: 100,
                      spread: 70,
                      origin: { y: 0.6 },
                    })
                  }, 300)
                }
              }}
            />
          </>
        )}
        {finished && (
          <div className="flex flex-col items-center px-6">
            <p className="text-lg font-medium text-center mb-4">
              🎉 Congratulations! You've completed all your cards for today.
            </p>
            <p className="text-sm text-gray-500 text-center mx-auto">
              Great job on your study session. Come back tomorrow for more review.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
