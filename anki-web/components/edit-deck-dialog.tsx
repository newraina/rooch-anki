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
import { useCurrentWallet, useRoochClient } from '@roochnetwork/rooch-sdk-kit'
import { useAppSession } from '@/hooks'

interface FieldValues {
  deckName: string
  deckDesc: string
}

interface Props {
  onCreated: () => void
}

export function EditDeckDialog({ children, onCreated }: PropsWithChildren<Props>) {
  const form = useForm<FieldValues>()
  const currentWallet = useCurrentWallet()
  const client = useRoochClient()
  const { sessionKey } = useAppSession()

  const [open, setOpen] = useState(false)

  const onSubmit: SubmitHandler<FieldValues> = async (formValues) => {
    const tx = new Transaction()
    tx.callFunction({
      target: `${MODULE_ADDRESS}::deck::create_deck_entry`,
      args: [Args.string(formValues.deckName)],
    })
    const result = await client.signAndExecuteTransaction({
      transaction: tx,
      signer: sessionKey!,
    })

    console.log(result)

    if (result.execution_info.status.type !== 'executed') {
      alert('Transaction failed')
      return
    }

    await onCreated()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add Deck</DialogTitle>
              <DialogDescription>Create a new Deck to organize your study cards.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                name="deckName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="col-span-3" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="deckDesc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} className="col-span-3" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
