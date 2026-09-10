// ==============================================================================
// VENAR REGISTRY STORE: 50 Skills, 50 MCP Servers, 50 Connectors
// Curated world-class tools for 3D, motion, concept sites, and autonomous dev.
// Features 1-click install, 0ms local caching in ~/.venar/, and prompt injection.
// Automatically mirrored to ~/.venar/registry.json!
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
  },
  {
    "id": "stagehand-self-healing-qa",
    "name": "Stagehand Self-Healing Test Engine",
    "rank": 41,
    "category": "Autonomous Testing & QA",
    "creator": "Browserbase / Stagehand",
    "desc": "AI-native browser automation with self-healing semantic element locators and auto-repaired test scripts.",
    "prompt": "[SKILL ACTIVATED: STAGEHAND SELF-HEALING QA]\nYou are an Autonomous Test Engineer using Browserbase Stagehand.\n1. Initialize Stagehand with new Stagehand({ env: 'BROWSERBASE', verbose: 1, debugDom: true }).\n2. Use semantic primitives: page.act({ action: 'click on checkout button' }), page.observe(), and page.extract().\n3. Never use brittle CSS/XPath selectors. Rely on Stagehand's LLM vision & accessibility graph locators.\n4. Auto-heal broken test steps by catching errors and asking Stagehand to re-evaluate alternative interaction routes."
  },
  {
    "id": "touchdesigner-generative-gl",
    "name": "TouchDesigner Generative Visuals",
    "rank": 42,
    "category": "Creative Tech & Visuals",
    "creator": "Derivative / TouchDesigner",
    "desc": "Real-time generative visuals, OSC message routing, audio-reactive TOPs, and GLSL TOP operators.",
    "prompt": "[SKILL ACTIVATED: TOUCHDESIGNER GENERATIVE VISUALS]\nYou are a Creative Technologist specializing in TouchDesigner & real-time generative art:\n1. Structure generative pipelines using Operator families: COMP (containers), TOP (2D texture processing), CHOP (channel data/audio/OSC), SOP (3D geometry).\n2. Wire real-time audio FFT into Audio Device In CHOP -> Math CHOP -> Lag CHOP for smooth visual dampening.\n3. Write custom GLSL TOP shaders with uniform float uTime and sampler2D sInput1 for dynamic feedback loops.\n4. Route bidirectional OSC/WebSockets to control visual parameters from web interfaces."
  },
  {
    "id": "cerebras-wafer-scale-router",
    "name": "Cerebras Wafer-Scale Sub-20ms Router",
    "rank": 43,
    "category": "Model Routing & Latency",
    "creator": "Cerebras Systems",
    "desc": "Sub-20ms Time-to-First-Token (TTFT) and 2,100+ tokens/sec inference routing on CS-3 Wafer-Scale Engine.",
    "prompt": "[SKILL ACTIVATED: CEREBRAS WAFER-SCALE ROUTER]\nYou are a High-Frequency AI Systems Engineer optimizing for ultra-low latency:\n1. Route time-critical interactive agent steps to Cerebras Inference API via OpenAI SDK (baseURL: 'https://api.cerebras.ai/v1').\n2. Target llama3.1-70b or llama3.3-70b with stream: true to achieve 2,100+ tokens/sec generation speed.\n3. Keep TTFT under 25ms by warm-starting requests and pipelining prompt token payloads.\n4. Maintain deterministic latency fallback to local V8 AST parsing when network jitter exceeds 60ms."
  },
  {
    "id": "comfyui-procedural-textures",
    "name": "ComfyUI Generative Texture Pipeline",
    "rank": 44,
    "category": "Creative Tech & 3D",
    "creator": "ComfyOrg",
    "desc": "Headless node-graph execution for real-time procedural PBR textures, normal maps, and shader displacement.",
    "prompt": "[SKILL ACTIVATED: COMFYUI GENERATIVE TEXTURES]\nYou are a Technical Artist building procedural asset generation pipelines:\n1. Construct headless ComfyUI API prompt JSON node graphs (CheckpointLoaderSimple -> KSampler -> VAE Decode).\n2. Generate seamless tiling PBR texture maps (Albedo, Normal, Roughness, Height) for 3D meshes.\n3. Execute prompt graphs via WebSocket API /ws and HTTP POST /prompt on ComfyUI local server.\n4. Automatically convert generated normal maps to WebGL-ready THREE.Texture with sRGBEncoding."
  },
  {
    "id": "agentql-semantic-selectors",
    "name": "AgentQL Resilient Semantic Locators",
    "rank": 45,
    "category": "Autonomous Testing & QA",
    "creator": "TinyFish / AgentQL",
    "desc": "GraphQL-like semantic DOM locators immune to layout changes, CSS refactors, and obfuscated classnames.",
    "prompt": "[SKILL ACTIVATED: AGENTQL RESILIENT SELECTORS]\nYou are an Automation Architect using AgentQL:\n1. Replace brittle CSS selectors with AgentQL queries: `{ search_input, submit_button, result_items[] { title, price } }`.\n2. Wrap Playwright pages with agentql.wrap(page).\n3. Query live elements: const elements = await page.queryElements(QUERY).\n4. Assert UI state using natural language semantic matching that survives complete frontend rewrites."
  },
  {
    "id": "hydra-live-coding-synth",
    "name": "Hydra Live WebGL Video Synthesizer",
    "rank": 46,
    "category": "Creative Tech & Shaders",
    "creator": "Olivia Jack / Hydra",
    "desc": "Real-time modular video synthesizer using GLSL fragment feedback loops, osc, modulate, and kaleid.",
    "prompt": "[SKILL ACTIVATED: HYDRA LIVE VIDEO SYNTH]\nYou are an Analog Video & Live Coding Shader Artist:\n1. Initialize Hydra canvas with new Hydra({ detectAudio: true, makeGlobal: true }).\n2. Chain generative primitives: osc(60, 0.1, 1.5).modulate(noise(3)).kaleid(4).color(1.2, 0.8, 1.5).out().\n3. Map Web Audio frequency bands (a.fft[0] bass, a.fft[2] treble) to modulate scale and rotate parameters.\n4. Render feedback loops with src(o0).modulateRotate(noise(2), 0.05).blend(o0, 0.9).out()."
  },
  {
    "id": "sglang-radix-attention-router",
    "name": "SGLang RadixAttention High-Throughput Router",
    "rank": 47,
    "category": "Model Routing & Latency",
    "creator": "LMSYS / SGLang Team",
    "desc": "Sub-50ms multi-turn agent routing with RadixAttention KV cache reuse and structured JSON schema decoding.",
    "prompt": "[SKILL ACTIVATED: SGLANG RADIX ATTENTION ROUTER]\nYou are an AI Inference Serving Specialist:\n1. Leverage SGLang RadixAttention tree-based KV cache sharing across multi-turn agent sessions.\n2. Enforce strict JSON schema decoding with zero parsing failure using sgl.gen(regex=...) or json_schema.\n3. Batch concurrent agent swarm calls through SGLang Runtime with jump-forward speculative token decoding.\n4. Minimize cold-start overhead by pre-loading common system prompt prefixes into prefix cache."
  },
  {
    "id": "babylon-pbr-physics-engine",
    "name": "Babylon.js Havok Physics & PBR Engine",
    "rank": 48,
    "category": "3D & Physics",
    "creator": "Microsoft Babylon.js Team",
    "desc": "Production WebAssembly Havok physics integration with real-time PBR material sheen and WebGPU rendering.",
    "prompt": "[SKILL ACTIVATED: BABYLON HAVOK & PBR ENGINE]\nYou are a Senior 3D Web Graphics Engineer:\n1. Initialize BABYLON.WebGPUEngine with BABYLON.Scene and HavokPlugin({ wasmBinary }).\n2. Build PBR materials using BABYLON.PBRMaterial with metallicRoughness, clearCoat, and subsurface scattering.\n3. Attach Havok physics aggregates (BABYLON.PhysicsAggregate) with rigid body dynamics and convex hull colliders.\n4. Optimize scene renders using FreezeActiveMeshes, hardware instancing, and Cascaded Shadow Maps (CSM)."
  },
  {
    "id": "deepeval-llm-regression-test",
    "name": "DeepEval Production LLM Regression Engine",
    "rank": 49,
    "category": "Autonomous Testing & QA",
    "creator": "Confident AI / DeepEval",
    "desc": "Automated unit testing for LLM pipelines, hallucination scoring, RAG answer relevancy, and drift alerts.",
    "prompt": "[SKILL ACTIVATED: DEEPEVAL REGRESSION TEST ENGINE]\nYou are an AI Quality & Reliability Architect:\n1. Define test cases with LLMTestCase(input=..., actual_output=..., expected_output=..., retrieval_context=...).\n2. Run assertions using HallucinationMetric(threshold=0.3), AnswerRelevancyMetric(threshold=0.7), and FaithfulnessMetric().\n3. Integrate test suites into GitHub Actions CI pipeline to gate pull requests on LLM regressions.\n4. Track performance drift across model updates and log diagnostic traces to Confident AI platform."
  },
  {
    "id": "deepinfra-serverless-gpu-router",
    "name": "DeepInfra Serverless GPU Router",
    "rank": 50,
    "category": "Model Routing & Latency",
    "creator": "DeepInfra",
    "desc": "Sub-90ms serverless cold-start routing across open-weight models with streaming token economics.",
    "prompt": "[SKILL ACTIVATED: DEEPINFRA SERVERLESS GPU ROUTER]\nYou are an Edge AI Infrastructure Engineer:\n1. Dispatch API calls to DeepInfra endpoint (https://api.deepinfra.com/v1/openai) with pay-per-token pricing.\n2. Route code synthesis to Qwen/Qwen2.5-Coder-32B-Instruct and reasoning to deepseek-ai/DeepSeek-R1.\n3. Stream SSE tokens directly to UI with sub-50ms first-chunk latency.\n4. Implement automatic failover to local model if network latency exceeds 200ms."
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
    "desc": "Direct AST component injection, design token resolution, and zero hallucinated props.",
    "command": "npx shadcn@latest mcp"
  },
  {
    "id": "sequential-thinking",
    "name": "Sequential Thinking MCP",
    "rank": 2,
    "category": "Reasoning & Architecture",
    "creator": "Model Context Protocol / Anthropic",
    "package": "@modelcontextprotocol/server-sequential-thinking",
    "cmd": "npx -y @modelcontextprotocol/server-sequential-thinking",
    "desc": "Dynamic multi-step algorithmic chain-of-thought for complex architectural decisions.",
    "command": "npx -y @modelcontextprotocol/server-sequential-thinking"
  },
  {
    "id": "playwright",
    "name": "Playwright Visual Testing MCP",
    "rank": 3,
    "category": "Browser & Testing",
    "creator": "Microsoft / ExecuteAutomation",
    "package": "@executeautomation/playwright-mcp-server",
    "cmd": "npx -y @executeautomation/playwright-mcp-server",
    "desc": "Headless Chromium browser automation, full-page visual screenshots, and WebGL verification.",
    "command": "npx -y @executeautomation/playwright-mcp-server"
  },
  {
    "id": "figma",
    "name": "Figma Design Tokens MCP",
    "rank": 4,
    "category": "Design Systems",
    "creator": "Model Context Protocol / Figma",
    "package": "@modelcontextprotocol/server-figma",
    "cmd": "npx -y @modelcontextprotocol/server-figma",
    "desc": "Inspect live Figma frames, extract CSS tokens, colors, typography, and layout geometry.",
    "command": "npx -y @modelcontextprotocol/server-figma"
  },
  {
    "id": "memory",
    "name": "Persistent Knowledge Graph MCP",
    "rank": 5,
    "category": "Memory & State",
    "creator": "Model Context Protocol",
    "package": "@modelcontextprotocol/server-memory",
    "cmd": "npx -y @modelcontextprotocol/server-memory",
    "desc": "Session-persistent graph memory tracking codebase facts, dependencies, and architectural decisions.",
    "command": "npx -y @modelcontextprotocol/server-memory"
  },
  {
    "id": "context7",
    "name": "Context7 Live Docs MCP",
    "rank": 6,
    "category": "Documentation",
    "creator": "Context7",
    "package": "@context7/mcp-server",
    "cmd": "npx -y @context7/mcp-server",
    "desc": "Search up-to-date documentation and code examples for any npm library in real time.",
    "command": "npx -y @context7/mcp-server"
  },
  {
    "id": "puppeteer",
    "name": "Puppeteer DevTools MCP",
    "rank": 7,
    "category": "Browser & Testing",
    "creator": "Model Context Protocol",
    "package": "@modelcontextprotocol/server-puppeteer",
    "cmd": "npx -y @modelcontextprotocol/server-puppeteer",
    "desc": "Chrome DevTools protocol integration for console error inspection and network analysis.",
    "command": "npx -y @modelcontextprotocol/server-puppeteer"
  },
  {
    "id": "github",
    "name": "GitHub Full Operations MCP",
    "rank": 8,
    "category": "DevOps & Git",
    "creator": "Model Context Protocol / GitHub",
    "package": "@modelcontextprotocol/server-github",
    "cmd": "npx -y @modelcontextprotocol/server-github",
    "desc": "Create pull requests, manage issues, trigger GitHub Actions workflows, and inspect commits.",
    "command": "npx -y @modelcontextprotocol/server-github"
  },
  {
    "id": "postgres",
    "name": "PostgreSQL Introspection MCP",
    "rank": 9,
    "category": "Databases",
    "creator": "Model Context Protocol",
    "package": "@modelcontextprotocol/server-postgres",
    "cmd": "npx -y @modelcontextprotocol/server-postgres",
    "desc": "Direct DB schema introspection, migration planning, and safe parameter query execution.",
    "command": "npx -y @modelcontextprotocol/server-postgres"
  },
  {
    "id": "supabase",
    "name": "Supabase Cloud MCP",
    "rank": 10,
    "category": "Databases & Backend",
    "creator": "Supabase",
    "package": "@supabase/mcp-server",
    "cmd": "npx -y @supabase/mcp-server",
    "desc": "Manage Supabase Postgres tables, Row Level Security policies, auth users, and storage buckets.",
    "command": "npx -y @supabase/mcp-server"
  },
  {
    "id": "filesystem",
    "name": "High-Speed FileSystem MCP",
    "rank": 11,
    "category": "Filesystem",
    "creator": "Model Context Protocol",
    "package": "@modelcontextprotocol/server-filesystem",
    "cmd": "npx -y @modelcontextprotocol/server-filesystem",
    "desc": "Raw high-speed file operations, directory diffing, and batch file manipulation.",
    "command": "npx -y @modelcontextprotocol/server-filesystem"
  },
  {
    "id": "git",
    "name": "Git Version Control MCP",
    "rank": 12,
    "category": "DevOps & Git",
    "creator": "Model Context Protocol",
    "package": "@modelcontextprotocol/server-git",
    "cmd": "npx -y @modelcontextprotocol/server-git",
    "desc": "Local git branch inspection, atomic commits, diffing, and staging operations.",
    "command": "npx -y @modelcontextprotocol/server-git"
  },
  {
    "id": "docker",
    "name": "Docker Container Control MCP",
    "rank": 13,
    "category": "DevOps & Infrastructure",
    "creator": "Model Context Protocol",
    "package": "@modelcontextprotocol/server-docker",
    "cmd": "npx -y @modelcontextprotocol/server-docker",
    "desc": "Inspect local containers, view container logs, run builds, and manage Docker Compose.",
    "command": "npx -y @modelcontextprotocol/server-docker"
  },
  {
    "id": "brave-search",
    "name": "Brave Search Live Web MCP",
    "rank": 14,
    "category": "Web Search",
    "creator": "Model Context Protocol / Brave",
    "package": "@modelcontextprotocol/server-brave-search",
    "cmd": "npx -y @modelcontextprotocol/server-brave-search",
    "desc": "Real-time privacy-preserving web search for latest APIs, libraries, and breaking changes.",
    "command": "npx -y @modelcontextprotocol/server-brave-search"
  },
  {
    "id": "fetch",
    "name": "Web Content Fetcher MCP",
    "rank": 15,
    "category": "Web Scraping",
    "creator": "Model Context Protocol",
    "package": "@modelcontextprotocol/server-fetch",
    "cmd": "npx -y @modelcontextprotocol/server-fetch",
    "desc": "HTML to Markdown web page scraper for documentation and API reference extraction.",
    "command": "npx -y @modelcontextprotocol/server-fetch"
  },
  {
    "id": "sentry",
    "name": "Sentry Telemetry MCP",
    "rank": 16,
    "category": "Observability",
    "creator": "Sentry",
    "package": "@sentry/mcp-server",
    "cmd": "npx -y @sentry/mcp-server",
    "desc": "Fetch live production error stack traces, breadcrumbs, and performance spans.",
    "command": "npx -y @sentry/mcp-server"
  },
  {
    "id": "linear",
    "name": "Linear Issue Tracking MCP",
    "rank": 17,
    "category": "Project Management",
    "creator": "Linear",
    "package": "@linear/mcp-server",
    "cmd": "npx -y @linear/mcp-server",
    "desc": "Read and update Linear issues, cycle sprints, and link git commits to project tickets.",
    "command": "npx -y @linear/mcp-server"
  },
  {
    "id": "slack",
    "name": "Slack Notification MCP",
    "rank": 18,
    "category": "Communication",
    "creator": "Model Context Protocol / Slack",
    "package": "@modelcontextprotocol/server-slack",
    "cmd": "npx -y @modelcontextprotocol/server-slack",
    "desc": "Post deployment status, test alerts, and build summaries directly into team channels.",
    "command": "npx -y @modelcontextprotocol/server-slack"
  },
  {
    "id": "cloudflare",
    "name": "Cloudflare Edge Infrastructure MCP",
    "rank": 19,
    "category": "Cloud & Edge",
    "creator": "Cloudflare",
    "package": "@cloudflare/mcp-server",
    "cmd": "npx -y @cloudflare/mcp-server",
    "desc": "Deploy Workers, manage KV namespaces, inspect R2 buckets, and configure DNS.",
    "command": "npx -y @cloudflare/mcp-server"
  },
  {
    "id": "aws",
    "name": "AWS Cloud Services MCP",
    "rank": 20,
    "category": "Cloud & Infrastructure",
    "creator": "AWS",
    "package": "@aws/mcp-server",
    "cmd": "npx -y @aws/mcp-server",
    "desc": "Inspect S3 buckets, invoke Lambda functions, and read CloudWatch logs.",
    "command": "npx -y @aws/mcp-server"
  },
  {
    "id": "redis",
    "name": "Redis In-Memory Store MCP",
    "rank": 21,
    "category": "Databases",
    "creator": "Model Context Protocol",
    "package": "@modelcontextprotocol/server-redis",
    "cmd": "npx -y @modelcontextprotocol/server-redis",
    "desc": "Inspect Redis cache keys, monitor pub/sub channels, and query session values.",
    "command": "npx -y @modelcontextprotocol/server-redis"
  },
  {
    "id": "notion",
    "name": "Notion Workspace MCP",
    "rank": 22,
    "category": "Documentation",
    "creator": "Notion",
    "package": "@notionhq/mcp-server",
    "cmd": "npx -y @notionhq/mcp-server",
    "desc": "Sync technical specifications and architecture docs directly into Notion pages.",
    "command": "npx -y @notionhq/mcp-server"
  },
  {
    "id": "neo4j",
    "name": "Neo4j Graph Database MCP",
    "rank": 23,
    "category": "Databases",
    "creator": "Neo4j",
    "package": "@neo4j/mcp-server",
    "cmd": "npx -y @neo4j/mcp-server",
    "desc": "Execute Cypher graph queries and visualize node relationships.",
    "command": "npx -y @neo4j/mcp-server"
  },
  {
    "id": "stripe",
    "name": "Stripe Payments MCP",
    "rank": 24,
    "category": "Fintech & Billing",
    "creator": "Stripe",
    "package": "@stripe/mcp-server",
    "cmd": "npx -y @stripe/mcp-server",
    "desc": "Test payment webhooks, verify checkout sessions, and inspect customer invoice events.",
    "command": "npx -y @stripe/mcp-server"
  },
  {
    "id": "everart",
    "name": "EverArt AI Generation MCP",
    "rank": 25,
    "category": "AI & Assets",
    "creator": "EverArt",
    "package": "@everart/mcp-server",
    "cmd": "npx -y @everart/mcp-server",
    "desc": "Generate custom 3D textures, UI mockups, and visual assets on the fly.",
    "command": "npx -y @everart/mcp-server"
  },
  {
    "id": "vercel",
    "name": "Vercel Deployment MCP",
    "rank": 26,
    "category": "Cloud & Deployment",
    "creator": "Vercel",
    "package": "@vercel/mcp-server",
    "cmd": "npx -y @vercel/mcp-server",
    "desc": "Trigger preview deployments, inspect build logs, and manage edge domain aliases.",
    "command": "npx -y @vercel/mcp-server"
  },
  {
    "id": "google-drive",
    "name": "Google Drive Asset MCP",
    "rank": 27,
    "category": "Storage & Assets",
    "creator": "Model Context Protocol",
    "package": "@modelcontextprotocol/server-gdrive",
    "cmd": "npx -y @modelcontextprotocol/server-gdrive",
    "desc": "Fetch brand guidelines, design briefs, and media assets from Google Drive.",
    "command": "npx -y @modelcontextprotocol/server-gdrive"
  },
  {
    "id": "mongodb",
    "name": "MongoDB Document MCP",
    "rank": 28,
    "category": "Databases",
    "creator": "MongoDB",
    "package": "@mongodb/mcp-server",
    "cmd": "npx -y @mongodb/mcp-server",
    "desc": "Introspect Mongo collections, run aggregation pipelines, and validate schemas.",
    "command": "npx -y @mongodb/mcp-server"
  },
  {
    "id": "kubernetes",
    "name": "Kubernetes Cluster MCP",
    "rank": 29,
    "category": "DevOps & Infrastructure",
    "creator": "Kubernetes Community",
    "package": "@k8s/mcp-server",
    "cmd": "npx -y @k8s/mcp-server",
    "desc": "Monitor pod health, stream container logs, and inspect ingress routes.",
    "command": "npx -y @k8s/mcp-server"
  },
  {
    "id": "tinybird",
    "name": "Tinybird Real-Time Analytics MCP",
    "rank": 30,
    "category": "Analytics & Data",
    "creator": "Tinybird",
    "package": "@tinybirdco/mcp-server",
    "cmd": "npx -y @tinybirdco/mcp-server",
    "desc": "Real-time ClickHouse SQL pipes and event streaming analytics.",
    "command": "npx -y @tinybirdco/mcp-server"
  },
  {
    "id": "midscene",
    "name": "Midscene AI Visual Grounding",
    "rank": 31,
    "category": "Browser & Testing",
    "creator": "Tencent AI",
    "package": "@midscene/web",
    "cmd": "npx -y @midscene/web",
    "desc": "Multimodal web automation controlling complex WebGL and canvas via visual coordinate grounding.",
    "command": "npx -y @midscene/web"
  },
  {
    "id": "blender",
    "name": "Headless Blender 3D MCP",
    "rank": 32,
    "category": "3D & Assets",
    "creator": "Blender Foundation",
    "package": "@modelcontextprotocol/server-blender",
    "cmd": "npx -y @modelcontextprotocol/server-blender",
    "desc": "Headless Blender 3D scene creation, procedural geometry node graphs, and automatic GLTF exports.",
    "command": "npx -y @modelcontextprotocol/server-blender"
  },
  {
    "id": "val-town",
    "name": "Val Town Edge Function MCP",
    "rank": 33,
    "category": "Cloud & Edge",
    "creator": "Val Town",
    "package": "@val-town/mcp-server",
    "cmd": "npx -y @val-town/mcp-server",
    "desc": "Instant serverless TypeScript API deployment and cron triggers directly from chat.",
    "command": "npx -y @val-town/mcp-server"
  },
  {
    "id": "chroma",
    "name": "ChromaDB Vector Memory MCP",
    "rank": 34,
    "category": "Databases & Memory",
    "creator": "ChromaDB",
    "package": "@chromadb/mcp-server",
    "cmd": "npx -y @chromadb/mcp-server",
    "desc": "Vector collection management, semantic document embeddings, and hybrid search.",
    "command": "npx -y @chromadb/mcp-server"
  },
  {
    "id": "obsidian",
    "name": "Obsidian Knowledge Vault MCP",
    "rank": 35,
    "category": "Documentation",
    "creator": "Obsidian Community",
    "package": "@modelcontextprotocol/server-obsidian",
    "cmd": "npx -y @modelcontextprotocol/server-obsidian",
    "desc": "Local Markdown vault search, bidirectional backlink graph navigation, and notes sync.",
    "command": "npx -y @modelcontextprotocol/server-obsidian"
  },
  {
    "id": "raygun",
    "name": "Raygun Crash Diagnostic MCP",
    "rank": 36,
    "category": "Observability",
    "creator": "Raygun",
    "package": "@raygun/mcp-server",
    "cmd": "npx -y @raygun/mcp-server",
    "desc": "Real-time production crash stacktraces, user session replay correlation, and error alerts.",
    "command": "npx -y @raygun/mcp-server"
  },
  {
    "id": "cloudflare-d1",
    "name": "Cloudflare D1 SQL MCP",
    "rank": 37,
    "category": "Databases",
    "creator": "Cloudflare",
    "package": "@cloudflare/mcp-server-d1",
    "cmd": "npx -y @cloudflare/mcp-server-d1",
    "desc": "Direct edge SQLite querying, schema migrations, and instant database branching.",
    "command": "npx -y @cloudflare/mcp-server-d1"
  },
  {
    "id": "linear-cycles",
    "name": "Linear Autonomous Cycles MCP",
    "rank": 38,
    "category": "Project Management",
    "creator": "Linear Team",
    "package": "@modelcontextprotocol/server-linear-cycles",
    "cmd": "npx -y @modelcontextprotocol/server-linear-cycles",
    "desc": "Automated sprint cycle planning, issue triage, and git commit linkage.",
    "command": "npx -y @modelcontextprotocol/server-linear-cycles"
  },
  {
    "id": "weaviate",
    "name": "Weaviate Hybrid Search MCP",
    "rank": 39,
    "category": "Databases & Memory",
    "creator": "Weaviate",
    "package": "@weaviate/mcp-server",
    "cmd": "npx -y @weaviate/mcp-server",
    "desc": "Hybrid dense-sparse BM25 vector search and multi-tenant schema introspection.",
    "command": "npx -y @weaviate/mcp-server"
  },
  {
    "id": "postman",
    "name": "Postman API Workspace MCP",
    "rank": 40,
    "category": "API & Testing",
    "creator": "Postman",
    "package": "@postman/mcp-server",
    "cmd": "npx -y @postman/mcp-server",
    "desc": "API collection mock testing, automated test suite runs, and live OpenAPI synchronization.",
    "command": "npx -y @postman/mcp-server"
  },
  {
    "id": "touchdesigner",
    "name": "TouchDesigner Visual Network MCP",
    "rank": 41,
    "command": "npx -y touchdesigner-mcp",
    "category": "Creative Tech & Visuals",
    "creator": "Derivative / Community",
    "desc": "Programmatic TouchDesigner node creation, parameter binding, and real-time OSC/MIDI signal routing.",
    "cmd": "npx -y touchdesigner-mcp"
  },
  {
    "id": "comfyui",
    "name": "ComfyUI Node Graph Execution MCP",
    "rank": 42,
    "command": "npx -y @artokun/comfyui-mcp",
    "category": "Creative Tech & Generative",
    "creator": "Comfy Org / Artokun",
    "desc": "Headless ComfyUI workflow orchestration, generative texture synthesis, and automated asset generation.",
    "cmd": "npx -y @artokun/comfyui-mcp"
  },
  {
    "id": "spline",
    "name": "Spline 3D Scene Orchestration MCP",
    "rank": 43,
    "command": "npx -y spline-mcp",
    "category": "3D & Creative Tech",
    "creator": "Spline.design",
    "desc": "Programmatic 3D scene editing, materials, cameras, physics, and state-machine trigger binding.",
    "cmd": "npx -y spline-mcp"
  },
  {
    "id": "babylon",
    "name": "Babylon.js Documentation & Scene MCP",
    "rank": 44,
    "command": "npx -y @immersiveidea/babylon-mcp",
    "category": "3D & WebGPU",
    "creator": "Babylon.js Community",
    "desc": "Babylon.js scene graph inspection, WebGPU shader node queries, and Havok physics configuration.",
    "cmd": "npx -y @immersiveidea/babylon-mcp"
  },
  {
    "id": "stagehand",
    "name": "Stagehand Self-Healing Test MCP",
    "rank": 45,
    "command": "npx -y @browserbase/stagehand-mcp",
    "category": "Autonomous Testing & QA",
    "creator": "Browserbase",
    "desc": "Autonomous self-healing browser testing, natural language assertions, and DOM mutation resilience.",
    "cmd": "npx -y @browserbase/stagehand-mcp"
  },
  {
    "id": "agentql",
    "name": "AgentQL Semantic Locator MCP",
    "rank": 46,
    "command": "npx -y agentql-mcp",
    "category": "Autonomous Testing & Scraper",
    "creator": "TinyFish",
    "desc": "Semantic natural language DOM queries, robust to UI redesigns, shadow roots, and dynamic layouts.",
    "cmd": "npx -y agentql-mcp"
  },
  {
    "id": "botgauge",
    "name": "BotGauge Agentic QA MCP",
    "rank": 47,
    "command": "npx -y @botgauge/mcp-server",
    "category": "Autonomous Testing & QA",
    "creator": "BotGauge AI",
    "desc": "Automated test generation, DOM tree regression analysis, and self-healing test execution loops.",
    "cmd": "npx -y @botgauge/mcp-server"
  },
  {
    "id": "cerebras",
    "name": "Cerebras Ultra-Fast Inference MCP",
    "rank": 48,
    "command": "npx -y @cerebras/mcp-server",
    "category": "Model Routing & Latency",
    "creator": "Cerebras Systems",
    "desc": "Sub-20ms wafer-scale LLM execution, real-time code synthesis, and instant agent reasoning.",
    "cmd": "npx -y @cerebras/mcp-server"
  },
  {
    "id": "modal",
    "name": "Modal Labs Serverless GPU MCP",
    "rank": 49,
    "command": "npx -y @modal-labs/mcp-server",
    "category": "Cloud & GPU Infrastructure",
    "creator": "Modal Labs",
    "desc": "Sub-second serverless GPU container spawning, custom CUDA kernel execution, and headless worker management.",
    "cmd": "npx -y @modal-labs/mcp-server"
  },
  {
    "id": "deepeval",
    "name": "DeepEval Autonomous LLM Testing MCP",
    "rank": 50,
    "command": "npx -y @confident-ai/deepeval-mcp",
    "category": "Autonomous Testing & QA",
    "creator": "Confident AI",
    "desc": "Automated LLM evaluation test runs, hallucination unit tests, RAG G-Eval metrics, and CI regression gates.",
    "cmd": "npx -y @confident-ai/deepeval-mcp"
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
    "desc": "PostgreSQL, Row-Level Security, Auth, Realtime WebSockets, and Storage.",
    "env": "SUPABASE_SERVICE_ROLE_KEY"
  },
  {
    "id": "cloudflare",
    "name": "Cloudflare Edge Suite",
    "rank": 2,
    "category": "Edge Infrastructure",
    "creator": "Cloudflare",
    "sdk": "wrangler",
    "envKey": "CLOUDFLARE_API_TOKEN",
    "desc": "Edge Workers, R2 object storage, KV store, and D1 serverless SQL.",
    "env": "CLOUDFLARE_API_TOKEN"
  },
  {
    "id": "github",
    "name": "GitHub API & Actions",
    "rank": 3,
    "category": "DevOps & Source Control",
    "creator": "GitHub / Microsoft",
    "sdk": "@octokit/rest",
    "envKey": "GITHUB_TOKEN",
    "desc": "PR automation, issue synchronization, webhook listeners, and CI/CD triggers.",
    "env": "GITHUB_TOKEN"
  },
  {
    "id": "stripe",
    "name": "Stripe Billing & Payments",
    "rank": 4,
    "category": "Payments & Subscriptions",
    "creator": "Stripe Inc.",
    "sdk": "stripe",
    "envKey": "STRIPE_SECRET_KEY",
    "desc": "Payment intents, checkout sessions, customer portal, and webhook verification.",
    "env": "STRIPE_SECRET_KEY"
  },
  {
    "id": "sentry",
    "name": "Sentry Error Monitoring",
    "rank": 5,
    "category": "Observability & APM",
    "creator": "Sentry",
    "sdk": "@sentry/node",
    "envKey": "SENTRY_DSN",
    "desc": "Real-time crash reporting, performance tracing, and session replay telemetry.",
    "env": "SENTRY_DSN"
  },
  {
    "id": "vercel",
    "name": "Vercel Edge & Serverless",
    "rank": 6,
    "category": "Hosting & Edge Functions",
    "creator": "Vercel",
    "sdk": "@vercel/sdk",
    "envKey": "VERCEL_TOKEN",
    "desc": "Serverless deployment lifecycle, instant edge caching, and web analytics.",
    "env": "VERCEL_TOKEN"
  },
  {
    "id": "neon",
    "name": "Neon Serverless Postgres",
    "rank": 7,
    "category": "Databases",
    "creator": "Neon Inc.",
    "sdk": "@neondatabase/serverless",
    "envKey": "DATABASE_URL",
    "desc": "Instant database branching for PRs, autoscaling, and connection pooling.",
    "env": "DATABASE_URL"
  },
  {
    "id": "resend",
    "name": "Resend Transactional Email",
    "rank": 8,
    "category": "Email & Communications",
    "creator": "Resend / Zeno Rocha",
    "sdk": "resend",
    "envKey": "RESEND_API_KEY",
    "desc": "Developer-first email API with React Email templates and high deliverability.",
    "env": "RESEND_API_KEY"
  },
  {
    "id": "clerk",
    "name": "Clerk User Authentication",
    "rank": 9,
    "category": "Auth & Identity",
    "creator": "Clerk",
    "sdk": "@clerk/backend",
    "envKey": "CLERK_SECRET_KEY",
    "desc": "Drop-in user authentication, multi-factor auth, social logins, and session tokens.",
    "env": "CLERK_SECRET_KEY"
  },
  {
    "id": "upstash",
    "name": "Upstash Serverless Redis & QStash",
    "rank": 10,
    "category": "Cache & Message Queues",
    "creator": "Upstash",
    "sdk": "@upstash/redis",
    "envKey": "UPSTASH_REDIS_REST_TOKEN",
    "desc": "HTTP-based serverless Redis for API rate limiting, caching, and background queues.",
    "env": "UPSTASH_REDIS_REST_TOKEN"
  },
  {
    "id": "pinata",
    "name": "Pinata IPFS Storage",
    "rank": 11,
    "category": "Decentralized Storage",
    "creator": "Pinata Cloud",
    "sdk": "pinata-web3",
    "envKey": "PINATA_JWT",
    "desc": "Immutable decentralized IPFS asset storage and fast global CDN gateways.",
    "env": "PINATA_JWT"
  },
  {
    "id": "posthog",
    "name": "PostHog Product Analytics",
    "rank": 12,
    "category": "Analytics & Experiments",
    "creator": "PostHog",
    "sdk": "posthog-node",
    "envKey": "POSTHOG_API_KEY",
    "desc": "Feature flags, session recording, funnel analysis, and user event tracking.",
    "env": "POSTHOG_API_KEY"
  },
  {
    "id": "langchain",
    "name": "LangChain Multi-Model Connector",
    "rank": 13,
    "category": "AI & LLM Orchestration",
    "creator": "Harrison Chase / LangChain",
    "sdk": "@langchain/core",
    "envKey": "OPENAI_API_KEY",
    "desc": "Vector embeddings, semantic retrieval (RAG), and multi-provider agent chains.",
    "env": "OPENAI_API_KEY"
  },
  {
    "id": "huggingface",
    "name": "Hugging Face Inference",
    "rank": 14,
    "category": "AI Models",
    "creator": "Hugging Face",
    "sdk": "@huggingface/inference",
    "envKey": "HF_TOKEN",
    "desc": "Run open-source models for vision, voice, embeddings, and NLP via cloud inference.",
    "env": "HF_TOKEN"
  },
  {
    "id": "algolia",
    "name": "Algolia InstantSearch",
    "rank": 15,
    "category": "Search & Discovery",
    "creator": "Algolia",
    "sdk": "algoliasearch",
    "envKey": "ALGOLIA_ADMIN_KEY",
    "desc": "Sub-10ms search indexing, typo-tolerant search, and faceted filtering.",
    "env": "ALGOLIA_ADMIN_KEY"
  },
  {
    "id": "twilio",
    "name": "Twilio SMS & Voice",
    "rank": 16,
    "category": "Communications",
    "creator": "Twilio",
    "sdk": "twilio",
    "envKey": "TWILIO_AUTH_TOKEN",
    "desc": "SMS alerts, WhatsApp notifications, voice calls, and phone number verification.",
    "env": "TWILIO_AUTH_TOKEN"
  },
  {
    "id": "sendgrid",
    "name": "SendGrid High-Volume Email",
    "rank": 17,
    "category": "Email & Communications",
    "creator": "Twilio SendGrid",
    "sdk": "@sendgrid/mail",
    "envKey": "SENDGRID_API_KEY",
    "desc": "High-volume marketing and transactional email delivery with analytics.",
    "env": "SENDGRID_API_KEY"
  },
  {
    "id": "openrouter",
    "name": "OpenRouter Universal LLM Gateway",
    "rank": 18,
    "category": "AI Inference",
    "creator": "OpenRouter",
    "sdk": "openai",
    "envKey": "OPENROUTER_API_KEY",
    "desc": "Single unified API endpoint to access Claude 3.5, GPT-4o, DeepSeek R1, and Qwen.",
    "env": "OPENROUTER_API_KEY"
  },
  {
    "id": "groq",
    "name": "Groq LPU Ultra-Fast Inference",
    "rank": 19,
    "category": "AI Inference",
    "creator": "Groq Inc.",
    "sdk": "groq-sdk",
    "envKey": "GROQ_API_KEY",
    "desc": "Hardware LPU inference serving Llama 3.3 and Mixtral at 300-800 tokens/sec.",
    "env": "GROQ_API_KEY"
  },
  {
    "id": "elevenlabs",
    "name": "ElevenLabs Realistic Voice AI",
    "rank": 20,
    "category": "Voice & Audio",
    "creator": "ElevenLabs",
    "sdk": "elevenlabs",
    "envKey": "ELEVENLABS_API_KEY",
    "desc": "State-of-the-art neural text-to-speech, voice cloning, and audio sound effects.",
    "env": "ELEVENLABS_API_KEY"
  },
  {
    "id": "pusher",
    "name": "Pusher Realtime WebSockets",
    "rank": 21,
    "category": "Real-Time Sync",
    "creator": "Pusher",
    "sdk": "pusher",
    "envKey": "PUSHER_SECRET",
    "desc": "Pub/sub WebSocket channels for live multi-user collaboration and cursor sync.",
    "env": "PUSHER_SECRET"
  },
  {
    "id": "livekit",
    "name": "LiveKit WebRTC Audio/Video",
    "rank": 22,
    "category": "Real-Time Audio/Video",
    "creator": "LiveKit",
    "sdk": "livekit-server-sdk",
    "envKey": "LIVEKIT_API_SECRET",
    "desc": "Scalable WebRTC infrastructure for real-time video rooms and AI voice agents.",
    "env": "LIVEKIT_API_SECRET"
  },
  {
    "id": "sanity",
    "name": "Sanity Headless CMS",
    "rank": 23,
    "category": "Content Management",
    "creator": "Sanity.io",
    "sdk": "@sanity/client",
    "envKey": "SANITY_AUTH_TOKEN",
    "desc": "Structured content platform with GROQ querying and real-time visual editing.",
    "env": "SANITY_AUTH_TOKEN"
  },
  {
    "id": "strapi",
    "name": "Strapi Open-Source Headless CMS",
    "rank": 24,
    "category": "Content Management",
    "creator": "Strapi",
    "sdk": "axios",
    "envKey": "STRAPI_API_TOKEN",
    "desc": "Self-hostable Node.js headless CMS with automatic REST and GraphQL APIs.",
    "env": "STRAPI_API_TOKEN"
  },
  {
    "id": "replicate",
    "name": "Replicate AI Cloud Models",
    "rank": 25,
    "category": "AI Models",
    "creator": "Replicate",
    "sdk": "replicate",
    "envKey": "REPLICATE_API_TOKEN",
    "desc": "Run FLUX image generators, Stable Diffusion, and open models via simple API.",
    "env": "REPLICATE_API_TOKEN"
  },
  {
    "id": "deepgram",
    "name": "Deepgram Low-Latency Speech-to-Text",
    "rank": 26,
    "category": "Voice & Audio",
    "creator": "Deepgram",
    "sdk": "@deepgram/sdk",
    "envKey": "DEEPGRAM_API_KEY",
    "desc": "Sub-300ms real-time audio transcription and speech-to-text streaming.",
    "env": "DEEPGRAM_API_KEY"
  },
  {
    "id": "auth0",
    "name": "Auth0 Enterprise SSO",
    "rank": 27,
    "category": "Auth & Identity",
    "creator": "Okta / Auth0",
    "sdk": "auth0",
    "envKey": "AUTH0_CLIENT_SECRET",
    "desc": "Enterprise identity, SAML single sign-on, and RBAC user access control.",
    "env": "AUTH0_CLIENT_SECRET"
  },
  {
    "id": "datadog",
    "name": "Datadog Cloud Monitoring",
    "rank": 28,
    "category": "Observability",
    "creator": "Datadog",
    "sdk": "dd-trace",
    "envKey": "DATADOG_API_KEY",
    "desc": "Full-stack APM, distributed tracing, metric dashboards, and log streaming.",
    "env": "DATADOG_API_KEY"
  },
  {
    "id": "mixpanel",
    "name": "Mixpanel Cohort Analytics",
    "rank": 29,
    "category": "Analytics",
    "creator": "Mixpanel",
    "sdk": "mixpanel",
    "envKey": "MIXPANEL_TOKEN",
    "desc": "Product usage metrics, retention funnels, and customer journey tracking.",
    "env": "MIXPANEL_TOKEN"
  },
  {
    "id": "daily-co",
    "name": "Daily.co Video Calling API",
    "rank": 30,
    "category": "Real-Time Audio/Video",
    "creator": "Daily.co",
    "sdk": "@daily-co/daily-js",
    "envKey": "DAILY_API_KEY",
    "desc": "Drop-in video call widgets and WebRTC rooms with recording capabilities.",
    "env": "DAILY_API_KEY"
  },
  {
    "id": "sambanova",
    "name": "SambaNova Ultra-Fast Inference",
    "rank": 31,
    "category": "AI Inference",
    "creator": "SambaNova Systems",
    "sdk": "@sambanova/ai",
    "envKey": "SAMBANOVA_API_KEY",
    "desc": "Sub-80ms TTFT on SN40L Reconfigurable Dataflow Units running Llama 3.3.",
    "env": "SAMBANOVA_API_KEY"
  },
  {
    "id": "turso",
    "name": "Turso Edge LibSQL",
    "rank": 32,
    "category": "Databases",
    "creator": "ChiselStrike / Turso",
    "sdk": "@libsql/client",
    "envKey": "TURSO_DATABASE_URL",
    "desc": "Sub-5ms SQLite queries with embedded replicas and vector extension support.",
    "env": "TURSO_DATABASE_URL"
  },
  {
    "id": "hyperbolic",
    "name": "Hyperbolic Decentralized GPU",
    "rank": 33,
    "category": "AI Inference",
    "creator": "Hyperbolic Labs",
    "sdk": "openai",
    "envKey": "HYPERBOLIC_API_KEY",
    "desc": "High-throughput open GPU cluster serving DeepSeek R1 at lowest possible cost.",
    "env": "HYPERBOLIC_API_KEY"
  },
  {
    "id": "together-ai",
    "name": "Together AI Inference Engine",
    "rank": 34,
    "category": "AI Inference",
    "creator": "Together AI",
    "sdk": "together-ai",
    "envKey": "TOGETHER_API_KEY",
    "desc": "Sub-100ms TTFT inference engine with on-demand custom LoRA adapter switching.",
    "env": "TOGETHER_API_KEY"
  },
  {
    "id": "fireworks-ai",
    "name": "Fireworks FireAttention Engine",
    "rank": 35,
    "category": "AI Inference",
    "creator": "Fireworks AI",
    "sdk": "openai",
    "envKey": "FIREWORKS_API_KEY",
    "desc": "Speculative decoding delivering 400+ tokens/sec on frontier coder models.",
    "env": "FIREWORKS_API_KEY"
  },
  {
    "id": "deepseek-official",
    "name": "DeepSeek Official Reasoning API",
    "rank": 36,
    "category": "AI Inference",
    "creator": "DeepSeek AI",
    "sdk": "openai",
    "envKey": "DEEPSEEK_API_KEY",
    "desc": "Native DeepSeek-R1 reasoning engine with chain-of-thought token streams.",
    "env": "DEEPSEEK_API_KEY"
  },
  {
    "id": "axiom",
    "name": "Axiom Cloud Observability",
    "rank": 37,
    "category": "Observability",
    "creator": "Axiom Inc.",
    "sdk": "@axiomhq/js",
    "envKey": "AXIOM_TOKEN",
    "desc": "Serverless 100% event log retention with sub-second dataset queries.",
    "env": "AXIOM_TOKEN"
  },
  {
    "id": "inngest",
    "name": "Inngest Durable Execution",
    "rank": 38,
    "category": "Workflows & Queues",
    "creator": "Inngest",
    "sdk": "inngest",
    "envKey": "INNGEST_EVENT_KEY",
    "desc": "Durable serverless step workflows, background jobs, and automatic failure retries.",
    "env": "INNGEST_EVENT_KEY"
  },
  {
    "id": "knock",
    "name": "Knock Multi-Channel Notifications",
    "rank": 39,
    "category": "Communications",
    "creator": "Knock Labs",
    "sdk": "@knocklabs/node",
    "envKey": "KNOCK_API_KEY",
    "desc": "In-app notification feeds, push, email, and SMS with smart batching.",
    "env": "KNOCK_API_KEY"
  },
  {
    "id": "fal-ai",
    "name": "Fal.ai Fast Media Generation",
    "rank": 40,
    "category": "AI Models",
    "creator": "Fal.ai",
    "sdk": "@fal-ai/serverless-client",
    "envKey": "FAL_KEY",
    "desc": "Sub-second FLUX image and AI video generation API.",
    "env": "FAL_KEY"
  },
  {
    "id": "cerebras",
    "name": "Cerebras Wafer-Scale Engine",
    "rank": 41,
    "sdk": "@cerebras/cerebras_cloud_sdk",
    "env": "CEREBRAS_API_KEY",
    "category": "AI Inference & Model Routing",
    "creator": "Cerebras Systems",
    "desc": "World-record 2,100+ tokens/sec, sub-20ms TTFT on CS-3 Wafer-Scale Engine running Llama 3.1 & 3.3.",
    "envKey": "CEREBRAS_API_KEY"
  },
  {
    "id": "stagehand",
    "name": "Stagehand Self-Healing Test Connector",
    "rank": 42,
    "sdk": "@browserbase/stagehand",
    "env": "BROWSERBASE_API_KEY",
    "category": "Autonomous Testing & QA",
    "creator": "Browserbase",
    "desc": "AI-native test automation that self-heals broken locators and validates dynamic WebGL/DOM UI flows.",
    "envKey": "BROWSERBASE_API_KEY"
  },
  {
    "id": "deepinfra",
    "name": "DeepInfra Serverless GPU Inference",
    "rank": 43,
    "sdk": "openai",
    "env": "DEEPINFRA_TOKEN",
    "category": "AI Inference & Model Routing",
    "creator": "DeepInfra",
    "desc": "Sub-50ms TTFT serverless GPU inference with cost-efficient token routing for open weights.",
    "envKey": "DEEPINFRA_TOKEN"
  },
  {
    "id": "agentql",
    "name": "AgentQL Semantic Locator Connector",
    "rank": 44,
    "sdk": "agentql",
    "env": "AGENTQL_API_KEY",
    "category": "Autonomous Testing & Data",
    "creator": "TinyFish",
    "desc": "Natural language queries that locate UI elements regardless of DOM mutations, CSS redesigns, or obfuscation.",
    "envKey": "AGENTQL_API_KEY"
  },
  {
    "id": "baseten",
    "name": "Baseten Low-Latency Model Serving",
    "rank": 45,
    "sdk": "@baseten/client",
    "env": "BASETEN_API_KEY",
    "category": "AI Inference & Model Routing",
    "creator": "Baseten",
    "desc": "Sub-30ms model serving with Truss on dedicated bare-metal GPUs and instant cold-start scale.",
    "envKey": "BASETEN_API_KEY"
  },
  {
    "id": "modal",
    "name": "Modal Labs Serverless Container GPU",
    "rank": 46,
    "sdk": "modal",
    "env": "MODAL_TOKEN_ID",
    "category": "Cloud & GPU Compute",
    "creator": "Modal Labs",
    "desc": "Spawns serverless H100/A100 GPU containers in < 1 second for parallel batch workloads and custom inference.",
    "envKey": "MODAL_TOKEN_ID"
  },
  {
    "id": "deepeval",
    "name": "DeepEval Continuous LLM Testing",
    "rank": 47,
    "sdk": "deepeval",
    "env": "CONFIDENT_AI_API_KEY",
    "category": "Autonomous Testing & QA",
    "creator": "Confident AI",
    "desc": "Production LLM unit testing, hallucination regression suites, and automated synthetic test generation.",
    "envKey": "CONFIDENT_AI_API_KEY"
  },
  {
    "id": "cloudflare-workers-ai",
    "name": "Cloudflare Workers AI Edge Router",
    "rank": 48,
    "sdk": "@cloudflare/workers-ai",
    "env": "CLOUDFLARE_API_TOKEN",
    "category": "AI Inference & Model Routing",
    "creator": "Cloudflare",
    "desc": "Sub-50ms global edge model execution across Cloudflare's 300+ city data centers without GPU cold starts.",
    "envKey": "CLOUDFLARE_API_TOKEN"
  },
  {
    "id": "browserbase",
    "name": "Browserbase Headless Browser Cloud",
    "rank": 49,
    "sdk": "@browserbasehq/sdk",
    "env": "BROWSERBASE_API_KEY",
    "category": "Autonomous Testing & Infrastructure",
    "creator": "Browserbase",
    "desc": "Stealth headless Chromium sessions with integrated residential proxies, captcha solving, and session replay.",
    "envKey": "BROWSERBASE_API_KEY"
  },
  {
    "id": "sglang",
    "name": "SGLang High-Performance Engine",
    "rank": 50,
    "sdk": "openai",
    "env": "SGLANG_API_KEY",
    "category": "AI Inference & Model Routing",
    "creator": "LMSYS / SGLang",
    "desc": "High-throughput multi-agent serving engine with RadixAttention cache reuse and sub-40ms agent turns.",
    "envKey": "SGLANG_API_KEY"
  }
];

