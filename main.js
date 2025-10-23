import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ========== Configuration ==========
const CONFIG = {
    // GitHub configuration for committing shopping list
    github: {
        owner: 'YOUR_GITHUB_USERNAME',  // Replace with your GitHub username
        repo: 'veggie-garden',          // Replace with your repo name
        token: 'YOUR_GITHUB_TOKEN'      // Replace with your GitHub personal access token
    },
    // Vegetable models configuration
    vegetables: [
        { name: 'Carrot', file: 'carrot.glb', position: { x: -3, z: 2 } },
        { name: 'Tomato', file: 'tomato.glb', position: { x: 3, z: 3 } },
        { name: 'Broccoli', file: 'broccoli.glb', position: { x: 0, z: -3 } },
        { name: 'Onion', file: 'onion.glb', position: { x: -4, z: -2 } },
        { name: 'Eggplant', file: 'eggplant.glb', position: { x: 4, z: -1 } },
        { name: 'Pepper', file: 'pepper.glb', position: { x: 2, z: 5 } },
        { name: 'Cucumber', file: 'cucumber.glb', position: { x: -2, z: 4 } }
    ],
    character: {
        speed: 0.1,
        size: 0.5,
        collectionRadius: 1.5
    }
};

// ========== Scene Setup ==========
let scene, camera, renderer, character;
let vegetables = [];
let collectedVeggies = [];
let loadingManager;

const keys = { w: false, a: false, s: false, d: false };

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 10, 50);

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 10, 12);
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);

    // Hemisphere light for better outdoor feel
    const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x8B4513, 0.4);
    scene.add(hemiLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(30, 30);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x228B22,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Garden bed decoration
    const bedGeometry = new THREE.BoxGeometry(20, 0.3, 20);
    const bedMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const gardenBed = new THREE.Mesh(bedGeometry, bedMaterial);
    gardenBed.position.y = 0.15;
    gardenBed.receiveShadow = true;
    scene.add(gardenBed);

    // Character (simple capsule)
    createCharacter();

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

    // Start animation
    animate();
}

function createCharacter() {
    const geometry = new THREE.CapsuleGeometry(CONFIG.character.size, CONFIG.character.size * 2, 4, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
    character = new THREE.Mesh(geometry, material);
    character.position.set(0, CONFIG.character.size, 0);
    character.castShadow = true;
    scene.add(character);

    // Add a simple face
    const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 0.8, 0.4);
    character.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 0.8, 0.4);
    character.add(rightEye);
}

function loadVegetables() {
    const loader = new GLTFLoader(loadingManager);

    CONFIG.vegetables.forEach((vegConfig, index) => {
        // Create a placeholder for each vegetable
        const placeholderGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const placeholderMaterial = new THREE.MeshStandardMaterial({
            color: getVeggieColor(vegConfig.name),
            emissive: getVeggieColor(vegConfig.name),
            emissiveIntensity: 0.2
        });
        const placeholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
        placeholder.position.set(vegConfig.position.x, 0.5, vegConfig.position.z);
        placeholder.castShadow = true;
        placeholder.userData = { name: vegConfig.name, index: index };

        // Add a floating animation offset
        placeholder.userData.floatOffset = Math.random() * Math.PI * 2;

        scene.add(placeholder);
        vegetables.push(placeholder);

        // Try to load actual model (will fail gracefully if not present)
        loader.load(
            `models/${vegConfig.file}`,
            (gltf) => {
                // Replace placeholder with actual model
                const model = gltf.scene;
                model.position.copy(placeholder.position);
                model.scale.set(0.5, 0.5, 0.5);
                model.userData = placeholder.userData;
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                    }
                });

                scene.remove(placeholder);
                vegetables[index] = model;
                scene.add(model);
            },
            undefined,
            (error) => {
                console.log(`Model ${vegConfig.file} not found, using placeholder`);
                // Keep the placeholder
            }
        );
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
        'Cucumber': 0x90EE90
    };
    return colors[name] || 0x00FF00;
}

function onKeyDown(event) {
    const key = event.key.toLowerCase();
    if (key in keys) keys[key] = true;
}

function onKeyUp(event) {
    const key = event.key.toLowerCase();
    if (key in keys) keys[key] = false;
}

function updateCharacterMovement() {
    const movement = new THREE.Vector3();

    if (keys.w) movement.z -= CONFIG.character.speed;
    if (keys.s) movement.z += CONFIG.character.speed;
    if (keys.a) movement.x -= CONFIG.character.speed;
    if (keys.d) movement.x += CONFIG.character.speed;

    character.position.add(movement);

    // Keep character on the garden bed
    character.position.x = Math.max(-9, Math.min(9, character.position.x));
    character.position.z = Math.max(-9, Math.min(9, character.position.z));

    // Rotate character in movement direction
    if (movement.length() > 0) {
        const angle = Math.atan2(movement.x, movement.z);
        character.rotation.y = angle;
    }
}

function checkCollisions() {
    const characterPos = new THREE.Vector2(character.position.x, character.position.z);

    vegetables.forEach((veggie, index) => {
        if (!veggie.userData.collected) {
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

    // Add to collected list
    collectedVeggies.push(veggie.userData.name);

    // Update UI
    const listElement = document.getElementById('veggie-list');
    const li = document.createElement('li');
    li.textContent = veggie.userData.name;
    listElement.appendChild(li);

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

function animate() {
    requestAnimationFrame(animate);

    updateCharacterMovement();
    checkCollisions();

    // Animate vegetables (floating effect)
    vegetables.forEach((veggie, index) => {
        if (!veggie.userData.collected) {
            const time = Date.now() * 0.001;
            veggie.position.y = 0.5 + Math.sin(time * 2 + veggie.userData.floatOffset) * 0.2;
            veggie.rotation.y += 0.01;
        }
    });

    // Camera follows character with slight offset
    const targetCameraPos = new THREE.Vector3(
        character.position.x,
        10,
        character.position.z + 12
    );
    camera.position.lerp(targetCameraPos, 0.05);
    camera.lookAt(character.position.x, 0, character.position.z);

    renderer.render(scene, camera);
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

    if (collectedVeggies.length === 0) {
        showStatus('Collect some vegetables first!', 'error');
        return;
    }

    button.disabled = true;
    showStatus('Saving your list...', 'info');

    try {
        // Prepare the shopping list data
        const shoppingList = {
            date: new Date().toISOString(),
            vegetables: collectedVeggies,
            total: collectedVeggies.length
        };

        // Commit to GitHub
        await commitToGitHub(shoppingList);

        showStatus('List saved & email sent!', 'success');

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
    const { owner, repo, token } = CONFIG.github;

    if (!token || token === 'YOUR_GITHUB_TOKEN') {
        throw new Error('Please configure your GitHub token in main.js');
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
        // File doesn't exist yet, which is fine
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
