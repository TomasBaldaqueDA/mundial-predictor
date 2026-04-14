/** Monday 00:00 local time of the calendar week containing `d` (week starts Monday). */
export function startOfMondayWeek(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const day = (x.getDay() + 6) % 7
  x.setDate(x.getDate() - day)
  x.setHours(0, 0, 0, 0)
  return x
}

export function sameMondayWeek(a: Date, b: Date): boolean {
  return startOfMondayWeek(a).getTime() === startOfMondayWeek(b).getTime()
}
