"use client"

import * as React from "react"
import { format } from "date-fns"
import { nl } from "date-fns/locale"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateTimePickerProps {
  value?: Date
  onChange?: (date: Date) => void
  name?: string
  required?: boolean
  disabledTimes?: string[]
}

export function DateTimePicker({ value, onChange, name, required, disabledTimes }: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value)
  const [isOpen, setIsOpen] = React.useState(false)

  const openingHours = {
    1: { start: 13, end: 17 }, // Maandag
    2: { start: 10, end: 17 }, // Dinsdag
    3: { start: 12, end: 17 }, // Woensdag
    4: { start: 10, end: 17 }, // Donderdag
    5: { start: 10, end: 17 }, // Vrijdag
    6: { start: 9, end: 15 },  // Zaterdag
    0: null                    // Zondag (Gesloten)
  }

  // Generate 15-minute intervals based on selected day
  const timeOptions = React.useMemo(() => {
    if (!date) return []

    const day = date.getDay() as keyof typeof openingHours
    const hours = openingHours[day]

    if (!hours) return []

    const options = []
    for (let h = hours.start; h < hours.end; h++) {
      for (let m = 0; m < 60; m += 15) {
        options.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`)
      }
    }
    // Add the end time if it's on the hour (optional, but usually fine)
    options.push(`${hours.end.toString().padStart(2, '0')}:00`)
    return options
  }, [date])

  const handleSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const current = date || new Date()
      const day = newDate.getDay() as keyof typeof openingHours
      const hours = openingHours[day]

      if (!hours) return // Should not happen if Sunday is disabled

      // If switching to a date where the current selected hour is out of range, 
      // reset to the start hour
      let newHours = current.getHours()
      let newMinutes = current.getMinutes()

      if (newHours < hours.start || newHours > hours.end) {
        newHours = hours.start
        newMinutes = 0
      } else if (newHours === hours.end && newMinutes > 0) {
        newHours = hours.start
        newMinutes = 0
      }

      newDate.setHours(newHours)
      newDate.setMinutes(newMinutes)
      setDate(newDate)
      onChange?.(newDate)
    }
  }

  const handleTimeSelect = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number)
    const newDate = new Date(date || new Date())
    newDate.setHours(hours)
    newDate.setMinutes(minutes)
    
    // Auto close only if date has also been selected
    if (date) {
      setIsOpen(false)
    }
    
    setDate(newDate)
    onChange?.(newDate)
  }

  return (
    <>
      <input 
        type="hidden" 
        name={name} 
        value={date ? format(date, "yyyy-MM-dd'T'HH:mm") : ''} 
        required={required}
      />
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-bold bg-gray-50 border-gray-100 hover:bg-white focus:ring-2 focus:ring-brand-primary/20",
              !date && "text-gray-400"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "d MMMM yyyy, HH:mm", { locale: nl }) : <span>Kies een datum & tijd...</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex flex-col sm:flex-row shadow-xl border-gray-100 rounded-2xl overflow-hidden" align="start">
          <div className="bg-white">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              locale={nl}
              disabled={(day) => day.getDay() === 0}
              initialFocus
            />
          </div>
          <div className="w-full sm:w-48 border-t sm:border-t-0 sm:border-l border-gray-100 bg-gray-50 p-4 max-h-[352px] flex flex-col">
            <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-900 border-b border-gray-200 pb-2">
              <Clock className="w-4 h-4 text-brand-primary" />
              Tijdstip
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
              {!date ? (
                <div className="text-[10px] text-gray-400 font-medium italic py-4">
                  Kies eerst een datum
                </div>
              ) : timeOptions.length === 0 ? (
                <div className="text-[10px] text-red-400 font-bold py-4">
                  Gesloten op deze dag
                </div>
              ) : (
                timeOptions.map((time) => {
                  const isSelected = date && format(date, "HH:mm") === time
                  const isDisabled = disabledTimes?.includes(time)
                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => handleTimeSelect(time)}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm rounded-lg transition-all font-medium flex items-center justify-between",
                        isSelected 
                          ? "bg-brand-primary text-white font-bold shadow-md shadow-brand-primary/20" 
                          : isDisabled
                            ? "text-gray-400 bg-gray-50 cursor-not-allowed opacity-70 border border-gray-100"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <span className={isDisabled ? "line-through" : ""}>{time}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                      {isDisabled && <span className="text-[10px] uppercase tracking-wider font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Bezet</span>}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}
