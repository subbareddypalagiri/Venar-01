// ==============================================================================
// VENAR REGISTRY STORE: 40 Skills, 40 MCP Servers, 40 Connectors
// Curated world-class tools for 3D, motion, concept sites, and autonomous dev.
// Features 1-click install, 0ms local caching in ~/.venar/, and prompt injection.
// ==============================================================================

const fs = require('fs');
const path = require('path');
const os = require('os');

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  peach: "\x1b[38;2;224;108;85m",
  peachBold: "\x1b[1;38;2;224;108;85m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
  white: "\x1b[97m"
};

const SKILLS_STORE = [
  {
    "id": "ui-ux-pro-max",
    "name": "UI/UX Pro Max",
    "rank": 1,
    "category": "Design Systems",
    "creator": "shadcn / Apple Design Team",
    "desc": "Apple-tier design systems, fluid typography, OKLCH colors, Bento grids & micro-interactions.",
    "prompt": "[SKILL ACTIVATED: UI/UX PRO MAX]\nYou are a FAANG-grade Principal Design Engineer. Strictly follow these rules:\n1. TYPOGRAPHY: Use modern font pairings (Inter, Outfit, Plus Jakarta Sans) with fluid clamp() scales.\n2. PALETTE: Use luxury dark mode (slate-950, zinc-900) with OKLCH colors and subtle accent borders (border-white/10).\n3. SURFACES: Use frosted glassmorphism (backdrop-blur-md, bg-white/5, border border-white/10).\n4. LAYOUT: Structure layouts with asymmetrical Bento grids, generous negative space, and pill badges.\n5. MOTION: Implement subtle hover micro-interactions, scale-102 transitions, and magnetic cursor states."
  },
  {
    "id": "glsl-raymarching",
    "name": "GLSL Raymarching & SDF Shaders",
    "rank": 2,
    "category": "3D & Shaders",
    "creator": "Inigo Quilez / Shadertoy",
    "desc": "Signed Distance Fields, volumetric lighting, liquid metaballs & 0MB 3D directly on the GPU.",
    "prompt": "[SKILL ACTIVATED: GLSL RAYMARCHING & SDF]\nYou are an elite Graphics Programmer. When asked to build 3D graphics or concept visualizers:\n1. Avoid loading heavy 50MB GLTF models. Instead, write procedural GLSL Signed Distance Functions (SDFs).\n2. Use raymarching loops (max 100 steps, min distance 0.001) in Three.js ShaderMaterial or raw WebGL.\n3. Compute surface normals via gradient tetrahedron: normalize(vec3(sdScene(p+e.xyy)-sdScene(p-e.xyy), ...)).\n4. Implement Fresnel rim lighting, soft shadow penumbras, and smooth-minimum (smin) metaball blending.\n5. Provide a fallback 2D canvas animation if WebGL context is lost."
  },
  {
    "id": "gstack",
    "name": "G-Stack Autonomous Suite",
    "rank": 3,
    "category": "Autonomous Engineering",
    "creator": "Gary Sheng / G-Stack",
    "desc": "Full autonomous pipeline: planning, architecture review, visual QA browse & post-deploy canary.",
    "prompt": "[SKILL ACTIVATED: G-STACK AUTONOMOUS SUITE]\nOperate as an autonomous tech lead.\n1. Before writing code, outline architecture, edge cases, and failure modes.\n2. Implement atomic changes with test assertions.\n3. Follow up with automated self-healing and code review diagnostics."
  },
  {
    "id": "threejs-particle-vortex",
    "name": "Three.js Particle Vortex",
    "rank": 4,
    "category": "3D & Shaders",
    "creator": "Bruno Simon / Three.js Journey",
    "desc": "50,000+ GPU particles with curl noise, attractor physics, and mouse velocity tracking.",
    "prompt": "[SKILL ACTIVATED: THREEJS PARTICLE VORTEX]\nImplement high-performance GPU particle systems:\n1. Use THREE.BufferGeometry and THREE.Points with instanced attributes for 50,000+ particles.\n2. In vertex shaders, displace particles using 3D Simplex or Curl Noise based on uniform float uTime.\n3. Track mouse velocity (deltaX, deltaY) to create gravitational pull and vortex disturbance fields.\n4. Use additive blending (THREE.AdditiveBlending) with depthWrite: false for glowing cosmic trails."
  },
  {
    "id": "awwwards-spatial-ui",
    "name": "Awwwards Spatial UI & Momentum",
    "rank": 5,
    "category": "Motion & Physics",
    "creator": "Awwwards Site of the Day / Lusion",
    "desc": "Lenis smooth momentum scrolling, magnetic cursor physics, noise-grain shaders & sheen reflections.",
    "prompt": "[SKILL ACTIVATED: AWWWARDS SPATIAL UI]\nCreate award-winning experiential concept websites:\n1. SCROLL: Use Lenis smooth scroll with lerp: 0.08 and wheelMultiplier: 1.1 for buttery momentum.\n2. CURSOR: Add an elastic magnetic cursor that snaps to interactive buttons with spring damping.\n3. TEXTURE: Overlay an SVG or WebGL noise-grain filter with blend-mode: overlay for filmic luxury.\n4. DEPTH: Add mouse parallax tilt (transform: perspective(1000px) rotateX(...) rotateY(...)) with light sheen reflections."
  },
  {
    "id": "karpathy-vibe-coder",
    "name": "Karpathy Vibe Coder",
    "rank": 6,
    "category": "Rapid Prototyping",
    "creator": "Andrej Karpathy",
    "desc": "Zero-boilerplate, hyper-fast single-pass vibe coding for instant interactive apps & tools.",
    "prompt": "[SKILL ACTIVATED: KARPATHY VIBE CODER]\nExecute rapid prototyping:\n1. Zero unnecessary boilerplate or convoluted abstractions. Get to the working interactive core immediately.\n2. Embed CSS, JS, and HTML cleanly or create minimal, tightly coupled modern ESM modules.\n3. Ensure the app is immediately playable, runnable, and visually satisfying on the very first render."
  },
  {
    "id": "web-audio-synth",
    "name": "Web Audio API Procedural Synth",
    "rank": 7,
    "category": "Audio & Immersion",
    "creator": "Tone.js / Web Audio Spec",
    "desc": "Real-time procedural audio synthesis, hover clicks, filter sweeps & ambient soundscapes without mp3s.",
    "prompt": "[SKILL ACTIVATED: WEB AUDIO PROCEDURAL SYNTH]\nSynthesize procedural audio without external audio files:\n1. Create a lazy-initialized AudioContext triggered on first user interaction.\n2. Synthesize tactile UI sounds: high-pass filtered clicks (exponentialRampToValueAtTime for clicks) and low-frequency sweeps.\n3. Implement generative ambient pads using dual detuned sine/sawtooth oscillators with slow LFO modulation.\n4. Provide a sleek mute/sound-wave toggle button with real-time AnalyserNode visualizer bars."
  },
  {
    "id": "matter-physics-canvas",
    "name": "Matter.js 2D Kinetic Physics",
    "rank": 8,
    "category": "Motion & Physics",
    "creator": "Matter.js / Codrops",
    "desc": "Interactive physics bodies, floating draggable tags, collision gravity & throw momentum.",
    "prompt": "[SKILL ACTIVATED: MATTER.JS 2D PHYSICS]\nCreate interactive physical interfaces:\n1. Setup Matter.Engine, World, and Runner bound to a canvas container.\n2. Spawn pill-shaped interactive bodies (technologies, badges, cards) with realistic restitution (0.7) and friction.\n3. Add MouseConstraint so users can grab, toss, and fling badges across the screen with natural inertia.\n4. Render custom HTML DOM cards matching the physics body positions and rotation angles via requestAnimationFrame."
  },
  {
    "id": "framer-motion-master",
    "name": "Framer Motion Dynamic Physics",
    "rank": 9,
    "category": "Motion & Physics",
    "creator": "Matt Perry / Motion One",
    "desc": "Spring physics, layout animations, exit/enter presence, and SVG path morphing.",
    "prompt": "[SKILL ACTIVATED: FRAMER MOTION MASTER]\nImplement production spring dynamics:\n1. Replace duration-based easings with spring physics: { type: 'spring', stiffness: 350, damping: 25 }.\n2. Use AnimatePresence mode='wait' for seamless page transitions and tab switches.\n3. Leverage layout and layoutId for magical morphing pills, moving indicator underlines, and expanding cards."
  },
  {
    "id": "tailwind-v4-fluid",
    "name": "Tailwind v4 Fluid Typography & CSS Next",
    "rank": 10,
    "category": "Design Systems",
    "creator": "Adam Wathan / Tailwind Labs",
    "desc": "CSS Next variables, fluid clamp() scales, container queries & subgrid layouts.",
    "prompt": "[SKILL ACTIVATED: TAILWIND V4 FLUID]\nUse state-of-the-art CSS styling:\n1. Modern CSS color functions (oklch, color-mix) for vibrant gradients and dark-mode depth.\n2. Fluid typography using clamp(min, preferred_vw, max) for seamless scaling across mobile and 4K displays.\n3. CSS Container Queries (@container) for self-responsive modular UI components."
  },
  {
    "id": "spline-3d-interactive",
    "name": "Spline 3D Runtime Integration",
    "rank": 11,
    "category": "3D & Shaders",
    "creator": "Spline.design",
    "desc": "Interactive Spline 3D scenes with state machines, scroll triggers, and mouse tracking.",
    "prompt": "[SKILL ACTIVATED: SPLINE 3D RUNTIME]\nIntegrate real-time 3D scenes:\n1. Embed @splinetool/runtime with lazy loading and loading spinners.\n2. Hook into Spline event listeners (onSplineMouseDown, onSplineMouseHover).\n3. Bind scroll progression and mouse coordinates to trigger named state transitions in the 3D scene."
  },
  {
    "id": "gsap-scrolltrigger-pro",
    "name": "GSAP ScrollTrigger Pro",
    "rank": 12,
    "category": "Motion & Physics",
    "creator": "GreenSock",
    "desc": "Pinned horizontal scroll sections, parallax depth planes, and scrubbed SVG animations.",
    "prompt": "[SKILL ACTIVATED: GSAP SCROLLTRIGGER PRO]\nBuild cinematic narrative scroll flows:\n1. Use gsap.timeline({ scrollTrigger: { trigger, scrub: 1, pin: true, start: 'top top', end: '+=2000' } }).\n2. Orchestrate multi-stage horizontal panels, scale zooms, and text reveals.\n3. Clean up ScrollTrigger instances on component unmount to prevent memory leaks."
  },
  {
    "id": "shader-cursor-effects",
    "name": "Shader Cursor Distortion & Fluid Trails",
    "rank": 13,
    "category": "3D & Shaders",
    "creator": "Codrops / Yuriy Artyukh",
    "desc": "Liquid ripple distortion on cursor movement using WebGL displacement maps.",
    "prompt": "[SKILL ACTIVATED: SHADER CURSOR DISTORTION]\nCreate liquid cursor interactions:\n1. Render mouse movement into an offscreen ping-pong framebuffer texture (FBO).\n2. Dissipate trails gradually each frame with a fade factor (0.96).\n3. Use the FBO texture as a displacement map in background images or typography shaders to create liquid refractions."
  },
  {
    "id": "ascii-3d-renderer",
    "name": "WebGL ASCII & Braille 3D Engine",
    "rank": 14,
    "category": "Experiential",
    "creator": "Active Theory / Three.js AsciiEffect",
    "desc": "Real-time 3D mesh rendering into ASCII, matrix glyphs, and high-density Braille characters.",
    "prompt": "[SKILL ACTIVATED: ASCII 3D RENDERER]\nConvert 3D scenes to dynamic ASCII art:\n1. Render 3D geometry into a low-resolution canvas or read frame luminosity.\n2. Map pixel brightness values to a character set: ' .,:;i1tfLCG08@'.\n3. Render in monospace typography with glowing phosphor green/amber CRT aesthetics."
  },
  {
    "id": "pro-ui-architect",
    "name": "Pro UI Architect (FAANG Tier)",
    "rank": 15,
    "category": "Design Systems",
    "creator": "Vercel Design / Apple HIG",
    "desc": "Comprehensive design tokens, accessible contrast, WCAG AAA compliance & micro-layouts.",
    "prompt": "[SKILL ACTIVATED: PRO UI ARCHITECT]\nArchitect uncompromising UI systems:\n1. Define rigid spacing scales (4, 8, 12, 16, 24, 32, 48, 64px).\n2. Enforce WCAG AAA contrast ratios for all text and UI boundaries.\n3. Add accessible keyboard navigation, focus-visible rings, and screen-reader aria labels."
  },
  {
    "id": "react-spring-physics",
    "name": "React Spring & Gesture Inertia",
    "rank": 16,
    "category": "Motion & Physics",
    "creator": "Poimandres",
    "desc": "Damped harmonic oscillators, realistic drag inertia, and pull-to-dismiss gestures.",
    "prompt": "[SKILL ACTIVATED: REACT SPRING PHYSICS]\nBuild tactile touch and mouse gestural controls:\n1. Use physics-based spring models with mass, tension, and friction.\n2. Implement drag-and-flick velocity transfer so elements glide to a natural stop based on release speed."
  },
  {
    "id": "svg-morphing-anim",
    "name": "SVG Organic Morphing & Wave Flow",
    "rank": 17,
    "category": "Motion & Physics",
    "creator": "Flubber.js / Kute.js",
    "desc": "Seamless SVG path morphing, liquid blob animations, and generative wave dividers.",
    "prompt": "[SKILL ACTIVATED: SVG MORPHING]\nGenerate dynamic organic vector animations:\n1. Compute matching vertex counts between starting and target SVG paths.\n2. Interpolate bezier curve control points with smooth sinusoidal noise for organic liquid blobs."
  },
  {
    "id": "cinematic-camera-flythrough",
    "name": "Cinematic 3D Camera Flythrough",
    "rank": 18,
    "category": "3D & Shaders",
    "creator": "Three.js / Apple Product Pages",
    "desc": "CatmullRomCurve3 spline camera paths driven by user scroll percentage.",
    "prompt": "[SKILL ACTIVATED: CINEMATIC CAMERA FLYTHROUGH]\nBuild Apple-style product reveal flythroughs:\n1. Construct a THREE.CatmullRomCurve3 path with control points around the 3D model.\n2. Sample camera position at curve.getPointAt(scrollProgress) and camera.lookAt(target).\n3. Smooth out camera movement with damping (camera.position.lerp) to avoid jarring scroll jumps."
  },
  {
    "id": "noise-grain-postprocessing",
    "name": "Noise, Grain & Bloom Post-Processing",
    "rank": 19,
    "category": "3D & Shaders",
    "creator": "Three.js EffectComposer",
    "desc": "Unreal Bloom, chromatic aberration, scanlines & analog film grain shaders.",
    "prompt": "[SKILL ACTIVATED: POST-PROCESSING SHADERS]\nAdd cinematic film grading:\n1. Setup EffectComposer with RenderPass, UnrealBloomPass (strength 0.6, radius 0.4, threshold 0.85).\n2. Add custom ShaderPass with chromatic aberration (red/blue channel offset based on distance from center).\n3. Overlay animated film grain to eliminate digital banding."
  },
  {
    "id": "3d-card-tilt-parallax",
    "name": "3D Card Tilt & Holographic Sheen",
    "rank": 20,
    "category": "Experiential",
    "creator": "Stripe Press / Linear",
    "desc": "Smooth mouse-tracking 3D rotation with dynamic specular highlight gradients.",
    "prompt": "[SKILL ACTIVATED: 3D CARD TILT]\nBuild luxury interactive cards:\n1. Calculate mouse offset relative to card center (-0.5 to 0.5).\n2. Apply CSS transform: perspective(1000px) rotateY(...) rotateX(...).\n3. Overlay an absolute glare layer with background: radial-gradient(...) following the exact mouse position."
  },
  {
    "id": "audio-reactive-visualizer",
    "name": "Audio-Reactive 3D Visualizer",
    "rank": 21,
    "category": "Audio & Immersion",
    "creator": "Web Audio / Canvas API",
    "desc": "FFT frequency analysis mapping bass, mid, and treble bands to 3D geometry scales & colors.",
    "prompt": "[SKILL ACTIVATED: AUDIO-REACTIVE 3D]\nBuild music visualizers:\n1. Connect audio source to AnalyserNode with fftSize = 512.\n2. Read frequencyData (Uint8Array) in requestAnimationFrame.\n3. Isolate bass (bins 0-10) for scale pulsing, mid for mesh displacement, and treble for particle sparks."
  },
  {
    "id": "kinetic-typography",
    "name": "Kinetic Typography & Velocity Skew",
    "rank": 22,
    "category": "Motion & Physics",
    "creator": "Locomotive / Studio Freight",
    "desc": "Infinite marquee loops with dynamic font weight and velocity-based italic skew.",
    "prompt": "[SKILL ACTIVATED: KINETIC TYPOGRAPHY]\nCreate high-impact editorial typography:\n1. Build seamless infinite marquee tickers using translate3d and modulo arithmetic.\n2. Calculate scroll velocity and dynamically skew text (transform: skewX(calc(var(--velocity) * 0.5deg))).\n3. Animate variable font weights ('wght' 200 to 900) on hover or scroll position."
  },
  {
    "id": "magnetic-buttons-cursor",
    "name": "Magnetic Attraction UI & Morphing Cursor",
    "rank": 23,
    "category": "Experiential",
    "creator": "Cuberto / Aristide Benoist",
    "desc": "Center-attraction magnetic pull on buttons and morphing cursor bound to element outlines.",
    "prompt": "[SKILL ACTIVATED: MAGNETIC BUTTONS]\nBuild magnetic UI interactions:\n1. On mouse proximity to button (< 80px), attract button center toward cursor using damped lerp.\n2. Expand and morph the custom cursor to snap flush to the button perimeter with blend-mode: difference.\n3. Snap back to original resting position on mouse leave with spring recoil."
  },
  {
    "id": "infinite-canvas-zoom",
    "name": "Infinite Canvas Pan & Zoom",
    "rank": 24,
    "category": "Experiential",
    "creator": "Figma / Miro Engine",
    "desc": "Matrix transform infinite zoom/pan canvas with viewport level-of-detail (LOD) culling.",
    "prompt": "[SKILL ACTIVATED: INFINITE CANVAS]\nImplement infinite zoomable workspaces:\n1. Track pan offset (x, y) and zoom scale (min 0.1, max 10.0).\n2. Handle mouse wheel zoom centered around cursor focal point.\n3. Cull off-screen nodes and switch to simplified low-LOD cards at extreme zoom-out."
  },
  {
    "id": "dark-mode-ambient-glow",
    "name": "Ambient Radial Glow & Dark Luxury",
    "rank": 25,
    "category": "Design Systems",
    "creator": "Raycast / Linear.app",
    "desc": "Conic/radial lighting gradients following pointer across dark matte backgrounds.",
    "prompt": "[SKILL ACTIVATED: AMBIENT GLOW]\nDesign luxury dark interfaces:\n1. Deep matte backgrounds (#0a0a0c, #050507).\n2. Dynamic radial gradient backdrop-glow following cursor: radial-gradient(600px circle at var(--x) var(--y), rgba(120,119,198,0.15), transparent 80%).\n3. Razor-thin border highlights that illuminate as cursor draws near."
  },
  {
    "id": "svg-line-drawing-scroll",
    "name": "SVG Blueprint Line Drawing on Scroll",
    "rank": 26,
    "category": "Motion & Physics",
    "creator": "Stripe Engineering / Apple",
    "desc": "Synchronized SVG stroke-dashoffset drawing animations tracing circuits and diagrams.",
    "prompt": "[SKILL ACTIVATED: SVG BLUEPRINT DRAWING]\nAnimate vector circuits and flow lines:\n1. Calculate path.getTotalLength() and set strokeDasharray and strokeDashoffset.\n2. Map scroll progress or time directly to strokeDashoffset to simulate precision laser drawing."
  },
  {
    "id": "webgl-fluid-simulation",
    "name": "WebGL Navier-Stokes Fluid Simulation",
    "rank": 27,
    "category": "3D & Shaders",
    "creator": "Pavel Docev / WebGL Fluid",
    "desc": "Real-time GPU fluid dynamics, colorful dye injection, and smoke dissipation on pointer drag.",
    "prompt": "[SKILL ACTIVATED: WEBGL FLUID SIMULATION]\nImplement real-time interactive fluids:\n1. Solve 2D Navier-Stokes equations on GPU (advection, divergence, pressure Poisson solve, curl/vorticity).\n2. Inject splats of colorful dye and velocity vectors on pointer move.\n3. Render fluid velocity and pressure as iridescent organic visuals."
  },
  {
    "id": "generative-art-canvas",
    "name": "Generative Flow Fields & Perlin Noise",
    "rank": 28,
    "category": "Experiential",
    "creator": "Tyler Hobbs / Processing",
    "desc": "Vector flow fields, recursive organic trees, and algorithmic generative geometry in canvas.",
    "prompt": "[SKILL ACTIVATED: GENERATIVE FLOW FIELDS]\nCreate algorithmic digital artwork:\n1. Generate 2D grid of angle vectors calculated via Perlin/Simplex noise: angle = noise(x*scale, y*scale) * TWO_PI.\n2. Spawn thousands of autonomous tracer particles following the local vector angles.\n3. Draw fine semi-transparent paths leaving mesmerizing harmonic textures."
  },
  {
    "id": "glass-refraction-caustics",
    "name": "Screen-Space Glass Refraction & Caustics",
    "rank": 29,
    "category": "3D & Shaders",
    "creator": "Three.js MeshPhysicalMaterial",
    "desc": "Physical transmission, chromatic dispersion, roughness blur, and light caustics.",
    "prompt": "[SKILL ACTIVATED: GLASS REFRACTION & CAUSTICS]\nRender physically accurate glass:\n1. Use THREE.MeshPhysicalMaterial with transmission: 1.0, roughness: 0.15, ior: 1.5, dispersion: 0.05.\n2. Place luminous colorful 3D objects behind the glass geometry to demonstrate realistic real-time refraction and chromatic aberration."
  },
  {
    "id": "bento-grid-showcase",
    "name": "Interactive Bento Grid Showcase",
    "rank": 30,
    "category": "Design Systems",
    "creator": "Apple Events / Vercel Ship",
    "desc": "Responsive CSS Grid bento boxes with live animated counters, code snippets, and mini-visualizers.",
    "prompt": "[SKILL ACTIVATED: BENTO GRID SHOWCASE]\nCreate high-density feature showcases:\n1. CSS Grid with span-1, span-2, and span-3 layouts collapsing gracefully on mobile.\n2. Each bento card hosts an interactive element: live canvas, simulated telemetry ticker, interactive switch, or syntax-highlighted code pill."
  },
  {
    "id": "webgpu-wgsl-compute",
    "name": "WebGPU WGSL Compute Pipeline",
    "rank": 31,
    "category": "GPU & WebGPU",
    "creator": "W3C / Chrome GPU Team",
    "desc": "WGSL compute shaders for 100k N-body gravity physics & matrix math; 10x faster than WebGL.",
    "prompt": "[SKILL ACTIVATED: WEBGPU WGSL COMPUTE]\nYou are a WebGPU Graphics & Compute Systems Engineer. When writing WebGPU applications:\n1. Check navigator.gpu and requestAdapter() with requestDevice().\n2. Write raw WGSL compute shaders: @compute @workgroup_size(64) fn main(@builtin(global_invocation_id) id: vec3<u32>).\n3. Create GPUBuffer with GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST.\n4. Create GPUBindGroup and compute pipeline (device.createComputePipeline).\n5. Encode compute passes (passEncoder.dispatchWorkgroups(...)) and submit to device.queue.\n6. Always provide a fallback message if browser lacks WebGPU support."
  },
  {
    "id": "gaussian-splatting-3d",
    "name": "3D Gaussian Splatting Radiance",
    "rank": 32,
    "category": "3D & Photorealism",
    "creator": "Inria / Mark Kellogg",
    "desc": "Photorealistic neural radiance fields rendered in canvas at 60 FPS without 3D polygon meshes.",
    "prompt": "[SKILL ACTIVATED: 3D GAUSSIAN SPLATTING]\nYou are a Neural Rendering & Radiance Field specialist:\n1. Use @mkkellogg/gaussian-splats-3d or WebGL/WebGPU rasterization of 3D ellipsoids with spherical harmonics.\n2. Optimize sort passes using 16-bit float half-precision buffers on the GPU.\n3. Bind camera view-projection matrices to depth-sort splat centers every frame.\n4. Implement progressive LOD streaming for massive radiance point clouds."
  },
  {
    "id": "rive-interactive-motion",
    "name": "Rive State-Machine Physics",
    "rank": 33,
    "category": "Motion & Animation",
    "creator": "Rive.app",
    "desc": "Bone rigging, procedural cursor tracking, and nested state machine animations with 0 frame drops.",
    "prompt": "[SKILL ACTIVATED: RIVE INTERACTIVE MOTION]\nBuild interactive Rive vector animations:\n1. Embed @rive-app/canvas with stateMachines and autoplay.\n2. Retrieve state machine inputs via riveInstance.stateMachineInputs(machineName).\n3. Bind cursor position (xAxis, yAxis) or click triggers directly to state machine boolean/number inputs.\n4. Handle resize events to maintain crisp vector rendering on Retina/High-DPI screens."
  },
  {
    "id": "ast-grep-codemod",
    "name": "ast-grep Structural Rewrite",
    "rank": 34,
    "category": "Tooling & Refactoring",
    "creator": "Herrington Darkholme",
    "desc": "Tree-sitter based AST structural code search and multi-file semantic rewrites without regex errors.",
    "prompt": "[SKILL ACTIVATED: AST-GREP CODEMOD]\nPerform structural AST code transformations:\n1. Use pattern syntax: $MATCH, $$$ARGS to match code structure irrespective of whitespace or linebreaks.\n2. Rewrite API calls, deprecated patterns, and import paths with semantic precision.\n3. Validate syntax tree integrity before committing changes."
  },
  {
    "id": "matter-ragdoll-physics",
    "name": "Matter.js Ragdoll & Verlet Cloth",
    "rank": 35,
    "category": "Motion & Physics",
    "creator": "Codrops / Matter.js",
    "desc": "Interactive 2D skeletal ragdoll physics and draggable verlet cloth simulations in browser.",
    "prompt": "[SKILL ACTIVATED: MATTER.JS RAGDOLL & CLOTH]\nBuild physical ragdolls and verlet simulations:\n1. Construct composite ragdoll bodies using Matter.Bodies and Matter.Constraint for joints.\n2. Build cloth grids using interconnected distance constraints with stiffness and relaxation iterations.\n3. Add pointer tearing interactions: remove constraints when drag tension exceeds threshold."
  },
  {
    "id": "chroma-vector-search",
    "name": "In-Browser Chroma Vector Search",
    "rank": 36,
    "category": "AI & Memory",
    "creator": "Chroma Core Team",
    "desc": "In-browser quantized vector search with cosine similarity and sub-millisecond retrieval.",
    "prompt": "[SKILL ACTIVATED: CHROMA VECTOR SEARCH]\nImplement client-side vector search:\n1. Generate or load quantized vector embeddings (e.g. 384-dimensional).\n2. Compute dot products and cosine similarity using typed Float32Array arrays.\n3. Store vectors in IndexedDB for instant cross-session persistence."
  },
  {
    "id": "haptic-gamepad-api",
    "name": "Gamepad Haptic Force Feedback",
    "rank": 37,
    "category": "Hardware & Immersion",
    "creator": "W3C Gamepad Spec",
    "desc": "Dual-rumble frequency vibration feedback and tactile controller input for interactive web experiences.",
    "prompt": "[SKILL ACTIVATED: HAPTIC GAMEPAD API]\nImplement game controller immersion:\n1. Listen to window.addEventListener('gamepadconnected').\n2. Poll navigator.getGamepads() in requestAnimationFrame.\n3. Trigger dual-rumble vibration: gamepad.vibrationActuator.playEffect('dual-rumble', { startDelay: 0, duration: 150, weakMagnitude: 0.5, strongMagnitude: 0.8 })."
  },
  {
    "id": "web-midi-sequencer",
    "name": "Web MIDI Hardware Sequencer",
    "rank": 38,
    "category": "Audio & Immersion",
    "creator": "Web MIDI Spec",
    "desc": "Real-time hardware synthesizer control and interactive multi-track canvas step sequencers.",
    "prompt": "[SKILL ACTIVATED: WEB MIDI SEQUENCER]\nControl physical and software synthesizers:\n1. Request navigator.requestMIDIAccess({ sysex: false }).\n2. Send MIDI Note On [0x90, note, velocity] and Note Off [0x80, note, 0] messages via output.send().\n3. Render an interactive 16-step grid canvas with tempo BPM sync."
  },
  {
    "id": "mediapipe-gesture-vision",
    "name": "MediaPipe Zero-Server Hand Tracking",
    "rank": 39,
    "category": "Vision & AI",
    "creator": "Google Research",
    "desc": "Real-time webcam hand skeleton and facial gesture tracking running purely in client WebAssembly.",
    "prompt": "[SKILL ACTIVATED: MEDIAPIPE GESTURE VISION]\nBuild touchless gesture-controlled interfaces:\n1. Load @mediapipe/tasks-vision HandLandmarker in WebAssembly.\n2. Process video stream frame-by-frame via requestVideoFrameCallback.\n3. Map index finger tip (landmark 8) and thumb tip (landmark 4) distance for pinch-to-click gestures in 3D canvas."
  },
  {
    "id": "web-codecs-video-gl",
    "name": "WebCodecs Hardware Video Shaders",
    "rank": 40,
    "category": "3D & Shaders",
    "creator": "W3C Media Working Group",
    "desc": "Hardware-accelerated low-latency video frame decoding with real-time WebGL post-processing shaders.",
    "prompt": "[SKILL ACTIVATED: WEBCODECS VIDEO SHADERS]\nProcess video with GPU shaders:\n1. Setup VideoDecoder with output: (videoFrame) => { ... }.\n2. Upload VideoFrame directly to WebGL texture via gl.texImage2D(..., videoFrame) without CPU copy overhead.\n3. Apply chromatic aberration, CRT scanlines, or edge detection fragment shaders in real-time."
  }
];
const MCP_STORE = [
  {
    "id": "shadcn",
    "name": "Shadcn UI Official MCP",
    "rank": 1,
    "category": "UI & Frontend",
    "creator": "shadcn / Vercel",
    "package": "shadcn",
    "cmd": "npx shadcn@latest mcp",
    "desc": "Direct AST component injection, design token resolution, and zero hallucinated props."
  },
  {
    "id": "sequential-thinking",
    "name": "Sequential Thinking MCP",
    "rank": 2,
    "category": "Reasoning & Architecture",
    "creator": "Model Context Protocol / Anthropic",
    "package": "@modelcontextprotocol/server-sequential-thinking",
    "cmd": "npx -y @modelcontextprotocol/server-sequential-thinking",
    "desc": "Dynamic multi-step algorithmic chain-of-thought for complex architectural decisions."
  },
  {
    "id": "playwright",
    "name": "Playwright Visual Testing MCP",
    "rank": 3,
    "category": "Browser & Testing",
    "creator": "Microsoft / ExecuteAutomation",
    "package": "@executeautomation/playwright-mcp-server",
    "cmd": "npx -y @executeautomation/playwright-mcp-server",
    "desc": "Headless Chromium browser automation, full-page visual screenshots, and WebGL verification."
  },
  {
    "id": "figma",
    "name": "Figma Design Tokens MCP",
    "rank": 4,
    "category": "Design Systems",
    "creator": "Model Context Protocol / Figma",
    "package": "@modelcontextprotocol/server-figma",
    "cmd": "npx -y @modelcontextprotocol/server-figma",
    "desc": "Inspect live Figma frames, extract CSS tokens, colors, typography, and layout geometry."
  },
  {
    "id": "memory",
    "name": "Persistent Knowledge Graph MCP",
    "rank": 5,
    "category": "Memory & State",
    "creator": "Model Context Protocol",
    "package": "@modelcontextprotocol/server-memory",
    "cmd": "npx -y @modelcontextprotocol/server-memory",
    "desc": "Session-persistent graph memory tracking codebase facts, dependencies, and architectural decisions."
  },
  {
    "id": "context7",
    "name": "Context7 Live Docs MCP",
    "rank": 6,
    "category": "Documentation",
    "creator": "Context7",
    "package": "@context7/mcp-server",
    "cmd": "npx -y @context7/mcp-server",
    "desc": "Search up-to-date documentation and code examples for any npm library in real time."
  },
  {
    "id": "puppeteer",
    "name": "Puppeteer DevTools MCP",
    "rank": 7,
    "category": "Browser & Testing",
    "creator": "Model Context Protocol",
    "package": "@modelcontextprotocol/server-puppeteer",
    "cmd": "npx -y @modelcontextprotocol/server-puppeteer",
    "desc": "Chrome DevTools protocol integration for console error inspection and network analysis."
  },
  {
    "id": "github",
    "name": "GitHub Full Operations MCP",
    "rank": 8,
    "category": "DevOps & Git",
    "creator": "Model Context Protocol / GitHub",
    "package": "@modelcontextprotocol/server-github",
    "cmd": "npx -y @modelcontextprotocol/server-github",
    "desc": "Create pull requests, manage issues, trigger GitHub Actions workflows, and inspect commits."
  },
  {
    "id": "postgres",
    "name": "PostgreSQL Introspection MCP",
    "rank": 9,
    "category": "Databases",
    "creator": "Model Context Protocol",
    "package": "@modelcontextprotocol/server-postgres",
    "cmd": "npx -y @modelcontextprotocol/server-postgres",
    "desc": "Direct DB schema introspection, migration planning, and safe parameter query execution."
  },
  {
    "id": "supabase",
    "name": "Supabase Cloud MCP",
    "rank": 10,
    "category": "Databases & Backend",
    "creator": "Supabase",
    "package": "@supabase/mcp-server",
    "cmd": "npx -y @supabase/mcp-server",
    "desc": "Manage Supabase Postgres tables, Row Level Security policies, auth users, and storage buckets."
  },
  {
    "id": "filesystem",
    "name": "High-Speed FileSystem MCP",
    "rank": 11,
    "category": "Filesystem",
    "creator": "Model Context Protocol",
    "package": "@modelcontextprotocol/server-filesystem",
    "cmd": "npx -y @modelcontextprotocol/server-filesystem",
    "desc": "Raw high-speed file operations, directory diffing, and batch file manipulation."
  },
  {
    "id": "git",
    "name": "Git Version Control MCP",
    "rank": 12,
    "category": "DevOps & Git",
    "creator": "Model Context Protocol",
    "package": "@modelcontextprotocol/server-git",
    "cmd": "npx -y @modelcontextprotocol/server-git",
    "desc": "Local git branch inspection, atomic commits, diffing, and staging operations."
  },
  {
    "id": "docker",
    "name": "Docker Container Control MCP",
    "rank": 13,
    "category": "DevOps & Infrastructure",
    "creator": "Model Context Protocol",
    "package": "@modelcontextprotocol/server-docker",
    "cmd": "npx -y @modelcontextprotocol/server-docker",
    "desc": "Inspect local containers, view container logs, run builds, and manage Docker Compose."
  },
  {
    "id": "brave-search",
    "name": "Brave Search Live Web MCP",
    "rank": 14,
    "category": "Web Search",
    "creator": "Model Context Protocol / Brave",
    "package": "@modelcontextprotocol/server-brave-search",
    "cmd": "npx -y @modelcontextprotocol/server-brave-search",
    "desc": "Real-time privacy-preserving web search for latest APIs, libraries, and breaking changes."
  },
  {
    "id": "fetch",
    "name": "Web Content Fetcher MCP",
    "rank": 15,
    "category": "Web Scraping",
    "creator": "Model Context Protocol",
    "package": "@modelcontextprotocol/server-fetch",
    "cmd": "npx -y @modelcontextprotocol/server-fetch",
    "desc": "HTML to Markdown web page scraper for documentation and API reference extraction."
  },
  {
    "id": "sentry",
    "name": "Sentry Telemetry MCP",
    "rank": 16,
    "category": "Observability",
    "creator": "Sentry",
    "package": "@sentry/mcp-server",
    "cmd": "npx -y @sentry/mcp-server",
    "desc": "Fetch live production error stack traces, breadcrumbs, and performance spans."
  },
  {
    "id": "linear",
    "name": "Linear Issue Tracking MCP",
    "rank": 17,
    "category": "Project Management",
    "creator": "Linear",
    "package": "@linear/mcp-server",
    "cmd": "npx -y @linear/mcp-server",
    "desc": "Read and update Linear issues, cycle sprints, and link git commits to project tickets."
  },
  {
    "id": "slack",
    "name": "Slack Notification MCP",
    "rank": 18,
    "category": "Communication",
    "creator": "Model Context Protocol / Slack",
    "package": "@modelcontextprotocol/server-slack",
    "cmd": "npx -y @modelcontextprotocol/server-slack",
    "desc": "Post deployment status, test alerts, and build summaries directly into team channels."
  },
  {
    "id": "cloudflare",
    "name": "Cloudflare Edge Infrastructure MCP",
    "rank": 19,
    "category": "Cloud & Edge",
    "creator": "Cloudflare",
    "package": "@cloudflare/mcp-server",
    "cmd": "npx -y @cloudflare/mcp-server",
    "desc": "Deploy Workers, manage KV namespaces, inspect R2 buckets, and configure DNS."
  },
  {
    "id": "aws",
    "name": "AWS Cloud Services MCP",
    "rank": 20,
    "category": "Cloud & Infrastructure",
    "creator": "AWS",
    "package": "@aws/mcp-server",
    "cmd": "npx -y @aws/mcp-server",
    "desc": "Inspect S3 buckets, invoke Lambda functions, and read CloudWatch logs."
  },
  {
    "id": "redis",
    "name": "Redis In-Memory Store MCP",
    "rank": 21,
    "category": "Databases",
    "creator": "Model Context Protocol",
    "package": "@modelcontextprotocol/server-redis",
    "cmd": "npx -y @modelcontextprotocol/server-redis",
    "desc": "Inspect Redis cache keys, monitor pub/sub channels, and query session values."
  },
  {
    "id": "notion",
    "name": "Notion Workspace MCP",
    "rank": 22,
    "category": "Documentation",
    "creator": "Notion",
    "package": "@notionhq/mcp-server",
    "cmd": "npx -y @notionhq/mcp-server",
    "desc": "Sync technical specifications and architecture docs directly into Notion pages."
  },
  {
    "id": "neo4j",
    "name": "Neo4j Graph Database MCP",
    "rank": 23,
    "category": "Databases",
    "creator": "Neo4j",
    "package": "@neo4j/mcp-server",
    "cmd": "npx -y @neo4j/mcp-server",
    "desc": "Execute Cypher graph queries and visualize node relationships."
  },
  {
    "id": "stripe",
    "name": "Stripe Payments MCP",
    "rank": 24,
    "category": "Fintech & Billing",
    "creator": "Stripe",
    "package": "@stripe/mcp-server",
    "cmd": "npx -y @stripe/mcp-server",
    "desc": "Test payment webhooks, verify checkout sessions, and inspect customer invoice events."
  },
  {
    "id": "everart",
    "name": "EverArt AI Generation MCP",
    "rank": 25,
    "category": "AI & Assets",
    "creator": "EverArt",
    "package": "@everart/mcp-server",
    "cmd": "npx -y @everart/mcp-server",
    "desc": "Generate custom 3D textures, UI mockups, and visual assets on the fly."
  },
  {
    "id": "vercel",
    "name": "Vercel Deployment MCP",
    "rank": 26,
    "category": "Cloud & Deployment",
    "creator": "Vercel",
    "package": "@vercel/mcp-server",
    "cmd": "npx -y @vercel/mcp-server",
    "desc": "Trigger preview deployments, inspect build logs, and manage edge domain aliases."
  },
  {
    "id": "google-drive",
    "name": "Google Drive Asset MCP",
    "rank": 27,
    "category": "Storage & Assets",
    "creator": "Model Context Protocol",
    "package": "@modelcontextprotocol/server-gdrive",
    "cmd": "npx -y @modelcontextprotocol/server-gdrive",
    "desc": "Fetch brand guidelines, design briefs, and media assets from Google Drive."
  },
  {
    "id": "mongodb",
    "name": "MongoDB Document MCP",
    "rank": 28,
    "category": "Databases",
    "creator": "MongoDB",
    "package": "@mongodb/mcp-server",
    "cmd": "npx -y @mongodb/mcp-server",
    "desc": "Introspect Mongo collections, run aggregation pipelines, and validate schemas."
  },
  {
    "id": "kubernetes",
    "name": "Kubernetes Cluster MCP",
    "rank": 29,
    "category": "DevOps & Infrastructure",
    "creator": "Kubernetes Community",
    "package": "@k8s/mcp-server",
    "cmd": "npx -y @k8s/mcp-server",
    "desc": "Monitor pod health, stream container logs, and inspect ingress routes."
  },
  {
    "id": "tinybird",
    "name": "Tinybird Real-Time Analytics MCP",
    "rank": 30,
    "category": "Analytics & Data",
    "creator": "Tinybird",
    "package": "@tinybirdco/mcp-server",
    "cmd": "npx -y @tinybirdco/mcp-server",
    "desc": "Real-time ClickHouse SQL pipes and event streaming analytics."
  },
  {
    "id": "midscene",
    "name": "Midscene AI Visual Grounding",
    "rank": 31,
    "category": "Browser & Testing",
    "creator": "Tencent AI",
    "package": "@midscene/web",
    "cmd": "npx -y @midscene/web",
    "desc": "Multimodal web automation controlling complex WebGL and canvas via visual coordinate grounding."
  },
  {
    "id": "blender",
    "name": "Headless Blender 3D MCP",
    "rank": 32,
    "category": "3D & Assets",
    "creator": "Blender Foundation",
    "package": "@modelcontextprotocol/server-blender",
    "cmd": "npx -y @modelcontextprotocol/server-blender",
    "desc": "Headless Blender 3D scene creation, procedural geometry node graphs, and automatic GLTF exports."
  },
  {
    "id": "val-town",
    "name": "Val Town Edge Function MCP",
    "rank": 33,
    "category": "Cloud & Edge",
    "creator": "Val Town",
    "package": "@val-town/mcp-server",
    "cmd": "npx -y @val-town/mcp-server",
    "desc": "Instant serverless TypeScript API deployment and cron triggers directly from chat."
  },
  {
    "id": "chroma",
    "name": "ChromaDB Vector Memory MCP",
    "rank": 34,
    "category": "Databases & Memory",
    "creator": "ChromaDB",
    "package": "@chromadb/mcp-server",
    "cmd": "npx -y @chromadb/mcp-server",
    "desc": "Vector collection management, semantic document embeddings, and hybrid search."
  },
  {
    "id": "obsidian",
    "name": "Obsidian Knowledge Vault MCP",
    "rank": 35,
    "category": "Documentation",
    "creator": "Obsidian Community",
    "package": "@modelcontextprotocol/server-obsidian",
    "cmd": "npx -y @modelcontextprotocol/server-obsidian",
    "desc": "Local Markdown vault search, bidirectional backlink graph navigation, and notes sync."
  },
  {
    "id": "raygun",
    "name": "Raygun Crash Diagnostic MCP",
    "rank": 36,
    "category": "Observability",
    "creator": "Raygun",
    "package": "@raygun/mcp-server",
    "cmd": "npx -y @raygun/mcp-server",
    "desc": "Real-time production crash stacktraces, user session replay correlation, and error alerts."
  },
  {
    "id": "cloudflare-d1",
    "name": "Cloudflare D1 SQL MCP",
    "rank": 37,
    "category": "Databases",
    "creator": "Cloudflare",
    "package": "@cloudflare/mcp-server-d1",
    "cmd": "npx -y @cloudflare/mcp-server-d1",
    "desc": "Direct edge SQLite querying, schema migrations, and instant database branching."
  },
  {
    "id": "linear-cycles",
    "name": "Linear Autonomous Cycles MCP",
    "rank": 38,
    "category": "Project Management",
    "creator": "Linear Team",
    "package": "@modelcontextprotocol/server-linear-cycles",
    "cmd": "npx -y @modelcontextprotocol/server-linear-cycles",
    "desc": "Automated sprint cycle planning, issue triage, and git commit linkage."
  },
  {
    "id": "weaviate",
    "name": "Weaviate Hybrid Search MCP",
    "rank": 39,
    "category": "Databases & Memory",
    "creator": "Weaviate",
    "package": "@weaviate/mcp-server",
    "cmd": "npx -y @weaviate/mcp-server",
    "desc": "Hybrid dense-sparse BM25 vector search and multi-tenant schema introspection."
  },
  {
    "id": "postman",
    "name": "Postman API Workspace MCP",
    "rank": 40,
    "category": "API & Testing",
    "creator": "Postman",
    "package": "@postman/mcp-server",
    "cmd": "npx -y @postman/mcp-server",
    "desc": "API collection mock testing, automated test suite runs, and live OpenAPI synchronization."
  }
];
const CONNECTORS_STORE = [
  {
    "id": "supabase",
    "name": "Supabase Full Backend",
    "rank": 1,
    "category": "Backend as a Service",
    "creator": "Supabase Inc.",
    "sdk": "@supabase/supabase-js",
    "envKey": "SUPABASE_SERVICE_ROLE_KEY",
    "desc": "PostgreSQL, Row-Level Security, Auth, Realtime WebSockets, and Storage."
  },
  {
    "id": "cloudflare",
    "name": "Cloudflare Edge Suite",
    "rank": 2,
    "category": "Edge Infrastructure",
    "creator": "Cloudflare",
    "sdk": "wrangler",
    "envKey": "CLOUDFLARE_API_TOKEN",
    "desc": "Edge Workers, R2 object storage, KV store, and D1 serverless SQL."
  },
  {
    "id": "github",
    "name": "GitHub API & Actions",
    "rank": 3,
    "category": "DevOps & Source Control",
    "creator": "GitHub / Microsoft",
    "sdk": "@octokit/rest",
    "envKey": "GITHUB_TOKEN",
    "desc": "PR automation, issue synchronization, webhook listeners, and CI/CD triggers."
  },
  {
    "id": "stripe",
    "name": "Stripe Billing & Payments",
    "rank": 4,
    "category": "Payments & Subscriptions",
    "creator": "Stripe Inc.",
    "sdk": "stripe",
    "envKey": "STRIPE_SECRET_KEY",
    "desc": "Payment intents, checkout sessions, customer portal, and webhook verification."
  },
  {
    "id": "sentry",
    "name": "Sentry Error Monitoring",
    "rank": 5,
    "category": "Observability & APM",
    "creator": "Sentry",
    "sdk": "@sentry/node",
    "envKey": "SENTRY_DSN",
    "desc": "Real-time crash reporting, performance tracing, and session replay telemetry."
  },
  {
    "id": "vercel",
    "name": "Vercel Edge & Serverless",
    "rank": 6,
    "category": "Hosting & Edge Functions",
    "creator": "Vercel",
    "sdk": "@vercel/sdk",
    "envKey": "VERCEL_TOKEN",
    "desc": "Serverless deployment lifecycle, instant edge caching, and web analytics."
  },
  {
    "id": "neon",
    "name": "Neon Serverless Postgres",
    "rank": 7,
    "category": "Databases",
    "creator": "Neon Inc.",
    "sdk": "@neondatabase/serverless",
    "envKey": "DATABASE_URL",
    "desc": "Instant database branching for PRs, autoscaling, and connection pooling."
  },
  {
    "id": "resend",
    "name": "Resend Transactional Email",
    "rank": 8,
    "category": "Email & Communications",
    "creator": "Resend / Zeno Rocha",
    "sdk": "resend",
    "envKey": "RESEND_API_KEY",
    "desc": "Developer-first email API with React Email templates and high deliverability."
  },
  {
    "id": "clerk",
    "name": "Clerk User Authentication",
    "rank": 9,
    "category": "Auth & Identity",
    "creator": "Clerk",
    "sdk": "@clerk/backend",
    "envKey": "CLERK_SECRET_KEY",
    "desc": "Drop-in user authentication, multi-factor auth, social logins, and session tokens."
  },
  {
    "id": "upstash",
    "name": "Upstash Serverless Redis & QStash",
    "rank": 10,
    "category": "Cache & Message Queues",
    "creator": "Upstash",
    "sdk": "@upstash/redis",
    "envKey": "UPSTASH_REDIS_REST_TOKEN",
    "desc": "HTTP-based serverless Redis for API rate limiting, caching, and background queues."
  },
  {
    "id": "pinata",
    "name": "Pinata IPFS Storage",
    "rank": 11,
    "category": "Decentralized Storage",
    "creator": "Pinata Cloud",
    "sdk": "pinata-web3",
    "envKey": "PINATA_JWT",
    "desc": "Immutable decentralized IPFS asset storage and fast global CDN gateways."
  },
  {
    "id": "posthog",
    "name": "PostHog Product Analytics",
    "rank": 12,
    "category": "Analytics & Experiments",
    "creator": "PostHog",
    "sdk": "posthog-node",
    "envKey": "POSTHOG_API_KEY",
    "desc": "Feature flags, session recording, funnel analysis, and user event tracking."
  },
  {
    "id": "langchain",
    "name": "LangChain Multi-Model Connector",
    "rank": 13,
    "category": "AI & LLM Orchestration",
    "creator": "Harrison Chase / LangChain",
    "sdk": "@langchain/core",
    "envKey": "OPENAI_API_KEY",
    "desc": "Vector embeddings, semantic retrieval (RAG), and multi-provider agent chains."
  },
  {
    "id": "huggingface",
    "name": "Hugging Face Inference",
    "rank": 14,
    "category": "AI Models",
    "creator": "Hugging Face",
    "sdk": "@huggingface/inference",
    "envKey": "HF_TOKEN",
    "desc": "Run open-source models for vision, voice, embeddings, and NLP via cloud inference."
  },
  {
    "id": "algolia",
    "name": "Algolia InstantSearch",
    "rank": 15,
    "category": "Search & Discovery",
    "creator": "Algolia",
    "sdk": "algoliasearch",
    "envKey": "ALGOLIA_ADMIN_KEY",
    "desc": "Sub-10ms search indexing, typo-tolerant search, and faceted filtering."
  },
  {
    "id": "twilio",
    "name": "Twilio SMS & Voice",
    "rank": 16,
    "category": "Communications",
    "creator": "Twilio",
    "sdk": "twilio",
    "envKey": "TWILIO_AUTH_TOKEN",
    "desc": "SMS alerts, WhatsApp notifications, voice calls, and phone number verification."
  },
  {
    "id": "sendgrid",
    "name": "SendGrid High-Volume Email",
    "rank": 17,
    "category": "Email & Communications",
    "creator": "Twilio SendGrid",
    "sdk": "@sendgrid/mail",
    "envKey": "SENDGRID_API_KEY",
    "desc": "High-volume marketing and transactional email delivery with analytics."
  },
  {
    "id": "openrouter",
    "name": "OpenRouter Universal LLM Gateway",
    "rank": 18,
    "category": "AI Inference",
    "creator": "OpenRouter",
    "sdk": "openai",
    "envKey": "OPENROUTER_API_KEY",
    "desc": "Single unified API endpoint to access Claude 3.5, GPT-4o, DeepSeek R1, and Qwen."
  },
  {
    "id": "groq",
    "name": "Groq LPU Ultra-Fast Inference",
    "rank": 19,
    "category": "AI Inference",
    "creator": "Groq Inc.",
    "sdk": "groq-sdk",
    "envKey": "GROQ_API_KEY",
    "desc": "Hardware LPU inference serving Llama 3.3 and Mixtral at 300-800 tokens/sec."
  },
  {
    "id": "elevenlabs",
    "name": "ElevenLabs Realistic Voice AI",
    "rank": 20,
    "category": "Voice & Audio",
    "creator": "ElevenLabs",
    "sdk": "elevenlabs",
    "envKey": "ELEVENLABS_API_KEY",
    "desc": "State-of-the-art neural text-to-speech, voice cloning, and audio sound effects."
  },
  {
    "id": "pusher",
    "name": "Pusher Realtime WebSockets",
    "rank": 21,
    "category": "Real-Time Sync",
    "creator": "Pusher",
    "sdk": "pusher",
    "envKey": "PUSHER_SECRET",
    "desc": "Pub/sub WebSocket channels for live multi-user collaboration and cursor sync."
  },
  {
    "id": "livekit",
    "name": "LiveKit WebRTC Audio/Video",
    "rank": 22,
    "category": "Real-Time Audio/Video",
    "creator": "LiveKit",
    "sdk": "livekit-server-sdk",
    "envKey": "LIVEKIT_API_SECRET",
    "desc": "Scalable WebRTC infrastructure for real-time video rooms and AI voice agents."
  },
  {
    "id": "sanity",
    "name": "Sanity Headless CMS",
    "rank": 23,
    "category": "Content Management",
    "creator": "Sanity.io",
    "sdk": "@sanity/client",
    "envKey": "SANITY_AUTH_TOKEN",
    "desc": "Structured content platform with GROQ querying and real-time visual editing."
  },
  {
    "id": "strapi",
    "name": "Strapi Open-Source Headless CMS",
    "rank": 24,
    "category": "Content Management",
    "creator": "Strapi",
    "sdk": "axios",
    "envKey": "STRAPI_API_TOKEN",
    "desc": "Self-hostable Node.js headless CMS with automatic REST and GraphQL APIs."
  },
  {
    "id": "replicate",
    "name": "Replicate AI Cloud Models",
    "rank": 25,
    "category": "AI Models",
    "creator": "Replicate",
    "sdk": "replicate",
    "envKey": "REPLICATE_API_TOKEN",
    "desc": "Run FLUX image generators, Stable Diffusion, and open models via simple API."
  },
  {
    "id": "deepgram",
    "name": "Deepgram Low-Latency Speech-to-Text",
    "rank": 26,
    "category": "Voice & Audio",
    "creator": "Deepgram",
    "sdk": "@deepgram/sdk",
    "envKey": "DEEPGRAM_API_KEY",
    "desc": "Sub-300ms real-time audio transcription and speech-to-text streaming."
  },
  {
    "id": "auth0",
    "name": "Auth0 Enterprise SSO",
    "rank": 27,
    "category": "Auth & Identity",
    "creator": "Okta / Auth0",
    "sdk": "auth0",
    "envKey": "AUTH0_CLIENT_SECRET",
    "desc": "Enterprise identity, SAML single sign-on, and RBAC user access control."
  },
  {
    "id": "datadog",
    "name": "Datadog Cloud Monitoring",
    "rank": 28,
    "category": "Observability",
    "creator": "Datadog",
    "sdk": "dd-trace",
    "envKey": "DATADOG_API_KEY",
    "desc": "Full-stack APM, distributed tracing, metric dashboards, and log streaming."
  },
  {
    "id": "mixpanel",
    "name": "Mixpanel Cohort Analytics",
    "rank": 29,
    "category": "Analytics",
    "creator": "Mixpanel",
    "sdk": "mixpanel",
    "envKey": "MIXPANEL_TOKEN",
    "desc": "Product usage metrics, retention funnels, and customer journey tracking."
  },
  {
    "id": "daily-co",
    "name": "Daily.co Video Calling API",
    "rank": 30,
    "category": "Real-Time Audio/Video",
    "creator": "Daily.co",
    "sdk": "@daily-co/daily-js",
    "envKey": "DAILY_API_KEY",
    "desc": "Drop-in video call widgets and WebRTC rooms with recording capabilities."
  },
  {
    "id": "sambanova",
    "name": "SambaNova Ultra-Fast Inference",
    "rank": 31,
    "category": "AI Inference",
    "creator": "SambaNova Systems",
    "sdk": "@sambanova/ai",
    "envKey": "SAMBANOVA_API_KEY",
    "desc": "Sub-80ms TTFT on SN40L Reconfigurable Dataflow Units running Llama 3.3."
  },
  {
    "id": "turso",
    "name": "Turso Edge LibSQL",
    "rank": 32,
    "category": "Databases",
    "creator": "ChiselStrike / Turso",
    "sdk": "@libsql/client",
    "envKey": "TURSO_DATABASE_URL",
    "desc": "Sub-5ms SQLite queries with embedded replicas and vector extension support."
  },
  {
    "id": "hyperbolic",
    "name": "Hyperbolic Decentralized GPU",
    "rank": 33,
    "category": "AI Inference",
    "creator": "Hyperbolic Labs",
    "sdk": "openai",
    "envKey": "HYPERBOLIC_API_KEY",
    "desc": "High-throughput open GPU cluster serving DeepSeek R1 at lowest possible cost."
  },
  {
    "id": "together-ai",
    "name": "Together AI Inference Engine",
    "rank": 34,
    "category": "AI Inference",
    "creator": "Together AI",
    "sdk": "together-ai",
    "envKey": "TOGETHER_API_KEY",
    "desc": "Sub-100ms TTFT inference engine with on-demand custom LoRA adapter switching."
  },
  {
    "id": "fireworks-ai",
    "name": "Fireworks FireAttention Engine",
    "rank": 35,
    "category": "AI Inference",
    "creator": "Fireworks AI",
    "sdk": "openai",
    "envKey": "FIREWORKS_API_KEY",
    "desc": "Speculative decoding delivering 400+ tokens/sec on frontier coder models."
  },
  {
    "id": "deepseek-official",
    "name": "DeepSeek Official Reasoning API",
    "rank": 36,
    "category": "AI Inference",
    "creator": "DeepSeek AI",
    "sdk": "openai",
    "envKey": "DEEPSEEK_API_KEY",
    "desc": "Native DeepSeek-R1 reasoning engine with chain-of-thought token streams."
  },
  {
    "id": "axiom",
    "name": "Axiom Cloud Observability",
    "rank": 37,
    "category": "Observability",
    "creator": "Axiom Inc.",
    "sdk": "@axiomhq/js",
    "envKey": "AXIOM_TOKEN",
    "desc": "Serverless 100% event log retention with sub-second dataset queries."
  },
  {
    "id": "inngest",
    "name": "Inngest Durable Execution",
    "rank": 38,
    "category": "Workflows & Queues",
    "creator": "Inngest",
    "sdk": "inngest",
    "envKey": "INNGEST_EVENT_KEY",
    "desc": "Durable serverless step workflows, background jobs, and automatic failure retries."
  },
  {
    "id": "knock",
    "name": "Knock Multi-Channel Notifications",
    "rank": 39,
    "category": "Communications",
    "creator": "Knock Labs",
    "sdk": "@knocklabs/node",
    "envKey": "KNOCK_API_KEY",
    "desc": "In-app notification feeds, push, email, and SMS with smart batching."
  },
  {
    "id": "fal-ai",
    "name": "Fal.ai Fast Media Generation",
    "rank": 40,
    "category": "AI Models",
    "creator": "Fal.ai",
    "sdk": "@fal-ai/serverless-client",
    "envKey": "FAL_KEY",
    "desc": "Sub-second FLUX image and AI video generation API."
  }
];

