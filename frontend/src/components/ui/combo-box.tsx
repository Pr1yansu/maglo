'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import Image from '@/components/ui/image'

export function Combobox({
  data,
  name,
}: {
  data: { label: string; value: string; image?: string }[]
  name?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? (
            <div className="flex items-center gap-2">
              <Image
                src={
                  data.find((framework) => framework.value === value)?.image ||
                  'https://placehold.co/600x400'
                }
                alt={
                  data.find((framework) => framework.value === value)?.label ||
                  'https://placehold.co/600x400'
                }
                width={20}
                height={20}
                className="inline-block mr-2 rounded-full w-5 h-5 object-cover"
              />
              <p className="font-medium">
                {data.find((framework) => framework.value === value)?.label}
              </p>
            </div>
          ) : (
            `Select ${name}...`
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${name}...`} className="h-9" />
          <CommandList>
            <CommandEmpty>No {name} found.</CommandEmpty>
            <CommandGroup>
              {data.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  <Image
                    src={framework.image || 'https://placehold.co/600x400'}
                    alt={framework.label}
                    width={20}
                    height={20}
                    className="inline-block mr-2 rounded-full w-5 h-5 object-cover"
                  />
                  <p className="font-medium">{framework.label}</p>
                  <Check
                    className={cn(
                      'ml-auto',
                      value === framework.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
