export type Translator = (key: string, named?: Record<string, unknown>) => string

export type ListFormatter = (values: string[]) => string