function getStorageDir() {
  const dir = path.join(os.homedir(), '.venar');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function getSkillsDir() {
  const dir = path.join(getStorageDir(), 'skills');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function getActiveSkillsPath() {
  return path.join(getStorageDir(), 'active_skills.json');
}

function getMcpConfigPath() {
  return path.join(getStorageDir(), 'mcp.json');
}

function getConnectorsConfigPath() {
  return path.join(getStorageDir(), 'connectors.json');
}

function getActiveSkills() {
  try {
    const p = getActiveSkillsPath();
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    }
  } catch (e) {}
  return [];
}

function saveActiveSkills(skillsList) {
  const p = getActiveSkillsPath();
  fs.writeFileSync(p, JSON.stringify(skillsList, null, 2), 'utf8');
}

function isSkillCached(skillId) {
  const p = path.join(getSkillsDir(), skillId + '.md');
  return fs.existsSync(p);
}

function installAndActivateSkill(idOrNum) {
  let skill = null;
  const num = parseInt(idOrNum, 10);
  if (!isNaN(num) && num >= 1 && num <= SKILLS_STORE.length) {
    skill = SKILLS_STORE[num - 1];
  } else {
    skill = SKILLS_STORE.find(s => s.id.toLowerCase() === String(idOrNum).toLowerCase());
  }

  if (!skill) return { error: "Skill '" + idOrNum + "' not found in registry." };

  const skillFilePath = path.join(getSkillsDir(), skill.id + '.md');
  let newlyDownloaded = false;

  if (!fs.existsSync(skillFilePath)) {
    const content = "# Skill: " + skill.name + " (#" + skill.rank + ")\n" +
      "Category: " + skill.category + "\n" +
      "Creator: " + skill.creator + "\n" +
      "Description: " + skill.desc + "\n\n" +
      "## System Prompt Directive:\n" +
      skill.prompt + "\n";
    fs.writeFileSync(skillFilePath, content, 'utf8');
    newlyDownloaded = true;
  }

  const active = getActiveSkills();
  if (!active.includes(skill.id)) {
    active.push(skill.id);
    saveActiveSkills(active);
  }

  return { skill, newlyDownloaded, active: true };
}

function deactivateSkill(idOrNum) {
  let skill = null;
  const num = parseInt(idOrNum, 10);
  if (!isNaN(num) && num >= 1 && num <= SKILLS_STORE.length) {
    skill = SKILLS_STORE[num - 1];
  } else {
    skill = SKILLS_STORE.find(s => s.id.toLowerCase() === String(idOrNum).toLowerCase());
  }

  if (!skill) return { error: "Skill '" + idOrNum + "' not found." };

  let active = getActiveSkills();
  active = active.filter(id => id !== skill.id);
  saveActiveSkills(active);

  return { skill, active: false };
}

function getActiveSkillsPrompt() {
  const activeIds = getActiveSkills();
  if (activeIds.length === 0) return '';

  const prompts = [];
  for (const id of activeIds) {
    const s = SKILLS_STORE.find(item => item.id === id);
    if (s && s.prompt) {
      prompts.push(s.prompt);
    }
  }
  if (prompts.length === 0) return '';
  return '\n--- ACTIVE VENAR SKILLS DIRECTIVES ---\n' + prompts.join('\n\n') + '\n--- END SKILLS DIRECTIVES ---\n';
}

function getMcpConfig() {
  try {
    const p = getMcpConfigPath();
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    }
  } catch (e) {}
  return { mcpServers: {} };
}

