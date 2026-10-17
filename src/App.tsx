import Ocean from './Ocean'
import mascot from '../assets/brand/kuruttina-v1.webp'
import kanji from '../assets/brand/kanji-v1.svg'

function Arrow({ down = false }: { down?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" className={down ? 'arrow-down' : ''}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
}
function Github() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.81c.85 0 1.71.11 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>
}

export default function App() {
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
      <section id="inicio" className="hero" aria-label="Kurutta: apresentação visual">
        <div className="stage">
          <div className="figure-scene">
            <img className="hero-kanji" src={kanji} alt="" aria-hidden="true" />
            <img className="mascot" src={mascot} alt="Personagem de cabelos prateados, sentada de frente e segurando um coelho de pelúcia." fetchPriority="high" />
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
