// Custom Cursor
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        
        // Follower with slight delay for smooth effect
        setTimeout(() => {
            cursorFollower.style.left = `${e.clientX}px`;
            cursorFollower.style.top = `${e.clientY}px`;
        }, 70);
    });

    // Scale cursor on clickable elements
    const clickables = document.querySelectorAll('a, button');
    clickables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorFollower.style.backgroundColor = 'rgba(182, 186, 197, 0.1)';
        });
        
        item.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.backgroundColor = 'transparent';
        });
    });

    // Simulate loading
    simulateLoading();
});

// Loading Simulation
function simulateLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    const progressFill = document.querySelector('.progress-fill');
    const mainContent = document.querySelector('.main-content');
    
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 100) progress = 100;
        
        progressFill.style.width = `${progress}%`;
        
        if (progress === 100) {
            clearInterval(loadingInterval);
            
            // Hide loading overlay
            setTimeout(() => {
                loadingOverlay.style.opacity = '0';
                mainContent.style.opacity = '1';
                
                // Initialize 3D elements after loading
                initHero3D();
                initIceBlocks();
                initParticles();
                
                // Remove loading overlay from DOM after fade out
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 500);
            }, 500);
        }
    }, 200);
}

// 3D Hero Igloo
function initHero3D() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        return;
    }
    
    const canvas = document.getElementById('hero-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    
    // Create simple igloo shape for demonstration
    const geometry = new THREE.SphereGeometry(3, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.1
    });
    
    const igloo = new THREE.Mesh(geometry, material);
    igloo.rotation.x = Math.PI;
    scene.add(igloo);
    
    // Position camera
    camera.position.z = 8;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate igloo slightly
        igloo.rotation.y += 0.005;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
}

// Ice Blocks
function initIceBlocks() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        return;
    }
    
    const iceCanvases = document.querySelectorAll('.ice-canvas');
    
    iceCanvases.forEach((canvas, index) => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Lights
        const ambientLight = new THREE.AmbientLight(0xb6bac5, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
        
        // Create ice block
        let geometry;
        
        // Different geometry for each ice block
        if (index === 0) {
            geometry = new THREE.BoxGeometry(3, 3, 3);
        } else {
            geometry = new THREE.CylinderGeometry(1.5, 1.5, 3, 8);
        }
        
        // Create ice material with refraction/transparency
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xb6bac5,
            metalness: 0.1,
            roughness: 0.1,
            transparency: 1,
            transparent: true,
            opacity: 0.8,
            clearcoat: 1,
            clearcoatRoughness: 0.1
        });
        
        const iceBlock = new THREE.Mesh(geometry, material);
        iceBlock.rotation.x = 0.3;
        iceBlock.rotation.y = 0.4;
        scene.add(iceBlock);
        
        // Add item inside ice block
        let innerGeometry;
        let innerMaterial;
        
        if (index === 0) {
            // Penguin shape (simplified)
            innerGeometry = new THREE.SphereGeometry(0.8, 16, 16);
            innerMaterial = new THREE.MeshStandardMaterial({ color: 0x383e4e });
        } else {
            // Logo shape (simplified)
            innerGeometry = new THREE.TorusGeometry(0.7, 0.2, 16, 16);
            innerMaterial = new THREE.MeshStandardMaterial({ color: 0x383e4e });
        }
        
        const innerObject = new THREE.Mesh(innerGeometry, innerMaterial);
        iceBlock.add(innerObject);
        
        // Position camera
        camera.position.z = 6;
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate ice block slowly
            iceBlock.rotation.y += 0.01;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Scroll animation
        window.addEventListener('scroll', () => {
            const rect = canvas.getBoundingClientRect();
            const isInView = (
                rect.top >= -rect.height &&
                rect.bottom <= window.innerHeight + rect.height
            );
            
            if (isInView) {
                const scrollPosition = rect.top / window.innerHeight;
                iceBlock.rotation.x = 0.3 + scrollPosition * 0.5;
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        });
    });
}

// Particles in Footer
function initParticles() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        return;
    }
    
    const canvas = document.getElementById('particles-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xb6bac5,
        transparent: true
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Position camera
    camera.position.z = 5;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        particlesMesh.rotation.y += 0.001;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
}