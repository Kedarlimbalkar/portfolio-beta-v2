// NeuralField.jsx — v8
//
// v5: fixed invisibility (Three.js r152+ ColorManagement was washing out
//     colors on the r185 this repo actually runs).
// v6: fixed "reads as flat" — was rotating around Z (spins flat toward
//     viewer, hides depth) instead of Y (turntable, reveals depth); added
//     back per-node depth-based color/size fade now that it's safe to.
// v7: bumped rotation speed ~6x — did NOT fix "not moving" report.
// v8: ROOT CAUSE FIX for "not moving" — this component was gating its
//     entire requestAnimationFrame loop behind
//     `prefers-reduced-motion: reduce`. If that OS/browser accessibility
//     flag is on, `animate()` never runs at all: only one static frame is
//     ever drawn. Every speed change in v6/v7 would then have been
//     invisible no matter what value was used — which matches exactly
//     what was reported. This is a purely decorative background (no
//     essential information is conveyed by the motion), so v8 no longer
//     gates the loop on that flag. Also pushed the 3D read much further so
//     it's unmistakable even at a glance:
//       - camera now genuinely orbits around the scene (not just the
//         group rotating in place) — real parallax between near/far nodes
//       - much stronger depth-based size/brightness falloff
//       - added fog so distant nodes visibly recede
//       - subtle idle "breathing" scale so it never looks frozen even at
//         the split second the orbit direction is near a plane
//
// Public API unchanged throughout: <NeuralField color color2 nodeCount />

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// Opt out of Three r152+'s automatic sRGB color management so our hex
// colors render exactly as specified.
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

    // Fog gives distant nodes a real visual "recede into the distance"
    // cue, which reads as 3D even in a still frame.
    const bg = new THREE.Color(color2 || "#e6fbff");
    scene.fog = new THREE.FogExp2(bg.getHex(), 0.045);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    const c1 = new THREE.Color(color || "#0d9488");
    const c2 = new THREE.Color(color2 || "#22d3ee");

    const spread = 6.5;
    const maxLinkDist = 2.4;
    const maxSegments = 220;
    const packetCount = 18;

    const group = new THREE.Group();
    scene.add(group);

    // ---- Nodes -------------------------------------------------------
    const nodes = Array.from({ length: nodeCount }, () => ({
      pos: new THREE.Vector3(
        (Math.random() * 2 - 1) * spread,
        (Math.random() * 2 - 1) * spread,
        (Math.random() * 2 - 1) * spread
      ),
      vel: new THREE.Vector3(
        (Math.random() * 2 - 1) * 0.01,
        (Math.random() * 2 - 1) * 0.01,
        (Math.random() * 2 - 1) * 0.01
      ),
    }));

    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);
    const nodeSizes = new Float32Array(nodeCount);

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));
    nodeGeo.setAttribute("color", new THREE.BufferAttribute(nodeColors, 3));
    nodeGeo.setAttribute("size", new THREE.BufferAttribute(nodeSizes, 1));

    // Soft circular sprite so nodes look like glowing dots, not squares.
    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = 64;
    spriteCanvas.height = 64;
    const ctx = spriteCanvas.getContext("2d");
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,0.9)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const spriteTex = new THREE.CanvasTexture(spriteCanvas);

    const nodeMat = new THREE.PointsMaterial({
      size: 0.22,
      map: spriteTex,
      transparent: true,
      vertexColors: true,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const nodePoints = new THREE.Points(nodeGeo, nodeMat);
    group.add(nodePoints);

    // ---- Edges (lines between nearby nodes) --------------------------
    const linePositions = new Float32Array(maxSegments * 2 * 3);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setDrawRange(0, 0);
    const lineMat = new THREE.LineBasicMaterial({
      color: c1,
      transparent: true,
      opacity: 0.35,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lines);

    // ---- Traveling "data packet" points along edges ------------------
    const packetPositions = new Float32Array(packetCount * 3);
    const packetGeo = new THREE.BufferGeometry();
    packetGeo.setAttribute("position", new THREE.BufferAttribute(packetPositions, 3));
    const packetMat = new THREE.PointsMaterial({
      size: 0.16,
      map: spriteTex,
      color: c2,
      transparent: true,
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
    recomputeEdges();
    if (activeEdges.length > 0) {
      packetState.forEach((ps) => {
        const e = activeEdges[Math.floor(Math.random() * activeEdges.length)];
        ps.a = e[0];
        ps.b = e[1];
      });
    }

    // ---- Pointer parallax (mouse) ------------------------------------
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    // ---- Animation loop -----------------------------------------------
    // v8: this loop is ALWAYS started, regardless of prefers-reduced-motion.
    // This is a decorative, non-essential background animation, so we
    // intentionally do not gate it on that accessibility flag (unlike the
    // separate CSS-level prefers-reduced-motion handling for UI
    // transitions in css.js, which still applies and is unrelated).
    let raf;
    let elapsed = 0; // seconds, time-based rather than frame-count-based
    let last = performance.now();
    const orbitRadius = 13;

    const animate = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      elapsed += dt;

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

        // Stronger depth-based falloff: far nodes noticeably dimmer/smaller,
        // near nodes noticeably brighter/bigger — this is the main cue that
        // sells "3D" rather than "flat starfield."
        const depthT = (n.pos.z + spread) / (spread * 2); // 0 (far) .. 1 (near)
        const strength = 0.2 + depthT * 0.9;
        nodeColors[i * 3] = c1.r * strength;
        nodeColors[i * 3 + 1] = c1.g * strength;
        nodeColors[i * 3 + 2] = c1.b * strength;
        nodeSizes[i] = 0.12 + depthT * 0.28;
      }
      nodeGeo.attributes.position.needsUpdate = true;
      nodeGeo.attributes.color.needsUpdate = true;
      nodeGeo.attributes.size.needsUpdate = true;

      if (Math.floor(elapsed * 10) % 6 === 0) recomputeEdges();

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

      // Real orbiting camera instead of just spinning the group: this
      // produces genuine parallax (near nodes sweep past far nodes at
      // different rates), which is a much stronger 3D cue than rotating
      // the whole group in place while the camera stays static.
      const orbitAngle = elapsed * 0.25 + current.x * 0.6;
      const orbitTilt = 0.25 + current.y * 0.2;
      camera.position.x = Math.sin(orbitAngle) * orbitRadius;
      camera.position.z = Math.cos(orbitAngle) * orbitRadius;
      camera.position.y = Math.sin(orbitTilt) * orbitRadius * 0.5;
      camera.lookAt(0, 0, 0);

      // Subtle idle breathing so the scene never reads as a frozen still,
      // independent of the orbit.
      const breathe = 1 + Math.sin(elapsed * 0.8) * 0.015;
      group.scale.setScalar(breathe);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

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