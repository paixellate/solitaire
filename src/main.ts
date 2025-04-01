import * as THREE from "three";
import { Game } from "./core/game";
import { Input } from "./core/input";

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
    game.mainLoop(input);

    // Render the scene
    renderer.render(scene, camera);
    input.reset();
}

animate();
