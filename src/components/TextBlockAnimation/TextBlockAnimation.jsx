import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'

// Registro dos plugins (SplitText e ScrollTrigger são gratuitos desde que a
// GreenSock foi adquirida pela Webflow — não precisam mais de licença Club).
gsap.registerPlugin(SplitText, ScrollTrigger)

/**
 * Efeito de "revelar" texto linha a linha com um bloco colorido passando por
 * cima, como um pincel de destaque. Adaptado do componente original em TSX
 * (projeto shadcn/Next.js) para este projeto, que usa Vite + JS + CSS puro
 * — por isso não há tipos TypeScript nem a função `cn` do Tailwind (o
 * original importava `cn` mas nunca chegava a usá-la).
 *
 * Uso:
 *   <TextBlockAnimation blockColor="var(--color-wine)">
 *     <h2>Um bar de bairro com alma de cozinha de casa</h2>
 *   </TextBlockAnimation>
 */
export default function TextBlockAnimation({
  children,
  animateOnScroll = true,
  delay = 0,
  blockColor = '#000',
  stagger = 0.1,
  duration = 0.6,
}) {
  const containerRef = useRef(null)

  useGSAP(
    () => {
      if (!containerRef.current) return

      const split = new SplitText(containerRef.current, {
        type: 'lines',
        linesClass: 'block-line-parent',
      })

      const lines = split.lines
      const blocks = []

      lines.forEach((line) => {
        const wrapper = document.createElement('div')
        wrapper.style.position = 'relative'
        wrapper.style.display = 'block'
        wrapper.style.overflow = 'hidden'

        const block = document.createElement('div')
        block.style.position = 'absolute'
        block.style.top = '0'
        block.style.left = '0'
        block.style.width = '100%'
        block.style.height = '100%'
        block.style.backgroundColor = blockColor
        block.style.zIndex = '2'
        block.style.transform = 'scaleX(0)'
        block.style.transformOrigin = 'left center'

        line.parentNode.insertBefore(wrapper, line)
        wrapper.appendChild(line)
        wrapper.appendChild(block)

        gsap.set(line, { opacity: 0 })

        blocks.push(block)
      })

      const tl = gsap.timeline({
        defaults: { ease: 'expo.inOut' },
        scrollTrigger: animateOnScroll
          ? {
              trigger: containerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            }
          : null,
        delay,
      })

      tl.to(blocks, {
        scaleX: 1,
        duration,
        stagger,
        transformOrigin: 'left center',
      })
        .set(
          lines,
          {
            opacity: 1,
            stagger,
          },
          `<${duration / 2}`
        )
        .to(
          blocks,
          {
            scaleX: 0,
            duration,
            stagger,
            transformOrigin: 'right center',
          },
          `<${duration * 0.4}`
        )

      return () => {
        split.revert()
      }
    },
    {
      scope: containerRef,
      dependencies: [animateOnScroll, delay, blockColor, stagger, duration],
    }
  )

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {children}
    </div>
  )
}
