import * as THREE from "three";
import { Game } from "./game";
import { Input } from "./input";
import Stats from "stats.js";
import { createBoard } from "./core/setup";
import { createControls } from "./core/setup";
import { getDefaultLayout } from "./core/ui/layout";
import { SCENE_BACKGROUND_COLOR, AMBIENT_LIGHT_COLOR, AMBIENT_LIGHT_INTENSITY } from "./graphics/material/materials";

// const stats = new Stats();
// // the number will decide which information will be displayed
// // 0 => FPS Frames rendered in the last second. The higher the number the better.
// // 1 => MS Milliseconds needed to render a frame. The lower the number the better.
// // 2 => MB MBytes of allocated memory. (Run Chrome with --enable-precise-memory-info)
// // 3 => CUSTOM User-defined panel support.
// stats.showPanel(0);
// document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);
const camera = new THREE.OrthographicCamera(
    window.innerWidth / -2, // Initial values, will be updated by onWindowResize
    window.innerWidth / 2,
    window.innerHeight / 2,
    window.innerHeight / -2,
    0.1,
    1000
);
camera.position.z = 500;

// Function to handle window resize
function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Update camera
    camera.left = width / -2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = height / -2;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(width, height);
}

// Add event listener
window.addEventListener("resize", onWindowResize, false);

// Setup mouse and touch event listeners
const input = new Input();

// Helper function to convert touch/mouse coordinates to scene coordinates
function convertToSceneCoordinates(clientX: number, clientY: number) {
    return {
        x: clientX - window.innerWidth / 2,
        y: -(clientY - window.innerHeight / 2),
    };
}

// Mouse Events
window.addEventListener("mousemove", (event) => {
    const coords = convertToSceneCoordinates(event.clientX, event.clientY);
    input.mouse.position.x = coords.x;
    input.mouse.position.y = coords.y;
});

window.addEventListener("mousedown", () => {
    input.mouse.isDown = true;
});

window.addEventListener("mouseup", () => {
    input.mouse.isDown = false;
});

// Touch Events
window.addEventListener(
    "touchmove",
    (event) => {
        event.preventDefault(); // Prevent scrolling
        const touch = event.touches[0];
        const coords = convertToSceneCoordinates(touch.clientX, touch.clientY);
        input.mouse.position.x = coords.x;
        input.mouse.position.y = coords.y;
    },
    { passive: false }
);

window.addEventListener(
    "touchstart",
    (event) => {
        event.preventDefault();
        input.mouse.isDown = true;
        const touch = event.touches[0];
        const coords = convertToSceneCoordinates(touch.clientX, touch.clientY);
        input.mouse.position.x = coords.x;
        input.mouse.position.y = coords.y;
    },
    { passive: false }
);

window.addEventListener(
    "touchend",
    (event) => {
        event.preventDefault();
        input.mouse.isDown = false;
    },
    { passive: false }
);

const scene = new THREE.Scene();
scene.background = new THREE.Color(SCENE_BACKGROUND_COLOR);
const ambientLight = new THREE.AmbientLight(AMBIENT_LIGHT_COLOR, AMBIENT_LIGHT_INTENSITY);
scene.add(ambientLight);
const layout = getDefaultLayout(window.innerWidth, window.innerHeight);
const game = new Game(createBoard(layout, -1), createControls(layout));
game.addToScene(scene);

function animate() {
    requestAnimationFrame(animate);

    // stats.begin();
    game.mainLoop(input);

    renderer.render(scene, camera);
    // stats.end();
}

onWindowResize();
animate();
