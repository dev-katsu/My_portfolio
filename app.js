(function() {
  'use strict';

  // 1. Web Audio API Synthesizer for Anime Sound Effects (No external audio files needed!)
  // Sound clicks & audio effects removed per user request
  function playSound() {}

  // 2. Three.js Volumetric Particle & Crystal Glint Engine (Complements 1:1 Shattered Glass)
  function initThreeHero() {
    if (typeof THREE === 'undefined') return;
    
    const canvas = document.getElementById('threeHeroCanvas');
    const container = document.getElementById('heroStage');
    const card = document.getElementById('heroDropZone');
    if (!canvas || !container) return;

    const width = container.clientWidth * 1.35;
    const height = container.clientHeight * 1.35;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.z = 450;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: (window.devicePixelRatio || 1) < 1.5, powerPreference: 'high-performance', precision: 'mediump' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    // Subtle Anime Lighting (Toned down - Dark, high-contrast & sleek)
    const ambientLight = new THREE.AmbientLight(0x040810, 0.5);
    scene.add(ambientLight);

    const centerGlowLight = new THREE.PointLight(0x00ef4b, 0.4, 400);
    centerGlowLight.position.set(0, 0, 80);
    scene.add(centerGlowLight);

    const frontWhiteLight = new THREE.PointLight(0xffffff, 0.25, 300);
    frontWhiteLight.position.set(50, 50, 150);
    scene.add(frontWhiteLight);

    // Group for 3D floating crystal prisms & particles
    const shardsGroup = new THREE.Group();
    scene.add(shardsGroup);

    // Ambient floating 3D micro-diamonds and crystal prisms around perimeter
    const microShards = [];
    const crystalGeo = new THREE.OctahedronGeometry(10, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.65,
      transmission: 0.9,
      roughness: 0.05,
      ior: 1.5,
      clearcoat: 1.0,
      attenuationColor: new THREE.Color(0x00ef4b),
      attenuationDistance: 25
    });

    const edgeMat = new THREE.LineBasicMaterial({ color: 0x00ef4b, transparent: true, opacity: 0.9 });
    const edgeGeo = new THREE.EdgesGeometry(crystalGeo);

    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const radius = 140 + Math.random() * 80;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = (Math.random() - 0.5) * 80;

      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.position.set(x, y, z);
      crystal.scale.set(0.6 + Math.random() * 0.8, 1.2 + Math.random() * 0.9, 0.4 + Math.random() * 0.6);
      crystal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      const wire = new THREE.LineSegments(edgeGeo, edgeMat);
      crystal.add(wire);

      crystal.userData = {
        baseX: x, baseY: y, baseZ: z,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        floatSpeed: 0.8 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2
      };

      shardsGroup.add(crystal);
      microShards.push(crystal);
    }

    // Subtle cyan particle embers along radial vectors
    const partCount = 18;
    const partGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(partCount * 3);
    const partSpeeds = [];

    for (let i = 0; i < partCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 40 + Math.random() * 180;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = Math.sin(angle) * r;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 90;
      partSpeeds.push({
        vx: Math.cos(angle) * (0.2 + Math.random() * 0.4),
        vy: Math.sin(angle) * (0.2 + Math.random() * 0.4),
        maxR: 220 + Math.random() * 50
      });
    }

    partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 2,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(partGeo, partMat);
    scene.add(particleSystem);

    // Mouse tracking for Holographic 3D Parallax with Damped Lerp Physics
    let targetMouseX = 0;
    let targetMouseY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;
    let stageLocalX = 0;
    let stageLocalY = 0;
    let smoothLocalX = 0;
    let smoothLocalY = 0;

    window.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth) - 0.5;
      targetMouseY = (e.clientY / window.innerHeight) - 0.5;
      targetRotY = targetMouseX * 0.35;
      targetRotX = -targetMouseY * 0.35;
    }, { passive: true });

    // Interactive Stage Proximity Reaction
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      stageLocalX = ((e.clientX - rect.left) / rect.width) - 0.5;
      stageLocalY = ((e.clientY - rect.top) / rect.height) - 0.5;
    }, { passive: true });

    container.addEventListener('mouseleave', () => {
      stageLocalX = 0;
      stageLocalY = 0;
    });

    // Kinetic Click Shockwave Effect
    container.addEventListener('click', (e) => {
      if (e.target.tagName === 'INPUT') return;
      container.classList.remove('shard-shockwave');
      void container.offsetWidth; // Trigger reflow for re-animation
      container.classList.add('shard-shockwave');
    });

    const glassBg = document.getElementById('heroBgGlassSvg');
    const glassFg = document.getElementById('heroFgGlassSvg');

    // Animation Loop
    let clock = new THREE.Clock();

    let isHeroVisible = true;
    if ('IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver((entries) => {
        isHeroVisible = entries[0].isIntersecting;
      }, { threshold: 0.05 });
      heroObserver.observe(container);
    }

    function animate() {
      requestAnimationFrame(animate);
      if (!isHeroVisible) return; // Completely sleep when hero is offscreen! Zero GPU lag while browsing
      const time = clock.getElapsedTime();

      // Damped Lerping for buttery 60-120fps motion
      smoothMouseX += (targetMouseX - smoothMouseX) * 0.08;
      smoothMouseY += (targetMouseY - smoothMouseY) * 0.08;
      smoothLocalX += (stageLocalX - smoothLocalX) * 0.10;
      smoothLocalY += (stageLocalY - smoothLocalY) * 0.10;

      // Multi-Plane 3D Parallax: Background glass, Pentagon Core, and Overlapping Foreground glass tilt dynamically
      if (glassBg) {
        const bgX = smoothMouseX * 18 - smoothLocalX * 10;
        const bgY = smoothMouseY * 18 - smoothLocalY * 10;
        glassBg.style.transform = `translate3d(${-bgX}px, ${-bgY}px, -20px) rotateX(${-smoothMouseY * 4.5}deg) rotateY(${smoothMouseX * 4.5}deg)`;
      }
      if (card) {
        const cardX = smoothMouseX * 10 + smoothLocalX * 6;
        const cardY = smoothMouseY * 10 + smoothLocalY * 6;
        card.style.transform = `translate3d(${cardX}px, ${cardY}px, 20px) rotateX(${-smoothMouseY * 4}deg) rotateY(${smoothMouseX * 4}deg)`;
      }
      if (glassFg) {
        const fgX = smoothMouseX * 26 + smoothLocalX * 16;
        const fgY = smoothMouseY * 26 + smoothLocalY * 16;
        glassFg.style.transform = `translate3d(${fgX}px, ${fgY}px, 45px) rotateX(${-smoothMouseY * 6.5}deg) rotateY(${smoothMouseX * 6.5}deg)`;
      }

      // Smooth camera / group rotation via parallax lerp
      shardsGroup.rotation.y += (targetRotY - shardsGroup.rotation.y) * 0.05;
      shardsGroup.rotation.x += (targetRotX - shardsGroup.rotation.x) * 0.05;

      // Rotate and float micro crystal shards
      microShards.forEach(c => {
        const u = c.userData;
        c.rotation.x += u.rotSpeedX;
        c.rotation.y += u.rotSpeedY;
        c.position.y = u.baseY + Math.sin(time * u.floatSpeed + u.phase) * 6;
      });

      // Drift particle embers radially outward
      const posArr = particleSystem.geometry.attributes.position.array;
      for (let i = 0; i < partCount; i++) {
        posArr[i * 3] += partSpeeds[i].vx;
        posArr[i * 3 + 1] += partSpeeds[i].vy;
        const curR = Math.hypot(posArr[i * 3], posArr[i * 3 + 1]);
        if (curR > partSpeeds[i].maxR) {
          posArr[i * 3] = (Math.random() - 0.5) * 30;
          posArr[i * 3 + 1] = (Math.random() - 0.5) * 30;
        }
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

      centerGlowLight.intensity = 0.35 + Math.sin(time * 1.5) * 0.05;
      renderer.render(scene, camera);
    }
    animate();

    // Handle Window Resize
    window.addEventListener('resize', () => {
      const newW = container.clientWidth * 1.35;
      const newH = container.clientHeight * 1.35;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    });
  }

  // Initialize Three.js after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeHero);
  } else {
    initThreeHero();
  }

  // 2.5 Hero 3-Phase Interactive Glass Shatter Engine (Fixed -> Cracks -> Fractures -> Shattered Current Form)
  const heroStage = document.getElementById('heroStage');
  const glassStrikeOverlay = document.getElementById('heroIntactGlassPane');
  const glassStrikeFlash = document.getElementById('glassStrikeFlash');

  let currentGlassPhase = 0; // 0 = Fixed/Intact, 1 = Cracks, 2 = Heavy Fractures, 3 = Shattered (Current Form)
  let isPhaseTransitioning = false;

  function strikeGlass() {
    if (!heroStage || currentGlassPhase >= 3 || isPhaseTransitioning) return;
    isPhaseTransitioning = true;
    currentGlassPhase++;

    heroStage.setAttribute('data-glass-phase', currentGlassPhase.toString());

    // Flash animation
    if (glassStrikeFlash) {
      glassStrikeFlash.classList.remove('flashing');
      void glassStrikeFlash.offsetWidth; // trigger reflow
      glassStrikeFlash.classList.add('flashing');
    }

    if (currentGlassPhase === 1) {
      // Phase 1: Initial Hairline Cracks
      heroStage.classList.remove('strike-p1', 'strike-p2');
      void heroStage.offsetWidth;
      heroStage.classList.add('strike-p1');
      setTimeout(() => { isPhaseTransitioning = false; }, 320);
    } else if (currentGlassPhase === 2) {
      // Phase 2: Heavy Branching Fractures
      heroStage.classList.remove('strike-p1', 'strike-p2');
      void heroStage.offsetWidth;
      heroStage.classList.add('strike-p2');
      setTimeout(() => { isPhaseTransitioning = false; }, 380);
    } else if (currentGlassPhase === 3) {
      // Phase 3: FULL MAANGAS SHATTER INTO CURRENT FORM!
      heroStage.classList.remove('strike-p1', 'strike-p2');
      heroStage.classList.add('shard-shockwave', 'is-shattered', 'just-shattered');
      spawnGlassDebrisBurst();
      launchShardsToProjects();

      setTimeout(() => {
        heroStage.classList.remove('just-shattered', 'shard-shockwave');
        isPhaseTransitioning = false;
      }, 1050);
    }
  }

  // Explosive 360° Glass Micro-Debris Particle Shrapnel Spawner
  function spawnGlassDebrisBurst() {
    const container = document.getElementById('heroDebrisContainer');
    if (!container) return;
    container.innerHTML = '';

    const particleCount = 38;
    const colors = [
      '#ffffff', '#00ef4b', '#00ef4b', '#54fbb4', 
      '#f720f9', '#b408d3', '#e0e0e0', '#85ffd1'
    ];

    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'glass-shrapnel-particle';
      
      const angle = (Math.PI * 2 * i / particleCount) + (Math.random() * 0.4 - 0.2);
      const distance = 140 + Math.random() * 260; // 140px to 400px radial travel!
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const rot = (Math.random() - 0.5) * 720;
      
      const size = 4 + Math.random() * 10;
      const aspect = Math.random() > 0.5 ? (1.5 + Math.random() * 2) : 1;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const duration = 0.7 + Math.random() * 0.4;
      const delay = Math.random() * 0.08;

      p.style.width = `${size}px`;
      p.style.height = `${size * aspect}px`;
      p.style.backgroundColor = color;
      p.style.boxShadow = `0 0 ${size * 1.5}px ${color}, 0 0 ${size * 3}px rgba(255,255,255,0.85)`;
      p.style.setProperty('--tx', `${tx}px`);
      p.style.setProperty('--ty', `${ty}px`);
      p.style.setProperty('--rot', `${rot}deg`);
      p.style.animation = `shrapnelFlight ${duration}s cubic-bezier(0.12, 0.85, 0.25, 1) ${delay}s forwards`;
      
      if (Math.random() > 0.4) {
        p.style.clipPath = 'polygon(50% 0%, 100% 70%, 70% 100%, 0% 80%)';
      } else {
        p.style.clipPath = 'polygon(20% 0%, 100% 30%, 80% 100%, 0% 60%)';
      }

      container.appendChild(p);
    }

    setTimeout(() => {
      container.innerHTML = '';
    }, 1300);
  }

  // 2.6 Cinematic Shard Flight to Projects Section & Dynamic Camera Follow
  function launchShardsToProjects() {
    const heroStage = document.getElementById('heroStage');
    const goalsSection = document.getElementById('goals');
    const unlockFlash = document.getElementById('projectsUnlockFlash');
    if (!heroStage || !goalsSection) return;

    const heroRect = heroStage.getBoundingClientRect();
    const goalsRect = goalsSection.getBoundingClientRect();

    // Calculate real page-relative coordinates
    const startX = heroRect.left + (heroRect.width / 2);
    const startY = heroRect.top + window.scrollY + (heroRect.height / 2);

    const targetX = goalsRect.left + (goalsRect.width / 2);
    const targetY = goalsRect.top + window.scrollY + (goalsRect.height / 2);

    const shardColors = ['#00ef4b', '#f720f9', '#54fbb4', '#ffffff', '#00ffcc'];
    const projectileCount = 4;
    const projectiles = [];

    for (let i = 0; i < projectileCount; i++) {
      const p = document.createElement('div');
      p.className = 'flying-shard-projectile';
      const color = shardColors[i % shardColors.length];
      p.style.color = color;
      p.style.backgroundColor = color;
      p.style.left = `${startX}px`;
      p.style.top = `${startY}px`;
      document.body.appendChild(p);

      const scatterAngle = (Math.PI / 4) + (i * (Math.PI / 3)) + (Math.random() * 0.2 - 0.1);
      const scatterDist = 50 + Math.random() * 40;
      const midX = startX + Math.cos(scatterAngle) * scatterDist + (Math.random() - 0.5) * 80;
      const midY = startY + 140 + Math.random() * 120;

      const destX = targetX + (i - (projectileCount / 2)) * 140 + (Math.random() - 0.5) * 50;
      const destY = targetY + (Math.random() - 0.5) * 70;

      projectiles.push({
        el: p,
        startX, startY,
        midX, midY,
        destX, destY,
        rotSpeed: 360 + Math.random() * 400,
        scale: 0.9 + Math.random() * 0.4
      });
    }

    // Smooth Camera Follow: Viewport glides down tracking the shards!
    setTimeout(() => {
      goalsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 240);

    // 60fps Quad-Bezier Flight Animation
    const startTime = performance.now();
    const flightDuration = 920; // ms

    function animateFlight(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / flightDuration, 1);
      
      const t = progress;
      const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      projectiles.forEach(p => {
        const curX = Math.pow(1 - easeT, 2) * p.startX + 2 * (1 - easeT) * easeT * p.midX + Math.pow(easeT, 2) * p.destX;
        const curY = Math.pow(1 - easeT, 2) * p.startY + 2 * (1 - easeT) * easeT * p.midY + Math.pow(easeT, 2) * p.destY;
        const curRot = easeT * p.rotSpeed;
        const curScale = (1 - easeT * 0.25) * p.scale;
        const curOpacity = easeT > 0.88 ? (1 - easeT) / 0.12 : 1;

        p.el.style.transform = `translate(${curX - p.startX}px, ${curY - p.startY}px) rotate(${curRot}deg) scale(${curScale})`;
        p.el.style.opacity = curOpacity.toString();
      });

      if (progress < 1) {
        requestAnimationFrame(animateFlight);
      } else {
        // Impact at Section 3!
        projectiles.forEach(p => p.el.remove());

        // Unlock the Projects Gallery!
        goalsSection.classList.remove('projects-locked');
        goalsSection.classList.add('projects-unlocked', 'projects-just-unlocked');

        if (unlockFlash) {
          unlockFlash.classList.remove('flashing');
          void unlockFlash.offsetWidth;
          unlockFlash.classList.add('flashing');
        }

        setTimeout(() => {
          goalsSection.classList.remove('projects-just-unlocked');
        }, 1300);
      }
    }

    requestAnimationFrame(animateFlight);
  }

  // Click on locked overlay to smoothly jump to Hero crystal
  const projectsLockOverlay = document.getElementById('projectsLockOverlay');
  if (projectsLockOverlay) {
    projectsLockOverlay.addEventListener('click', () => {
      const hero = document.getElementById('home');
      if (hero) {
        hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  if (glassStrikeOverlay) {
    glassStrikeOverlay.addEventListener('click', strikeGlass);
    glassStrikeOverlay.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        strikeGlass();
      }
    });
  }

  // 3. Central Hero Image Replacement & Drag-and-Drop
  const dropZone = document.getElementById('heroDropZone');
  const fileInput = document.getElementById('heroImageInput');
  const userImage = document.getElementById('heroUserImage');
  const iconWrap = document.getElementById('placeholderIconWrap');

  if (dropZone && fileInput && userImage) {
    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) loadHeroImage(file);
    });

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = '#00ef4b';
      dropZone.style.boxShadow = '0 0 50px rgba(0, 239, 75, 0.8)';
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.style.borderColor = '';
      dropZone.style.boxShadow = '';
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = '';
      dropZone.style.boxShadow = '';
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        loadHeroImage(file);
      }
    });

    function loadHeroImage(file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        userImage.src = ev.target.result;
        userImage.classList.add('has-image');
        userImage.style.display = 'block';
        dropZone.classList.add('has-user-image');
        if (iconWrap) iconWrap.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  }

  // 4. Project Details Data & Modal Interaction (Round 1 & Round 2)
  const projectRounds = [
    // Round 1 (Matches 1-6) - Joaquin's Real Works
    [
      { 
        id: "p01", 
        title: "BREW HAVEN", 
        category: "WEB DEV", 
        year: "2025", 
        desc: "Handcrafted responsive artisan coffee shop website designed for Brew Haven in Pagsanjan, Laguna. Features rich autumnal branding, dynamic signature drinks & pastry catalog, custom order customization modals, interactive shopping cart, member-exclusive secret selections, and responsive mobile-first drawer navigation.",
        img: "assets/projects/brew-haven-shard.png",
        link: "../brew-haven-landing-page/index.html",
        btnText: "LAUNCH BREW HAVEN SITE"
      },
      { 
        id: "p02", 
        title: "VOCA SYSTEM", 
        category: "AI & VISION", 
        year: "2025-2026", 
        desc: "Desktop AI Classroom Activity & Exam Surveillance system (Vision of Classroom Activity) built in Python. Integrates real-time YOLOv8 object detection, MediaPipe pose landmarking, instructional activity recognition, and automated PDF audit report generation.",
        img: "assets/projects/voca-shard.png",
        link: "#",
        btnText: "INSPECT SYSTEM SPECS"
      },
      { 
        id: "p03", 
        title: "KALYE SNATCH", 
        category: "GAME DEV", 
        year: "2026", 
        desc: "Fast-paced Philippine street action-driving indie game created for Game Jam Los BaÃ±os 2026 by Team NPE. Maneuver a motorcycle through the bustling streets of Barangay Maligaya, dodge checkpoints, and beat the clock 'Para sa Pamilya'.",
        img: "assets/projects/kalye-snatch-shard.png",
        link: "https://itch.io",
        btnText: "PLAY ON ITCH.IO"
      },
      { 
        id: "p04", 
        title: "CSS NC II", 
        fullTitle: "COMPUTER SYSTEMS SERVICING (CSS NC II)",
        category: "HARDWARE & SYSTEMS", 
        year: "2024", 
        desc: "Official TESDA National Certificate II (NC II) in Computer Systems Servicing awarded to Joaquin Matthew C. Velarde (Certificate No: 24043402019308). National competency certification covering computer systems assembly and configuration, network and server setup, OS deployment, hardware diagnostics, and preventive maintenance.",
        img: "assets/projects/css-rig-setup.png",
        link: "assets/certificates/tesda-nc2-certificate.png",
        btnText: "VIEW OFFICIAL CERTIFICATE"
      },
      { 
        id: "p05", 
        title: "CREATIVE ART", 
        fullTitle: "CREATIVE ANIME ART & SKETCHES",
        category: "ILLUSTRATION", 
        year: "2022-2026", 
        desc: "Hand-drawn traditional anime sketches and character illustrations created by Joaquin. Features meticulous pencil shading, expressive line weight, and iconic character studies including Gojo Satoru, Takagi-san, and original anime concepts spanning 2022 to 2026.",
        img: "assets/projects/creative-art.png",
        link: "assets/projects/creative-art.png",
        btnText: "VIEW FULL ARTWORK"
      },
      { 
        id: "p06", 
        title: "PROMO ADS", 
        fullTitle: "VELARDE PROMOTIONAL ADS",
        category: "VIDEO & MOTION", 
        year: "2026", 
        desc: "Official personal promotional video advertisement produced, scripted, and edited by Joaquin Matthew Velarde. Dynamic commercial showcasing creative video editing, high-energy pacing, sound design, and personal brand storytelling.",
        img: "assets/projects/velarde-promo-shard.png",
        video: "assets/videos/Velarde_promotional_ads.mp4",
        link: "assets/videos/Velarde_promotional_ads.mp4",
        btnText: "WATCH PROMOTIONAL ADS"
      }
    ],
    // Round 2 (Matches 7-12) - Core Modules & Competencies
    [
      { id: "p07", title: "PC ASSEMBLY", category: "HARDWARE", year: "2025", desc: "Motherboard seating, component mounting, thermal paste application, cable management, and POST testing.", link: "#", btnText: "VIEW SPECS" },
      { id: "p08", title: "PYTHON TOOLS", category: "AUTOMATION", year: "2025", desc: "Data processing scripts, CLI tools, automated file management, and computer vision utilities.", link: "#", btnText: "VIEW CODE" },
      { id: "p09", title: "JAVA APPS", category: "SOFTWARE", year: "2024", desc: "Object-oriented desktop applications, modular business logic, and GUI event handling.", link: "#", btnText: "VIEW PROJECT" },
      { id: "p10", title: "SQL DATABASE", category: "DATA ENGINE", year: "2024", desc: "Relational database schema design, normalization, complex joins, and stored queries.", link: "#", btnText: "VIEW SCHEMA" },
      { id: "p11", title: "NETWORK LAB", category: "NETWORKING", year: "2025", desc: "Structured cabling (Cat5e/Cat6 RJ45), router/switch configuration, DHCP/DNS, and firewall setup.", link: "#", btnText: "VIEW LAB" },
      { id: "p12", title: "UI/UX MOCKUPS", category: "DESIGN", year: "2025", desc: "Wireframing, high-fidelity UI prototypes, anime aesthetic graphics, and design component systems.", link: "#", btnText: "VIEW MOCKUPS" }
    ]
  ];

  let currentRoundIndex = 0; // 0 for Round 1, 1 for Round 2

  const modal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDismissBtn = document.getElementById('modalDismissBtn');
  const modalLiveBtn = document.getElementById('modalLiveBtn');
  const modalCat = document.getElementById('modalProjectCategory');
  const modalTitle = document.getElementById('modalProjectTitle');
  const modalDesc = document.getElementById('modalProjectDesc');
  const roundCurrentEl = document.getElementById('roundCurrent');
  const dotRound1 = document.getElementById('dotRound1');
  const dotRound2 = document.getElementById('dotRound2');
  const matchesGlassSvg = document.getElementById('matchesGlassSvg');

  function updateRoundDisplay() {
    const roundData = projectRounds[currentRoundIndex];
    if (roundCurrentEl) roundCurrentEl.textContent = currentRoundIndex === 0 ? "01" : "02";
    if (dotRound1) dotRound1.classList.toggle('active', currentRoundIndex === 0);
    if (dotRound2) dotRound2.classList.toggle('active', currentRoundIndex === 1);

    // Update HUD texts in the 6 shards
    for (let i = 0; i < 6; i++) {
      const p = roundData[i];
      const catEl = document.getElementById(`hudCat${i}`);
      const titleEl = document.getElementById(`hudTitle${i}`);
      if (catEl && p) catEl.textContent = p.category;
      if (titleEl && p) titleEl.textContent = p.title;
    }
  }

  function setRound(idx) {
    if (idx === currentRoundIndex) return;
    currentRoundIndex = idx;
    if (matchesGlassSvg) {
      matchesGlassSvg.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
      matchesGlassSvg.style.transform = 'scale(0.97)';
      matchesGlassSvg.style.opacity = '0.4';
      setTimeout(() => {
        updateRoundDisplay();
        matchesGlassSvg.style.transform = 'scale(1)';
        matchesGlassSvg.style.opacity = '1';
      }, 250);
    } else {
      updateRoundDisplay();
    }
  }

  // Click handler for 3D Glass Shards in SVG
  document.querySelectorAll('.m-glass-shard-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const shardIdx = parseInt(btn.getAttribute('data-shard'), 10) || 0;
      const data = projectRounds[currentRoundIndex][shardIdx];
      if (!data) return;

      if (modalCat) modalCat.textContent = `${data.category} // ${data.year}`;
      if (modalTitle) modalTitle.textContent = data.fullTitle || data.title;
      if (modalDesc) modalDesc.textContent = data.desc;

      const modalPreview = document.getElementById('modalPreview');
      if (modalPreview) {
        if (data.video) {
          modalPreview.innerHTML = `
            <div class="modal-preview-box modal-video-box">
              <video controls autoplay playsinline poster="${data.img || ''}" class="modal-video-player" id="modalVideoPlayer">
                <source src="${data.video}" type="video/mp4">
                Your browser does not support HTML5 video playback.
              </video>
              <div class="modal-preview-tag">
                <span>&#9658; VIDEO STREAM // ${data.fullTitle || data.title}</span>
                <span style="color:var(--brand-titanium); font-size:0.7rem;">PROJECT 0${shardIdx + 1}</span>
              </div>
            </div>
          `;
          modalPreview.style.padding = '0';
          modalPreview.style.border = 'none';
          modalPreview.style.background = 'transparent';
        } else if (data.img) {
          modalPreview.innerHTML = `
            <div class="modal-preview-box">
              <img src="${data.img}" alt="${data.fullTitle || data.title}">
              <div class="modal-preview-tag">
                <span>&#9658; LIVE PREVIEW // ${data.fullTitle || data.title}</span>
                <span style="color:var(--brand-titanium); font-size:0.7rem;">PROJECT 0${shardIdx + 1}</span>
              </div>
            </div>
          `;
          modalPreview.style.padding = '0';
          modalPreview.style.border = 'none';
          modalPreview.style.background = 'transparent';
        } else {
          modalPreview.innerHTML = `
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#00ef4b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span style="font-family:var(--font-tech);color:var(--ink-secondary);letter-spacing:0.1em;">PROJECT SPEC DISPLAY</span>
          `;
          modalPreview.style.padding = '2rem 1rem';
          modalPreview.style.border = '1px dashed rgba(0, 239, 75, 0.3)';
          modalPreview.style.background = 'rgba(0, 239, 75, 0.03)';
        }
      }

      if (modalLiveBtn) {
        if (data.link && data.link !== '#') {
          modalLiveBtn.href = data.link;
          modalLiveBtn.target = '_blank';
          modalLiveBtn.style.display = 'inline-flex';
          modalLiveBtn.innerHTML = `&#9658; ${data.btnText || 'VIEW PROJECT'}`;
        } else {
          modalLiveBtn.href = '#';
          modalLiveBtn.target = '_self';
          modalLiveBtn.style.display = 'inline-flex';
          modalLiveBtn.innerHTML = `&#9658; ${data.btnText || 'VIEW DETAILS'}`;
        }
      }
      if (modal) {
        modal.classList.add('open');
      }
    });
  });

  // Navigation Arrows
  const prevBtn = document.getElementById('projPrevBtn');
  const nextBtn = document.getElementById('projNextBtn');
  if (prevBtn) prevBtn.addEventListener('click', () => setRound(currentRoundIndex === 0 ? 1 : 0));
  if (nextBtn) nextBtn.addEventListener('click', () => setRound(currentRoundIndex === 0 ? 1 : 0));
  if (dotRound1) dotRound1.addEventListener('click', () => setRound(0));
  if (dotRound2) dotRound2.addEventListener('click', () => setRound(1));

  function closeModal() {
    const vid = document.getElementById('modalVideoPlayer');
    if (vid) {
      vid.pause();
    }
    if (modal) modal.classList.remove('open');
  }
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // 5. Weapon Puzzle Skill Tag Interactions (Inline Tactical Drawer, No Browser Alerts)
  const weaponData = {
    hardware: {
      title: "&#9874; COMPUTER SYSTEMS SERVICING (CSS NC II)",
      tools: "PC ASSEMBLY // OS INSTALLATION // COMPONENT DIAGNOSTICS // HARDWARE REPAIR // ROUTINE MAINTENANCE",
      rank: "TESDA CSS NC II // 75%"
    },
    networking: {
      title: "&#9874; NETWORK &amp; SERVER SETUP",
      tools: "ROUTER &amp; SWITCH CONFIG // LAN CABLING &amp; RJ45 // SERVER DEPLOYMENT // IP &amp; SUBNETTING",
      rank: "INFRASTRUCTURE // 70%"
    },
    design: {
      title: "&#9874; DIGITAL DESIGN &amp; DRAWING",
      tools: "DIGITAL ILLUSTRATION // BRAND IDENTITY // UI/UX CONCEPTS // CHARACTER SKETCHING // GRAPHIC ASSETS",
      rank: "CREATIVE CORE // 85%"
    },
    coding: {
      title: "&#9874; PROGRAMMING &amp; DATABASES",
      tools: "PYTHON // JAVA // HTML &amp; CSS // SQL QUERIES // SYSTEM LOGIC &amp; BACKEND SCRIPTS",
      rank: "SOFTWARE DEV // 92%"
    }
  };

  const drawerTitle = document.getElementById('drawerTitle');
  const drawerTools = document.getElementById('drawerTools');
  const drawerRank = document.getElementById('drawerRank');
  const tacticalDrawer = document.getElementById('tacticalDrawer');

  document.querySelectorAll('.hud-badge, .puzzle-piece').forEach(el => {
    const skillKey = el.getAttribute('data-skill') || 'hardware';

    function activateSkill() {
      const data = weaponData[skillKey] || weaponData.hardware;
      if (drawerTitle) drawerTitle.innerHTML = data.title;
      if (drawerTools) drawerTools.textContent = data.tools;
      if (drawerRank) drawerRank.textContent = data.rank;

      if (tacticalDrawer) {
        tacticalDrawer.style.transform = 'scale(1.03)';
        tacticalDrawer.style.borderColor = skillKey === 'networking' ? '#f720f9' : (skillKey === 'design' ? '#dbdadb' : '#00ef4b');
        tacticalDrawer.style.boxShadow = skillKey === 'networking' ? '0 0 30px rgba(247, 32, 249, 0.6)' : (skillKey === 'design' ? '0 0 30px rgba(219, 218, 219, 0.6)' : '0 0 30px rgba(0, 239, 75, 0.6)');
        setTimeout(() => {
          tacticalDrawer.style.transform = '';
          tacticalDrawer.style.boxShadow = '';
          tacticalDrawer.style.borderColor = '';
        }, 300);
      }
    }

    el.addEventListener('click', activateSkill);
  });

  // 5.1 Interactive 3D Emblem Flip (Flips between Tactical Badge and Crest Logo)
  const emblemFlipper = document.getElementById('emblemFlipper');
  const emblemFlipScene = document.getElementById('emblemFlipScene');

  if (emblemFlipScene && emblemFlipper) {
    function toggleEmblemFlip() {
      emblemFlipper.classList.toggle('flipped');
    }

    emblemFlipScene.addEventListener('click', toggleEmblemFlip);
    emblemFlipScene.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleEmblemFlip();
      }
    });
  }

  // 6. Contact Form Transmission
  const contactForm = document.getElementById('contactForm');
  const contactEmail = document.getElementById('contactEmail');
  const contactSubmitBtn = document.getElementById('contactSubmitBtn');
  const formMsg = document.getElementById('formMsg');

  if (contactForm && contactSubmitBtn) {
    contactSubmitBtn.addEventListener('click', () => {
      const val = contactEmail.value.trim();
      const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val);
      
      if (!val) {
        formMsg.className = 'form-feedback-msg error';
        formMsg.textContent = '[ ERROR ]: Please enter an email coordinate.';
        return;
      }
      if (!valid) {
        formMsg.className = 'form-feedback-msg error';
        formMsg.textContent = '[ ERROR ]: Invalid transmission format (e.g., striker@ego.gg).';
        return;
      }

      contactSubmitBtn.textContent = 'TRANSMITTING...';
      contactSubmitBtn.disabled = true;

      setTimeout(() => {
        formMsg.className = 'form-feedback-msg success';
        formMsg.textContent = '[ SUCCESS ]: Transmission received. Ego coordinates locked. Awaiting contact within 24h.';
        contactSubmitBtn.textContent = 'TRANSMITTED';
        contactEmail.value = '';
        setTimeout(() => {
          contactSubmitBtn.textContent = 'TRANSMIT';
          contactSubmitBtn.disabled = false;
        }, 4000);
      }, 700);
    });
  }

  // 7. Active Navigation Highlight on Scroll
  const navLinks = document.querySelectorAll('.site-nav a');
  const sections = ['home', 'skills', 'goals', 'next-stage'].map(id => document.getElementById(id));

  let isScrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!isScrollTicking) {
      window.requestAnimationFrame(() => {
        const scrollPos = window.scrollY + 160;
        let activeIndex = 0;
        sections.forEach((sec, idx) => {
          if (sec && sec.offsetTop <= scrollPos) {
            activeIndex = idx;
          }
        });
        navLinks.forEach((link, idx) => {
          link.classList.toggle('active', idx === activeIndex);
        });
        isScrollTicking = false;
      });
      isScrollTicking = true;
    }
  }, { passive: true });

  // 8. Animated Project Counter
  const counterEl = document.getElementById('counterProjects');
  let counted = false;
  function triggerCounter() {
    if (counted || !counterEl) return;
    counted = true;
    let count = 0;
    const target = 20;
    const timer = setInterval(() => {
      count++;
      counterEl.textContent = count + (count >= target ? '+' : '');
      if (count >= target) clearInterval(timer);
    }, 60);
  }
  triggerCounter();

})();