// File system paths in ~/.venar/
const VENAR_DIR = path.join(os.homedir(), '.venar');
const SKILLS_DIR = path.join(VENAR_DIR, 'skills');
const ACTIVE_SKILLS_FILE = path.join(VENAR_DIR, 'active_skills.json');
const MCP_CONFIG_FILE = path.join(VENAR_DIR, 'mcp.json');
const CONNECTORS_CONFIG_FILE = path.join(VENAR_DIR, 'connectors.json');
const MASTER_REGISTRY_FILE = path.join(VENAR_DIR, 'registry.json');

// Ensure ~/.venar directories exist
function ensureDirs() {
  if (!fs.existsSync(VENAR_DIR)) fs.mkdirSync(VENAR_DIR, { recursive: true });
  if (!fs.existsSync(SKILLS_DIR)) fs.mkdirSync(SKILLS_DIR, { recursive: true });
  if (!fs.existsSync(MASTER_REGISTRY_FILE)) {
    fs.writeFileSync(MASTER_REGISTRY_FILE, JSON.stringify({
      version: '2.0.0',
      total_skills: SKILLS_STORE.length,
      total_mcps: MCP_STORE.length,
      total_connectors: CONNECTORS_STORE.length,
      skills: SKILLS_STORE,
      mcps: MCP_STORE,
      connectors: CONNECTORS_STORE
    }, null, 2), 'utf-8');
  }
}

