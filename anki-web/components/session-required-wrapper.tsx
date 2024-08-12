import { cloneElement, useState, forwardRef } from 'react'
import { useAppSession } from '@/hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'

const SessionRequiredWrapper = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  ({ children }, ref) => {
    const { sessionKey, handlerCreateSessionKey } = useAppSession()
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleCreateSession = async () => {
      await handlerCreateSessionKey()
      setIsDialogOpen(false)
    }

    if (sessionKey) {
      return cloneElement(children as React.ReactElement, { ref })
    }

    const ChildButton = cloneElement(children as React.ReactElement, {
      onClick: (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault()
        ev.stopPropagation()
        setIsDialogOpen(true)
      },
    })

    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>{ChildButton}</DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Session Key Required</DialogTitle>
          </DialogHeader>
          <p className="text-base text-gray-700">Please create a session key to continue.</p>
          <p className="text-sm text-gray-600">
            Session key can be used to sign transactions, so you don't need to open your wallet for
            every operation.
          </p>
          <Button onClick={handleCreateSession}>Create Session Key</Button>
        </DialogContent>
      </Dialog>
    )
  },
)

SessionRequiredWrapper.displayName = 'SessionRequiredWrapper'

export default SessionRequiredWrapper
