"use client";

import { useState, useRef, useEffect } from "react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  startOfWeek, 
  endOfWeek,
  parseISO
} from "date-fns";
import { fr } from "date-fns/locale";

interface CustomDatePickerProps {
  name?: string;
  defaultValue?: string | Date;
  placeholder?: string;
  onChange?: (date: Date) => void;
  required?: boolean;
}

export default function CustomDatePicker({
  name,
  defaultValue,
  placeholder = "Sélectionner une date",
  onChange,
  required
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (defaultValue) return typeof defaultValue === 'string' ? parseISO(defaultValue) : defaultValue;
    return new Date();
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    if (defaultValue) return typeof defaultValue === 'string' ? parseISO(defaultValue) : defaultValue;
    return null;
  });

  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const onDateClick = (day: Date) => {
    setSelectedDate(day);
    setIsOpen(false);
    if (onChange) onChange(day);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4 px-2 pt-2">
        <button 
          type="button"
          onClick={prevMonth}
          className="w-8 h-8 rounded-full bg-orange-200 text-orange-600 flex items-center justify-center hover:bg-orange-300 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>
        <div className="font-bold text-gray-900 uppercase tracking-wider text-sm">
          {format(currentMonth, "MMMM yyyy", { locale: fr })}
        </div>
        <button 
          type="button"
          onClick={nextMonth}
          className="w-8 h-8 rounded-full bg-orange-200 text-orange-600 flex items-center justify-center hover:bg-orange-300 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    const shortDays = ["L", "M", "M", "J", "V", "S", "D"];

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-bold text-orange-500 text-sm py-2">
          {shortDays[i]}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;

        days.push(
          <div
            key={day.toString()}
            className="flex items-center justify-center h-10"
          >
            <button
              type="button"
              onClick={() => onDateClick(cloneDay)}
              className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm transition-colors
                ${!isCurrentMonth ? "text-gray-300 hover:text-gray-500" : ""}
                ${isCurrentMonth && !isSelected ? "text-gray-700 hover:bg-gray-100" : ""}
                ${isSelected ? "bg-orange-400 text-black font-bold shadow-md" : ""}
              `}
            >
              {formattedDate}
            </button>
          </div>
        );
        day = new Date(day.getTime() + 24 * 60 * 60 * 1000); // add 1 day
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  // Format value for hidden input (YYYY-MM-DD for standard html date input compatibility)
  const inputValue = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  // Format for display
  const displayValue = selectedDate ? format(selectedDate, "dd MMMM yyyy", { locale: fr }) : placeholder;

  return (
    <div className="relative w-full" ref={calendarRef}>
      {name && <input type="hidden" name={name} value={inputValue} required={required} />}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-900 rounded-lg text-sm font-medium hover:bg-gray-50 focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
      >
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-gray-500">
            calendar_today
          </span>
          <span className={selectedDate ? "text-gray-900" : "text-gray-500"}>
            {displayValue}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-white border border-gray-900 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] w-[320px] left-0">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>
      )}
    </div>
  );
}
