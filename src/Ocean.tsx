import { useEffect, useRef, useState } from 'react'
import mascot from '../assets/brand/hero-figure-v1.webp'

const WATER = { speed: .55, amplitude: .018, reflection: .78, fade: .9, resolution: 1, maxDpr: 1.5 }

const vertex = `attribute vec2 position;
varying vec2 uv;
void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`
const fragment = `precision highp float;
varying vec2 uv;
uniform float time;
uniform vec2 resolution;
uniform vec2 figure;
uniform float contact;
uniform float center;
uniform vec4 tuning;
uniform vec4 ripples[8];
uniform sampler2D subject;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float sea(vec2 p){
 // Long swell and short crossing ripples share the same surface.
 float swell=sin(p.y*1.9-time*.85+p.x*.23)*.12;
 swell+=sin(dot(p,vec2(.7,1.3))+time*.58)*.085;
 float ripples=0.;float amplitude=.042;float frequency=3.2;
 for(int i=0;i<4;i++){
  vec2 direction=normalize(vec2(sin(float(i)*1.7+.4),1.5));
  ripples+=sin(dot(p,direction)*frequency-time*(1.1+float(i)*.23)+sin(p.x*1.7)*.4)*amplitude;
  frequency*=1.85;amplitude*=.42;
 }
 return swell+ripples;
}
void main(){
 float depth=1.-uv.y;
 float aspect=resolution.x/resolution.y;
 float upperWave=1.-smoothstep(.05,.4,depth);
 // A low camera looking down onto a receding horizontal plane.
 // Limit perspective compression at the top so the swells retain visible width.
 float distance=2.4/(depth+.11+upperWave*.16);
 vec2 world=vec2((uv.x-.5)*aspect*distance*.58,distance);
 float e=.015;
 float h=sea(world);
 vec2 slope=vec2(sea(world+vec2(e,0))-h,sea(world+vec2(0,e))-h)/e;
 // Stronger relief near the waterline, tapering into the existing foreground.
 slope*=1.+upperWave*.65;
 // Crossing broad swells break up the previously continuous mirrored surface.
 vec2 swellPhase=vec2(world.y*.65+world.x*.32-time*.7,
   world.y*.9-world.x*.48+time*.45);
 vec2 swellSlope=vec2(.32*cos(swellPhase.x)-.48*cos(swellPhase.y),
   .65*cos(swellPhase.x)+.9*cos(swellPhase.y));
 slope+=swellSlope*upperWave*.55;
 vec3 normal=normalize(vec3(-slope.x*.8,1.,-slope.y*.8));
 vec3 view=normalize(vec3(-(uv.x-.5)*aspect*.12,.15+depth*.55,1.));
 float fresnel=pow(1.-max(dot(normal,view),0.),3.);
 vec3 reflected=reflect(-view,normal);
 // A broad overcast sky reflection lights wave faces rather than drawing stripes.
 float sky=exp(-pow((reflected.y-.23)*4.,2.));
 float crest=pow(max(0.,dot(normal,normalize(vec3(-.2,1.,.8)))),18.);
 float seaLight=.012+sky*.075+fresnel*.035+crest*.08;
 seaLight*=mix(.86,1.06,noise(world*13.));
 seaLight*=mix(.9,1.,smoothstep(0.,.15,depth));
 // Reveal the upper waves sooner instead of flattening them into a dark band.
 seaLight=mix(.014,seaLight,mix(.45,1.,smoothstep(.01,.22,depth)));
 seaLight*=1.+upperWave*.3;
 vec2 displacement=(slope*.35+vec2(noise(world+time*.15)-.5,noise(world*.7-time*.1)-.5))*tuning.y*(.05+depth*2.);
 displacement+=swellSlope*vec2(.014,.024)*upperWave*smoothstep(0.,.06,depth);
 for(int i=0;i<8;i++) {
   vec2 delta=vec2((uv.x-ripples[i].x)*aspect,depth-ripples[i].y);
   float age=ripples[i].z;
   float radius=length(delta);
   float wave=sin((radius-age*.22)*65.)*exp(-pow((radius-age*.22)*12.,2.))*exp(-age*1.5)*ripples[i].w;
   displacement+=normalize(delta+vec2(.0001))*wave*.012;
   seaLight+=wave*.025;
 }
 vec2 tex=vec2((uv.x-center)*resolution.x/figure.x+.5,
   contact-depth*resolution.y/figure.y)+displacement;
 vec4 reflection=texture2D(subject,clamp(tex,0.,1.));
 float inside=step(0.,tex.x)*step(tex.x,1.)*step(0.,tex.y)*step(tex.y,1.);
 float fade=tuning.z*exp(-depth*2.2/tuning.w)*(1.-smoothstep(tuning.w*.65,tuning.w,depth));
 // Soft occlusion and spreading elliptical wakes anchor the seated figure.
 vec2 local=vec2((uv.x-.5)*resolution.x/figure.x,depth*resolution.y/figure.y);
 float radius=length(vec2(local.x,local.y*3.2));
 float wake=pow(.5+.5*sin(radius*76.-time*1.35),15.);
 wake*=smoothstep(.08,.25,depth)*exp(-local.y*13.)*smoothstep(.1,.3,radius)*(1.-smoothstep(.8,1.25,radius));
 float shadow=exp(-pow(local.x*3.2,2.)-local.y*30.);
 vec3 color=vec3(seaLight*(1.-shadow*.8)+wake*.065);
 vec3 refl=vec3(dot(reflection.rgb,vec3(.2126,.7152,.0722)));
 float peak=max(refl.r,max(refl.g,refl.b));
 refl=mix(vec3(.12),refl,smoothstep(0.,.35,peak));
 float waveVisibility=1.-upperWave*.28*(.5+.5*sin(swellPhase.x));
 color+=refl*reflection.a*inside*fade*waveVisibility;
 float waterEdge=3.+sin(swellPhase.x)*2.+sin(swellPhase.y)*1.5;
 float alpha=smoothstep(waterEdge,waterEdge+18.,depth*resolution.y);
 gl_FragColor=vec4(color,alpha);
}`

