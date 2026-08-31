import { useUnitStore } from '../../store/useUnitStore'
import './UnitSwitcher.css'

function UnitSwitcher({ unidades, compact = false }) {
  const { unitSlug, setUnit } = useUnitStore()

  if (!unidades || unidades.length === 0) return null

  return (
    <div className={`unit-switcher${compact ? ' unit-switcher--compact' : ''}`} role="tablist" aria-label="Selecionar unidade">
      {unidades.map((u) => (
        <button
          key={u.slug}
          role="tab"
          aria-selected={unitSlug === u.slug}
          className={`unit-switcher__btn${unitSlug === u.slug ? ' unit-switcher__btn--active' : ''}`}
          onClick={() => setUnit(u.slug)}
        >
          {u.nome}
        </button>
      ))}
    </div>
  )
}

export default UnitSwitcher
