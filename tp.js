// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Reveal Text Animation
gsap.utils.toArray(".reveal-text").forEach((text) => {
  gsap.from(text, {
    opacity: 0,
    y: 30,
    duration: 1,
    scrollTrigger: {
      trigger: text,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
    },
  });
});

// Slide Up Animation
gsap.utils.toArray(".slide-up").forEach((element) => {
  gsap.from(element, {
    opacity: 0,
    y: 50,
    duration: 1,
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
    },
  });
});

// Zoom In Animation
gsap.utils.toArray(".zoom-in").forEach((element) => {
  gsap.from(element, {
    opacity: 0,
    scale: 0.5,
    duration: 1,
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
    },
  });
});

// Rotate In Animation
gsap.utils.toArray(".rotate-in").forEach((element) => {
  gsap.from(element, {
    opacity: 0,
    rotate: 90,
    duration: 1,
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
    },
  });
});

// Fade In Animation
gsap.utils.toArray(".fade-in").forEach((element) => {
  gsap.from(element, {
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
    },
  });
});

// Ripple Button Effect
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", (e) => {
    const ripple = document.createElement("span");
    ripple.classList.add("ripple-effect");
    ripple.style.left = `${e.offsetX}px`;
    ripple.style.top = `${e.offsetY}px`;
    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 500);
  });
});

// Three.js Particle Effects
const initParticles = (id) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById(id).appendChild(renderer.domElement);

  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 500;
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posArray, 3)
  );

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0xffffff,
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  camera.position.z = 5;

  const animate = () => {
    requestAnimationFrame(animate);
    particlesMesh.rotation.x += 0.001;
    particlesMesh.rotation.y += 0.001;
    renderer.render(scene, camera);
  };

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
};

// Initialize Particle Effects for Each Parallax Section
initParticles("particles1");
initParticles("particles2");
initParticles("particles3");