function installMcpServer(idOrNum) {
  let mcp = null;
  const num = parseInt(idOrNum, 10);
  if (!isNaN(num) && num >= 1 && num <= MCP_STORE.length) {
    mcp = MCP_STORE[num - 1];
  } else {
    mcp = MCP_STORE.find(m => m.id.toLowerCase() === String(idOrNum).toLowerCase());
  }

  if (!mcp) return { error: "MCP Server '" + idOrNum + "' not found in registry." };

  const config = getMcpConfig();
  if (!config.mcpServers) config.mcpServers = {};

  const parts = mcp.cmd.split(/\s+/);
  const command = parts[0];
  const args = parts.slice(1);

  config.mcpServers[mcp.id] = {
    command,
    args,
    category: mcp.category,
    creator: mcp.creator,
    description: mcp.desc
  };

  fs.writeFileSync(getMcpConfigPath(), JSON.stringify(config, null, 2), 'utf8');
  return { mcp, configPath: getMcpConfigPath() };
}

function getConnectorsConfig() {
  try {
    const p = getConnectorsConfigPath();
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    }
  } catch (e) {}
  return { connectors: {} };
}

function installConnector(idOrNum, keyVal) {
  let conn = null;
  const num = parseInt(idOrNum, 10);
  if (!isNaN(num) && num >= 1 && num <= CONNECTORS_STORE.length) {
    conn = CONNECTORS_STORE[num - 1];
  } else {
    conn = CONNECTORS_STORE.find(c => c.id.toLowerCase() === String(idOrNum).toLowerCase());
  }

  if (!conn) return { error: "Connector '" + idOrNum + "' not found in registry." };

  const config = getConnectorsConfig();
  if (!config.connectors) config.connectors = {};

  config.connectors[conn.id] = {
    name: conn.name,
    category: conn.category,
    creator: conn.creator,
    sdk: conn.sdk,
    envKey: conn.envKey,
    status: 'configured',
    apiKeySet: Boolean(keyVal),
    updatedAt: new Date().toISOString()
  };

  if (keyVal) {
    config.connectors[conn.id].apiKey = keyVal;
  }

  fs.writeFileSync(getConnectorsConfigPath(), JSON.stringify(config, null, 2), 'utf8');
  return { conn, configPath: getConnectorsConfigPath() };
}

