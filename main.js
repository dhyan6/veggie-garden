import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ========== Configuration ==========
const CONFIG = {
    // GitHub configuration for committing shopping list
    github: {
        owner: 'dhyan6',
        repo: 'veggie-garden',
        token: '' // Token removed for security - configure in browser or skip GitHub commits
    },
    // Vegetable models configuration - multiple instances of each
    vegetables: [
        { name: 'Carrot', file: 'carrot.glb', positions: [
            { x: -12.3, z: 7.8 }, { x: -18.5, z: -3.2 }, { x: -4.7, z: 15.1 }
        ]},
        { name: 'Tomato', file: 'tomato.glb', positions: [
            { x: 14.2, z: 9.5 }, { x: 8.9, z: -11.3 }, { x: 22.1, z: 3.7 }
        ]},
        { name: 'Broccoli', file: 'broccoli.glb', positions: [
            { x: -2.8, z: -14.6 }, { x: 11.4, z: -7.9 }, { x: -15.2, z: -19.3 }
        ]},
        { name: 'Onion', file: 'onion.glb', positions: [
            { x: -21.7, z: -8.4 }, { x: -6.3, z: -22.8 }, { x: -13.9, z: 12.6 }
        ]},
        { name: 'Eggplant', file: 'eggplant.glb', positions: [
            { x: 19.8, z: -15.7 }, { x: 5.2, z: 18.4 }, { x: 16.6, z: -5.1 }
        ]},
        { name: 'Pepper', file: 'pepper.glb', positions: [
            { x: -8.1, z: 20.9 }, { x: 3.5, z: 12.7 }, { x: -19.4, z: 16.2 }
        ]},
        { name: 'Cucumber', file: 'cucumber.glb', positions: [
            { x: 7.6, z: 21.3 }, { x: -11.8, z: 4.5 }, { x: 1.9, z: -18.7 }
        ]},
        { name: 'Peas', file: 'peas.glb', positions: [
            { x: 13.7, z: -20.2 }, { x: -7.4, z: -9.8 }, { x: 20.5, z: -12.6 }
        ]},
        { name: 'Turnip', file: 'turnip.glb', positions: [
            { x: -24.1, z: -2.7 }, { x: -16.8, z: 8.9 }, { x: -3.2, z: -5.4 }
        ]},
        { name: 'Radish', file: 'radish.glb', positions: [
            { x: 24.3, z: 6.8 }, { x: 10.1, z: -3.5 }, { x: 17.9, z: 13.2 }
        ]},
        { name: 'Banana', file: 'banana.glb', positions: [
            { x: -9.7, z: -16.4 }, { x: 15.3, z: -8.9 }, { x: -20.8, z: 19.5 }
        ]},
        { name: 'Apple', file: 'apple.glb', positions: [
            { x: 6.4, z: -24.1 }, { x: -14.9, z: -12.7 }, { x: 21.6, z: -18.3 }
        ]},
        { name: 'Strawberry', file: 'strawberry.glb', positions: [
            { x: 18.7, z: 22.4 }, { x: -5.8, z: 24.9 }, { x: 12.3, z: 6.1 }
        ]},
        { name: 'Grape', file: 'grape.glb', positions: [
            { x: -8.4, z: -20.7 }, { x: 22.8, z: -6.3 }, { x: -16.2, z: 18.5 }
        ]},
        { name: 'Watermelon', file: 'watermelon.glb', positions: [
            { x: 11.9, z: -16.4 }, { x: -21.3, z: -11.8 }, { x: 4.7, z: 20.2 }
        ]},
        { name: 'Avocado', file: 'avocado.glb', positions: [
            { x: -13.6, z: 9.8 }, { x: 19.2, z: -22.1 }, { x: 8.5, z: 14.6 }
        ]}
    ],
    character: {
        speed: 0.15,
        size: 0.5,
        collectionRadius: 2.0
    }
};