// -----------------------------------------------------------------------------
// SKILLS ENGINE: 1-Click Install, 0ms Cache, & Prompt Injection
// -----------------------------------------------------------------------------
function getActiveSkills() {
  ensureDirs();
  if (!fs.existsSync(ACTIVE_SKILLS_FILE)) return ['ui-ux-pro-max', 'glsl-raymarching'];
  try {
    return JSON.parse(fs.readFileSync(ACTIVE_SKILLS_FILE, 'utf-8'));
  } catch {
    return ['ui-ux-pro-max', 'glsl-raymarching'];
  }
}

function saveActiveSkills(skills) {
  ensureDirs();
  fs.writeFileSync(ACTIVE_SKILLS_FILE, JSON.stringify(skills, null, 2));
}

function installAndActivateSkill(skillQuery) {
  ensureDirs();
  const skill = SKILLS_STORE.find(s => 
    s.id.toLowerCase() === skillQuery.toLowerCase() || 
    s.rank === parseInt(skillQuery) ||
    s.name.toLowerCase().includes(skillQuery.toLowerCase())
  );

  if (!skill) {
    return { error: "Skill '" + skillQuery + "' not found in VENAR registry. Run 'venar /skills' to see all available skills." };
  }

  const skillPath = path.join(SKILLS_DIR, skill.id + '.md');
  const newlyDownloaded = !fs.existsSync(skillPath);
  const skillContent = '# VENAR SKILL: ' + skill.name + '\nRank: #' + skill.rank + '\nCategory: ' + skill.category + '\nCreator: ' + skill.creator + '\n\n' + skill.desc + '\n\n## Directive\n' + skill.prompt + '\n';
  fs.writeFileSync(skillPath, skillContent, 'utf-8');

  const active = getActiveSkills();
  if (!active.includes(skill.id)) {
    active.push(skill.id);
    saveActiveSkills(active);
  }

  return { skill, newlyDownloaded };
}