function printSkillsCatalog() {
  const activeIds = getActiveSkills();
  console.log('\n' + c.peachBold + '═══ VENAR WORLD-CLASS SKILLS REGISTRY (' + SKILLS_STORE.length + ' Curated Master Skills) ═══' + c.reset);
  console.log(c.dim + '1-Click Download: 1st time downloads to ~/.venar/skills/ • Next time: 0ms Instant Cache!' + c.reset + '\n');

  const categories = [...new Set(SKILLS_STORE.map(s => s.category))];
  categories.forEach(cat => {
    console.log(c.bold + c.magenta + '▸ ' + cat.toUpperCase() + ':' + c.reset);
    const items = SKILLS_STORE.filter(s => s.category === cat);
    items.forEach(s => {
      const isActive = activeIds.includes(s.id);
      const isCached = isSkillCached(s.id);
      const statusBadge = isActive 
        ? c.green + '● ACTIVE' + c.reset 
        : (isCached ? c.cyan + '✓ CACHED' + c.reset : c.dim + '○ AVAILABLE' + c.reset);
      const numStr = '[' + s.rank.toString().padStart(2, ' ') + ']';
      console.log('  ' + c.yellow + numStr + c.reset + ' ' + c.bold + s.name.padEnd(36) + c.reset + ' ' + statusBadge + ' ' + c.dim + '(by ' + s.creator + ')' + c.reset);
      console.log('       ' + c.dim + s.desc + c.reset);
    });
    console.log();
  });

  console.log(c.peachBold + 'Usage:' + c.reset);
  console.log('  ' + c.cyan + '/skill <number|id>' + c.reset + '            - 1-Click Install & Activate (e.g. /skill 31 or /skill webgpu-wgsl-compute)');
  console.log('  ' + c.cyan + '/skill deactivate <number|id>' + c.reset + ' - Deactivate a skill');
  console.log('  ' + c.cyan + '/skills' + c.reset + '                       - View this catalog anytime\n');
}

