import Ocean from './Ocean'
import { useEffect, useRef } from 'react'
import mascot from '../assets/brand/hero-figure-v1.webp'
import kanji from '../assets/brand/kanji-v1.svg'

function Arrow({ down = false }: { down?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" className={down ? 'arrow-down' : ''}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
}
function Github() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.81c.85 0 1.71.11 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>
}

export default function App() {
  const hero = useRef<HTMLElement>(null)
  useEffect(() => {
    const element = hero.current!
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    let x=0, y=0, tx=0, ty=0, frame=0, previous=0, visible=true
    const move = (e: PointerEvent) => {
      const box=element.getBoundingClientRect()
      tx=(e.clientX-box.left)/box.width*2-1; ty=(e.clientY-box.top)/box.height*2-1
    }
    const leave = () => { tx=0; ty=0 }
    const scroll = () => {
      const box=element.getBoundingClientRect()
      const progress=motion.matches ? 0 : Math.max(0,Math.min(1,(76-box.top)/(box.height*.65)))
      element.style.setProperty('--sink',`${progress*220}px`)
      element.style.setProperty('--rise',`${-progress*100}px`)
      element.style.setProperty('--kanji-opacity',String(1-progress))
    }
    const tick = (now: number) => {
      const ease=1-Math.exp(-Math.min(now-previous || 16,64)/110); previous=now
      x+=(tx-x)*ease; y+=(ty-y)*ease
      element.style.setProperty('--mx', `${x}px`); element.style.setProperty('--my', `${y}px`)
      frame=requestAnimationFrame(tick)
    }
    const start = () => {
      cancelAnimationFrame(frame); previous=0
      scroll()
      element.dataset.paused=String(document.hidden || !visible)
      if (motion.matches) { x=0; y=0; element.style.setProperty('--mx','0px'); element.style.setProperty('--my','0px') }
      else if (!document.hidden && visible) frame=requestAnimationFrame(tick)
    }
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;start()})
    observer.observe(element)
    element.addEventListener('pointermove',move); element.addEventListener('pointerleave',leave)
    window.addEventListener('scroll',scroll,{passive:true}); window.addEventListener('resize',scroll)
    document.addEventListener('visibilitychange',start); motion.addEventListener('change',start); start()
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('scroll',scroll); window.removeEventListener('resize',scroll); element.removeEventListener('pointermove',move); element.removeEventListener('pointerleave',leave); document.removeEventListener('visibilitychange',start); motion.removeEventListener('change',start) }
  }, [])
  return <>
    <a className="skip-link" href="#sobre">Ir para o conteúdo</a>
    <header className="header">
      <a className="brand" href="#inicio" aria-label="Kurutta, início"><img src={kanji} alt="" /><span>Kurutta</span></a>
      <nav aria-label="Navegação principal">
        <a href="#sobre">Sobre</a><a href="#projetos">Projetos</a><a href="#contato">Contato</a>
        <a className="github-link" href="https://github.com/AthosMontarroyos/KuruttaWebsite" target="_blank" rel="noreferrer" aria-label="Código do Kurutta no GitHub"><Github /></a>
      </nav>
    </header>
    <main>
      <section ref={hero} id="inicio" className="hero" aria-label="Kurutta: apresentação visual">
        <div className="stage">
          <div className="figure-scene">
            <img className="hero-kanji" src={kanji} alt="" aria-hidden="true" />
            <div className="mascot-clip"><img className="mascot" src={mascot} alt="Personagem de cabelos escuros, sentada, com uma espada apoiada no ombro." fetchPriority="high" /></div>
          </div>
          <Ocean />
        </div>
        <a className="scroll-cue" href="#sobre" aria-label="Rolar para conhecer o Kurutta"><Arrow down /></a>
      </section>
      <section id="sobre" className="about section">
        <h1>Kurutta.</h1>
        <div className="about-copy"><p className="lead">Desenvolvimento com identidade.</p><p>Um projeto de desenvolvimento web que reúne uma interface minimalista, uma identidade própria e movimento feito em código.</p><p>Preto, branco e o essencial. O contraste define a composição; a interação dá vida a ela.</p></div>
      </section>
      <section id="projetos" className="projects section">
        <h2>Projetos</h2>
        <a className="project" href="https://github.com/AthosMontarroyos/KuruttaWebsite" target="_blank" rel="noreferrer"><div><h3>Kurutta Website</h3><p>Interface e animação para a web.</p><span className="stack">React / TypeScript / Vite</span></div><Arrow /></a>
      </section>
      <footer id="contato" className="section footer"><div><h2>Vamos conversar.</h2><a href="https://github.com/AthosMontarroyos" target="_blank" rel="noreferrer">Encontre no GitHub <Arrow /></a></div><a className="back-top" href="#inicio">Voltar ao início ↑</a></footer>
    </main>
  </>
}
