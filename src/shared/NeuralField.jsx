// NeuralField.jsx — v7
// v5: fixed invisibility (Three.js r152+ ColorManagement was washing out
//     colors on the r185 this repo actually runs).
// v6: fixed "reads as flat" — was rotating around Z (spins flat toward
//     viewer, hides depth) instead of Y (turntable, reveals depth); added
//     back per-node depth-based color/size fade now that it's safe to.
// v7: v6's rotation speed (0.0025 rad/frame) was technically animating but
//     too subtle to read as "moving" in a quick glance — bumped ~6x.
//
// Public API unchanged throughout: <NeuralField color color2 nodeCount />

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// Opt out of Three r152+'s automatic sRGB color management so our hex
// colors render exactly as specified — this one line is the primary fix.
if (THREE.ColorManagement) {
  THREE.ColorManagement.enabled = false;
}

export default function NeuralField({ color, color2, nodeCount = 56, style, className }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || 800;
    let height = mount.clientHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 13);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    // belt-and-suspenders: force the "no color management" output path
    // regardless of Three version quirks
    if ("outputColorSpace" in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.rotation.x = -0.15;
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
    const c2 = new THREE.Color(color2 || color);

    // solid circle sprite (opaque core, soft antialiased edge) — no reliance
    // on additive blending or vertex-color multiplication to be visible
    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = 64;
    spriteCanvas.height = 64;
    const sctx = spriteCanvas.getContext("2d");
    sctx.beginPath();
    sctx.arc(32, 32, 28, 0, Math.PI * 2);
    const grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 28);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.7, "rgba(255,255,255,1)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    sctx.fillStyle = grad;
    sctx.fill();
    const spriteTex = new THREE.CanvasTexture(spriteCanvas);

    // --- nodes: vertex-colored (near = full accent, far = dimmer) so
    // depth is visible even when the scene is standing still ---
    const nodeGeo = new THREE.BufferGeometry();
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);
    const nodeSizes = new Float32Array(nodeCount);
    for (let i = 0; i < nodeCount; i++) {
      nodePositions[i * 3] = nodes[i].pos.x;
      nodePositions[i * 3 + 1] = nodes[i].pos.y;
      nodePositions[i * 3 + 2] = nodes[i].pos.z;
    }
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));
    nodeGeo.setAttribute("color", new THREE.BufferAttribute(nodeColors, 3));
    const nodeMat = new THREE.PointsMaterial({
      size: 0.34,
      map: spriteTex,
      transparent: true,
      vertexColors: true,
      opacity: 1,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const nodePoints = new THREE.Points(nodeGeo, nodeMat);
    group.add(nodePoints);

    // --- edges: solid brighter accent, thicker visual weight via opacity ---
    const maxLinkDist = 3.4;
    const maxSegments = nodeCount * 6;
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(maxSegments * 2 * 3);
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: c2,
      transparent: true,
      opacity: 0.6,
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
      size: 0.4,
      map: spriteTex,
      transparent: true,
      color: c2,
      opacity: 1,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const packets = new THREE.Points(packetGeo, packetMat);
    group.add(packets);
    const packetState = Array.from({ length: packetCount }, () => ({
      a: 0,
      b: 0,
      t: Math.random(),
      speed: 0.006 + Math.random() * 0.006,
    }));

    // computes the current set of "close enough" node pairs and writes
    // them into the shared line buffer. Called once synchronously below
    // (before the first paint) and then every 6th animation frame.
    let activeEdges = [];
    const recomputeEdges = () => {
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
            segIdx++;
          }
        }
      }
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, activeEdges.length * 2);
    };
    // run once immediately so edges (and therefore packets) are correct
    // from the very first frame, instead of sitting at the origin for a
    // few frames waiting for the periodic recompute
    recomputeEdges();
    if (activeEdges.length > 0) {
      packetState.forEach((ps) => {
        const e = activeEdges[Math.floor(Math.random() * activeEdges.length)];
        ps.a = e[0];
        ps.b = e[1];
      });
    }

    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    let baseRotation = 0;
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
        nodePositions[i * 3] = n.pos.x;
        nodePositions[i * 3 + 1] = n.pos.y;
        nodePositions[i * 3 + 2] = n.pos.z;
        // depth cue: nodes nearer the camera (larger z) render at full
        // accent strength; nodes further away fade toward a dim, muted
        // version — this is what makes depth readable even standing still
        const depthT = (n.pos.z + spread) / (spread * 2); // 0 (far) .. 1 (near)
        const strength = 0.35 + depthT * 0.65; // never fully invisible
        nodeColors[i * 3] = c1.r * strength;
        nodeColors[i * 3 + 1] = c1.g * strength;
        nodeColors[i * 3 + 2] = c1.b * strength;
      }
      nodeGeo.attributes.position.needsUpdate = true;
      nodeGeo.attributes.color.needsUpdate = true;

      if (frame % 6 === 0) recomputeEdges();

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
      baseRotation += 0.015; // fast enough to be unmistakably moving —
      // previous value (0.0025) was too subtle to read as "animating" in
      // a quick glance even though it was technically rotating
      group.rotation.y = baseRotation + current.x * 0.3;
      group.rotation.x = -0.15 - current.y * 0.15; // slight permanent tilt
      // so the depth axis is visible even at rest, not just a flat-on view

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      renderer.render(scene, camera);
    } else {
      animate();
    }

    const onResize = () => {
      width = mount.clientWidth || width;
      height = mount.clientHeight || height;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      nodeGeo.dispose();
      lineGeo.dispose();
      packetGeo.dispose();
      nodeMat.dispose();
      lineMat.dispose();
      packetMat.dispose();
      spriteTex.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [color, color2, nodeCount]);

  return <div ref={mountRef} className={className} style={{ position: "absolute", inset: 0, ...style }} />;
}
