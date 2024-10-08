'use client'

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
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAppSession } from '@/hooks'
import { MODULE_ADDRESS } from '@/utils/constants'
import { Args, Transaction } from '@roochnetwork/rooch-sdk'
import { useRoochClient } from '@roochnetwork/rooch-sdk-kit'
import { PropsWithChildren, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

interface FieldValues {
  deckName: string
  deckDesc: string
}

interface Props {
  onCreated: () => void
}

export function AddDeckDialog({ children, onCreated }: PropsWithChildren<Props>) {
  const form = useForm<FieldValues>({
    defaultValues: {
      deckName: '',
      deckDesc: '',
    },
  })
  const client = useRoochClient()
  const { sessionKey } = useAppSession()

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open])

  const onSubmit: SubmitHandler<FieldValues> = async (formValues) => {
    const tx = new Transaction()
    tx.callFunction({
      target: `${MODULE_ADDRESS}::deck::create_deck_entry`,
      args: [Args.string(formValues.deckName), Args.string(formValues.deckDesc)],
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
                      <Textarea {...field} className="col-span-3" />
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
