import * as THREE from "three";
import { Game } from "./core/game";
import { Input } from "./core/input";
import Stats from "stats.js";

const stats = new Stats();
// the number will decide which information will be displayed
// 0 => FPS Frames rendered in the last second. The higher the number the better.
// 1 => MS Milliseconds needed to render a frame. The lower the number the better.
// 2 => MB MBytes of allocated memory. (Run Chrome with --enable-precise-memory-info)
// 3 => CUSTOM User-defined panel support.
stats.showPanel(0);

document.body.appendChild(stats.dom);

let input: Input = {
    mouse: {
        position: new THREE.Vector2(),
        isDown: false,
        wasDown: false,
    },
    reset: () => {
        input.mouse.wasDown = input.mouse.isDown;
    },
};

// Setup mouse event listeners
window.addEventListener("mousemove", (event) => {
    // (0 to window.innerWidth)
    input.mouse.position.x = event.clientX - window.innerWidth / 2;
    input.mouse.position.y = -(event.clientY - window.innerHeight / 2);
});

window.addEventListener("mousedown", () => {
    input.mouse.isDown = true;
});

window.addEventListener("mouseup", () => {
    input.mouse.isDown = false;
});

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const camera = new THREE.OrthographicCamera(
    window.innerWidth / -2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    window.innerHeight / -2,
    0.1,
    1000
);
const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(ambientLight);

camera.position.z = 500;

const game = new Game();
game.addToScene(scene);

function animate() {
    requestAnimationFrame(animate);

    stats.begin();
    game.mainLoop(input);

    // Render the scene
    renderer.render(scene, camera);
    input.reset();
    stats.end();
}

animate();
