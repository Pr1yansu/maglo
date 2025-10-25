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

interface ComboboxOption {
  label: string
  value: string
  image?: string
}

interface ComboboxProps {
  data: ComboboxOption[]
  name?: string
  className?: string
  onChange?: (value: string | null) => void
  value?: string | null
}

export const Combobox: React.FC<ComboboxProps> = ({
  data,
  name,
  className,
  onChange,
  value: controlledValue,
}) => {
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState('')

  // If parent passes a controlled value, use that
  const value = controlledValue ?? internalValue

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? '' : currentValue
    setInternalValue(newValue)
    onChange?.(newValue || null)
    setOpen(false)
  }

  const selected = data.find((item) => item.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          {selected ? (
            <div className="flex items-center gap-2">
              <Image
                src={selected.image || 'https://placehold.co/600x400'}
                alt={selected.label}
                width={20}
                height={20}
                className="inline-block mr-2 rounded-full w-5 h-5 object-cover"
              />
              <p className="font-medium">{selected.label}</p>
            </div>
          ) : (
            `${name}...`
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
              {data.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Image
                    src={option.image || 'https://placehold.co/600x400'}
                    alt={option.label}
                    width={20}
                    height={20}
                    className="inline-block mr-2 rounded-full w-5 h-5 object-cover"
                  />
                  <p className="font-medium">{option.label}</p>
                  <Check
                    className={cn(
                      'ml-auto',
                      value === option.value ? 'opacity-100' : 'opacity-0'
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
