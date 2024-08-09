import { useLastCardReviewTime } from '@/hooks'
import { ActivityIcon } from './icons'

export default function Footer() {
  const lastCardReviewTime = useLastCardReviewTime()
  return (
    <footer className="bg-muted text-muted-foreground ">
      <div className="py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ActivityIcon className="w-5 h-5" />
          <span>Last studied: {lastCardReviewTime.formatted ?? 'Never'}</span>
        </div>
      </div>

      <div className="border-t py-4 bg-muted text-center text-sm text-gray-500">
        <a
          href="https://github.com/newraina/rooch-anki"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          GitHub
        </a>
        <span className="mx-2">|</span>
        @2024 let-us-rooch
      </div>
    </footer>
  )
}