function deactivateSkill(skillQuery) {
  ensureDirs();
  const skill = SKILLS_STORE.find(s => 
    s.id.toLowerCase() === skillQuery.toLowerCase() || 
    s.rank === parseInt(skillQuery) ||
    s.name.toLowerCase().includes(skillQuery.toLowerCase())
  );

  if (!skill) return { error: "Skill '" + skillQuery + "' not found." };

  let active = getActiveSkills();
  active = active.filter(id => id !== skill.id);
  saveActiveSkills(active);
  return { skill };
}

function getActiveSkillsPrompt() {
  const activeIds = getActiveSkills();
  const activeSkills = SKILLS_STORE.filter(s => activeIds.includes(s.id));
  if (activeSkills.length === 0) return '';
  return activeSkills.map(s => s.prompt).join('\n\n') + '\n';
}

// -----------------------------------------------------------------------------
// MCP SERVERS ENGINE: 1-Click Auto-Configuration
// -----------------------------------------------------------------------------
function installMcpServer(mcpQuery) {
  ensureDirs();
  const mcp = MCP_STORE.find(m => 
    m.id.toLowerCase() === mcpQuery.toLowerCase() || 
    m.rank === parseInt(mcpQuery) ||
    m.name.toLowerCase().includes(mcpQuery.toLowerCase())
  );

  if (!mcp) {
    return { error: "MCP server '" + mcpQuery + "' not found. Run 'venar /mcp' to view all available servers." };
  }

  let mcpConfig = { mcpServers: {} };
  if (fs.existsSync(MCP_CONFIG_FILE)) {
    try {
      mcpConfig = JSON.parse(fs.readFileSync(MCP_CONFIG_FILE, 'utf-8'));
      if (!mcpConfig.mcpServers) mcpConfig.mcpServers = {};
    } catch {}
  }

  const rawCmd = mcp.command || mcp.cmd;
  const parts = rawCmd.split(' ');
  const cmd = parts[0];
  const args = parts.slice(1);

  mcpConfig.mcpServers[mcp.id] = {
    command: cmd,
    args: args,
    env: {}
  };

  fs.writeFileSync(MCP_CONFIG_FILE, JSON.stringify(mcpConfig, null, 2), 'utf-8');
  return { mcp: { ...mcp, cmd: rawCmd } };
}

