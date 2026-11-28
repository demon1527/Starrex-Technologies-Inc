/* =========================================================
   STARREX – Planet background (Three.js)
   Earth (home) + Saturn (projects) + Mars (services) + Moon (software)
   + a Milky Way galaxy (contact). About shows no planet.
   No texture downloads needed.
 
   Self-contained classic script (no import statements), so it
   works when loaded from /public in a Vite / React project.
   Requires the global THREE (r128 UMD build) and <canvas id="planet">.
 
   Page switching API (called from React):
     window.StarrexPlanets.show("earth")   // Home
     window.StarrexPlanets.show("saturn")  // Projects
     window.StarrexPlanets.show("mars")    // Services
     window.StarrexPlanets.show("moon")    // Software Development
     window.StarrexPlanets.show("none")    // About: the planet leaves, nothing arrives
     window.StarrexPlanets.show("galaxy")  // Contact: the planet leaves, the galaxy fades in
 
   Stability:
   - WebGL availability protection
   - Single animation loop
   - Pause when tab is hidden
   - WebGL context-loss handling
   - Resize handling
   - Reduced-motion support
========================================================= */
 
(() => {
  "use strict";
 
  /* ---------- INITIAL SAFETY CHECKS ---------- */
  if (document.body.dataset.planet === "moon") return;
 
  const canvas = document.getElementById("planet");
 
  if (!canvas) {
    console.warn("Starrex Planets: Canvas #planet was not found.");
    return;
  }
 
  if (!window.THREE) {
    console.warn("Starrex Planets: Three.js is not available.");
    return;
  }
 
  // Safety net in case the page CSS does not position the canvas.
  if (getComputedStyle(canvas).position === "static") {
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "-1";
    canvas.style.pointerEvents = "none";
  }
 
  /* =========================================================
     INLINED HELPERS
  ========================================================= */
 
  function createAnimationLoop({ onFrame, shouldRun }) {
    let id = 0;
    let disposed = false;
 
    function tick() {
      id = 0;
      if (disposed || !shouldRun()) return;
      if (onFrame() === false) return;
      id = requestAnimationFrame(tick);
    }
 
    function stop() {
      if (id) {
        cancelAnimationFrame(id);
        id = 0;
      }
    }
 
    return {
      start() {
        if (id || disposed || !shouldRun()) return;
        id = requestAnimationFrame(tick);
      },
      stop,
      dispose() {
        disposed = true;
        stop();
      },
    };
  }
 
  function createVisibilityController({ onVisibilityChange }) {
    const handler = () => onVisibilityChange(document.hidden);
    document.addEventListener("visibilitychange", handler);
 
    return {
      dispose() {
        document.removeEventListener("visibilitychange", handler);
      },
    };
  }
 
  function createViewportController({ renderer, camera, onResize }) {
    let queued = false;
    let observer = null;
 
    function resize() {
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;
      if (width < 1 || height < 1) return;
 
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
 
      const aspect = width / height;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
 
      const halfViewHeight =
        Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
 
      onResize({
        width,
        height,
        portrait: aspect < 1,
        halfViewHeight,
        halfViewWidth: halfViewHeight * aspect,
      });
    }
 
    function scheduleResize() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        resize();
      });
    }
 
    window.addEventListener("resize", scheduleResize, { passive: true });
 
    if (window.ResizeObserver) {
      observer = new ResizeObserver(scheduleResize);
      observer.observe(canvas);
    }
 
    return {
      resize,
      dispose() {
        window.removeEventListener("resize", scheduleResize);
        if (observer) observer.disconnect();
      },
    };
  }
 
  /* ---------- RENDERER ---------- */
  let renderer;
 
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
  } catch (error) {
    console.warn("Starrex Planets: WebGL could not be initialized.", error);
    return;
  }
 
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
 
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.z = 10;
 
  // One group per planet; the page decides which one is present.
  const group = new THREE.Group();        // Saturn
  const earthGroup = new THREE.Group();   // Earth
  const marsGroup = new THREE.Group();    // Mars
  const moonGroup = new THREE.Group();    // Moon
  scene.add(group, earthGroup, marsGroup, moonGroup);
 
  const PLANET_R = 2.0;
  const EARTH_R = 2.3;
  const MARS_R = 2.0;
  const MOON_R = 1.7;
  const FLATTEN = 0.93;
  const SUN = new THREE.Vector3(-0.9, 0.3, 0.5).normalize();
 
  /* ---------- HELPERS ---------- */
  let seed = 11;
 
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
 
  function smoothArr(arr, k) {
    return arr.map((_, i) => {
      let s = 0;
      let n = 0;
 
      for (let j = -k; j <= k; j++) {
        const idx = i + j;
 
        if (idx >= 0 && idx < arr.length) {
          s += arr[idx];
          n++;
        }
      }
 
      return s / n;
    });
  }
 
  function normArr(arr) {
    let lo = Infinity;
    let hi = -Infinity;
 
    for (const v of arr) {
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
 
    return arr.map((v) => (v - lo) / (hi - lo || 1));
  }
 
  function ramp(t, stops) {
    t = Math.min(Math.max(t, 0), 1);
 
    for (let i = 0; i < stops.length - 1; i++) {
      const [t0, c0] = stops[i];
      const [t1, c1] = stops[i + 1];
 
      if (t <= t1) {
        const f = (t - t0) / (t1 - t0);
 
        return [
          c0[0] + (c1[0] - c0[0]) * f,
          c0[1] + (c1[1] - c0[1]) * f,
          c0[2] + (c1[2] - c0[2]) * f,
        ];
      }
    }
 
    return stops[stops.length - 1][1];
  }
 
  /* ---------- SATURN SURFACE TEXTURE ---------- */
  function makeSaturnTexture() {
    const w = 2048;
    const h = 1024;
 
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
 
    const g = c.getContext("2d");
    const img = g.createImageData(w, h);
 
    function makeNoise(nx, ny) {
      const L = new Float32Array(nx * (ny + 1));
 
      for (let i = 0; i < L.length; i++) {
        L[i] = rnd();
      }
 
      return (u, v) => {
        const x = u * nx;
        const y = v * ny;
 
        const ix = Math.floor(x);
        const iy = Math.floor(y);
 
        let fx = x - ix;
        let fy = y - iy;
 
        fx = fx * fx * (3 - 2 * fx);
        fy = fy * fy * (3 - 2 * fy);
 
        const x0 = ix % nx;
        const x1 = (ix + 1) % nx;
 
        const a = L[iy * nx + x0];
        const b = L[iy * nx + x1];
        const c2 = L[(iy + 1) * nx + x0];
        const d = L[(iy + 1) * nx + x1];
 
        return (a + (b - a) * fx) * (1 - fy) + (c2 + (d - c2) * fx) * fy;
      };
    }
 
    const waves = makeNoise(10, 6);
    const swirls = makeNoise(40, 20);
    const streaks = makeNoise(5, 220);
 
    const raw = Array.from({ length: h }, rnd);
 
    const a1 = normArr(smoothArr(raw, 30));
    const a2 = normArr(smoothArr(raw, 10));
    const a3 = normArr(smoothArr(raw, 3));
 
    const prof = normArr(
      a1.map((_, i) => 0.5 * a1[i] + 0.33 * a2[i] + 0.17 * a3[i]),
    );
 
    const stops = [
      [0.0, [118, 92, 62]],
      [0.3, [170, 140, 94]],
      [0.58, [212, 185, 133]],
      [0.82, [235, 215, 166]],
      [1.0, [247, 236, 204]],
    ];
 
    for (let y = 0; y < h; y++) {
      const v = y / h;
 
      const polar = Math.abs(v - 0.5) * 2;
      const polarMix = Math.min(Math.max((polar - 0.72) / 0.28, 0), 1) * 0.45;
 
      for (let x = 0; x < w; x++) {
        const u = x / w;
 
        const warp = (waves(u, v) - 0.5) * 0.032 + (swirls(u, v) - 0.5) * 0.01;
 
        const vy = Math.min(Math.max(v + warp, 0), 0.999);
 
        let t = prof[Math.floor(vy * (h - 1))];
 
        t += (streaks(u, v) - 0.5) * 0.14 + (swirls(u, v) - 0.5) * 0.1;
 
        t = 0.12 + 0.8 * t;
 
        const col = ramp(t, stops);
        const k = (y * w + x) * 4;
 
        img.data[k] = col[0] * (1 - polarMix) + 138 * polarMix;
        img.data[k + 1] = col[1] * (1 - polarMix) + 140 * polarMix;
        img.data[k + 2] = col[2] * (1 - polarMix) + 132 * polarMix;
        img.data[k + 3] = 255;
      }
    }
 
    g.putImageData(img, 0, 0);
 
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
 
    return tex;
  }
 
  /* ---------- RING TEXTURE ---------- */
  function makeRingTexture() {
    const w = 2048;
    const h = 4;
 
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
 
    const g = c.getContext("2d");
    const img = g.createImageData(w, h);
 
    const noise = Array.from({ length: w }, rnd);
 
    const fine = normArr(smoothArr(noise, 1));
    const mid = normArr(smoothArr(noise, 6));
    const broad = normArr(smoothArr(noise, 28));
 
    const alpha = new Array(w);
    const cols = new Array(w);
 
    for (let i = 0; i < w; i++) {
      const r = i / (w - 1);
 
      const rl =
        (fine[i] - 0.5) * 0.45 +
        (mid[i] - 0.5) * 0.55 +
        (broad[i] - 0.5) * 0.35;
 
      let a;
      let col;
 
      if (r < 0.28) {
        const q = r / 0.28;
 
        a = 0.14 + 0.26 * q + rl * 0.22;
        col = [128 + 36 * q, 113 + 32 * q, 92 + 24 * q];
      } else if (r < 0.69) {
        const q = (r - 0.28) / 0.41;
 
        a = 0.8 + 0.16 * q + rl * 0.4;
        col = [205 + 33 * q, 180 + 42 * q, 140 + 50 * q];
      } else if (r < 0.765) {
        a = 0.06 + rl * 0.08;
        col = [170, 150, 120];
      } else {
        const q = (r - 0.765) / 0.235;
 
        a = 0.66 - 0.12 * q + rl * 0.38;
        col = [214, 196, 162];
 
        if (r > 0.943 && r < 0.957) {
          a *= 0.12;
        }
 
        a *= Math.min(Math.max((1.0 - r) / 0.03, 0), 1);
      }
 
      alpha[i] = Math.min(Math.max(a, 0), 1);
      cols[i] = col;
    }
 
    const alphaS = smoothArr(alpha, 2);
 
    for (let i = 0; i < w; i++) {
      for (let y = 0; y < h; y++) {
        const k = (y * w + i) * 4;
 
        img.data[k] = cols[i][0];
        img.data[k + 1] = cols[i][1];
        img.data[k + 2] = cols[i][2];
        img.data[k + 3] = alphaS[i] * 255;
      }
    }
 
    g.putImageData(img, 0, 0);
 
    return new THREE.CanvasTexture(c);
  }
 
  const saturnTex = makeSaturnTexture();
  const ringTex = makeRingTexture();
 
  const R_IN = PLANET_R * 1.24;
  const R_OUT = PLANET_R * 2.27;
 
  /* ---------- SATURN RINGS ---------- */
  const ringGeo = new THREE.RingGeometry(R_IN, R_OUT, 256, 1);
 
  {
    const pos = ringGeo.attributes.position;
    const uv = ringGeo.attributes.uv;
    const v = new THREE.Vector3();
 
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
 
      uv.setXY(i, (v.length() - R_IN) / (R_OUT - R_IN), 0.5);
    }
  }
 
  const ring = new THREE.Mesh(
    ringGeo,
    new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: ringTex },
        uSun: { value: SUN },
        uR: { value: PLANET_R },
        uTilt: { value: new THREE.Matrix4() },
      },
 
      vertexShader: `
        uniform mat4 uTilt;
        varying vec2 vUv;
        varying vec3 vGP;
 
        void main() {
          vUv = uv;
          vGP = (uTilt * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
 
      fragmentShader: `
        uniform sampler2D uMap;
        uniform vec3 uSun;
        uniform float uR;
 
        varying vec2 vUv;
        varying vec3 vGP;
 
        void main() {
          vec4 tex = texture2D(uMap, vUv);
 
          vec3 l = normalize(uSun);
          float b = dot(vGP, l);
 
          float disc = b * b - (dot(vGP, vGP) - uR * uR);
          float shadow = smoothstep(-0.8, 1.2, disc) * step(b, 0.0);
 
          float grey = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
          vec3 rc = mix(vec3(grey), tex.rgb, 0.6);
 
          float ringOpacity = clamp(tex.a * 1.22 + 0.055, 0.0, 0.98);
          // Lower ring luminance so the background stays behind the content.
          gl_FragColor = vec4(rc * (1.0 - 0.78 * shadow) * 0.62, ringOpacity);
        }
      `,
 
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
 
  ring.rotation.order = "ZXY";
  ring.rotation.x = THREE.MathUtils.degToRad(-70);
  ring.rotation.z = THREE.MathUtils.degToRad(16);
 
  ring.updateMatrix();
  ring.material.uniforms.uTilt.value = ring.matrix;
 
  ring.renderOrder = 3;
  group.add(ring);
 
  const ringNormal = new THREE.Vector3(0, 0, 1).transformDirection(ring.matrix);
 
  /* ---------- SATURN BODY ---------- */
  const globe = new THREE.Group();
 
  globe.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), ringNormal);
 
  globe.scale.set(1, FLATTEN, 1);
  group.add(globe);
 
  const planetMat = new THREE.ShaderMaterial({
    uniforms: {
      uTex: { value: saturnTex },
      uRing: { value: ringTex },
      uRot: { value: 0 },
      uSun: { value: SUN },
      uN: { value: ringNormal },
      uR: { value: PLANET_R },
      uRin: { value: R_IN },
      uRout: { value: R_OUT },
    },
 
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vView;
 
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
 
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vView = normalize(-mv.xyz);
 
        gl_Position = projectionMatrix * mv;
      }
    `,
 
    fragmentShader: `
      uniform sampler2D uTex;
      uniform sampler2D uRing;
 
      uniform float uRot, uR, uRin, uRout;
      uniform vec3 uSun, uN;
 
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vView;
 
      void main() {
        vec3 n = normalize(vNormal);
        vec3 v = normalize(vView);
        vec3 l = normalize(uSun);
 
        vec3 tex = texture2D(uTex, vec2(vUv.x + uRot, vUv.y)).rgb;
 
        float grey = dot(tex, vec3(0.299, 0.587, 0.114));
        tex = mix(vec3(grey), tex, 0.5);
 
        float d = dot(n, l);
        float soft = smoothstep(-0.12, 0.75, d);
 
        // Shadow of the rings on the planet.
        vec3 p = n * uR;
        float ndl = dot(l, uN);
        float shadow = 0.0;
 
        if (abs(ndl) > 0.02) {
          float t = -dot(p, uN) / ndl;
 
          if (t > 0.0) {
            vec3 hp = p + l * t;
            float k = (length(hp) - uRin) / (uRout - uRin);
 
            if (k > 0.0 && k < 1.0) {
              shadow = texture2D(uRing, vec2(k, 0.5)).a;
            }
          }
        }
 
        float mu = max(dot(n, v), 0.0);
 
        vec3 col = tex * (0.075 + 1.32 * soft * (1.0 - 0.72 * shadow));
        col *= 0.6 + 0.4 * pow(mu, 0.6);
 
        float fres = pow(1.0 - mu, 3.0);
        col += vec3(0.85, 0.82, 0.75) * fres * 0.22 * soft;
 
        // Apply the final brightness reduction to both the surface and rim light.
        col *= 0.62;
 
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
 
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(PLANET_R, 128, 128),
    planetMat,
  );
 
  globe.add(planet);
 
  /* =========================================================
     EARTH (real NASA-based maps from the three.js repo)
     Plain Earth: continents, clouds, city lights, thin blue
     atmosphere. No rings, no violet glow.
  ========================================================= */
  const TEX = "https://raw.githubusercontent.com/mrdoob/three.js/r160/examples/textures/planets/";
  const texLoader = new THREE.TextureLoader();
  texLoader.setCrossOrigin("anonymous");
 
  let earthReadyTarget = 0;
  const earthTextures = [];
 
  function loadEarthTex(file, onLoad) {
    const t = texLoader.load(TEX + file, onLoad, undefined, () => {
      console.warn("Starrex Planets: could not load " + file + " (check your internet connection).");
      if (file === "earth_atmos_2048.jpg") {
        earthMat.uniforms.uFallback.value = 1;
        earthReadyTarget = 1;
      }
    });
    t.wrapS = THREE.RepeatWrapping;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    earthTextures.push(t);
    return t;
  }
 
  const dayMap = loadEarthTex("earth_atmos_2048.jpg", () => { earthReadyTarget = 1; });
  const nightMap = loadEarthTex("earth_lights_2048.png");
  const specMap = loadEarthTex("earth_specular_2048.jpg");
  const cloudMap = loadEarthTex("earth_clouds_1024.png");
 
  const sphereVertex = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vView;
 
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
 
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vView = normalize(-mv.xyz);
 
      gl_Position = projectionMatrix * mv;
    }
  `;
 
  const earthMat = new THREE.ShaderMaterial({
    uniforms: {
      uDay: { value: dayMap },
      uNight: { value: nightMap },
      uSpec: { value: specMap },
      uRot: { value: 0 },
      uSun: { value: SUN },
      uReady: { value: 0 },
      uFallback: { value: 0 },
      uBright: { value: 0.9 },
    },
 
    vertexShader: sphereVertex,
 
    fragmentShader: `
      uniform sampler2D uDay;
      uniform sampler2D uNight;
      uniform sampler2D uSpec;
      uniform float uRot;
      uniform vec3 uSun;
      uniform float uReady;
      uniform float uFallback;
      uniform float uBright;
 
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vView;
 
      void main() {
        vec3 n = normalize(vNormal);
        vec3 v = normalize(vView);
        vec3 l = normalize(uSun);
 
        // Minus sign: the surface turns west to east (left to right on screen).
vec2 uv = vec2(vUv.x + uRot, vUv.y); 
        vec3 day = texture2D(uDay, uv).rgb;
        vec3 night = texture2D(uNight, uv).rgb;
        float spec = texture2D(uSpec, uv).r;
 
        // Plain blue ball if the textures could not be downloaded.
        day = mix(day, vec3(0.10, 0.30, 0.55), uFallback);
        night *= 1.0 - uFallback;
        spec = mix(spec, 1.0, uFallback);
 
        float d = dot(n, l);
        float lit = smoothstep(-0.12, 0.30, d);
 
        vec3 col = day * max(d, 0.0) * 1.25;                  // sunlit side
        col += day * vec3(0.03, 0.05, 0.09) * 0.6;            // faint blue ambient
        col += night * vec3(1.0, 0.78, 0.45) * 1.4 * (1.0 - lit); // city lights
 
        vec3 h = normalize(l + v);
        float s = pow(max(dot(n, h), 0.0), 70.0) * spec * lit; // ocean shine
        col += vec3(1.0, 0.95, 0.85) * s * 0.7;
 
        float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);      // subtle blue edge
        col += vec3(0.25, 0.50, 1.0) * fres * (0.08 + 0.30 * lit);
 
        gl_FragColor = vec4(col * uBright * uReady, 1.0);
      }
    `,
  });
 
  const earthTilt = new THREE.Group();