type Renderer = { draw: (time: number, ripples?: Float32Array, scale?: number) => void; dispose: () => void }

function webglRenderer(canvas: HTMLCanvasElement, image: HTMLImageElement): Renderer | null {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'low-power' })
  if (!gl) return null
  const shaders: WebGLShader[] = []
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)
    if (!shader) throw new Error('Shader indisponível')
    shaders.push(shader); gl.shaderSource(shader, source); gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'Shader inválido')
    return shader
  }
  const program = gl.createProgram()
  const buffer = gl.createBuffer()
  const texture = gl.createTexture()
  if (!program || !buffer || !texture) return null
  const dispose = () => { gl.deleteProgram(program); gl.deleteBuffer(buffer); gl.deleteTexture(texture); shaders.forEach(s => gl.deleteShader(s)) }
  try {
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Programa WebGL inválido')
  } catch { dispose(); return null }
  gl.useProgram(program)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW)
  const position = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  gl.uniform1i(gl.getUniformLocation(program, 'subject'), 0)
  const clock = gl.getUniformLocation(program, 'time')
  const resolution = gl.getUniformLocation(program, 'resolution')
  const figure = gl.getUniformLocation(program, 'figure')
  const contact = gl.getUniformLocation(program, 'contact')
  const center = gl.getUniformLocation(program, 'center')
  const waves = gl.getUniformLocation(program, 'ripples[0]')
  gl.uniform4f(gl.getUniformLocation(program, 'tuning'), WATER.speed, WATER.amplitude, WATER.reflection, WATER.fade)
  return {
    draw: (time, ripples = new Float32Array(32), scale = WATER.resolution) => {
      gl.uniform4fv(waves, ripples)
      const w = canvas.clientWidth, h = canvas.clientHeight
      const ratio = Math.min(devicePixelRatio, WATER.maxDpr) * scale
      if (canvas.width !== Math.round(w*ratio) || canvas.height !== Math.round(h*ratio)) {
        canvas.width = Math.round(w*ratio); canvas.height = Math.round(h*ratio)
      }
      const box = canvas.parentElement?.querySelector('.mascot')?.getBoundingClientRect()
      const surface = canvas.getBoundingClientRect()
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform1f(clock, time / 1000 * WATER.speed)
      gl.uniform2f(resolution, w, h)
      gl.uniform2f(figure, box?.width || w*.6, box?.height || h*2)
      gl.uniform1f(contact, box ? (surface.top - box.top) / box.height : .9)
      gl.uniform1f(center, box ? (box.left+box.width/2-surface.left)/w : .5)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }, dispose,
  }
}

