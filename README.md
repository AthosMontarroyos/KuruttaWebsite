# Kurutta

Site de apresentação do projeto Kurutta, em React, TypeScript e Vite.

## Desenvolvimento

```sh
npm ci
npm run dev -- --host 0.0.0.0
```

```sh
npm run build
npm run lint
npm run preview -- --host 0.0.0.0
```

O hero usa um kanji vetorial, a personagem em WebP transparente e uma superfície de mar em WebGL com ondas em perspectiva, iluminação e reflexo da personagem. O movimento respeita `prefers-reduced-motion`; a renderização do mar pausa fora da tela e em abas ocultas. Sem WebGL, uma alternativa estática em Canvas mantém a água e o reflexo.

Assets selecionados ficam em `assets/`. Estudos, referências e capturas de validação ficam em `.temp/`, ignorada pelo Git. Preserve os estudos anteriores ao criar novas versões. Cada tarefa já possui um checkout isolado; utilize o checkout existente.
