import * as THREE from "three";
import { Game } from "./core/game";
import { Input } from "./input";
import Stats from "stats.js";
import { createBoard } from "./core/setup";
import { createControls } from "./core/setup";

const stats = new Stats();
// the number will decide which information will be displayed
// 0 => FPS Frames rendered in the last second. The higher the number the better.
// 1 => MS Milliseconds needed to render a frame. The lower the number the better.
// 2 => MB MBytes of allocated memory. (Run Chrome with --enable-precise-memory-info)
// 3 => CUSTOM User-defined panel support.
stats.showPanel(0);

document.body.appendChild(stats.dom);

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

// Setup mouse event listeners
const input = new Input();

// event.clientX: Screen position from (0 to window.innerWidth) (left to right)
// event.clientY: Screen position from (0 to window.innerHeight) (top to bottom)
window.addEventListener("mousemove", (event) => {
    // set values x: (- window.innerWidth/2 to + window.innerWidth / 2) (left to right)
    // set values y: (- window.innerHeight/2 to + window.innerHeight / 2) (bottom to top)
    input.mouse.position.x = event.clientX - window.innerWidth / 2;
    input.mouse.position.y = -(event.clientY - window.innerHeight / 2);
});

window.addEventListener("mousedown", () => {
    input.mouse.isDown = true;
});

window.addEventListener("mouseup", () => {
    input.mouse.isDown = false;
});

const scene = new THREE.Scene();
const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(ambientLight);

const game = new Game(createBoard(), createControls());
game.addToScene(scene);

function animate() {
    requestAnimationFrame(animate);

    stats.begin();
    game.mainLoop(input);

    renderer.render(scene, camera);
    stats.end();
}

onWindowResize();
animate();