// ========== Scene Setup ==========
let scene, camera, renderer, character, controls;
let vegetables = [];
let collectedVeggies = {};  // Changed to object to track quantities
let loadingManager;
let bunnies = []; // Array to track bunnies
let roosters = []; // Array to track roosters

const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    // Removed fog for cheerful, sunny atmosphere

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 20, 25);
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // OrbitControls for mouse pan and drag
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2.2; // Prevent going below ground

    // Lighting - Bright and cheerful sunlight
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Brighter ambient
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffee, 1.2); // Warmer, brighter sun
    directionalLight.position.set(15, 25, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    scene.add(directionalLight);

    // Hemisphere light for cheerful outdoor atmosphere
    const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x8B7355, 0.6);
    scene.add(hemiLight);

    // Add sun in the sky
    const sunGeometry = new THREE.SphereGeometry(8, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 1
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(50, 60, -50);
    scene.add(sun);

    // Sun glow effect
    const glowGeometry = new THREE.SphereGeometry(12, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffdd88,
        transparent: true,
        opacity: 0.3
    });
    const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    sunGlow.position.copy(sun.position);
    scene.add(sunGlow);

    // Ground - Large beautiful grass field
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x4CAF50,  // Nice grass green
        roughness: 0.9,
        metalness: 0.0
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Add subtle grass texture variation with more patches for larger world
    for (let i = 0; i < 50; i++) {
        const patchGeometry = new THREE.CircleGeometry(Math.random() * 3 + 1, 16);
        const patchMaterial = new THREE.MeshStandardMaterial({
            color: 0x66BB6A,  // Slightly darker green variation
            roughness: 0.95,
            transparent: true,
            opacity: 0.4
        });
        const patch = new THREE.Mesh(patchGeometry, patchMaterial);
        patch.rotation.x = -Math.PI / 2;
        patch.position.set(
            (Math.random() - 0.5) * 90,
            0.01,
            (Math.random() - 0.5) * 90
        );
        scene.add(patch);
    }

    // Character (simple capsule)
    createCharacter();

    // Add decorative trees and grass
    addTreesAndGrass();

    // Add animated bunnies
    addBunnies();

    // Add animated roosters
    addRoosters();

    // Load vegetables
    loadingManager = new THREE.LoadingManager();
    loadingManager.onLoad = () => {
        hideLoadingScreen();
    };
    loadingManager.onProgress = (url, loaded, total) => {
        console.log(`Loading: ${loaded}/${total} - ${url}`);
    };

    loadVegetables();

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    document.getElementById('save-email-btn').addEventListener('click', saveAndEmailList);

    // Music control
    setupMusicControl();

    // Start animation
    animate();
}

function setupMusicControl() {
    const music = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');

    // Set volume and assume music will play
    music.volume = 0.3; // 30% volume for soothing background music
    let isPlaying = true;

    // Try to autoplay - start as playing by default
    musicToggle.textContent = '🔊 Music';
    musicToggle.classList.remove('muted');

    const playPromise = music.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            // Autoplay started successfully
            console.log('Music autoplay started');
        }).catch(err => {
            // Autoplay blocked - update UI to reflect that
            console.log('Autoplay blocked, click button to play:', err);
            isPlaying = false;
            musicToggle.textContent = '🔇 Music (Click to play)';
            musicToggle.classList.add('muted');
        });
    }

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            music.pause();
            musicToggle.textContent = '🔇 Music';
            musicToggle.classList.add('muted');
            isPlaying = false;
        } else {
            music.play().then(() => {
                musicToggle.textContent = '🔊 Music';
                musicToggle.classList.remove('muted');
                isPlaying = true;
            }).catch(err => {
                console.log('Audio play failed:', err);
            });
        }
    });
}

