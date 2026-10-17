import studySheet from "./assets/brand/logo/kanji-estudo-v4.webp"
import mark16Black from "./assets/brand/logo/kanji-v4-16-black.png"
import mark16White from "./assets/brand/logo/kanji-v4-16-white.png"
import mark32Black from "./assets/brand/logo/kanji-v4-32-black.png"
import mark32White from "./assets/brand/logo/kanji-v4-32-white.png"
import mark from "./assets/brand/logo/kanji-v4.webp"

const swatches = [
  { name: "Preto", value: "#000000", className: "bg-black" },
  { name: "Cinza 700", value: "#525252", className: "bg-gray-700" },
  { name: "Cinza 500", value: "#8A8A8A", className: "bg-gray-500" },
  { name: "Cinza 300", value: "#D6D6D6", className: "bg-gray-300" },
  { name: "Branco", value: "#FFFFFF", className: "bg-white" },
]

const avoided = [
  "Cyberpunk",
  "Glitch RGB",
  "Neon",
  "Kanji aleatório",
  "UI poluída",
  "Visual gamer genérico",
  "Visual anime genérico",
]

const openItems = [
  "Vetorização manual do 狂, com poucos nós. Traço automático não é versão final.",
  "Família sans do corpo. A decisão não bloqueia a implementação.",
  "Licença comercial da Youth Shandey. As fontes públicas discordam, e a cobertura listada não inclui kanji.",
  "Imagem base da Kuruttina e o recorte da personagem.",
  "Reflexo do hero: a mascote ou somente o 狂.",
  "Campo estático de pontos no céu, decidido só depois de um teste visual.",
  "Organização da marca no GitHub, quando existirem dois ou mais repositórios.",
  "Carta e flores como elementos secundários. Os dois já estão fora do logotipo.",
]

type Polarity = {
  src: string
  label: string
  detail: string
  field: "black" | "white"
  width: number
  height: number
}

const samples: Polarity[] = [
  {
    src: mark32Black,
    label: "32 px, preto sobre branco",
    detail: "Redução direta do raster v4.",
    field: "white",
    width: 34,
    height: 32,
  },
  {
    src: mark32White,
    label: "32 px, branco sobre preto",
    detail: "O vão do fragmento continua visível.",
    field: "black",
    width: 34,
    height: 32,
  },
  {
    src: mark16Black,
    label: "16 px, preto sobre branco",
    detail: "Derivação: traço sólido, sem o fragmento.",
    field: "white",
    width: 17,
    height: 16,
  },
  {
    src: mark16White,
    label: "16 px, branco sobre preto",
    detail: "Os detalhes finos da redução direta fecham.",
    field: "black",
    width: 17,
    height: 16,
  },
]

function Eyebrow({ children, tone = "mute" }: { children: string; tone?: "mute" | "ink" }) {
  return (
    <p
      className={`text-[11px] tracking-[0.22em] uppercase ${tone === "ink" ? "text-gray-500" : "text-gray-700"}`}
    >
      {children}
    </p>
  )
}