// -----------------------------------------------------------------------------
// CONNECTORS ENGINE: 1-Click API & SDK Provisioning
// -----------------------------------------------------------------------------
function installConnector(connQuery, apiKey) {
  ensureDirs();
  const conn = CONNECTORS_STORE.find(cn => 
    cn.id.toLowerCase() === connQuery.toLowerCase() || 
    cn.rank === parseInt(connQuery) ||
    cn.name.toLowerCase().includes(connQuery.toLowerCase())
  );

  if (!conn) {
    return { error: "Connector '" + connQuery + "' not found. Run 'venar /connectors' to view all available backends." };
  }

  let connConfig = { connectors: {} };
  if (fs.existsSync(CONNECTORS_CONFIG_FILE)) {
    try {
      connConfig = JSON.parse(fs.readFileSync(CONNECTORS_CONFIG_FILE, 'utf-8'));
      if (!connConfig.connectors) connConfig.connectors = {};
    } catch {}
  }

  const envVar = conn.env || conn.envKey;

  connConfig.connectors[conn.id] = {
    name: conn.name,
    sdk: conn.sdk,
    env: envVar,
    configured: true,
    apiKey: apiKey || `process.env.${envVar} || ''`
  };

  fs.writeFileSync(CONNECTORS_CONFIG_FILE, JSON.stringify(connConfig, null, 2), 'utf-8');
  return { conn: { ...conn, envKey: envVar } };
}