function createCharacter() {
    const loader = new GLTFLoader();

    // Try to load character.glb model
    loader.load(
        'models/character.glb',
        (gltf) => {
            // Character model loaded successfully
            character = gltf.scene;
            character.position.set(0, 0, 0);
            character.scale.set(2, 2, 2);  // Make character 2x bigger
            character.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                }
            });
            scene.add(character);
            console.log('Character model loaded!');
        },
        undefined,
        (error) => {
            // Fallback to simple character if model not found
            console.log('Character model not found, using placeholder');
            const geometry = new THREE.CapsuleGeometry(CONFIG.character.size, CONFIG.character.size * 2, 4, 8);
            const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
            character = new THREE.Mesh(geometry, material);
            character.position.set(0, CONFIG.character.size, 0);
            character.castShadow = true;

            // Add a simple face
            const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

            const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            leftEye.position.set(-0.15, 0.8, 0.4);
            character.add(leftEye);

            const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            rightEye.position.set(0.15, 0.8, 0.4);
            character.add(rightEye);

            scene.add(character);
        }
    );
}

function addTreesAndGrass() {
    const loader = new GLTFLoader();

    // Large pine trees around the perimeter
    const pinePositions = [
        { x: -40, z: -35, scale: 15 },
        { x: 40, z: -35, scale: 18 },
        { x: -40, z: 35, scale: 16 },
        { x: 40, z: 35, scale: 17 },
        { x: 0, z: -42, scale: 20 },
        { x: 0, z: 42, scale: 19 },
        { x: -42, z: 0, scale: 16 },
        { x: 42, z: 0, scale: 18 }
    ];

    // Load large pine trees
    pinePositions.forEach((pinePos, index) => {
        loader.load(
            'models/pine.glb',
            (gltf) => {
                const pine = gltf.scene;
                pine.position.set(pinePos.x, 0, pinePos.z);
                pine.scale.set(pinePos.scale, pinePos.scale, pinePos.scale);

                // Calculate bounding box to position pine at ground level
                const box = new THREE.Box3().setFromObject(pine);
                const minY = box.min.y;
                pine.position.y = -minY; // Raise so bottom sits at y=0

                pine.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                scene.add(pine);
            },
            undefined,
            (error) => {
                console.log('Pine model not found, skipping');
            }
        );
    });

    // Regular tree positions - scattered around the landscape, 2x bigger
    const treePositions = [
        { x: -38, z: -28, scale: 6 },
        { x: 37, z: 32, scale: 8 },
        { x: -28, z: 38, scale: 7 },
        { x: 33, z: -37, scale: 6 },
        { x: -22, z: -33, scale: 8 },
        { x: 28, z: -25, scale: 7 },
        { x: -35, z: 25, scale: 7.6 },
        { x: 35, z: 28, scale: 6.4 },
        { x: -15, z: -38, scale: 7.2 },
        { x: 20, z: 35, scale: 6.8 },
        { x: -40, z: 10, scale: 7.4 },
        { x: 40, z: -15, scale: 6.6 },
        { x: -25, z: -15, scale: 6.8 },
        { x: 18, z: -32, scale: 7.5 },
        { x: -32, z: -5, scale: 6.2 },
        { x: 25, z: 15, scale: 7.8 },
        { x: -18, z: 30, scale: 6.5 },
        { x: 30, z: -10, scale: 7.1 }
    ];

    // Load trees
    treePositions.forEach((treePos, index) => {
        const modelFile = index % 2 === 0 ? 'tree1.glb' : 'tree2.glb';

        loader.load(
            `models/${modelFile}`,
            (gltf) => {
                const tree = gltf.scene;
                tree.position.set(treePos.x, 0, treePos.z);
                tree.scale.set(treePos.scale, treePos.scale, treePos.scale);

                // Calculate bounding box to position tree at ground level
                const box = new THREE.Box3().setFromObject(tree);
                const minY = box.min.y;
                tree.position.y = -minY; // Raise so bottom sits at y=0

                tree.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                scene.add(tree);
            },
            undefined,
            (error) => {
                console.log(`Tree model ${modelFile} not found, skipping`);
            }
        );
    });

    // Load grass patches scattered around
    const grassPositions = [
        { x: -20, z: -15 }, { x: 25, z: 18 }, { x: -15, z: 22 },
        { x: 18, z: -20 }, { x: -28, z: 10 }, { x: 22, z: -12 },
        { x: -10, z: 28 }, { x: 15, z: 25 }, { x: -25, z: -20 },
        { x: 20, z: 15 }
    ];

    grassPositions.forEach((grassPos) => {
        loader.load(
            'models/grass.glb',
            (gltf) => {
                const grass = gltf.scene;
                grass.position.set(grassPos.x, 0, grassPos.z);
                grass.scale.set(3, 3, 3);
                grass.traverse((child) => {
                    if (child.isMesh) {
                        child.receiveShadow = true;
                    }
                });
                scene.add(grass);
            },
            undefined,
            (error) => {
                console.log('Grass model not found, skipping');
            }
        );
    });

    // Add pond to the side, away from vegetables
    loader.load(
        'models/pond.glb',
        (gltf) => {
            const pond = gltf.scene;
            pond.position.set(38, -0.05, 35); // Far to the side, away from center
            pond.scale.set(0.15, 0.15, 0.15); // Much smaller - 5x smaller than before
            pond.traverse((child) => {
                if (child.isMesh) {
                    child.receiveShadow = true;
                }
            });
            scene.add(pond);
            console.log('Pond added to the scene!');
        },
        undefined,
        (error) => {
            console.log('Pond model not found, skipping');
        }
    );
}

