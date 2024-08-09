import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { PropsWithChildren, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Args, Transaction } from '@roochnetwork/rooch-sdk'
import { MODULE_ADDRESS } from '@/utils/constants'
import { useRoochClient } from '@roochnetwork/rooch-sdk-kit'
import { useAppSession } from '@/hooks'

interface FieldValues {
  cardFront: string
  cardBack: string
}

interface Props {
  deckId: string
  onCreated: () => void
}

export function AddCardDialog({ children, deckId, onCreated }: PropsWithChildren<Props>) {
  const form = useForm<FieldValues>({
    defaultValues: {
      cardFront: '',
      cardBack: '',
    },
  })
  const client = useRoochClient()
  const { sessionKey } = useAppSession()

  const [open, setOpen] = useState(false)
  const [continuousCreation, setContinuousCreation] = useState(false)

  const onSubmit: SubmitHandler<FieldValues> = async (formValues) => {
    const tx = new Transaction()
    tx.callFunction({
      target: `${MODULE_ADDRESS}::deck::add_card_entry`,
      args: [
        Args.objectId(deckId),
        Args.string(formValues.cardFront),
        Args.string(formValues.cardBack),
      ],
    })
    const result = await client.signAndExecuteTransaction({
      transaction: tx,
      signer: sessionKey!,
    })

    if (result.execution_info.status.type !== 'executed') {
      alert('Transaction failed')
      return
    }

    onCreated()
    if (!continuousCreation) {
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add Card</DialogTitle>
              <DialogDescription>Add a new study card to the selected Deck.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                name="cardFront"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Front</FormLabel>
                    <FormControl>
                      <Input {...field} className="col-span-3" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="cardBack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Back</FormLabel>
                    <FormControl>
                      <Input {...field} className="col-span-3" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <div className="flex items-center justify-between w-full">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={continuousCreation}
                    onChange={(e) => setContinuousCreation(e.target.checked)}
                  />
                  <span>Continuous creation</span>
                </label>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Create
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
