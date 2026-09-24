export type ListStyle = 'long' | 'short' | 'narrow'
export type ListType = 'conjunction' | 'disjunction' | 'unit'

export function createListFormatter(
  locale: string,
  type: ListType = 'conjunction',
  style: ListStyle = 'long',
): (values: string[]) => string {
  const formatter = new Intl.ListFormat(locale, { type, style })

  return (values: string[]): string => formatter.format(values)
}
