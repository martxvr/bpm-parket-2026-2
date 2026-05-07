'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
const MONTHS = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

interface DatePickerProps {
  value: Date | null;
  onChange: (d: Date) => void;
  variant?: 'dark' | 'light';
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, variant = 'dark' }) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => value ?? new Date());
  const [pickedDate, setPickedDate] = useState<Date | null>(value);
  const [pickedTime, setPickedTime] = useState<string | null>(
    value ? `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}` : null
  );
  const [dropdownStyle, setDropdownStyle] = useState<{ top?: number; bottom?: number; left: number; width: number; maxHeight: number }>({ left: 0, width: 0, maxHeight: 400 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    const handleScroll = () => setOpen(false);
    document.addEventListener('mousedown', handleClick);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const openPicker = () => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - r.bottom - 8;
      const spaceAbove = r.top - 8;
      if (spaceAbove > spaceBelow) {
        const maxHeight = Math.min(spaceAbove, window.innerHeight * 0.8);
        setDropdownStyle({ bottom: window.innerHeight - r.top + 8, left: r.left, width: r.width, maxHeight });
      } else {
        const maxHeight = Math.min(spaceBelow, window.innerHeight * 0.8);
        setDropdownStyle({ top: r.bottom + 8, left: r.left, width: r.width, maxHeight });
      }
    }
    setOpen(o => !o);
  };

  const firstDay = new Date(view.getFullYear(), view.getMonth(), 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const today = new Date();

  const prevMonth = () => setView(v => new Date(v.getFullYear(), v.getMonth() - 1, 1));
  const nextMonth = () => setView(v => new Date(v.getFullYear(), v.getMonth() + 1, 1));

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isSelectedDay = (d: number) =>
    pickedDate?.getFullYear() === view.getFullYear() &&
    pickedDate?.getMonth() === view.getMonth() &&
    pickedDate?.getDate() === d;

  const isToday = (d: number) =>
    today.getFullYear() === view.getFullYear() &&
    today.getMonth() === view.getMonth() &&
    today.getDate() === d;

  const isPast = (d: number) => {
    const date = new Date(view.getFullYear(), view.getMonth(), d);
    date.setHours(0, 0, 0, 0);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return date < t;
  };

  const selectDay = (day: number) => {
    setPickedDate(new Date(view.getFullYear(), view.getMonth(), day));
    setPickedTime(null);
  };

  const selectTime = (time: string) => {
    if (!pickedDate) return;
    const [h, m] = time.split(':').map(Number);
    const d = new Date(pickedDate);
    d.setHours(h, m, 0, 0);
    setPickedTime(time);
    onChange(d);
    setOpen(false);
  };

  const label = pickedDate
    ? pickedDate.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'long' }) +
      (pickedTime ? ` — ${pickedTime}` : '')
    : 'Kies een datum & tijd';

  const isDark = variant === 'dark';

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={openPicker}
        className={`w-full p-4 rounded-xl text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)]/50 transition-all border ${
          isDark
            ? 'bg-white/5 border-white/10'
            : 'bg-white border-gray-200'
        }`}
      >
        <span className={
          (pickedDate && pickedTime)
            ? isDark ? 'text-white' : 'text-[var(--color-brand-dark)]'
            : isDark ? 'text-white/50' : 'text-gray-400'
        }>
          {label}
        </span>
        <Calendar className={`h-4 w-4 flex-shrink-0 ${isDark ? 'text-white/40' : 'text-gray-400'}`} />
      </button>

      {mounted && open && createPortal(
        <div
          ref={dropdownRef}
          className="fixed bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 shadow-2xl z-[9998] overflow-y-auto"
          style={{ top: dropdownStyle.top, bottom: dropdownStyle.bottom, left: dropdownStyle.left, width: dropdownStyle.width, maxHeight: dropdownStyle.maxHeight }}
        >
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-white">
              {MONTHS[view.getMonth()]} {view.getFullYear()}
            </span>
            <button type="button" onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <span key={d} className="text-center text-[10px] font-bold text-white/30 uppercase tracking-wider py-1">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const past = isPast(day);
              return (
                <button
                  key={i}
                  type="button"
                  disabled={past}
                  onClick={() => selectDay(day)}
                  className={`
                    h-8 w-full rounded-lg text-sm font-medium transition-colors
                    ${past ? 'text-white/20 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'}
                    ${isSelectedDay(day) ? 'bg-[var(--color-brand-red)] text-white hover:bg-[var(--color-brand-red)]' : ''}
                    ${isToday(day) && !isSelectedDay(day) ? 'text-[var(--color-brand-red-light)] font-bold' : 'text-white/80'}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {pickedDate && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-3">Kies een tijd</p>
              <div className="grid grid-cols-4 gap-1.5">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => selectTime(slot)}
                    className={`
                      py-2 rounded-lg text-xs font-semibold transition-colors
                      ${pickedTime === slot ? 'bg-[var(--color-brand-red)] text-white' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}
                    `}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default DatePicker;