// -----------------------------------------------------------------------------
// PRINT CATALOGS
// -----------------------------------------------------------------------------
function printSkillsCatalog() {
  const active = getActiveSkills();
  console.log(`\n${c.peachBold}═══ VENAR WORLD-CLASS SKILLS REGISTRY (${SKILLS_STORE.length} Curated Master Skills) ═══${c.reset}`);
  console.log(`${c.dim}1-Click Download: 1st time downloads to ~/.venar/skills/ • Next time: 0ms Instant Cache!${c.reset}\n`);

  const categories = {};
  SKILLS_STORE.forEach(s => {
    if (!categories[s.category]) categories[s.category] = [];
    categories[s.category].push(s);
  });

  for (const [cat, skills] of Object.entries(categories)) {
    console.log(`${c.peachBold}▸ ${cat.toUpperCase()}:${c.reset}`);
    skills.forEach(s => {
      const isActive = active.includes(s.id);
      const statusBadge = isActive 
        ? `${c.green}● ACTIVE${c.reset}` 
        : `${c.dim}○ AVAILABLE${c.reset}`;
      const num = String(s.rank).padStart(2, ' ');
      console.log(`  ${c.peach}[${num}]${c.reset} ${c.bold}${s.name.padEnd(36)}${c.reset} ${statusBadge} ${c.dim}(by ${s.creator})${c.reset}`);
      console.log(`       ${c.dim}${s.desc}${c.reset}`);
    });
    console.log('');
  }

  console.log(`${c.bold}Usage:${c.reset}`);
  console.log(`  ${c.cyan}/skill <number|id>${c.reset}            - 1-Click Install & Activate (e.g. /skill 41 or /skill stagehand-self-healing-qa)`);
  console.log(`  ${c.cyan}/skill deactivate <number|id>${c.reset} - Deactivate a skill`);
  console.log(`  ${c.cyan}/skills${c.reset}                       - View this catalog anytime\n`);
}