function addBunnies() {
    const loader = new GLTFLoader();

    // Positions for 3 bunnies closer to the character (starts at 0, 0)
    const bunnyPositions = [
        { x: -8, z: -6 },
        { x: 10, z: 8 },
        { x: -5, z: 12 }
    ];

    bunnyPositions.forEach((pos, index) => {
        loader.load(
            'models/bunny.glb',
            (gltf) => {
                const bunny = gltf.scene;
                bunny.position.set(pos.x, 0, pos.z);
                bunny.scale.set(0.4, 0.4, 0.4); // 2x bigger than 0.2
                bunny.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                // Add bunny behavior data
                bunny.userData = {
                    targetX: pos.x,
                    targetZ: pos.z,
                    isPaused: true,
                    pauseTime: Date.now() + Math.random() * 2000, // Random initial pause
                    moveSpeed: 0.02,
                    hopPhase: 0,
                    baseY: 0
                };

                scene.add(bunny);
                bunnies.push(bunny);
                console.log('Bunny added to the scene!');
            },
            undefined,
            (error) => {
                console.log('Bunny model not found, skipping');
            }
        );
    });
}

function addRoosters() {
    const loader = new GLTFLoader();

    // Positions for 2 roosters spread around the garden
    const roosterPositions = [
        { x: -20, z: 15 },
        { x: 30, z: -20 }
    ];

    roosterPositions.forEach((pos, index) => {
        loader.load(
            'models/rooster.glb',
            (gltf) => {
                const rooster = gltf.scene;
                rooster.position.set(pos.x, 0, pos.z);
                rooster.scale.set(0.4, 0.4, 0.4); // Same size as bunny
                rooster.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                // Add rooster behavior data - similar to bunny but walks instead of hops
                rooster.userData = {
                    targetX: pos.x,
                    targetZ: pos.z,
                    isPaused: true,
                    pauseTime: Date.now() + Math.random() * 2000, // Random initial pause
                    moveSpeed: 0.03, // Slightly faster than bunnies
                    walkPhase: 0,
                    baseY: 0
                };

                scene.add(rooster);
                roosters.push(rooster);
                console.log('Rooster added to the scene!');
            },
            undefined,
            (error) => {
                console.log('Rooster model not found, skipping');
            }
        );
    });
}

