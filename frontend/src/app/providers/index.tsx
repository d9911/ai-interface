import { ReactNode } from 'react'
import { ThemeProvider } from '@/shared/context/theme-context'
import { LangProvider } from '@/shared/context/lang-context'

interface Props {
  children: ReactNode
}

export const Providers = ({ children }: Props) => {
  return (
    <ThemeProvider>
      <LangProvider>{children}</LangProvider>
    </ThemeProvider>
  )
}
