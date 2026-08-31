import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Store global da unidade selecionada (Sudoeste / Gama). Persistido no
// localStorage — quem visita de novo mantém a unidade escolhida.
export const useUnitStore = create(
  persist(
    (set) => ({
      unitSlug: 'sudoeste',
      setUnit: (slug) => set({ unitSlug: slug }),
    }),
    { name: 'taruma-unidade-selecionada' }
  )
)