function loadVegetables() {
    const loader = new GLTFLoader(loadingManager);

    CONFIG.vegetables.forEach((vegConfig) => {
        // Create multiple instances for each vegetable type
        vegConfig.positions.forEach((pos) => {
            // Create a placeholder for each vegetable instance
            const placeholderGeometry = new THREE.SphereGeometry(0.5, 16, 16);
            const placeholderMaterial = new THREE.MeshStandardMaterial({
                color: getVeggieColor(vegConfig.name),
                emissive: getVeggieColor(vegConfig.name),
                emissiveIntensity: 0.2
            });
            const placeholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
            placeholder.position.set(pos.x, 0, pos.z); // Start at ground level
            placeholder.castShadow = true;
            placeholder.userData = {
                name: vegConfig.name,
                collected: false,
                floatOffset: Math.random() * Math.PI * 2,
                baseY: 0 // Track base Y position
            };

            scene.add(placeholder);
            const vegIndex = vegetables.length;
            vegetables.push(placeholder);

            // Try to load actual model (will fail gracefully if not present)
            loader.load(
                `models/${vegConfig.file}`,
                (gltf) => {
                    // Replace placeholder with actual model
                    const model = gltf.scene.clone();
                    model.position.copy(placeholder.position);

                    // Scale based on vegetable type (base * proportion * 2x * 0.5x global)
                    let scale = 0.5; // base default
                    if (vegConfig.name === 'Tomato') scale = 1.0;      // 2x
                    if (vegConfig.name === 'Peas') scale = 0.35;       // 0.7x
                    if (vegConfig.name === 'Carrot') scale = 1.0;      // 2x
                    if (vegConfig.name === 'Onion') scale = 1.5;       // 3x
                    if (vegConfig.name === 'Radish') scale = 5.0;      // 10x (was 5x, now 2x bigger)
                    if (vegConfig.name === 'Turnip') scale = 0.25;     // 0.5x
                    if (vegConfig.name === 'Cucumber') scale = 2.5;    // 5x
                    if (vegConfig.name === 'Broccoli') scale = 0.35;   // 0.7x
                    if (vegConfig.name === 'Banana') scale = 1.2;      // 2.4x (medium-large)
                    if (vegConfig.name === 'Apple') scale = 0.2;       // 0.4x (tiny)
                    if (vegConfig.name === 'Strawberry') scale = 0.6;  // 1.2x (medium-small)
                    if (vegConfig.name === 'Grape') scale = 0.6;       // 1.2x (similar to strawberry)
                    if (vegConfig.name === 'Watermelon') scale = 1.5;  // 3x (medium-large)
                    if (vegConfig.name === 'Avocado') scale = 0.5;     // 1x (medium)

                    // Apply 2x global multiplier then 0.5x reduction (net 1x from original 2x)
                    scale = scale * 2 * 0.5;

                    model.scale.set(scale, scale, scale);

                    // Calculate bounding box to find the bottom of the model
                    const box = new THREE.Box3().setFromObject(model);
                    const minY = box.min.y;

                    // Raise the model so its bottom sits at ground level (y=0)
                    const yOffset = -minY;
                    model.position.y = yOffset;

                    // Store base Y in userData
                    model.userData = placeholder.userData;
                    model.userData.baseY = yOffset; // Use the offset as base Y
                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                        }
                    });

                    scene.remove(placeholder);
                    vegetables[vegIndex] = model;
                    scene.add(model);
                },
                undefined,
                (error) => {
                    // Keep the placeholder
                }
            );
        });
    });
}