earthTilt.rotation.z = THREE.MathUtils.degToRad(0);
earthTilt.rotation.x = THREE.MathUtils.degToRad(0);
  earthGroup.add(earthTilt);
 
  const earth = new THREE.Mesh(new THREE.SphereGeometry(EARTH_R, 96, 96), earthMat);
  earthTilt.add(earth);
 
  /* ---------- CLOUDS ---------- */
  const cloudMat = new THREE.ShaderMaterial({
    uniforms: {
      uClouds: { value: cloudMap },
      uRot: { value: 0 },
      uSun: { value: SUN },
      uReady: { value: 0 },
      uFallback: { value: 0 },
    },
 
    vertexShader: sphereVertex,
 
    fragmentShader: `
      uniform sampler2D uClouds;
      uniform float uRot;
      uniform vec3 uSun;
      uniform float uReady;
      uniform float uFallback;
 
      varying vec2 vUv;
      varying vec3 vNormal;
 
      void main() {
        vec3 n = normalize(vNormal);
        float lit = smoothstep(-0.15, 0.4, dot(n, normalize(uSun)));
 
        vec4 c = texture2D(uClouds, vec2(vUv.x + uRot, vUv.y));
        vec3 col = mix(vec3(0.05, 0.06, 0.09), vec3(1.0, 1.0, 1.0), lit);
        float a = c.a * 0.85 * (0.2 + 0.8 * lit) * uReady * (1.0 - uFallback);
 
        gl_FragColor = vec4(col * 0.9, a);
      }
    `,
 
    transparent: true,
    depthWrite: false,
  });
 
  const clouds = new THREE.Mesh(new THREE.SphereGeometry(EARTH_R * 1.012, 96, 96), cloudMat);
  clouds.renderOrder = 1;
  earthTilt.add(clouds);
 

  /* =========================================================
     MARS (fully procedural, no texture downloads)
     Rust-orange desert, dark basalt regions, a canyon scar,
     white polar caps and a thin dusty rim. Surface detail comes
     from 3D noise sampled on the sphere, so it spins with no seam.
  ========================================================= */
  const marsVertex = `
    varying vec3 vNormal;
    varying vec3 vView;
    varying vec3 vObj;

    void main() {
      vObj = position;
      vNormal = normalize(normalMatrix * normal);

      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vView = normalize(-mv.xyz);

      gl_Position = projectionMatrix * mv;
    }
  `;

  const marsMat = new THREE.ShaderMaterial({
    uniforms: {
      uRot: { value: 0 },
      uSun: { value: SUN },
      uBright: { value: 0.95 },
    },

    vertexShader: marsVertex,

    fragmentShader: `
      uniform float uRot;
      uniform vec3 uSun;
      uniform float uBright;

      varying vec3 vNormal;
      varying vec3 vView;
      varying vec3 vObj;

      float hash(vec3 p) {
        p = fract(p * 0.3183099 + 0.1);
        p *= 17.0;
        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
      }

      float noise(vec3 x) {
        vec3 i = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);

        return mix(
          mix(
            mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
            mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x),
            f.y),
          mix(
            mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
            mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x),
            f.y),
          f.z);
      }

      float fbm(vec3 p) {
        float a = 0.5;
        float sum = 0.0;

        for (int i = 0; i < 6; i++) {
          sum += a * noise(p);
          p = p * 2.03 + vec3(1.7, 9.2, 3.1);
          a *= 0.5;
        }

        return sum;
      }

      void main() {
        vec3 n = normalize(vNormal);
        vec3 v = normalize(vView);
        vec3 l = normalize(uSun);

        // Spin around the vertical axis (same direction as Earth).
        float ang = uRot * 6.2831853;
        float cs = cos(ang);
        float sn = sin(ang);
        vec3 o = normalize(vObj);
        vec3 p = vec3(o.x * cs + o.z * sn, o.y, -o.x * sn + o.z * cs);

        // Surface colour: rusty plains with lighter sand and dark basalt.
        float warp = fbm(p * 2.0 + 3.0);
        float big = fbm(p * 1.6 + warp * 0.9);
        float detail = fbm(p * 9.0);
        float fine = fbm(p * 28.0);

        vec3 rust = vec3(0.70, 0.30, 0.14);
        vec3 sand = vec3(0.86, 0.58, 0.36);
        vec3 basalt = vec3(0.30, 0.15, 0.10);

        vec3 col = mix(rust, sand, smoothstep(0.35, 0.70, fbm(p * 3.0 + 7.0)));
        col = mix(col, basalt, smoothstep(0.50, 0.62, big) * 0.75);
        col *= 0.82 + 0.36 * detail;
        col *= 0.92 + 0.16 * fine;

        // A long canyon scar near the equator.
        float ridge = 1.0 - abs(2.0 * fbm(p * 4.0 + 11.0) - 1.0);
        float canyon = smoothstep(0.93, 0.99, ridge) * (1.0 - smoothstep(0.30, 0.50, abs(o.y)));
        col *= 1.0 - canyon * 0.45;

        // Polar caps with a ragged edge.
        float edge = 0.88 + (fbm(p * 5.0) - 0.5) * 0.08;
        float cap = smoothstep(edge, edge + 0.03, abs(o.y));
        col = mix(col, vec3(0.93, 0.92, 0.90), cap * 0.9);

        // Lighting: sunlit side, soft terminator, faint ambient.
        float d = dot(n, l);
        float lit = smoothstep(-0.12, 0.30, d);
        vec3 outCol = col * (max(d, 0.0) * 1.25 + 0.03);

        // Thin dusty atmosphere along the edge.
        float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
        outCol += vec3(0.95, 0.55, 0.32) * fres * (0.05 + 0.35 * lit);

        gl_FragColor = vec4(outCol * uBright, 1.0);
      }
    `,
  });

  const marsTilt = new THREE.Group();
  marsGroup.add(marsTilt);

  const mars = new THREE.Mesh(new THREE.SphereGeometry(MARS_R, 96, 96), marsMat);
  marsTilt.add(mars);

  /* =========================================================
     MOON (fully procedural)
     Grey highlands, dark maria and layered craters with bright rims.
     No atmosphere, so the terminator is crisp.
  ========================================================= */
  const moonMat = new THREE.ShaderMaterial({
    uniforms: {
      uRot: { value: 0 },
      uSun: { value: SUN },
      uBright: { value: 0.98 },
    },

    vertexShader: marsVertex,

    fragmentShader: `
      uniform float uRot;
      uniform vec3 uSun;
      uniform float uBright;

      varying vec3 vNormal;
      varying vec3 vView;
      varying vec3 vObj;

      float hash(vec3 p) {
        p = fract(p * 0.3183099 + 0.1);
        p *= 17.0;
        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
      }

      float noise(vec3 x) {
        vec3 i = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);

        return mix(
          mix(
            mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
            mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x),
            f.y),
          mix(
            mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
            mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x),
            f.y),
          f.z);
      }

      float fbm(vec3 p) {
        float a = 0.5;
        float sum = 0.0;

        for (int i = 0; i < 5; i++) {
          sum += a * noise(p);
          p = p * 2.03 + vec3(1.7, 9.2, 3.1);
          a *= 0.5;
        }

        return sum;
      }

      vec3 hash3(vec3 p) {
        p = vec3(
          dot(p, vec3(127.1, 311.7, 74.7)),
          dot(p, vec3(269.5, 183.3, 246.1)),
          dot(p, vec3(113.5, 271.9, 124.6))
        );
        return fract(sin(p) * 43758.5453);
      }

      // x = crater bowl (0..1), y = crater rim (0..1)
      vec2 craters(vec3 x, float scale) {
        vec3 p = x * scale;
        vec3 ip = floor(p);
        vec3 fp = fract(p);

        float bowl = 0.0;
        float rim = 0.0;

        for (int k = -1; k <= 1; k++) {
          for (int j = -1; j <= 1; j++) {
            for (int i = -1; i <= 1; i++) {
              vec3 g = vec3(float(i), float(j), float(k));
              vec3 h = hash3(ip + g);

              if (h.x > 0.45) {
                vec3 c = g + h.yzx * 0.7 + 0.15;
                float rad = 0.14 + 0.26 * fract(h.x * 7.13 + h.z * 3.1);
                float d = length(fp - c) / rad;

                bowl = max(bowl, max(1.0 - d * d, 0.0));
                rim = max(rim, exp(-pow((d - 1.05) * 5.0, 2.0)));
              }
            }
          }
        }

        return vec2(bowl, rim);
      }

      void main() {
        vec3 n = normalize(vNormal);
        vec3 l = normalize(uSun);

        // Spin around the vertical axis (same direction as Earth and Mars).
        float ang = uRot * 6.2831853;
        float cs = cos(ang);
        float sn = sin(ang);
        vec3 o = normalize(vObj);
        vec3 p = vec3(o.x * cs + o.z * sn, o.y, -o.x * sn + o.z * cs);

        // Highlands and dark maria.
        vec3 highland = vec3(0.67, 0.66, 0.64);
        vec3 maria = vec3(0.29, 0.30, 0.33);

        float mare = smoothstep(0.48, 0.60, fbm(p * 1.7 + 2.0));
        vec3 col = mix(highland, maria, mare * 0.85);
        col *= 0.80 + 0.40 * fbm(p * 8.0);

        // Three layers of craters: large, medium, small.
        vec2 c1 = craters(p, 4.0);
        vec2 c2 = craters(p + 7.0, 9.0);
        vec2 c3 = craters(p + 3.0, 20.0);

        float bowl = max(c1.x * 0.9, max(c2.x * 0.7, c3.x * 0.5));
        float rim = max(c1.y, max(c2.y * 0.8, c3.y * 0.6));

        col *= 1.0 - bowl * 0.28;
        col *= 1.0 + rim * 0.30;

        // Rocky surface: crisp terminator and a faint ambient.
        float d = dot(n, l);
        vec3 outCol = col * (max(d, 0.0) * 1.2 + 0.025);

        gl_FragColor = vec4(outCol * uBright, 1.0);
      }
    `,
  });

  const moonTilt = new THREE.Group();
  moonGroup.add(moonTilt);

  const moon = new THREE.Mesh(new THREE.SphereGeometry(MOON_R, 96, 96), moonMat);
  moonTilt.add(moon);

  /* =========================================================
     MILKY WAY GALAXY (Contact page)
     A full-screen spiral galaxy drawn in a shader. It sits behind
     everything, its centre is the centre of the page, and it turns
     slowly around that centre. It fades in and out (it never flies).
  ========================================================= */
  const galaxyMat = new THREE.ShaderMaterial({
    uniforms: {
      uRot: { value: 0 },
      uAlpha: { value: 0 },
      uAspect: { value: 1.6 },
    },

    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        // Full-screen quad pushed to the far plane so planets and stars draw over it.
        gl_Position = vec4(position.xy, 0.9999, 1.0);
      }
    `,

    fragmentShader: `
      uniform float uRot;
      uniform float uAlpha;
      uniform float uAspect;

      varying vec2 vUv;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(vec2 x) {
        vec2 i = floor(x);
        vec2 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);

        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
          f.y);
      }

      float fbm(vec2 p) {
        float a = 0.5;
        float sum = 0.0;

        for (int i = 0; i < 5; i++) {
          sum += a * noise(p);
          p = p * 2.02 + vec2(5.2, 1.3);
          a *= 0.5;
        }

        return sum;
      }

      // Round, soft stars. More of them appear where the galaxy is dense.
      vec3 starLayer(vec2 q, float scale, float dens, float seed) {
        vec2 g = q * scale;
        vec2 id = floor(g);
        vec2 f = fract(g);

        float h = hash(id + seed);
        float thr = 1.0 - (0.008 + 0.06 * clamp(dens, 0.0, 1.0));
        if (h < thr) return vec3(0.0);

        vec2 jit = vec2(hash(id + seed + 3.7), hash(id + seed + 8.1));
        float d = length(f - (0.25 + 0.5 * jit));

        float b = smoothstep(0.34, 0.0, d) * (0.35 + 0.65 * fract(h * 97.0));
        vec3 tint = mix(vec3(0.74, 0.82, 1.0), vec3(1.0, 0.90, 0.70), fract(h * 53.0));

        return tint * b;
      }

      void main() {
        // Centre of the page is the centre of the galaxy. In landscape the
        // galaxy spans the full width; in portrait it spans the full height.
        float span = max(uAspect, 1.0);
        vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0) * 2.0 / span;

        // Tilt the disc so it reads as a galaxy seen at an angle.
        vec2 pt = vec2(p.x, p.y / 0.62);

        float angle = uRot * 6.2831853;
        float cs = cos(angle);
        float sn = sin(angle);

        // Coordinates that turn with the galaxy (used for noise and stars).
        vec2 q = vec2(pt.x * cs + pt.y * sn, -pt.x * sn + pt.y * cs);

        float r = length(pt);
        float theta = atan(pt.y, pt.x) - angle;

        // Uneven, clumpy arms with a grainy, mottled texture.
        float warp = (fbm(q * 3.0 + 4.0) - 0.5) * 0.9;
        float armPhase = 2.0 * (theta + warp) - 4.6 * log(r + 0.02);

        float arms = pow(0.5 + 0.5 * cos(armPhase), 1.6 + 1.6 * r);
        float minorArms = pow(0.5 + 0.5 * cos(armPhase * 2.0 + 1.3), 2.0) * 0.35;
        float grain = 0.62 + 0.76 * fbm(q * 16.0 + 2.0);

        float disc = exp(-r * 1.55);
        float density = disc * (0.16 + 0.95 * arms + minorArms) * grain;

        // Dark dust lanes along the inner edge of every arm.
        float lane = pow(0.5 + 0.5 * cos(armPhase + 0.95), 3.0);
        float dust = lane * smoothstep(0.06, 0.38, r) * (0.45 + 0.55 * fbm(q * 6.0 + 9.0));
        density *= 1.0 - 0.62 * dust;

        // Warm golden bulge of old stars at the centre.
        float bulge = exp(-r * r * 30.0) * 0.8 + exp(-r * 6.5) * 0.15;

        // Colours: golden core, pale blue-white inner arms, violet, deep blue edge.
        vec3 gold = vec3(1.00, 0.80, 0.52);
        vec3 paleBlue = vec3(0.66, 0.74, 1.00);
        vec3 violet = vec3(0.42, 0.30, 0.95);
        vec3 deepBlue = vec3(0.24, 0.24, 0.78);

        vec3 armCol = mix(paleBlue, violet, smoothstep(0.10, 0.42, r));
        armCol = mix(armCol, deepBlue, smoothstep(0.42, 0.95, r));
        armCol = mix(gold, armCol, smoothstep(0.02, 0.24, r));

        vec3 col = armCol * density * 0.55 + gold * bulge * 0.34;

        // Fine stars of two sizes that turn with the galaxy.
        vec3 stars = starLayer(q, 110.0, density * 2.0, 0.0)
                   + 0.7 * starLayer(q, 220.0, density * 2.0, 17.0);
        col += stars * (0.35 + 0.9 * clamp(density, 0.0, 1.0));

        // Fade the outer edge of the disc so it blends into space.
        col *= 1.0 - smoothstep(1.05, 1.6, r);

        col = clamp(col * uAlpha, 0.0, 1.0);

        // Premultiplied light: alpha follows brightness so the page
        // background stays visible wherever the galaxy is dark.
        gl_FragColor = vec4(col, max(col.r, max(col.g, col.b)));
      }
    `,

    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneFactor,
    blendSrcAlpha: THREE.OneFactor,
    blendDstAlpha: THREE.OneFactor,
  });

  const galaxyMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), galaxyMat);
  galaxyMesh.frustumCulled = false;
  galaxyMesh.renderOrder = -1;
  galaxyMesh.visible = false;
  scene.add(galaxyMesh);

  const galaxy = { alpha: 0, target: 0, lastTime: performance.now() };

  /* ---------- STARS ---------- */
  function makeStars(count, size, spread) {
    const pos = [];
 
    for (let i = 0; i < count; i++) {
      pos.push(
        (Math.random() - 0.5) * spread * 1.8,
        (Math.random() - 0.5) * spread,
        -Math.random() * 25 - 2,
      );
    }
 
    const geo = new THREE.BufferGeometry();
 
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
 
    return new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: 0xfff4e0,
        size,
        transparent: true,
        opacity: 0.62,
        depthWrite: false,
      }),
    );
  }
 
  const starsFar = makeStars(700, 0.04, 40);
  const starsNear = makeStars(120, 0.09, 30);
 
  scene.add(starsFar, starsNear);
 
  /* ---------- SIZE AND POSITION ---------- */
  const base = new THREE.Vector2(4.6, -0.3);
  const cur = new THREE.Vector2(4.6, -0.3); // smoothed position shared by both planets
  let scrollTravel = 9.4;
  let viewHalfW = 6.5;
 
  let viewportController = null;
  let visibilityController = null;
 
  function updateSaturnComposition({ portrait, halfViewWidth }) {
    // Preserve the established planet position and responsive scale.
    base.set(
      halfViewWidth * (portrait ? 0.4 : 0.76),
      portrait ? -1.6 : -0.3,
    );
    viewHalfW = halfViewWidth;
 
    const s = portrait ? 0.55 : 1;
    group.scale.setScalar(s);
    earthGroup.scale.setScalar(s);
    marsGroup.scale.setScalar(s);
    moonGroup.scale.setScalar(s);
 
    // Keep the planet visible through most of the page and move it fully
    // beyond the top edge only as the visitor approaches the page bottom.
    scrollTravel = portrait ? 6.4 : 6.0;
  }
 
  /* =========================================================
     PLANET SWITCHING (Earth / Saturn / Mars / Moon / none / galaxy)
     presence: 1 = in place, 0 = gone

     One rule for every page change:
     - The planet that is leaving exits to the LEFT.
     - The planet that is arriving comes in from BEHIND (the distance).
     - About: the planet leaves, nothing arrives.
     - Contact: the planet leaves and the galaxy fades in. The galaxy
       fades out again when the visitor goes anywhere else.
  ========================================================= */
  const easeInOutCubic = (k) =>
    k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  const easeOutCubic = (k) => 1 - Math.pow(1 - k, 3);
  const easeInCubic = (k) => k * k * k;

  const ENTER_FROM_BEHIND = { delay: 0.12, duration: 2.15, ease: easeOutCubic };
  const EXIT_LEFT = { delay: 0, duration: 1.5, ease: easeInOutCubic };
  const RECEDE_BEHIND = { delay: 0, duration: 1.2, ease: easeInCubic };

  function makePlanet(grp, presence) {
    return {
      group: grp,
      presence,
      tween: null,
      mode: "behind", // path it is travelling on: "behind" or "left"
      place(p) {
        if (this.mode === "left") {
          const away = (1 - p) * (base.x + viewHalfW + 7);
          grp.position.set(cur.x - away, cur.y, 0);
        } else {
          grp.position.set(cur.x, cur.y, -(1 - p) * 38);
        }
      },
    };
  }

  const planets = {
    saturn: makePlanet(group, 0),
    earth: makePlanet(earthGroup, 1),
    mars: makePlanet(marsGroup, 0),
    moon: makePlanet(moonGroup, 0),
  };

  let currentPlanet = "earth"; // key of the planet on screen, or null
  let firstShowCall = true;

  function startTween(planet, to, cfg) {
    planet.tween = {
      from: planet.presence,
      to,
      start: performance.now() + cfg.delay * 1000,
      duration: cfg.duration * 1000,
      ease: cfg.ease,
    };
  }

  function startEnter(planet) {
    // A planet that is still partly visible (changed mind mid-exit) simply
    // reverses along the path it is on; otherwise it comes from behind.
    if (planet.presence <= 0.001) planet.mode = "behind";
    startTween(planet, 1, ENTER_FROM_BEHIND);
  }

  function startExit(planet) {
    // A planet still arriving from behind recedes the same way (no jump);
    // every other planet exits to the left.
    if (planet.presence < 0.999 && planet.mode === "behind") {
      startTween(planet, 0, RECEDE_BEHIND);
      return;
    }

    planet.mode = "left";
    startTween(planet, 0, EXIT_LEFT);
  }

  function showPlanet(name) {
    const isPlanet = Boolean(planets[name]);
    if (!isPlanet && name !== "none" && name !== "galaxy") return;

    const nextKey = isPlanet ? name : null;

    // The very first call (page load) and reduced-motion users switch instantly.
    const instant = firstShowCall || reduceMotion;
    firstShowCall = false;

    galaxy.target = name === "galaxy" ? 1 : 0;
    if (instant) galaxy.alpha = galaxy.target;

    if (nextKey === currentPlanet) return;

    const prev = currentPlanet ? planets[currentPlanet] : null;
    const next = nextKey ? planets[nextKey] : null;
    currentPlanet = nextKey;

    if (instant) {
      for (const key in planets) {
        planets[key].tween = null;
        planets[key].mode = "behind";
        planets[key].presence = planets[key] === next ? 1 : 0;
      }
      return;
    }

    if (prev) startExit(prev);
    if (next) startEnter(next);
  }

  function updateTweens(now) {
    for (const key in planets) {
      const p = planets[key];
      const t = p.tween;
      if (!t) continue;
 
      const k = (now - t.start) / t.duration;
      if (k <= 0) continue; // still waiting for its delay
 
      const kk = Math.min(k, 1);
      p.presence = t.from + (t.to - t.from) * t.ease(kk);
 
      if (kk >= 1) {
        p.presence = t.to;
        p.tween = null;
      }
    }
  }
 
  window.StarrexPlanets = {
    show: showPlanet,
    current: () => currentPlanet,
  };
 
  /* ---------- MOUSE PARALLAX ---------- */
  const mouse = { x: 0, y: 0 };
 
  function handlePointerMove(e) {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }
 
  /* ---------- MOTION PREFERENCES ---------- */
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
 
  let reduceMotion = motionQuery.matches;
 
  // Rotation speeds (fractions of a full turn per frame).
  const normalSpeed = 0.0005;
  const reducedSpeed = 0.0001;
 
  /* ---------- ANIMATION CONTROL ---------- */
  let isContextLost = false;
  let isDisposed = false;
 
  function shouldAnimate() {
    if (isDisposed || isContextLost || document.hidden) return false;
 
    const context = renderer.getContext();
    return Boolean(context && !context.isContextLost());
  }
 
  function applyPlanetTransforms() {
    for (const key in planets) {
      const p = planets[key];
      const on = p.presence > 0.001;
      p.group.visible = on;
      if (on) p.place(p.presence);
    }
  }
 
  function animate() {
    if (!shouldAnimate()) return false;
 
    const speed = reduceMotion ? reducedSpeed : normalSpeed;
 
    updateTweens(performance.now());
 
    if (planets.saturn.presence > 0.001) planetMat.uniforms.uRot.value += speed;
    if (planets.earth.presence > 0.001) {
      earthMat.uniforms.uRot.value += speed * 0.2;
cloudMat.uniforms.uRot.value += speed * 0.2 * 1.35;
    }
    if (planets.mars.presence > 0.001) {
      marsMat.uniforms.uRot.value = (marsMat.uniforms.uRot.value + speed * 0.2) % 1;
    }
    if (planets.moon.presence > 0.001) {
      moonMat.uniforms.uRot.value = (moonMat.uniforms.uRot.value + speed * 0.2) % 1;
    }

    // Galaxy: fade in/out smoothly and turn slowly around the page centre.
    // Time-based (not frame-based) so it fades over the same duration on any screen.
    const nowMs = performance.now();
    const dt = Math.min((nowMs - galaxy.lastTime) / 1000, 0.25);
    galaxy.lastTime = nowMs;
    const gk = reduceMotion ? 1 : 1 - Math.exp(-dt / 0.55);
    galaxy.alpha += (galaxy.target - galaxy.alpha) * gk;
    if (Math.abs(galaxy.target - galaxy.alpha) < 0.003) galaxy.alpha = galaxy.target;

    galaxyMesh.visible = galaxy.alpha > 0.003;
    if (galaxyMesh.visible) {
      galaxyMat.uniforms.uAlpha.value = galaxy.alpha;
      galaxyMat.uniforms.uRot.value = (galaxyMat.uniforms.uRot.value + speed * 0.25) % 1;
      galaxyMat.uniforms.uAspect.value =
        renderer.domElement.width / Math.max(renderer.domElement.height, 1);
    }
 
    // Fade Earth in once its textures have arrived.
    const ready = earthMat.uniforms.uReady.value;
    const nextReady = ready + (earthReadyTarget - ready) * 0.06;
    earthMat.uniforms.uReady.value = nextReady;
    cloudMat.uniforms.uReady.value = nextReady;
    cloudMat.uniforms.uFallback.value = earthMat.uniforms.uFallback.value;
 
    if (!reduceMotion) {
      starsFar.rotation.z += 0.00005;
      starsNear.rotation.z += 0.0001;
    }
 
    // Normalize against the full document so the same behaviour works on
    // pages of different lengths.
    const pageHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body ? document.body.scrollHeight : 0,
    );
 
    const maxScroll = Math.max(pageHeight - window.innerHeight, 1);
    const currentScroll = Math.max(
      window.scrollY,
      document.documentElement.scrollTop,
      document.body ? document.body.scrollTop : 0,
    );
 
    // Scroll-driven movement remains active even when reduced-motion is
    // enabled; that preference only reduces decorative rotation/parallax.
    const rawProgress = THREE.MathUtils.clamp(
      currentScroll / maxScroll,
      0,
      1,
    );
 
    // Smoothstep keeps the upward movement gradual at both ends of the page.
    const easedProgress =
      rawProgress * rawProgress * (3 - 2 * rawProgress);
 
    const scrollLift = easedProgress * scrollTravel;
 
    const targetX = base.x + (reduceMotion ? 0 : mouse.x * 0.2);
    cur.x += (targetX - cur.x) * 0.05;
 
    const targetY = base.y + scrollLift - (reduceMotion ? 0 : mouse.y * 0.15);
    cur.y += (targetY - cur.y) * 0.075;
 
    applyPlanetTransforms();
 
    renderer.render(scene, camera);
    return true;
  }
 
  const animationLoop = createAnimationLoop({
    onFrame: animate,
    shouldRun: shouldAnimate,
  });
 
  function startAnimation() {
    animationLoop.start();
  }
 
  function stopAnimation() {
    animationLoop.stop();
  }
 
  /* ---------- BROWSER EVENT HANDLERS ---------- */
  function handleContextLost(event) {
    // Allow the browser to attempt restoring the WebGL context.
    event.preventDefault();
 
    isContextLost = true;
    stopAnimation();
 
    console.warn("Starrex Planets: WebGL context was lost.");
  }
 
  function handleContextRestored() {
    isContextLost = false;
 
    console.info("Starrex Planets: WebGL context restored.");
 
    saturnTex.needsUpdate = true;
    ringTex.needsUpdate = true;
    earthTextures.forEach((t) => { t.needsUpdate = true; });
 
    if (viewportController) viewportController.resize();
    startAnimation();
  }
 
  function handleMotionPreferenceChange(event) {
    reduceMotion = event.matches;
  }
 
  /* ---------- INITIALIZE ---------- */
  try {
    viewportController = createViewportController({
      renderer,
      camera,
      onResize: updateSaturnComposition,
    });
    viewportController.resize();
 
    // Pick the right scene for the page that was actually opened, before the
    // first frame is drawn. Without this the script would always start on
    // Earth and flash it until React loads and asks for the real scene.
    // (Keep this mapping in sync with PlanetController.jsx.)
    const startPath = window.location.pathname;
    let startScene = "earth";
    if (startPath.startsWith("/projects")) startScene = "saturn";
    else if (startPath.startsWith("/services")) startScene = "mars";
    else if (startPath.startsWith("/software-development")) startScene = "moon";
    else if (startPath.startsWith("/about")) startScene = "none";
    else if (startPath.startsWith("/products")) startScene = "none";
    else if (startPath.startsWith("/privacy") || startPath.startsWith("/terms")) startScene = "none";
    else if (startPath.startsWith("/contact")) startScene = "galaxy";
    showPlanet(startScene);

    // Start on that composition without a first-frame jump.
    cur.set(base.x, base.y);
    applyPlanetTransforms();
 
    visibilityController = createVisibilityController({
      onVisibilityChange: (hidden) => {
        if (hidden) {
          stopAnimation();
        } else {
          startAnimation();
        }
      },
    });
 
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
 
    canvas.addEventListener("webglcontextlost", handleContextLost, false);
 
    canvas.addEventListener(
      "webglcontextrestored",
      handleContextRestored,
      false,
    );
 
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener("change", handleMotionPreferenceChange);
    } else {
      // Compatibility with older browsers.
      motionQuery.addListener(handleMotionPreferenceChange);
    }
 
    startAnimation();
  } catch (error) {
    isDisposed = true;
    if (visibilityController) visibilityController.dispose();
    if (viewportController) viewportController.dispose();
    animationLoop.dispose();
 
    console.error("Starrex Planets: Initialization failed.", error);
  }
})();