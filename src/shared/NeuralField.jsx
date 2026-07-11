// NeuralField.jsx — v3
// Pure Three.js (no react-three-fiber), same approach as v2, pushed much
// further so it reads as a real hero centerpiece instead of a faint
// background wallpaper:
//   - nodes now colored by depth (near `color`, far `color2`) instead of a
//     single flat hue, so the 3D-ness is visible even standing still
//   - small "packet" points now travel along the currently-active edges,
//     a literal read of "data in motion" that doubles for both profiles
//     (inference signal on DS, pipeline throughput on DE)
//   - edges rewritten into a shared LineSegments buffer every 6 frames
//     (not every frame) to keep this cheap enough to also run at hero size
//   - group still eases its rotation toward the cursor (parallax, not spin)
//   - fully torn down in cleanup: geometries/materials disposed, canvas
//     removed, listeners removed — safe across DS <-> DE route changes
//
// Props: color (required), color2 (optional — defaults to a lightened
// version of `color`), nodeCount (default 56), className/style passthrough
// for positioning (ProfilePage still controls position:absolute etc.)

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

function lighten(hex, amt = 0.35) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const mix = (c) => Math.round(c + (255 - c) * amt);
  return `#${[mix(r), mix(g), mix(b)]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;
}

export default function NeuralField({
  color,
  color2,
  nodeCount = 56,
  style,
  className,
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || 1;
    let height = mount.clientHeight || 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 13);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const spread = 6.5;
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * spread * 2,
          (Math.random() - 0.5) * spread * 1.4,
          (Math.random() - 0.5) * spread
        ),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.004,
          (Math.random() - 0.5) * 0.004,
          (Math.random() - 0.5) * 0.004
        ),
      });
    }

    const c1 = new THREE.Color(color);
    const c2 = new THREE.Color(color2 || lighten(color));

    // shared glow sprite used by both nodes and packets
    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = 64;
    spriteCanvas.height = 64;
    const sctx = spriteCanvas.getContext("2d");
    const grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.25, "rgba(255,255,255,0.9)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 64, 64);
    const spriteTex = new THREE.CanvasTexture(spriteCanvas);

    // --- nodes ---
    const nodeGeo = new THREE.BufferGeometry();
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));
    nodeGeo.setAttribute("color", new THREE.BufferAttribute(nodeColors, 3));
    const nodeMat = new THREE.PointsMaterial({
      size: 0.22,
      map: spriteTex,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nodePoints = new THREE.Points(nodeGeo, nodeMat);
    group.add(nodePoints);

    // --- edges (rebuilt into a shared buffer, not recreated) ---
    const maxLinkDist = 3.4;
    const maxSegments = nodeCount * 6;
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(maxSegments * 2 * 3);
    const lineColors = new Float32Array(maxSegments * 2 * 3);
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lineSegments);

    // --- traveling data packets along active edges ---
    const packetCount = Math.max(8, Math.round(nodeCount * 0.28));
    const packetGeo = new THREE.BufferGeometry();
    const packetPositions = new Float32Array(packetCount * 3);
    packetGeo.setAttribute("position", new THREE.BufferAttribute(packetPositions, 3));
    const packetMat = new THREE.PointsMaterial({
      size: 0.3,
      map: spriteTex,
      transparent: true,
      color: c2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const packets = new THREE.Points(packetGeo, packetMat);
    group.add(packets);
    const packetState = Array.from({ length: packetCount }, () => ({
      a: 0,
      b: 0,
      t: Math.random(),
      speed: 0.006 + Math.random() * 0.006,
    }));

    let activeEdges = [];
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    let raf;
    let frame = 0;
    const animate = () => {
      frame++;
      for (let i = 0; i < nodeCount; i++) {
        const n = nodes[i];
        n.pos.add(n.vel);
        ["x", "y", "z"].forEach((ax) => {
          if (n.pos[ax] > spread) n.vel[ax] -= 0.0006;
          if (n.pos[ax] < -spread) n.vel[ax] += 0.0006;
        });
        const depthT = (n.pos.z + spread) / (spread * 2);
        const col = c1.clone().lerp(c2, depthT);
        nodePositions[i * 3] = n.pos.x;
        nodePositions[i * 3 + 1] = n.pos.y;
        nodePositions[i * 3 + 2] = n.pos.z;
        nodeColors[i * 3] = col.r;
        nodeColors[i * 3 + 1] = col.g;
        nodeColors[i * 3 + 2] = col.b;
      }
      nodeGeo.attributes.position.needsUpdate = true;
      nodeGeo.attributes.color.needsUpdate = true;

      if (frame % 6 === 0) {
        activeEdges = [];
        let segIdx = 0;
        outer: for (let i = 0; i < nodeCount; i++) {
          for (let j = i + 1; j < nodeCount; j++) {
            if (segIdx >= maxSegments) break outer;
            const d = nodes[i].pos.distanceTo(nodes[j].pos);
            if (d < maxLinkDist) {
              activeEdges.push([i, j]);
              const p0 = nodes[i].pos;
              const p1 = nodes[j].pos;
              linePositions[segIdx * 6] = p0.x;
              linePositions[segIdx * 6 + 1] = p0.y;
              linePositions[segIdx * 6 + 2] = p0.z;
              linePositions[segIdx * 6 + 3] = p1.x;
              linePositions[segIdx * 6 + 4] = p1.y;
              linePositions[segIdx * 6 + 5] = p1.z;
              const fade = 1 - d / maxLinkDist;
              const col = c1.clone().lerp(c2, 0.5).multiplyScalar(fade);
              lineColors[segIdx * 6] = col.r;
              lineColors[segIdx * 6 + 1] = col.g;
              lineColors[segIdx * 6 + 2] = col.b;
              lineColors[segIdx * 6 + 3] = col.r;
              lineColors[segIdx * 6 + 4] = col.g;
              lineColors[segIdx * 6 + 5] = col.b;
              segIdx++;
            }
          }
        }
        lineGeo.attributes.position.needsUpdate = true;
        lineGeo.attributes.color.needsUpdate = true;
        lineGeo.setDrawRange(0, activeEdges.length * 2);
      }

      if (activeEdges.length > 0) {
        for (let i = 0; i < packetCount; i++) {
          const ps = packetState[i];
          ps.t += ps.speed;
          if (ps.t >= 1) {
            ps.t = 0;
            const e = activeEdges[Math.floor(Math.random() * activeEdges.length)];
            ps.a = e[0];
            ps.b = e[1];
          }
          const pa = nodes[ps.a] ? nodes[ps.a].pos : nodes[0].pos;
          const pb = nodes[ps.b] ? nodes[ps.b].pos : nodes[0].pos;
          packetPositions[i * 3] = pa.x + (pb.x - pa.x) * ps.t;
          packetPositions[i * 3 + 1] = pa.y + (pb.y - pa.y) * ps.t;
          packetPositions[i * 3 + 2] = pa.z + (pb.z - pa.z) * ps.t;
        }
        packetGeo.attributes.position.needsUpdate = true;
      }

      current.x += (target.x - current.x) * 0.03;
      current.y += (target.y - current.y) * 0.03;
      group.rotation.y = current.x * 0.35;
      group.rotation.x = -current.y * 0.2;
      group.rotation.z += 0.0006;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    // respect prefers-reduced-motion: render one static frame, skip the loop
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      renderer.render(scene, camera);
    } else {
      animate();
    }

    const onResize = () => {
      width = mount.clientWidth || 1;
      height = mount.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      nodeGeo.dispose();
      lineGeo.dispose();
      packetGeo.dispose();
      nodeMat.dispose();
      lineMat.dispose();
      packetMat.dispose();
      spriteTex.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [color, color2, nodeCount]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ position: "absolute", inset: 0, ...style }}
    />
  );
}