function getVeggieColor(name) {
    const colors = {
        'Carrot': 0xFF8C00,
        'Tomato': 0xFF6347,
        'Broccoli': 0x228B22,
        'Onion': 0xFFE4B5,
        'Eggplant': 0x4B0082,
        'Pepper': 0xFF0000,
        'Cucumber': 0x90EE90,
        'Peas': 0x32CD32,
        'Turnip': 0xE6E6FA,
        'Radish': 0xFF69B4,
        'Banana': 0xFFFF00,
        'Apple': 0xFF0000,
        'Strawberry': 0xFF1493,
        'Grape': 0x800080,      // Purple
        'Watermelon': 0xFF69B4,  // Pink/red
        'Avocado': 0x568203      // Green
    };
    return colors[name] || 0x00FF00;
}

function onKeyDown(event) {
    if (event.key in keys) keys[event.key] = true;
}

function onKeyUp(event) {
    if (event.key in keys) keys[event.key] = false;
}

function updateCharacterMovement() {
    if (!character) return; // Wait for character to load

    const moveVector = new THREE.Vector3();
    let moving = false;

    // Simple screen-relative movement
    if (keys.ArrowUp) {
        moveVector.z -= CONFIG.character.speed;  // Move up on screen (away from camera)
        moving = true;
    }
    if (keys.ArrowDown) {
        moveVector.z += CONFIG.character.speed;  // Move down on screen (toward camera)
        moving = true;
    }
    if (keys.ArrowLeft) {
        moveVector.x -= CONFIG.character.speed;  // Move left on screen
        moving = true;
    }
    if (keys.ArrowRight) {
        moveVector.x += CONFIG.character.speed;  // Move right on screen
        moving = true;
    }

    if (moving) {
        // Apply movement
        character.position.add(moveVector);

        // Keep character within bounds
        character.position.x = Math.max(-45, Math.min(45, character.position.x));
        character.position.z = Math.max(-45, Math.min(45, character.position.z));

        // Rotate character to face the direction of movement
        const angle = Math.atan2(moveVector.x, moveVector.z);
        character.rotation.y = angle;
    }
}

function checkCollisions() {
    if (!character) return; // Wait for character to load

    const characterPos = new THREE.Vector2(character.position.x, character.position.z);

    vegetables.forEach((veggie, index) => {
        if (veggie && !veggie.userData.collected) {
            const veggiePos = new THREE.Vector2(veggie.position.x, veggie.position.z);
            const distance = characterPos.distanceTo(veggiePos);

            if (distance < CONFIG.character.collectionRadius) {
                collectVegetable(veggie, index);
            }
        }
    });
}

function collectVegetable(veggie, index) {
    veggie.userData.collected = true;

    // Add to collected list with quantity tracking
    const veggieName = veggie.userData.name;
    if (!collectedVeggies[veggieName]) {
        collectedVeggies[veggieName] = 0;
    }
    collectedVeggies[veggieName]++;

    // Update UI
    updateShoppingListUI();

    // Animate and remove from scene
    const startY = veggie.position.y;
    const duration = 500; // ms
    const startTime = Date.now();

    const animateCollection = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        veggie.position.y = startY + progress * 3;
        veggie.rotation.y += 0.2;
        veggie.scale.multiplyScalar(1 - progress * 0.02);

        if (progress < 1) {
            requestAnimationFrame(animateCollection);
        } else {
            scene.remove(veggie);
        }
    };

    animateCollection();
}

function updateShoppingListUI() {
    const listElement = document.getElementById('veggie-list');
    listElement.innerHTML = ''; // Clear the list

    // Emoji mapping for each item
    const emojiMap = {
        'Carrot': '🥕',
        'Tomato': '🍅',
        'Broccoli': '🥦',
        'Onion': '🧅',
        'Eggplant': '🍆',
        'Pepper': '🫑',
        'Cucumber': '🥒',
        'Peas': '🫛',
        'Turnip': '🌰',
        'Radish': '🔴',
        'Banana': '🍌',
        'Apple': '🍎',
        'Strawberry': '🍓',
        'Grape': '🍇',
        'Watermelon': '🍉',
        'Avocado': '🥑'
    };

    // Add each vegetable with its emoji and quantity
    Object.keys(collectedVeggies).sort().forEach(veggieName => {
        const li = document.createElement('li');
        const quantity = collectedVeggies[veggieName];
        const emoji = emojiMap[veggieName] || '🌱';
        li.textContent = `${emoji} ${veggieName} (${quantity})`;
        listElement.appendChild(li);
    });
}

