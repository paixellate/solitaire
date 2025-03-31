import * as THREE from "three";
import { Pile } from "./core/piles/pile";
import { PileType } from "./core/piles/pileType";
import { DrawPiles } from "./core/piles/drawPiles";

// Mouse state tracking
const mouse = {
    position: new THREE.Vector2(),
    isDown: false
};

// Setup mouse event listeners
window.addEventListener('mousemove', (event) => {
    // (0 to window.innerWidth)
    mouse.position.x = event.clientX - window.innerWidth / 2;
    mouse.position.y = -(event.clientY - window.innerHeight / 2);
});

window.addEventListener('mousedown', () => {
    mouse.isDown = true;
});

window.addEventListener('mouseup', () => {
    mouse.isDown = false;
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

// Add some lighting so the standard material can be visible
const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(ambientLight);

// Position camera
camera.position.z = 500;

const drawPile = new DrawPiles(1, 2, 100, 140, { x: 0, y: 300, z: -100 }, { x: -120, y: 0 });

// loops are overkill for this.
const tableauPiles = [
    new Pile(3, PileType.TABLEAU, 100, 140, { x: -450, y: 0, z: -100 }),
    new Pile(4, PileType.TABLEAU, 100, 140, { x: -300, y: 0, z: -100 }),
    new Pile(5, PileType.TABLEAU, 100, 140, { x: -150, y: 0, z: -100 }),
    new Pile(6, PileType.TABLEAU, 100, 140, { x: 0, y: 0, z: -100 }),
    new Pile(7, PileType.TABLEAU, 100, 140, { x: 150, y: 0, z: -100 }),
    new Pile(8, PileType.TABLEAU, 100, 140, { x: 300, y: 0, z: -100 }),
    new Pile(9, PileType.TABLEAU, 100, 140, { x: 450, y: 0, z: -100 }),
];

drawPile.addToScene(scene);
tableauPiles.forEach((pile) => pile.addToScene(scene));

for (let i = 0; i < 7; i++) {
    for (let j = 0; j < i + 1; j++) {
        tableauPiles[i].addCard(drawPile.dealCardForSetup(), { x: 0, y: -0.02 });
    }
}

tableauPiles.forEach((pile) => pile.getTopCard()?.makeFaceUp());


function animate() {
    requestAnimationFrame(animate);

    // Render the scene
    renderer.render(scene, camera);
}

animate();
