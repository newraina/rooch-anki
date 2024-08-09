import Link from 'next/link'
import { TopRightActions } from './top-right-actions'

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold">
        <Link href="/">Rooch Anki</Link>
      </h1>
      <TopRightActions />
    </header>
  )
}