function animate() {
    requestAnimationFrame(animate);

    updateCharacterMovement();
    checkCollisions();

    // Update controls for damping
    controls.update();

    // Animate vegetables (gentle bobbing only from ground level)
    vegetables.forEach((veggie, index) => {
        if (veggie && !veggie.userData.collected) {
            const time = Date.now() * 0.001;
            const baseY = veggie.userData.baseY || 0;
            // Gentle up and down bobbing motion starting from ground
            veggie.position.y = baseY + Math.sin(time * 1.5 + veggie.userData.floatOffset) * 0.15;
        }
    });

    // Animate bunnies (hopping around randomly)
    updateBunnies();

    // Animate roosters (walking around randomly)
    updateRoosters();

    // Update camera target to follow character
    if (character) {
        controls.target.set(character.position.x, 0, character.position.z);
    }

    renderer.render(scene, camera);
}

function updateBunnies() {
    const currentTime = Date.now();

    bunnies.forEach(bunny => {
        if (!bunny.userData) return;

        // Check if bunny should stop pausing and start moving
        if (bunny.userData.isPaused) {
            if (currentTime > bunny.userData.pauseTime) {
                // Stop pausing, pick a new random target
                bunny.userData.isPaused = false;
                bunny.userData.targetX = bunny.position.x + (Math.random() - 0.5) * 20;
                bunny.userData.targetZ = bunny.position.z + (Math.random() - 0.5) * 20;

                // Keep within bounds
                bunny.userData.targetX = Math.max(-40, Math.min(40, bunny.userData.targetX));
                bunny.userData.targetZ = Math.max(-40, Math.min(40, bunny.userData.targetZ));
            }
        } else {
            // Move towards target
            const dx = bunny.userData.targetX - bunny.position.x;
            const dz = bunny.userData.targetZ - bunny.position.z;
            const distance = Math.sqrt(dx * dx + dz * dz);

            if (distance > 0.5) {
                // Move slowly towards target
                bunny.position.x += (dx / distance) * bunny.userData.moveSpeed;
                bunny.position.z += (dz / distance) * bunny.userData.moveSpeed;

                // Rotate bunny to face movement direction
                const angle = Math.atan2(dx, dz);
                bunny.rotation.y = angle;

                // Hopping animation
                bunny.userData.hopPhase += 0.15;
                bunny.position.y = bunny.userData.baseY + Math.abs(Math.sin(bunny.userData.hopPhase)) * 0.3;
            } else {
                // Reached target, pause
                bunny.userData.isPaused = true;
                bunny.userData.pauseTime = currentTime + 1000 + Math.random() * 3000; // Pause 1-4 seconds
                bunny.position.y = bunny.userData.baseY; // Return to ground
                bunny.userData.hopPhase = 0;
            }
        }
    });
}

