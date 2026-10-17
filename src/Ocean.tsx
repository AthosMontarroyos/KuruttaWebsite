import { useEffect, useRef, useState } from 'react'
import mascot from '../assets/brand/hero-figure-v1.webp'

const vertex = `attribute vec2 position;
varying vec2 uv;
void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`
const fragment = `precision highp float;
varying vec2 uv;
uniform float time;
uniform vec2 resolution;
uniform vec2 figure;
uniform float contact;
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
 // A low camera looking down onto a receding horizontal plane.
 float distance=2.4/(depth+.11);
 vec2 world=vec2((uv.x-.5)*aspect*distance*.58,distance);
 float e=.015;
 float h=sea(world);
 vec2 slope=vec2(sea(world+vec2(e,0))-h,sea(world+vec2(0,e))-h)/e;
 vec3 normal=normalize(vec3(-slope.x*.8,1.,-slope.y*.8));
 vec3 view=normalize(vec3(-(uv.x-.5)*aspect*.12,.15+depth*.55,1.));
 float fresnel=pow(1.-max(dot(normal,view),0.),3.);
 vec3 reflected=reflect(-view,normal);
 // A broad overcast sky reflection lights wave faces rather than drawing stripes.
 float sky=exp(-pow((reflected.y-.23)*4.,2.));
 float crest=pow(max(0.,dot(normal,normalize(vec3(-.2,1.,.8)))),18.);
 float seaLight=.012+sky*.075+fresnel*.035+crest*.08;
 seaLight*=mix(.86,1.06,noise(world*13.));
 float distant=1.-smoothstep(.08,.42,depth);
 seaLight*=mix(.9,1.,smoothstep(0.,.15,depth));
 // Suppress distant specular bands; retain the foreground wave lighting.
 seaLight=mix(.014,seaLight,smoothstep(.06,.38,depth));
 vec2 displacement=slope*vec2(.024,.012)*(.12+depth*1.6+distant*.23);
 vec2 tex=vec2((uv.x-.5)*resolution.x/figure.x+.5,
   contact-depth*resolution.y/figure.y)+displacement;
 vec4 reflection=texture2D(subject,clamp(tex,0.,1.));
 float inside=step(0.,tex.x)*step(tex.x,1.)*step(0.,tex.y)*step(tex.y,1.);
 float fade=pow(1.-depth,2.1)*.38;
 // Soft occlusion and spreading elliptical wakes anchor the seated figure.
 vec2 local=vec2((uv.x-.5)*resolution.x/figure.x,depth*resolution.y/figure.y);
 float radius=length(vec2(local.x,local.y*3.2));
 float wake=pow(.5+.5*sin(radius*76.-time*1.35),15.);
 wake*=smoothstep(.08,.25,depth)*exp(-local.y*13.)*smoothstep(.1,.3,radius)*(1.-smoothstep(.8,1.25,radius));
 float shadow=exp(-pow(local.x*3.2,2.)-local.y*30.);
 vec3 color=vec3(seaLight*(1.-shadow*.8)+wake*.065);
 vec3 refl=reflection.rgb;
 float peak=max(refl.r,max(refl.g,refl.b));
 refl=mix(vec3(.12),refl,smoothstep(0.,.35,peak));
 color+=refl*reflection.a*inside*fade;
 float boundary=2.+sin(uv.x*44.+time*.8)*1.2+sin(uv.x*83.-time)*.6;
 float alpha=smoothstep(boundary-1.,boundary+5.,depth*resolution.y);
 gl_FragColor=vec4(color,alpha);
}`

type Renderer = { draw: (time: number) => void; dispose: () => void }

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
  return {
    draw: time => {
      const w = canvas.clientWidth, h = canvas.clientHeight
      const ratio = Math.min(devicePixelRatio, w < 640 ? 1 : 1.25)
      if (canvas.width !== Math.round(w*ratio) || canvas.height !== Math.round(h*ratio)) {
        canvas.width = Math.round(w*ratio); canvas.height = Math.round(h*ratio)
      }
      const box = canvas.parentElement?.querySelector('.mascot')?.getBoundingClientRect()
      const surface = canvas.getBoundingClientRect()
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform1f(clock, time / 1000)
      gl.uniform2f(resolution, w, h)
      gl.uniform2f(figure, box?.width || w*.6, box?.height || h*2)
      gl.uniform1f(contact, box ? (surface.top - box.top) / box.height : .9)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }, dispose,
  }
}

// Non-WebGL devices retain a water surface and a static reflected subject.
function fallback(canvas: HTMLCanvasElement, image: HTMLImageElement): Renderer {
  const ctx = canvas.getContext('2d')
  return { draw: () => {
    if (!ctx) return
    const w = canvas.width = canvas.clientWidth, h = canvas.height = canvas.clientHeight
    const figure = canvas.parentElement?.querySelector('.mascot')?.getBoundingClientRect()
    const size = figure?.width || w*.6
    const contact = figure ? (canvas.getBoundingClientRect().top - figure.top) / figure.height : .9
    ctx.fillStyle = '#050505'; ctx.fillRect(0,0,w,h)
    for(let y=0;y<h;y+=3){
      const d=y/h;ctx.globalAlpha=.4*Math.pow(1-d,2)
      ctx.drawImage(image,0,image.height*contact-y*image.width/size-3,image.width,4,(w-size)/2+Math.sin(y*.17)*d*7,y,size,3)
    }
    ctx.globalAlpha=1
    for(let y=3;y<h;y+=6){ctx.strokeStyle=`rgba(180,180,180,${.01+y/h*.025})`;ctx.beginPath();ctx.moveTo(0,y);for(let x=0;x<=w;x+=12)ctx.lineTo(x,y+Math.sin(x*.02+y)*y/h*2);ctx.stroke()}
  }, dispose: () => {} }
}

export default function Ocean() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [useFallback, setUseFallback] = useState(false)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const image = new Image()
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    let renderer: Renderer | null = null, frame = 0, visible = true, last = 0, activeTime = 0, previous = 0, disposed = false
    const tick = (now: number) => {
      if (disposed) return
      if (visible && !document.hidden && now-last>33) {
        activeTime += previous ? Math.min(now-previous, 100) : 0
        previous=now
        renderer?.draw(activeTime); last = now
      }
      frame=requestAnimationFrame(tick)
    }
    const start = () => {
      cancelAnimationFrame(frame); previous=0
      renderer?.draw(motion.matches ? 0 : activeTime)
      if (!motion.matches && visible && !document.hidden) frame=requestAnimationFrame(tick)
    }
    const init = () => {
      if (disposed || !canvas) return
      renderer?.dispose()
      renderer=useFallback ? fallback(canvas,image) : webglRenderer(canvas,image)
      if (!renderer) { setUseFallback(true); return }
      canvas.dataset.renderer=useFallback ? 'fallback' : 'webgl'
      start()
    }
    const lost = (event: Event) => { event.preventDefault(); cancelAnimationFrame(frame) }
    canvas.addEventListener('webglcontextlost',lost)
    canvas.addEventListener('webglcontextrestored',init)
    image.onload=init;image.src=mascot
    const resize=new ResizeObserver(()=>renderer?.draw(motion.matches?0:activeTime))
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
    }
  }, [useFallback])
  return <canvas key={useFallback ? '2d' : 'webgl'} ref={ref} className="ocean" aria-hidden="true" />
}
