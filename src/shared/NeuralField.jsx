import { useEffect, useRef } from "react";
import * as THREE from "three";

// ─── NEURAL FIELD ─────────────────────────────────────────────────────────────
// The portfolio's signature visual: a field of glowing nodes drifting in 3D,
// connected by lines when close together — a neural graph for the Data
// Scientist page, a data-pipeline graph for the Data Engineer page. Same
// system, recoloured per profile via `color`. The whole field tilts gently
// toward the cursor and toward scroll position, so it reads as alive without
// ever demanding attention over the actual content behind it.
//
// Pure Three.js (no react-three-fiber) — a single scene set up once in an
// effect and torn down on unmount, driven by requestAnimationFrame.
export default function NeuralField({ color = "#2dd4bf", nodeCount = 64, style }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.z = 22;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // ── Nodes ──
    const bounds = { x: 14, y: 9, z: 6 };
    const nodes = Array.from({ length: nodeCount }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * bounds.x * 2,
        (Math.random() - 0.5) * bounds.y * 2,
        (Math.random() - 0.5) * bounds.z * 2
      ),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.006,
        (Math.random() - 0.5) * 0.006,
        (Math.random() - 0.5) * 0.006
      ),
    }));

    const colorObj = new THREE.Color(color);

    const pointGeo = new THREE.BufferGeometry();
    const pointPositions = new Float32Array(nodeCount * 3);
    pointGeo.setAttribute("position", new THREE.BufferAttribute(pointPositions, 3));
    const pointMat = new THREE.PointsMaterial({
      color: colorObj, size: 0.16, transparent: true, opacity: 0.9,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(pointGeo, pointMat);
    group.add(points);

    // Lines are rebuilt each frame from a shared max-segment buffer.
    const maxLinkDist = 6.2;
    const maxSegments = nodeCount * 6;
    const linePositions = new Float32Array(maxSegments * 2 * 3);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: colorObj, transparent: true, opacity: 0.16,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lines);

    // ── Pointer + scroll reactivity ──
    const pointer = { x: 0, y: 0 };
    const targetRot = { x: 0, y: 0 };
    const onPointerMove = e => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onPointerMove, { passive: true });

    let raf;
    const clock = new THREE.Clock();

    function animate() {
      raf = requestAnimationFrame(animate);
      const dt = clock.getDelta();

      // Drift nodes and bounce softly off bounds.
      for (const n of nodes) {
        n.pos.addScaledVector(n.vel, dt * 60);
        if (Math.abs(n.pos.x) > bounds.x) n.vel.x *= -1;
        if (Math.abs(n.pos.y) > bounds.y) n.vel.y *= -1;
        if (Math.abs(n.pos.z) > bounds.z) n.vel.z *= -1;
      }

      const posAttr = pointGeo.attributes.position;
      nodes.forEach((n, i) => {
        posAttr.array[i * 3]     = n.pos.x;
        posAttr.array[i * 3 + 1] = n.pos.y;
        posAttr.array[i * 3 + 2] = n.pos.z;
      });
      posAttr.needsUpdate = true;

      // Rebuild connections between nearby nodes.
      let seg = 0;
      const linArr = lineGeo.attributes.position.array;
      outer:
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (seg >= maxSegments) break outer;
          const d = nodes[i].pos.distanceTo(nodes[j].pos);
          if (d < maxLinkDist) {
            linArr[seg * 6]     = nodes[i].pos.x;
            linArr[seg * 6 + 1] = nodes[i].pos.y;
            linArr[seg * 6 + 2] = nodes[i].pos.z;
            linArr[seg * 6 + 3] = nodes[j].pos.x;
            linArr[seg * 6 + 4] = nodes[j].pos.y;
            linArr[seg * 6 + 5] = nodes[j].pos.z;
            seg++;
          }
        }
      }
      lineGeo.setDrawRange(0, seg * 2);
      lineGeo.attributes.position.needsUpdate = true;

      // Ease the whole field toward the cursor — subtle parallax, not a spin.
      targetRot.y += (pointer.x * 0.35 - targetRot.y) * 0.02;
      targetRot.x += (-pointer.y * 0.2 - targetRot.x) * 0.02;
      group.rotation.y = targetRot.y;
      group.rotation.x = targetRot.x;

      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("resize", onResize);
      pointGeo.dispose();
      pointMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [color, nodeCount]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute", inset: 0, zIndex: 0,
        pointerEvents: "none", overflow: "hidden",
        ...style,
      }}
    />
  );
}
