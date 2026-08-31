import './BranchDivider.css'

/**
 * Divisor de seção em forma de galho com bagas — o elemento-assinatura do site,
 * referência direta à árvore que dá nome à casa (tarumã: árvore nativa do
 * cerrado, de bagas roxas). Substitui divisores genéricos (linhas, numeração).
 */
function BranchDivider({ flip = false }) {
  return (
    <div className={`branch-divider${flip ? ' branch-divider--flip' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 400 60" preserveAspectRatio="none">
        <path
          className="branch-divider__stem"
          d="M0 30 C 80 30, 120 10, 200 30 C 280 50, 320 30, 400 30"
        />
        <circle className="branch-divider__berry" cx="90" cy="21" r="4" />
        <circle className="branch-divider__berry branch-divider__berry--brass" cx="200" cy="30" r="5" />
        <circle className="branch-divider__berry" cx="310" cy="37" r="4" />
      </svg>
    </div>
  )
}

export default BranchDivider