function printMcpCatalog() {
  const config = getMcpConfig();
  const installedMap = config.mcpServers || {};

  console.log('\n' + c.peachBold + '═══ VENAR WORLD-CLASS MCP REGISTRY (' + MCP_STORE.length + ' Model Context Protocol Servers) ═══' + c.reset);
  console.log(c.dim + 'Saved to ~/.venar/mcp.json • Standard MCP Protocol Compatible' + c.reset + '\n');

  const categories = [...new Set(MCP_STORE.map(m => m.category))];
  categories.forEach(cat => {
    console.log(c.bold + c.cyan + '▸ ' + cat.toUpperCase() + ':' + c.reset);
    const items = MCP_STORE.filter(m => m.category === cat);
    items.forEach(m => {
      const isInstalled = Boolean(installedMap[m.id]);
      const statusBadge = isInstalled ? c.green + '● INSTALLED' + c.reset : c.dim + '○ AVAILABLE' + c.reset;
      const numStr = '[' + m.rank.toString().padStart(2, ' ') + ']';
      console.log('  ' + c.yellow + numStr + c.reset + ' ' + c.bold + m.name.padEnd(36) + c.reset + ' ' + statusBadge + ' ' + c.dim + '(by ' + m.creator + ')' + c.reset);
      console.log('       ' + c.dim + m.desc + c.reset);
      console.log('       ' + c.dim + 'Command: ' + c.white + m.cmd + c.reset);
    });
    console.log();
  });

  console.log(c.peachBold + 'Usage:' + c.reset);
  console.log('  ' + c.cyan + '/mcp <number|id>' + c.reset + ' - 1-Click Auto-Configure MCP server into ~/.venar/mcp.json (e.g. /mcp 31)');
  console.log('  ' + c.cyan + '/mcp' + c.reset + '            - View this catalog anytime\n');
}

