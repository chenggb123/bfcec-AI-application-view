'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { zh } from './zh'
import { en } from './en'

type Lang = 'zh' | 'en'

interface I18nContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
  isZh: boolean
}

const maps: Record<Lang, Record<string, string>> = { zh, en }

const I18nContext = createContext<I18nContextType>({
  lang: 'zh',
  setLang: () => {},
  t: (key: string) => key,
  isZh: true,
})

export function I18nProvider({ children, initialLang = 'zh' }: { children: ReactNode; initialLang?: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  const t = useCallback(
    (key: string) => {
      return maps[lang][key] ?? key
    },
    [lang]
  )

  const isZh = lang === 'zh'

  return (
    <I18nContext.Provider value={{ lang, setLang, t, isZh }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
