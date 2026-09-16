"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("কনসেপ্ট ক্লিয়ারিং ক্লাস লোড হচ্ছে...");
  const [canvasNode, setCanvasNode] = useState<HTMLCanvasElement | null>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync progressRef for 60fps Three.js animation loop
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // Smooth, deliberate progress timer: ~2.8 to 3.2 seconds total
  useEffect(() => {
    if (!isVisible || !mounted) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoadingText("প্রস্তুতি সম্পন্ন! স্বাগতম Ormission-এ...");
          setTimeout(() => {
            setIsVisible(false);
          }, 650);
          return 100;
        }

        // Smooth increment
        const step = prev < 80 ? Math.floor(Math.random() * 2) + 1 : 2;
        const next = prev + step;

        if (next < 25) {
          setLoadingText("কনসেপ্ট ক্লিয়ারিং ক্লাস লোড হচ্ছে...");
        } else if (next >= 25 && next < 55) {
          setLoadingText("বিগত ২০ বছরের প্রশ্নব্যাংক অ্যানালাইসিস...");
        } else if (next >= 55 && next < 80) {
          setLoadingText("ব্যক্তিগত মেন্টরশিপ ও ডাউট সলভিং...");
        } else if (next >= 80 && next < 100) {
          setLoadingText("১৪ ঘণ্টার স্টাডি রুটিন ও গাইডলাইন...");
        } else {
          setLoadingText("প্রস্তুতি সম্পন্ন! স্বাগতম Ormission-এ...");
        }

        return next > 100 ? 100 : next;
      });
    }, 28);

    return () => clearInterval(interval);
  }, [isVisible, mounted]);

  // 3D Canvas Scene with Three.js
  useEffect(() => {
    if (!isVisible || !canvasNode) return;

    const canvas = canvasNode;
    const width = 320;
    const height = 320;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.5;

    // 2. High-performance Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch (err) {
      console.warn("WebGL initialization error:", err);
      return;
    }

    // 3. Texture Loader for Official Ormission Logo
    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load(
      "/images/brand-logo-v2.png",
      () => {
        faceMaterial.needsUpdate = true;
      }
    );
    logoTexture.colorSpace = THREE.SRGBColorSpace;

    // 4. Medallion Group (Holds front, back, and rim for upright coin rotation)
    const badgeGroup = new THREE.Group();
    scene.add(badgeGroup);

    // Front Face (CircleGeometry is naturally 100% upright in Three.js)
    const frontGeo = new THREE.CircleGeometry(1.4, 64);
    const faceMaterial = new THREE.MeshStandardMaterial({
      map: logoTexture,
      roughness: 0.25,
      metalness: 0.15,
    });
    const frontMesh = new THREE.Mesh(frontGeo, faceMaterial);
    frontMesh.position.z = 0.11;
    badgeGroup.add(frontMesh);

    // Back Face (Un-mirrored UVs so the logo is readable and upright from both sides)
    const backGeo = new THREE.CircleGeometry(1.4, 64);
    const backUv = backGeo.attributes.uv;
    for (let i = 0; i < backUv.count; i++) {
      backUv.setX(i, 1 - backUv.getX(i));
    }
    backGeo.attributes.uv.needsUpdate = true;

    const backMesh = new THREE.Mesh(backGeo, faceMaterial);
    backMesh.position.z = -0.11;
    backMesh.rotation.y = Math.PI; // Face rear
    badgeGroup.add(backMesh);

    // Glistening Royal Blue Metallic Rim
    const rimGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.22, 64, 1, true);
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0x012c94,
      metalness: 0.9,
      roughness: 0.2,
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMaterial);
    rimMesh.rotation.x = Math.PI / 2;
    badgeGroup.add(rimMesh);

    // 5. Orbiting 3D Tech Halo Ring (Outer Blue)
    const haloGeometry = new THREE.TorusGeometry(2.1, 0.035, 16, 100);
    const haloMaterial = new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      emissive: 0x2563eb,
      emissiveIntensity: 0.8,
      metalness: 0.8,
      roughness: 0.2,
    });
    const haloRing = new THREE.Mesh(haloGeometry, haloMaterial);
    haloRing.rotation.x = 1.1;
    haloRing.rotation.y = 0.4;
    scene.add(haloRing);

    // Inner Accent Ring (Golden Amber shimmer)
    const innerRingGeo = new THREE.TorusGeometry(1.75, 0.02, 16, 80);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.75,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = -0.9;
    innerRing.rotation.y = -0.3;
    scene.add(innerRing);

    // 6. Orbiting 3D Particle Stardust Constellation
    const particleCount = 140;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 2.1 + Math.sin(i * 4) * 0.45;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = Math.sin(angle) * (radius * 0.55);
      particlePositions[i * 3 + 2] = (Math.sin(i * 7) - 0.5) * 1.5;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.065,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 7. Dynamic Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 3, 5);
    scene.add(keyLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 5, 20);
    blueLight.position.set(3, 2, 4);
    scene.add(blueLight);

    const goldLight = new THREE.PointLight(0xf59e0b, 3, 15);
    goldLight.position.set(-3, -2, 3);
    scene.add(goldLight);

    // 8. Mouse Parallax Motion
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseX = x * 0.4;
      mouseY = y * 0.4;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 9. 60fps Animation Loop with Guaranteed Upright Landing
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let currentRotationY = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const p = progressRef.current;

      // Exact 2 full 360-degree rotations (4 * Math.PI) tied smoothly to progress
      // At 0% progress -> target is 0 radians (UPRIGHT)
      // At 50% progress -> target is 2 * PI (UPRIGHT)
      // At 100% progress -> target is 4 * PI (UPRIGHT)
      const targetRotationY = (p / 100) * (Math.PI * 4);
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;
      badgeGroup.rotation.y = currentRotationY;

      // Levitation floating bob
      // As progress reaches 100%, gently dampens so badge settles rock-solid straight
      const floatDamp = Math.max(0, 1 - Math.max(0, (p - 90) / 10));
      badgeGroup.position.y = Math.sin(elapsedTime * 2.2) * 0.08 * floatDamp;

      // Mouse Parallax Lerp (also dampens to 0 at 100% so it locks straight facing user)
      badgeGroup.rotation.z += (mouseX * 0.12 * floatDamp - badgeGroup.rotation.z) * 0.05;
      badgeGroup.rotation.x += (mouseY * 0.12 * floatDamp - badgeGroup.rotation.x) * 0.05;

      // Orbit Halo Rings
      haloRing.rotation.z = elapsedTime * 0.6;
      innerRing.rotation.z = -elapsedTime * 0.8;

      // Orbit particles around badge
      particles.rotation.z = elapsedTime * 0.35;
      particles.rotation.y = Math.sin(elapsedTime * 0.4) * 0.25;

      // Orbit dynamic light around badge for specular gleams
      blueLight.position.x = Math.cos(elapsedTime * 1.5) * 3.5;
      blueLight.position.z = 3.5 + Math.sin(elapsedTime * 1.5) * 1.5;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      frontGeo.dispose();
      backGeo.dispose();
      rimGeo.dispose();
      haloGeometry.dispose();
      innerRingGeo.dispose();
      particleGeometry.dispose();
      rimMaterial.dispose();
      faceMaterial.dispose();
      haloMaterial.dispose();
      innerRingMat.dispose();
      particleMaterial.dispose();
      logoTexture.dispose();
    };
  }, [isVisible, canvasNode]);

  const handleSkip = () => {
    setIsVisible(false);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="ormission-splash-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.06,
            filter: "blur(10px)",
            transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#050A18] text-white select-none overflow-hidden"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 42%, rgba(1, 44, 148, 0.55) 0%, rgba(5, 10, 24, 0.98) 75%)",
          }}
        >
          {/* Subtle Ambient Background Mesh */}
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, white 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Central Blue Pulsing Ambient Aura */}
          <div className="absolute w-[440px] h-[440px] rounded-full bg-blue-600/25 blur-[100px] pointer-events-none animate-pulse" />

          {/* Core Content Container */}
          <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
            {/* 3D Canvas Area */}
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="relative flex items-center justify-center w-[320px] h-[320px] -mb-4"
            >
              <canvas
                ref={setCanvasNode}
                width={320}
                height={320}
                className="w-[320px] h-[320px] cursor-grab active:cursor-grabbing drop-shadow-[0_10px_35px_rgba(1,44,148,0.7)]"
              />
            </motion.div>

            {/* Glowing Brand Name with High-End Typography */}
            <motion.div
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="space-y-2"
            >
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-sans">
                <span className="text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.4)]">
                  Orm
                </span>
                <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_2px_25px_rgba(59,130,246,0.8)]">
                  ission
                </span>
              </h1>

              <p className="text-xs sm:text-sm font-bold tracking-[0.3em] text-blue-200/80 uppercase">
                Learn · Build · Grow
              </p>
            </motion.div>

            {/* Platform Tag Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="mt-4"
            >
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-xs font-semibold text-blue-300 font-bengali backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>বাংলাদেশের প্রিমিয়াম এডমিশন ও একাডেমিক প্ল্যাটফর্ম</span>
              </span>
            </motion.div>

            {/* Modern Animated Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="w-72 mt-6 space-y-2.5"
            >
              <div className="relative h-2 w-full bg-slate-800/90 rounded-full overflow-hidden border border-slate-700/60 shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-400 rounded-full shadow-[0_0_16px_rgba(59,130,246,0.9)]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>

              {/* Status text & percentage */}
              <div className="flex items-center justify-between text-xs text-slate-300 font-bengali">
                <div className="truncate pr-2 font-medium flex items-center gap-1.5">
                  <span className="shrink-0 inline-flex items-center justify-center w-4 h-4">
                    {progress === 100 ? (
                      <CheckCircle2 key="done-icon" className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span key="pending-dot" className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                    )}
                  </span>
                  <span className="truncate">{loadingText}</span>
                </div>
                <span className="font-mono font-bold text-sky-400 tabular-nums shrink-0">
                  {progress}%
                </span>
              </div>
            </motion.div>
          </div>

          {/* Quick Skip Button in Bottom Corner */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            onClick={handleSkip}
            className="absolute bottom-6 right-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold text-slate-200 hover:text-white font-bengali transition-all duration-200 shadow-sm hover:scale-105 active:scale-95"
            aria-label="Skip splash screen"
          >
            <span>সরাসরি প্রবেশ করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
