# Revisão incremental do hero

Atualização após feedback: removidos o afundamento da mascote no scroll e o parallax do kanji com o mouse. A mascote mantém respiração/parallax leve; o kanji mantém apenas subida/fade no scroll. Os patches A–D abaixo registram a entrega original; seus valores de afundamento e parallax do kanji foram desativados nesta revisão.

Preservados React, Vite, Tailwind, arquivos, nomes e artes originais. Não há nova dependência.

## Diffs por melhoria

- A.patch / eaeab1e: Ocean.tsx (reflexo, ruído, fade, alinhamento horizontal, DPR, remoção do limite de 30fps, fallback CSS); index.css (luz radial e fallback).
- B.patch / ae76394: Ocean.tsx (8 ripples em buffer circular, movimento a cada 100ms e clique); App.tsx (parallax interpolado); index.css (amplitudes e respiração).
- C.patch / 6992758: App.tsx (progresso de scroll e wrapper de recorte); index.css (afundamento, subida/fade do kanji e pulsação da seta).
- D.patch / 86117b1: App.tsx (grão SVG inline, vinheta, navbar); index.css (Tailwind para navbar, grão e vinheta). Inclui correções da inspeção: máscara suave de contato, cinza estrito, redução adaptativa da água, fallback em perda de contexto, âncoras compensadas pelo header fixo.

## Valores para calibrar

| Local | Valor inicial | Efeito |
|---|---|---|
| index.css, .stage --water | 66%; 72% ultrawide; 65% mobile | Linha d'água |
| index.css, .ocean | --water menos 12px | Início do canvas |
| index.css, .mascot-clip | faixa de máscara de 30px | Dissolução da personagem no contato; recalibrar junto com posição da figure-scene |
| Ocean.tsx, WATER.speed | .55 | Velocidade da água |
| WATER.amplitude | .018 | Deslocamento crescente em profundidade |
| WATER.reflection | .78 | Intensidade do reflexo |
| WATER.fade | .9 | Fração da altura da água para dissolução |
| WATER.maxDpr | 1.5 | Limite de densidade |
| WATER.resolution | 1 | Usar .5 para metade das dimensões do canvas |
| Shader, smoothstep alpha | 0–18px | Transição superior da água |
| index.css, .stage::before | #ffffff12 | Luz radial procedural |
| index.css, parallax | kanji -8px; mascote +2.5px | Amplitudes por eixo |
| App.tsx, interpolação | 110ms | Suavização independente do refresh |
| index.css, breathe | 6s; 1–1.008 | Respiração |
| Ocean.tsx, ripple | 8 slots; 100ms; força .35 movimento/1 clique | Carga máxima e resposta |
| App.tsx, scroll | 65% da altura; afunda 220px; sobe 100px | Progresso narrativo |
| index.css, .hero-grain | .035 | Grão 3,5% |
| Coordenadas da lâmina | Não definidas | Pendente máscara precisa; nenhum polígono aproximado aplicado |

## Assets e pendências

Nenhum asset foi gerado. Grok no Cursor não está disponível nesta sessão. Não foi substituído silenciosamente por outro gerador. Não existem assets aprovados ou rejeitados por qualidade em public/assets/generated/.

O glow usa gradiente radial em código, e o grão usa feTurbulence inline. O depth map e a máscara da katana permanecem pendentes: o parallax atual desloca a imagem inteira; não há brilho periódico da lâmina. Para concluir, gerar e validar os dois mapas a partir do arquivo original, mantendo suas dimensões. Sem máscara confiável, a alternativa procedural deve restringir um gradiente às coordenadas da lâmina verificadas visualmente; tais coordenadas não foram inventadas.

## Verificação e limites

Build TypeScript/Vite e oxlint passaram. Inspeção visual em navegador desktop, canvas WebGL ativo, sem erros/avisos no console. Clique na seta navega para #sobre. Screenshot fornecido pelo usuário não estava acessível; a referência foi a implementação existente.

Não foi comprovado 60fps em GPU integrada. Após 1,5s de aquecimento, uma média de 120 intervalos acima de 20ms reduz ambas as dimensões de renderização para 50%, mantendo o tamanho CSS; canvas recebe data-quality="half". É uma heurística de cadência, não medição direta de GPU. A sessão inspecionada permaneceu em resolução integral.

Reduced motion desativa parallax, respiração, ripples e movimento da água; scroll narrativo fica neutro. Aba oculta e hero fora de vista pausam RAF e animações CSS. Esses caminhos foram revisados no código, mas não emulados no navegador. O fallback CSS foi implementado e revisado, mas não validado em dispositivo sem WebGL. Não há alegação de teste mobile ou benchmark de hardware.

## Decisões por falta de informação

- Mantida a geometria e proporção existentes, pois o screenshot mencionado não estava disponível.
- Luz procedural substitui textura de glow; mapas sem ferramenta disponível ficaram explicitamente pendentes.
- Mantidas classes CSS existentes para preservar o projeto, usando Tailwind nos novos elementos e estilos de navbar.
- Mantida a navegação da seta para Sobre; sua animação apenas acompanha a narrativa de scroll.
