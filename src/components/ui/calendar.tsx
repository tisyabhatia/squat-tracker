import * as React from "react"
import { cn } from "../../lib/utils"

interface CalendarProps {
  mode?: "single" | "multiple"
  selected?: Date | Date[]
  onSelect?: (dates: Date | Date[] | undefined) => void
  className?: string
}

const Calendar: React.FC<CalendarProps> = ({
  mode = "single",
  selected,
  onSelect,
  className
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return { firstDay, daysInMonth }
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear()
  }

  const isSelected = (date: Date) => {
    if (!selected) return false
    if (mode === "single" && selected instanceof Date) {
      return isSameDay(date, selected)
    }
    if (mode === "multiple" && Array.isArray(selected)) {
      return selected.some(d => isSameDay(d, date))
    }
    return false
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)

    if (mode === "single") {
      onSelect?.(clickedDate)
    } else if (mode === "multiple") {
      const selectedDates = Array.isArray(selected) ? selected : []
      const index = selectedDates.findIndex(d => isSameDay(d, clickedDate))

      if (index > -1) {
        onSelect?.(selectedDates.filter((_, i) => i !== index))
      } else {
        onSelect?.([...selectedDates, clickedDate])
      }
    }
  }

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth)
  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="p-2" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const selected = isSelected(date)

    days.push(
      <button
        key={day}
        type="button"
        onClick={() => handleDateClick(day)}
        className={cn(
          "p-2 text-sm rounded-md hover:bg-accent transition-colors",
          selected && "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
      >
        {day}
      </button>
    )
  }

  return (
    <div className={cn("p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="p-2 hover:bg-accent rounded-md"
        >
          ←
        </button>
        <div className="font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <button
          type="button"
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="p-2 hover:bg-accent rounded-md"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  )
}

export { Calendar }
