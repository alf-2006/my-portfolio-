import * as THREE from "three";

/**
 * ALF ribbon — one continuous folded satin ribbon that writes A · L · F.
 * Units: letter height ≈ 3. The path is hand-authored; folds are produced
 * automatically by twisting the ribbon's width toward depth wherever the
 * path curves tightly (so tight turns read as real paper folds instead of
 * self-intersecting bends).
 */

type P = [number, number, number];

// Hand-authored centreline. z offsets keep overlapping passes apart.
const PATH: P[] = [
  // A — crossbar starts tucked behind the right leg, runs left, curls into the left foot
  [1.78, 1.08, -0.2],
  [1.3, 1.04, -0.14],
  [0.78, 1.0, -0.06],
  [0.36, 0.8, 0.02],
  [0.08, 0.36, 0.08],
  [0.02, 0.04, 0.12],
  [0.2, -0.02, 0.16],
  [0.3, 0.3, 0.17],
  // A — left leg up to the apex fold
  [0.62, 1.2, 0.16],
  [0.92, 2.1, 0.12],
  [1.1, 2.72, 0.07],
  [1.22, 3.02, 0.02],
  [1.34, 3.06, -0.03],
  [1.46, 2.8, -0.07],
  // A — right leg down
  [1.75, 1.95, -0.08],
  [2.02, 1.05, -0.06],
  [2.2, 0.38, -0.03],
  [2.3, 0.06, 0.0],
  // swoop along the baseline into the L
  [2.48, -0.06, 0.04],
  [2.72, 0.02, 0.06],
  [2.86, 0.36, 0.07],
  // L — upright up, tight fold at the top, back down on top of itself (reads as one stem)
  [2.9, 1.3, 0.09],
  [2.92, 2.4, 0.09],
  [2.93, 2.92, 0.08],
  [2.95, 3.1, 0.0],
  [2.97, 2.92, -0.08],
  [2.97, 2.2, -0.1],
  [2.98, 1.1, -0.1],
  [3.0, 0.36, -0.09],
  // L — rounded corner into a long foot
  [3.18, 0.06, -0.05],
  [3.6, -0.02, 0.0],
  [4.0, -0.01, 0.03],
  [4.3, 0.04, 0.05],
  // F — foot rises into the F stem
  [4.5, 0.32, 0.06],
  [4.56, 0.9, 0.06],
  [4.58, 1.32, 0.05],
  // F — middle arm: a hairpin out to the right and back
  [4.7, 1.56, 0.04],
  [5.05, 1.66, 0.03],
  [5.5, 1.7, 0.01],
  [5.78, 1.64, -0.02],
  [5.62, 1.48, -0.07],
  [5.1, 1.42, -0.1],
  [4.78, 1.44, -0.11],
  [4.62, 1.62, -0.11],
  // F — stem continues up, top fold, top arm sweeps right
  [4.6, 2.3, -0.09],
  [4.62, 2.86, -0.05],
  [4.72, 3.1, 0.0],
  [4.98, 3.2, 0.04],
  [5.5, 3.22, 0.06],
  [6.05, 3.24, 0.06],
  [6.42, 3.2, 0.05],
];

export const RIBBON_BOUNDS = { width: 6.5, height: 3.3 };