function updateRoosters() {
    const currentTime = Date.now();

    roosters.forEach(rooster => {
        if (!rooster.userData) return;

        // Check if rooster should stop pausing and start moving
        if (rooster.userData.isPaused) {
            if (currentTime > rooster.userData.pauseTime) {
                // Stop pausing, pick a new random target
                rooster.userData.isPaused = false;
                rooster.userData.targetX = rooster.position.x + (Math.random() - 0.5) * 25;
                rooster.userData.targetZ = rooster.position.z + (Math.random() - 0.5) * 25;

                // Keep within bounds
                rooster.userData.targetX = Math.max(-40, Math.min(40, rooster.userData.targetX));
                rooster.userData.targetZ = Math.max(-40, Math.min(40, rooster.userData.targetZ));
            }
        } else {
            // Move towards target
            const dx = rooster.userData.targetX - rooster.position.x;
            const dz = rooster.userData.targetZ - rooster.position.z;
            const distance = Math.sqrt(dx * dx + dz * dz);

            if (distance > 0.5) {
                // Move towards target (roosters walk, no hopping)
                rooster.position.x += (dx / distance) * rooster.userData.moveSpeed;
                rooster.position.z += (dz / distance) * rooster.userData.moveSpeed;

                // Rotate rooster to face movement direction
                const angle = Math.atan2(dx, dz);
                rooster.rotation.y = angle;

                // Subtle head bob while walking
                rooster.userData.walkPhase += 0.2;
                rooster.position.y = rooster.userData.baseY + Math.abs(Math.sin(rooster.userData.walkPhase)) * 0.05;
            } else {
                // Reached target, pause
                rooster.userData.isPaused = true;
                rooster.userData.pauseTime = currentTime + 500 + Math.random() * 2000; // Pause 0.5-2.5 seconds (shorter than bunnies)
                rooster.position.y = rooster.userData.baseY; // Return to ground
                rooster.userData.walkPhase = 0;
            }
        }
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
}

// ========== GitHub Integration & Email Trigger ==========

async function saveAndEmailList() {
    const button = document.getElementById('save-email-btn');
    const statusMsg = document.getElementById('status-message');

    if (Object.keys(collectedVeggies).length === 0) {
        showStatus('Collect some vegetables first!', 'error');
        return;
    }

    button.disabled = true;
    showStatus('Saving your list...', 'info');

    try {
        // Calculate total count
        const totalCount = Object.values(collectedVeggies).reduce((sum, count) => sum + count, 0);

        // Prepare the shopping list data
        const shoppingList = {
            date: new Date().toISOString(),
            vegetables: collectedVeggies,
            total: totalCount
        };

        // Commit to GitHub
        await commitToGitHub(shoppingList);

        showStatus('WhatsApp sent!', 'success');

        // Re-enable button after 3 seconds
        setTimeout(() => {
            button.disabled = false;
        }, 3000);

    } catch (error) {
        console.error('Error saving list:', error);
        showStatus(`Error: ${error.message}`, 'error');
        button.disabled = false;
    }
}

async function commitToGitHub(shoppingList) {
    // Check if we're running on Netlify (has the function endpoint)
    const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('netlify.live');

    if (isNetlify) {
        // Use Netlify serverless function (secure, uses environment variables)
        const response = await fetch('/.netlify/functions/save-shopping-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(shoppingList)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save shopping list');
        }

        return await response.json();
    } else {
        // Local development - use direct GitHub API with token from config
        const { owner, repo, token } = CONFIG.github;

        if (!token || token === '') {
            console.warn('GitHub token not configured - skipping commit');
            return { message: 'Skipped GitHub commit (no token configured)' };
        }

        const path = 'data/shopping-list.json';
        const content = btoa(JSON.stringify(shoppingList, null, 2));
        const message = `Update shopping list - ${new Date().toLocaleString()}`;

        // Check if file exists to get its SHA
        let sha = null;
        try {
            const getResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
                {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (getResponse.ok) {
                const data = await getResponse.json();
                sha = data.sha;
            }
        } catch (error) {
            console.log('File does not exist yet, will create new file');
        }

        // Create or update the file
        const body = {
            message: message,
            content: content,
            branch: 'main'
        };

        if (sha) {
            body.sha = sha;
        }

        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to commit to GitHub');
        }

        return await response.json();
    }
}

function showStatus(message, type) {
    const statusMsg = document.getElementById('status-message');
    statusMsg.textContent = message;
    statusMsg.className = type;

    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            statusMsg.textContent = '';
            statusMsg.className = '';
        }, 5000);
    }
}

// ========== Start the application ==========
init();