export default function Ocean() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [useFallback, setUseFallback] = useState(false)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const image = new Image()
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    let renderer: Renderer | null = null, frame = 0, visible = true, activeTime = 0, previous = 0, disposed = false
    const waves = new Float32Array(32)
    const births = new Float64Array(8).fill(-10000)
    let scale = WATER.resolution, samples = 0, elapsed = 0
    let next = 0, lastMove = -1000
    const ripple = (event: PointerEvent) => {
      if (motion.matches || document.hidden) return
      const box = canvas.getBoundingClientRect()
      if (event.clientY < box.top || event.clientY > box.bottom) return
      const click = event.type === 'pointerdown'
      if (!click && activeTime-lastMove < 100) return
      lastMove=activeTime
      waves[next*4]=(event.clientX-box.left)/box.width
      waves[next*4+1]=(event.clientY-box.top)/box.height
      waves[next*4+3]=click ? 1 : .35
      births[next]=activeTime; next=(next+1)%8
    }
    canvas.parentElement?.addEventListener('pointermove', ripple)
    canvas.parentElement?.addEventListener('pointerdown', ripple)
    const tick = (now: number) => {
      if (disposed) return
      if (visible && !document.hidden) {
        if (previous && activeTime>1500 && scale===1) {
          elapsed+=Math.min(now-previous,100); samples++
          if (samples===120) {
            if (elapsed/samples>20) { scale=.5; canvas.dataset.quality='half' }
            samples=0; elapsed=0
          }
        }
        activeTime += previous ? Math.min(now-previous, 100) : 0
        previous=now
        for (let i=0;i<8;i++) waves[i*4+2]=(activeTime-births[i])/1000
        renderer?.draw(activeTime, waves, scale)
      }
      frame=requestAnimationFrame(tick)
    }
    const start = () => {
      cancelAnimationFrame(frame); previous=0
      const box = canvas.parentElement?.querySelector('.mascot')?.getBoundingClientRect()
      const surface = canvas.getBoundingClientRect()
      const fallback = canvas.previousElementSibling as HTMLElement | null
      if (box && fallback) {
        fallback.style.setProperty('--reflection-left', `${box.left-surface.left}px`)
        fallback.style.setProperty('--reflection-top', `${surface.top-box.bottom}px`)
        fallback.style.setProperty('--reflection-width', `${box.width}px`)
        fallback.style.setProperty('--reflection-height', `${box.height}px`)
      }
      if (motion.matches) { waves.fill(0); births.fill(-10000) }
      renderer?.draw(motion.matches ? 0 : activeTime, waves, scale)
      if (renderer && !motion.matches && visible && !document.hidden) frame=requestAnimationFrame(tick)
    }
    const init = () => {
      if (disposed || !canvas) return
      renderer?.dispose()
      renderer=useFallback ? null : webglRenderer(canvas,image)
      if (!renderer) { setUseFallback(true); start(); return }
      canvas.dataset.renderer=useFallback ? 'fallback' : 'webgl'
      start()
    }
    const lost = (event: Event) => { event.preventDefault(); cancelAnimationFrame(frame); setUseFallback(true) }
    canvas.addEventListener('webglcontextlost',lost)
    canvas.addEventListener('webglcontextrestored',init)
    image.onload=init;image.src=mascot
    const resize=new ResizeObserver(start)
    resize.observe(canvas.parentElement!)
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;start()})
    observer.observe(canvas.parentElement!)
    motion.addEventListener('change',start)
    document.addEventListener('visibilitychange',start)
    return () => {
      disposed=true;cancelAnimationFrame(frame);renderer?.dispose();resize.disconnect();observer.disconnect()
      motion.removeEventListener('change',start);document.removeEventListener('visibilitychange',start)
      canvas?.removeEventListener('webglcontextlost',lost);canvas?.removeEventListener('webglcontextrestored',init)
      image.onload=null
      canvas.parentElement?.removeEventListener('pointermove', ripple)
      canvas.parentElement?.removeEventListener('pointerdown', ripple)
    }
  }, [useFallback])
  return <><div className={`ocean-fallback ${useFallback ? '' : 'hidden'}`} aria-hidden="true"><img src={mascot} alt="" /></div><canvas ref={ref} className="ocean" aria-hidden="true" /></>
}