export type RibbonOptions = {
  width?: number;
  thickness?: number;
  segments?: number;
  blue?: string;
  blueDeep?: string;
  yellow?: string;
};

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function buildRibbonGeometry(opts: RibbonOptions = {}) {
  const W = opts.width ?? 0.36;
  const D = opts.thickness ?? 0.03;
  const N = opts.segments ?? 1600;
  const blue = new THREE.Color(opts.blue ?? "#3366FF");
  const blueDeep = new THREE.Color(opts.blueDeep ?? "#1f3fc4");
  const yellow = new THREE.Color(opts.yellow ?? "#FBBF24");

  const cx = 3.2;
  const cy = 1.58;
  const pts = PATH.map((p) => new THREE.Vector3(p[0] - cx, p[1] - cy, p[2]));
  const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal", 0.5);
  const length = curve.getLength();
  const ds = length / N;

  const P: THREE.Vector3[] = [];
  const T: THREE.Vector3[] = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    P.push(curve.getPointAt(u));
    T.push(curve.getTangentAt(u).normalize());
  }

  // curvature → fold amount
  const raw = new Float32Array(N + 1);
  for (let i = 0; i <= N; i++) {
    const a = T[Math.max(0, i - 1)];
    const b = T[Math.min(N, i + 1)];
    const k = b.clone().sub(a).length() / (2 * ds);
    raw[i] = smoothstep(1.6, 5.5, k);
  }
  // gaussian-ish smoothing so twists ease in/out (~0.35 units each side)
  const win = Math.max(2, Math.round(0.35 / ds));
  const fold = new Float32Array(N + 1);
  for (let i = 0; i <= N; i++) {
    let acc = 0;
    let wsum = 0;
    for (let j = -win; j <= win; j++) {
      const idx = Math.min(N, Math.max(0, i + j));
      const w = Math.exp(-(j * j) / (2 * (win / 2) ** 2));
      acc += raw[idx] * w;
      wsum += w;
    }
    fold[i] = Math.min(1, (acc / wsum) * 1.6);
  }

  const Z = new THREE.Vector3(0, 0, 1);
  const base = 0.62; // ~35° tilt of the ribbon toward depth on straight runs
  const widthDir: THREE.Vector3[] = [];
  const normalDir: THREE.Vector3[] = [];
  let prevN = new THREE.Vector3(1, 0, 0);
  for (let i = 0; i <= N; i++) {
    const t = T[i];
    let n = new THREE.Vector3(-t.y, t.x, 0);
    if (n.lengthSq() < 1e-6) n = prevN.clone();
    n.normalize();
    prevN = n.clone();
    const phi = base + (Math.PI / 2 - 0.04 - base) * fold[i];
    const w = n.multiplyScalar(Math.cos(phi)).add(Z.clone().multiplyScalar(Math.sin(phi)));
    // orthogonalise against tangent
    w.sub(t.clone().multiplyScalar(w.dot(t))).normalize();
    const m = new THREE.Vector3().crossVectors(t, w).normalize();
    widthDir.push(w);
    normalDir.push(m);
  }

  // arc-length param for colouring / drawing
  const s = new Float32Array(N + 1);
  for (let i = 1; i <= N; i++) s[i] = s[i - 1] + P[i].distanceTo(P[i - 1]);
  const total = s[N];

  // yellow lining at the F top fold (nearest sample to the fold apex)
  const foldTarget = new THREE.Vector3(4.86 - cx, 3.16 - cy, 0.02);
  let foldIdx = 0;
  let best = Infinity;
  for (let i = Math.floor(N * 0.8); i <= N; i++) {
    const d = P[i].distanceToSquared(foldTarget);
    if (d < best) {
      best = d;
      foldIdx = i;
    }
  }
  const foldS = s[foldIdx];

  const faces: [number, number][] = [
    [0, 1], // top  (+m): A(+w,+m) B(-w,+m)
    [2, 3], // bottom (-m): C(-w,-m) D(+w,-m)
    [3, 0], // edge +w: D → A
    [1, 2], // edge -w: B → C
  ];
  const faceNormalSign = [
    { v: "m", s: 1 },
    { v: "m", s: -1 },
    { v: "w", s: 1 },
    { v: "w", s: -1 },
  ] as const;

  const vertsPerRing = 8;
  const positions = new Float32Array((N + 1) * vertsPerRing * 3);
  const normals = new Float32Array((N + 1) * vertsPerRing * 3);
  const colors = new Float32Array((N + 1) * vertsPerRing * 3);
  const progress = new Float32Array((N + 1) * vertsPerRing);
  const indices: number[] = [];

  const corner = new THREE.Vector3();
  const tmpC = new THREE.Color();
  for (let i = 0; i <= N; i++) {
    const u = s[i] / total;
    // taper: soft start (hidden), elegant pointed tip at the end
    const taper = Math.min(smoothstep(0, 0.012, u) * 0.85 + 0.15, 0.22 + 0.78 * smoothstep(1, 0.955, u));
    const hw = (W / 2) * taper;
    const hd = D / 2;
    const w = widthDir[i];
    const m = normalDir[i];
    const c = P[i];
    const cornersSigns: [number, number][] = [
      [1, 1], // A
      [-1, 1], // B
      [-1, -1], // C
      [1, -1], // D
    ];
    // satin variation: slightly deeper blue on folds
    const yellowAmt = 1 - smoothstep(0.1, 0.32, Math.abs(s[i] - foldS));
    for (let f = 0; f < 4; f++) {
      const [a, b] = faces[f];
      const pair = [a, b];
      for (let k = 0; k < 2; k++) {
        const [sw, sm] = cornersSigns[pair[k]];
        corner.copy(c).addScaledVector(w, sw * hw).addScaledVector(m, sm * hd);
        const vi = i * vertsPerRing + f * 2 + k;
        positions.set([corner.x, corner.y, corner.z], vi * 3);
        const ns = faceNormalSign[f];
        const nv = ns.v === "m" ? m : w;
        normals.set([nv.x * ns.s, nv.y * ns.s, nv.z * ns.s], vi * 3);
        tmpC.copy(blue).lerp(blueDeep, fold[i] * 0.55);
        // yellow only lines the underside (inner face) of the F top fold
        if (f === 1 && yellowAmt > 0) tmpC.lerp(yellow, yellowAmt);
        colors.set([tmpC.r, tmpC.g, tmpC.b], vi * 3);
        progress[vi] = u;
      }
    }
    if (i < N) {
      for (let f = 0; f < 4; f++) {
        const a0 = i * vertsPerRing + f * 2;
        const b0 = a0 + 1;
        const a1 = a0 + vertsPerRing;
        const b1 = b0 + vertsPerRing;
        indices.push(a0, b0, a1, b0, b1, a1);
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.setAttribute("aProgress", new THREE.BufferAttribute(progress, 1));
  geo.setIndex(indices);
  geo.computeBoundingSphere();
  return geo;
}

/** Satin physical material with a draw-on uniform (0 → hidden, 1 → fully written). */
export function createRibbonMaterial() {
  const uniforms = { uDraw: { value: 1 }, uStart: { value: 0 } };
  const mat = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.34,
    metalness: 0.0,
    clearcoat: 0.7,
    clearcoatRoughness: 0.22,
    sheen: 0.25,
    sheenRoughness: 0.5,
    sheenColor: new THREE.Color("#8fb0ff"),
    envMapIntensity: 0.55,
    side: THREE.FrontSide,
  });
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uDraw = uniforms.uDraw;
    shader.uniforms.uStart = uniforms.uStart;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float aProgress;\nvarying float vProgress;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvProgress = aProgress;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform float uDraw;\nuniform float uStart;\nvarying float vProgress;")
      .replace("#include <clipping_planes_fragment>", "#include <clipping_planes_fragment>\nif (vProgress > uDraw || vProgress < uStart) discard;");
  };
  return { material: mat, uniforms };
}