function printMcpCatalog() {
  console.log(`\n${c.peachBold}═══ VENAR MCP SERVER REGISTRY (${MCP_STORE.length} Verified Production MCPs) ═══${c.reset}`);
  console.log(`${c.dim}Zero-friction Model Context Protocol integration with Claude, Cursor & VENAR Swarm.${c.reset}\n`);

  let configured = [];
  if (fs.existsSync(MCP_CONFIG_FILE)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(MCP_CONFIG_FILE, 'utf-8'));
      configured = Object.keys(cfg.mcpServers || {});
    } catch {}
  }

  const categories = {};
  MCP_STORE.forEach(m => {
    if (!categories[m.category]) categories[m.category] = [];
    categories[m.category].push(m);
  });

  for (const [cat, mcps] of Object.entries(categories)) {
    console.log(`${c.peachBold}▸ ${cat.toUpperCase()}:${c.reset}`);
    mcps.forEach(m => {
      const isConfigured = configured.includes(m.id);
      const statusBadge = isConfigured 
        ? `${c.green}● CONFIGURED${c.reset}` 
        : `${c.dim}○ AVAILABLE${c.reset}`;
      const num = String(m.rank).padStart(2, ' ');
      const rawCmd = m.command || m.cmd;
      console.log(`  ${c.peach}[${num}]${c.reset} ${c.bold}${m.name.padEnd(35)}${c.reset} ${statusBadge} ${c.dim}(by ${m.creator})${c.reset}`);
      console.log(`       ${c.dim}${m.desc}${c.reset}`);
      console.log(`       ${c.cyan}Command: ${rawCmd}${c.reset}`);
    });
    console.log('');
  }

  console.log(`${c.bold}Usage:${c.reset}`);
  console.log(`  ${c.cyan}/mcp <number|id>${c.reset} - 1-Click Auto-Configure MCP server into ~/.venar/mcp.json (e.g. /mcp 41)`);
  console.log(`  ${c.cyan}/mcp${c.reset}            - View this catalog anytime\n`);
}