function PolarityTest({ sample }: { sample: Polarity }) {
  const onBlack = sample.field === "black"
  const scale = sample.height === 32 ? 7 : 10

  return (
    <figure className={`flex min-w-0 flex-col justify-between p-5 ${onBlack ? "bg-black text-white" : "bg-white text-black"}`}>
      <figcaption>
        <p className="text-[11px] tracking-[0.18em] uppercase">{sample.label}</p>
        <p className={`mt-2 text-sm leading-relaxed ${onBlack ? "text-gray-300" : "text-gray-700"}`}>
          {sample.detail}
        </p>
      </figcaption>
      <div className="mt-10 flex min-w-0 items-end justify-between gap-4">
        <img
          src={sample.src}
          width={sample.width}
          height={sample.height}
          alt={sample.label}
          className="shrink-0"
        />
        <img
          src={sample.src}
          width={sample.width * scale}
          height={sample.height * scale}
          alt=""
          className="h-auto max-h-36 w-auto max-w-[62%]"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
    </figure>
  )
}

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-black">
      <header className="flex items-end justify-between border-b border-gray-300 px-5 py-4 sm:px-8">
        <p className="text-[11px] tracking-[0.28em]">KURUTTA</p>
        <p className="text-[11px] tracking-[0.22em] text-gray-700">BRAND</p>
      </header>

      <section className="grid border-b border-gray-300 lg:min-h-[88vh] lg:grid-cols-12">
        <div className="relative h-[58vw] max-h-[420px] overflow-hidden border-b border-gray-300 lg:col-span-7 lg:h-auto lg:max-h-none lg:border-r lg:border-b-0">
          <img
            src={mark}
            alt="狂"
            className="absolute top-1/2 left-[-14%] h-[128%] w-auto max-w-none -translate-y-1/2 lg:left-[-18%] lg:h-[118%]"
          />
        </div>
        <div className="flex flex-col justify-between gap-16 px-5 py-10 sm:px-8 lg:col-span-5 lg:px-10 lg:py-12">
          <Eyebrow>Documentação de marca</Eyebrow>
          <div>
            <h1 className="text-5xl font-normal tracking-tight sm:text-6xl">Kurutta</h1>
            <p className="mt-8 max-w-sm text-sm leading-relaxed">
              Minimalismo × Contraste × Japão × Ruptura
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-700">
              O símbolo é o kanji 狂. O nome fica ao lado, como texto, na mesma sans do corpo.
              A ruptura é uma por tela. O restante permanece numa grade rígida.
            </p>
          </div>
          <p className="text-[11px] tracking-[0.16em] text-gray-700 uppercase">
            brand.athosmontarroyos.com
          </p>
        </div>
      </section>

      <section className="grid border-b border-gray-700 bg-black text-white lg:grid-cols-3">
        <article className="border-b border-gray-700 px-5 py-10 sm:px-8 lg:border-r lg:border-b-0 lg:px-10">
          <Eyebrow tone="ink">Princípio</Eyebrow>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-gray-300">
            A ruptura pode quebrar alinhamento, proporção, simetria ou expectativa visual.
            Ela preserva legibilidade, hierarquia e entendimento.
          </p>
        </article>
        <article className="border-b border-gray-700 px-5 py-10 sm:px-8 lg:border-r lg:border-b-0 lg:px-10">
          <Eyebrow tone="ink">Fora da marca</Eyebrow>
          <ul className="mt-8 space-y-2 text-sm text-gray-300">
            {avoided.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="px-5 py-10 sm:px-8 lg:px-10">
          <Eyebrow tone="ink">Imagética</Eyebrow>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-gray-300">
            Preto, branco e cinzas, produzidos assim desde a origem. A mascote se chama
            Kuruttina. O símbolo principal continua sendo o 狂.
          </p>
        </article>
      </section>

      <section className="border-b border-gray-300 px-5 py-14 sm:px-8 lg:px-10">
        <Eyebrow>Paleta</Eyebrow>
        <h2 className="mt-6 text-3xl font-normal tracking-tight">Somente monocromático</h2>
        <ul className="mt-10 grid grid-cols-2 gap-px border border-gray-300 bg-gray-300 sm:grid-cols-5">
          {swatches.map((swatch) => (
            <li key={swatch.name} className="bg-white p-4">
              <div className={`h-24 border border-gray-300 ${swatch.className}`} />
              <p className="mt-4 text-sm">{swatch.name}</p>
              <p className="mt-1 text-[11px] tracking-[0.14em] text-gray-700">{swatch.value}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid border-b border-gray-300 lg:grid-cols-12">
        <div className="border-b border-gray-300 px-5 py-14 sm:px-8 lg:col-span-5 lg:border-r lg:border-b-0 lg:px-10">
          <Eyebrow>Tipografia</Eyebrow>
          <h2 className="mt-6 text-3xl font-normal tracking-tight">Sans neutra</h2>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-gray-700">
            A família do corpo ainda não foi escolhida. Esta preparação usa a sans do sistema.
            Há no máximo uma peça de display por tela: aqui, o 狂.
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-700">
            A Youth Shandey não entra no projeto. A página do autor descreve uso livre, e
            outros catálogos marcam a mesma fonte como uso pessoal. A cobertura publicada é
            latina, sem kanji.
          </p>
        </div>
        <div className="flex flex-col justify-end px-5 py-14 sm:px-8 lg:col-span-7 lg:px-10">
          <p className="text-5xl leading-none tracking-tight sm:text-7xl">Kurutta</p>
          <p className="mt-8 max-w-md text-sm leading-relaxed">
            狂う, sair do esperado. A excentricidade fica sutil. O nome não se apoia em
            violência, hostilidade ou ameaça.
          </p>
        </div>
      </section>

      <section className="border-b border-gray-300">
        <div className="grid lg:grid-cols-12">
          <div className="px-5 py-14 sm:px-8 lg:col-span-5 lg:px-10">
            <Eyebrow>Logo</Eyebrow>
            <h2 className="mt-6 text-3xl font-normal tracking-tight">狂, versão v4</h2>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-gray-700">
              Lado esquerdo orgânico, lado direito geométrico, um único fragmento solto no
              topo. No raster oficial, o vão mede cerca de 4,3% da altura do glifo. A regra
              pede aproximadamente 5%.
            </p>
          </div>
          <div className="flex items-center justify-center border-t border-gray-300 px-8 py-12 lg:col-span-7 lg:border-t-0 lg:border-l">
            <img src={mark} alt="Kanji 狂, versão v4" className="h-64 w-auto sm:h-80" />
          </div>
        </div>
        <div className="grid gap-px border-t border-gray-300 bg-gray-300 sm:grid-cols-2 xl:grid-cols-4">
          {samples.map((sample) => (
            <PolarityTest key={sample.label} sample={sample} />
          ))}
        </div>
      </section>

      <section className="grid border-b border-gray-700 bg-black text-white lg:grid-cols-3">
        <figure className="border-b border-gray-700 px-5 py-12 sm:px-8 lg:border-r lg:border-b-0 lg:px-10">
          <Eyebrow tone="ink">Favicon 32</Eyebrow>
          <img
            src="/favicon-32.png"
            width={128}
            height={128}
            alt="Favicon de 32 pixels, 狂 branco sobre preto"
            className="mt-10 h-32 w-32 [image-rendering:pixelated]"
          />
          <figcaption className="mt-8 max-w-xs text-sm leading-relaxed text-gray-300">
            Quadrado, cantos leves, sem borda e sem sombra. O glifo ocupa cerca de 82% do lado.
          </figcaption>
        </figure>
        <figure className="border-b border-gray-700 px-5 py-12 sm:px-8 lg:border-r lg:border-b-0 lg:px-10">
          <Eyebrow tone="ink">Favicon 16</Eyebrow>
          <img
            src="/favicon-16.png"
            width={128}
            height={128}
            alt="Favicon de 16 pixels, derivação simplificada do 狂"
            className="mt-10 h-32 w-32 [image-rendering:pixelated]"
          />
          <figcaption className="mt-8 max-w-xs text-sm leading-relaxed text-gray-300">
            Traços engrossados. O fragmento superior sai, porque nesse tamanho ele deixa de ser legível.
          </figcaption>
        </figure>
        <figure className="px-5 py-12 sm:px-8 lg:px-10">
          <Eyebrow tone="ink">Avatar</Eyebrow>
          <img
            src="/avatar.png"
            width={160}
            height={160}
            alt="Avatar circular, 狂 branco sobre preto"
            className="mt-10 h-40 w-40"
          />
          <figcaption className="mt-8 max-w-xs text-sm leading-relaxed text-gray-300">
            Círculo, composição central, margem interna de 13%. Sem efeito adicional.
          </figcaption>
        </figure>
      </section>

      <section className="grid border-b border-gray-300 lg:grid-cols-12">
        <div className="border-b border-gray-300 px-5 py-14 sm:px-8 lg:col-span-4 lg:border-r lg:border-b-0 lg:px-10">
          <Eyebrow>Referência</Eyebrow>
          <h2 className="mt-6 text-3xl font-normal tracking-tight">Estudo v4</h2>
          <p className="mt-8 text-sm leading-relaxed text-gray-700">
            A prancha raster aprovada. A versão vetorial ainda será redesenhada à mão.
          </p>
        </div>
        <div className="border-t border-gray-300 px-5 py-10 sm:px-8 lg:col-span-8 lg:border-t-0 lg:border-l lg:px-10">
          <img
            src={studySheet}
            alt="Prancha de estudo do kanji 狂, versão v4, com avatar e testes de redução"
            className="w-full"
          />
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-10">
        <Eyebrow>Em aberto</Eyebrow>
        <h2 className="mt-6 text-3xl font-normal tracking-tight">O que esta preparação não fecha</h2>
        <ol className="mt-10 max-w-3xl list-decimal space-y-3 pl-5 text-sm leading-relaxed text-gray-700">
          {openItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <footer className="flex flex-col gap-3 border-t border-gray-300 px-5 py-6 text-[11px] tracking-[0.16em] text-gray-700 uppercase sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>Kurutta</p>
        <p>React · Tailwind CSS · Vite</p>
      </footer>
    </div>
  )
}
