# Borboleta

Asset: public/assets/generated/butterfly-cutout-v1.png. Recorte produzido com a ferramenta integrada imagegen a partir da imagem enviada; não é extração pixel a pixel. Inspecionado visualmente antes de aplicar.

Prompt: Background extraction only. Remove the black background from the supplied white butterfly. Preserve exactly its silhouette, side-view pose, antennae, wing veins, grayscale tones and delicate edges. Do not redesign, add wings, rotate, add glow or add objects. Output actual transparent alpha, tightly framed around the entire butterfly with small transparent padding. Asset for a website.

Trajetória determinística CSS: elipse em sentido anti-horário, ciclo de 18s. Região relativa à figure-scene: left 30%, top 50%, width 40%, height 28%. Tamanho 26–42px. Batimento visual por rotação em perspectiva de uma imagem única, a cada .48s; não é simulação anatômica independente das asas. Halo radial branco e cinco pontos suaves atrasados .12s entre si acompanham o caminho.

Não havia trilha direcional no código, apenas iluminação radial estática. A interpretação adotada foi voo anti-horário com rastro atrás, no sentido contrário ao avanço. Não foi adicionado movimento aleatório. A borboleta passa em frente à personagem dentro da região central.

Pausa da aba e fora da viewport herdam o controle do hero. Reduced motion deixa uma borboleta estática sem rastro. Build e lint passaram; composição conferida no preview desktop.