function printConnectorsCatalog() {
  console.log(`\n${c.peachBold}═══ VENAR PRODUCTION CONNECTORS REGISTRY (${CONNECTORS_STORE.length} Curated Backends) ═══${c.reset}`);
  console.log(`${c.dim}1-Click SDK wiring & env binding for databases, auth, payments, search & messaging.${c.reset}\n`);

  let configured = [];
  if (fs.existsSync(CONNECTORS_CONFIG_FILE)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(CONNECTORS_CONFIG_FILE, 'utf-8'));
      configured = Object.keys(cfg.connectors || {});
    } catch {}
  }

  const categories = {};
  CONNECTORS_STORE.forEach(cn => {
    if (!categories[cn.category]) categories[cn.category] = [];
    categories[cn.category].push(cn);
  });

  for (const [cat, conns] of Object.entries(categories)) {
    console.log(`${c.peachBold}▸ ${cat.toUpperCase()}:${c.reset}`);
    conns.forEach(cn => {
      const isConfigured = configured.includes(cn.id);
      const statusBadge = isConfigured 
        ? `${c.green}● CONFIGURED${c.reset}` 
        : `${c.dim}○ AVAILABLE${c.reset}`;
      const num = String(cn.rank).padStart(2, ' ');
      const envVar = cn.env || cn.envKey;
      console.log(`  ${c.peach}[${num}]${c.reset} ${c.bold}${cn.name.padEnd(34)}${c.reset} ${statusBadge} ${c.dim}(by ${cn.creator})${c.reset}`);
      console.log(`       ${c.dim}${cn.desc}${c.reset}`);
      console.log(`       ${c.cyan}SDK: ${cn.sdk}${c.reset} | ${c.yellow}Env: ${envVar}${c.reset}`);
    });
    console.log('');
  }

  console.log(`${c.bold}Usage:${c.reset}`);
  console.log(`  ${c.cyan}/connector <number|id> [optional_api_key]${c.reset} - 1-Click activate connector in ~/.venar/connectors.json`);
  console.log(`  ${c.cyan}/connectors${c.reset}                              - View this catalog anytime\n`);
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
