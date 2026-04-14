"use client"

import { type ReactNode, useEffect, useRef, useState } from "react"

type CustomSelectProps = {
  value: string
  options: string[]
  placeholder?: string
  onChange: (value: string) => void
  onOpenChange?: (open: boolean) => void
  className?: string
  id?: string
  /** When provided, options and selected value are rendered with this (e.g. flag + name). */
  renderOption?: (value: string) => ReactNode
}

export function CustomSelect({
  value,
  options,
  placeholder = "— Select —",
  onChange,
  onOpenChange,
  className = "",
  id,
  renderOption,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const setOpenWithCallback = (next: boolean) => {
    setOpen(next)
    onOpenChange?.(next)
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenWithCallback(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  const isPlaceholder = !value
  const displayContent: ReactNode = isPlaceholder
    ? placeholder
    : renderOption
      ? renderOption(value)
      : value

  return (
    <div ref={ref} className={`relative min-w-0 flex-1 ${className}`} id={id}>
      <button
        type="button"
        onClick={() => setOpenWithCallback(!open)}
        className={`w-full rounded-xl border border-cyan-500/25 bg-slate-900/80 px-4 py-2.5 text-left text-sm font-medium shadow-sm transition-shadow focus:ring-2 focus:ring-wc-gold/40 focus:border-wc-gold focus:outline-none ${
          isPlaceholder ? "text-slate-500" : "text-slate-100"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={id ? `${id}-label` : undefined}
      >
        <span className="block truncate pr-8 min-h-[1.25rem] flex items-center">{displayContent}</span>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      {open && (
        <ul
          className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-white/15 bg-slate-900 py-1 shadow-xl shadow-black/50 ring-1 ring-white/10"
          role="listbox"
        >
          <li>
            <button
              type="button"
              role="option"
              onClick={() => {
                onChange("")
                setOpenWithCallback(false)
              }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                !value ? "bg-amber-500/20 text-amber-100 font-medium" : "text-slate-300 hover:bg-white/10"
              }`}
            >
              {placeholder}
            </button>
          </li>
          {options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                role="option"
                onClick={() => {
                  onChange(opt)
                  setOpenWithCallback(false)
                }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center ${
                  value === opt
                    ? "bg-emerald-600/30 text-emerald-100 font-medium"
                    : "text-slate-100 hover:bg-amber-500/15 hover:text-amber-50"
                }`}
              >
                {renderOption ? renderOption(opt) : opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
