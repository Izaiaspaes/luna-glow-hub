import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  date,
  onDateChange,
  disabled,
  placeholder = "Selecione a data",
  className,
}: DatePickerProps) {
  const [inputValue, setInputValue] = React.useState(
    date ? format(date, "dd/MM/yyyy") : ""
  );
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (date) {
      setInputValue(format(date, "dd/MM/yyyy"));
    }
  }, [date]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Try to parse the date as the user types
    // Accept formats: dd/MM/yyyy, dd-MM-yyyy, dd.MM.yyyy
    const cleanValue = value.replace(/[.\-]/g, "/");
    
    if (cleanValue.length === 10) {
      const parsedDate = parse(cleanValue, "dd/MM/yyyy", new Date());
      
      if (isValid(parsedDate)) {
        // Check if date passes the disabled check
        if (!disabled || !disabled(parsedDate)) {
          onDateChange?.(parsedDate);
        }
      }
    }
  };

  const handleInputBlur = () => {
    // If input is invalid on blur, reset to current date or empty
    if (inputValue) {
      const cleanValue = inputValue.replace(/[.\-]/g, "/");
      const parsedDate = parse(cleanValue, "dd/MM/yyyy", new Date());
      
      if (!isValid(parsedDate)) {
        setInputValue(date ? format(date, "dd/MM/yyyy") : "");
      }
    }
  };

  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    onDateChange?.(selectedDate);
    if (selectedDate) {
      setInputValue(format(selectedDate, "dd/MM/yyyy"));
    }
    setOpen(false);
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        placeholder="dd/mm/aaaa"
        className="flex-1"
        maxLength={10}
        inputMode="numeric"
        pattern="[0-3][0-9]/[0-1][0-9]/[0-9]{4}"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-center",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="p-3 border-b">
            <p className="text-sm text-muted-foreground">
              {date ? format(date, "PPP", { locale: ptBR }) : placeholder}
            </p>
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleCalendarSelect}
            disabled={disabled}
            defaultMonth={date || new Date(2000, 0)}
            captionLayout="dropdown-buttons"
            fromYear={1900}
            toYear={new Date().getFullYear()}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}