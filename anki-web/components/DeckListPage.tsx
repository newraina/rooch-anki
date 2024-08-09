/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/reTL8iqcNmH
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

 import { Inter } from 'next/font/google'

 inter({
 subsets: ['latin'],
 display: 'swap',
 })

 To read more about using these font, please visit the Next.js documentation:
 - App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
 - Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
 **/
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useDecks } from '@/hooks'
import React, { SVGProps } from 'react'
import { AddDeckDialog } from '@/components/add-deck-dialog'

export function DeckListPage() {
  const deckResp = useDecks()

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Rooch Anki</h1>
        <AddDeckDialog
          onCreated={async () => {
            await deckResp.refetch()
          }}
        >
          <Button variant="ghost" size="sm">
            <PlusIcon className="w-5 h-5" />
            New Deck
          </Button>
        </AddDeckDialog>
      </header>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deckResp.data?.map((deck) => {
            return (
              <Card key={deck.id}>
                <CardHeader>
                  <CardTitle>{deck.name}</CardTitle>
                  <CardDescription>Learn new words and improve your vocabulary.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">{deck.cardCount}</p>
                    <p className="text-muted-foreground">Cards</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">85%</p>
                    <p className="text-muted-foreground">Mastered</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm">
                    <FilePenIcon className="w-5 h-5" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm">
                    <PlayIcon className="w-5 h-5" />
                    Study
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </main>
      <footer className="bg-muted text-muted-foreground py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ActivityIcon className="w-5 h-5" />
          <span>Last studied: 2 hours ago</span>
        </div>
      </footer>
    </div>
  )
}

function ActivityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
    </svg>
  )
}

function FilePenIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  )
}

function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  )
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}