function printConnectorsCatalog() {
  const config = getConnectorsConfig();
  const configuredMap = config.connectors || {};

  console.log('\n' + c.peachBold + '═══ VENAR CLOUD & ECOSYSTEM CONNECTORS (' + CONNECTORS_STORE.length + ' Verified Services) ═══' + c.reset);
  console.log(c.dim + 'Saved to ~/.venar/connectors.json • Direct SDK Integration & Env Setup' + c.reset + '\n');

  const categories = [...new Set(CONNECTORS_STORE.map(conn => conn.category))];
  categories.forEach(cat => {
    console.log(c.bold + c.green + '▸ ' + cat.toUpperCase() + ':' + c.reset);
    const items = CONNECTORS_STORE.filter(conn => conn.category === cat);
    items.forEach(conn => {
      const isConf = Boolean(configuredMap[conn.id]);
      const statusBadge = isConf ? c.green + '● CONFIGURED' + c.reset : c.dim + '○ AVAILABLE' + c.reset;
      const numStr = '[' + conn.rank.toString().padStart(2, ' ') + ']';
      console.log('  ' + c.yellow + numStr + c.reset + ' ' + c.bold + conn.name.padEnd(36) + c.reset + ' ' + statusBadge + ' ' + c.dim + '(by ' + conn.creator + ')' + c.reset);
      console.log('       ' + c.dim + conn.desc + c.reset);
      console.log('       ' + c.dim + 'SDK: ' + c.white + conn.sdk + c.reset + ' | Env: ' + c.yellow + conn.envKey + c.reset);
    });
    console.log();
  });

  console.log(c.peachBold + 'Usage:' + c.reset);
  console.log('  ' + c.cyan + '/connector <number|id> [optional_api_key]' + c.reset + ' - 1-Click activate connector in ~/.venar/connectors.json');
  console.log('  ' + c.cyan + '/connectors' + c.reset + '                              - View this catalog anytime\n');
}

module.exports = {
  SKILLS_STORE,
  MCP_STORE,
  CONNECTORS_STORE,
  getActiveSkills,
  getActiveSkillsPrompt,
  installAndActivateSkill,
  deactivateSkill,
  installMcpServer,
  installConnector,
  printSkillsCatalog,
  printMcpCatalog,
  printConnectorsCatalog
};
