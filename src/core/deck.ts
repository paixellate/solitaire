import { Card } from "./cards/card";
import { Suit } from "./cards/suit";
import { Rank } from "./cards/rank";
import { vec3 } from "../graphics/vector";
import * as THREE from "three";
import { createCardBackMaterial, createCardMaterial } from "../graphics/material/materials";

export class Deck {
    private cards: Card[];

    constructor(width: number, height: number) {
        this.cards = this.createCards(width, height);
    }

    public shuffle(seed: number): Card[] {
        if (seed == -1) {
            return [...this.cards];
        }
        return this.shuffleCards([...this.cards], seed);
    }

    private createCards(width: number, height: number): Card[] {
        const cards: Card[] = [];
        for (const suit of Object.values(Suit)) {
            for (const rank of Object.values(Rank)) {
                const materialFront = createCardMaterial(rank, suit, width, height);
                const materialBack = createCardBackMaterial(width, height);
                const planeGeometry = new THREE.PlaneGeometry(width, height);
                const card = new Card(rank, suit, planeGeometry, vec3(0, 0, 0), materialFront, materialBack);
                cards.push(card);
            }
        }
        return cards;
    }

    private shuffleCards(array: Card[], seed: number): Card[] {
        let currentSeed = seed;

        // Simple deterministic PRNG function
        const nextSeed = () => {
            currentSeed = (currentSeed * 9301 + 49297) % 233280;
            return currentSeed / 233280;
        };

        // Fisher-Yates shuffle with seeded randomness
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(nextSeed() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }
}
