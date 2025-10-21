import * as THREE from 'three';

let scene, camera, renderer, stars;
const starCount = 5000;
const starVelocities = [];

export function initBackground() {
    const canvas = document.getElementById('background-canvas');

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 1;
    camera.rotation.x = Math.PI / 2;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Starfield
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = [];

    for (let i = 0; i < starCount; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starPositions.push(x, y, z);
        starVelocities.push((Math.random() * 0.2 + 0.05)); // Store a velocity for each star
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));

    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7,
        transparent: true,
        blending: THREE.AdditiveBlending,
    });

    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Event Listeners
    window.addEventListener('resize', onWindowResize, false);

    // Start animation loop
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    const positions = stars.geometry.attributes.position.array;

    for (let i = 0; i < starCount; i++) {
        // Update z position
        positions[i * 3 + 2] += starVelocities[i];

        // If star is past camera, reset its position
        if (positions[i * 3 + 2] > camera.position.z + 500) {
            positions[i * 3 + 2] = -500;
        }
    }

    stars.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}