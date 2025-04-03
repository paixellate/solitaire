import * as THREE from "three";
import { createCardBackTexture, createCardTexture } from "./card";
import { Suit } from "../core/cards/suit";
import { Rank } from "../core/cards/rank";
import { createButtonTexture } from "./button";

export class TextureCache {
    private static readonly instance: TextureCache = new TextureCache();
    private readonly textures: Map<string, THREE.Texture>;
    private readonly textureLoader: THREE.TextureLoader;

    private constructor() {
        this.textures = new Map();
        this.textureLoader = new THREE.TextureLoader();
    }

    public static getInstance(): TextureCache {
        return TextureCache.instance;
    }

    private getTexture(key: string, textureCreator: () => string): THREE.Texture {
        let texture = this.textures.get(key);
        if (!texture) {
            texture = this.textureLoader.load(textureCreator());
            this.textures.set(key, texture);
            texture = this.textures.get(key);
            if (!texture) {
                throw new Error("Failed to load texture");
            }
        }
        return texture;
    }

    public loadCardTexture(rank: Rank, suit: Suit, width: number, height: number): THREE.Texture {
        const key = `${rank}-${suit}-${width}-${height}`;
        return this.getTexture(key, () => createCardTexture(rank, suit, width, height));
    }

    public loadCardBackTexture(width: number, height: number): THREE.Texture {
        const key = `back-${width}-${height}`;
        return this.getTexture(key, () => createCardBackTexture(width, height));
    }

    public loadButtonTexture(text: string, width: number, height: number): THREE.Texture {
        const key = `${text}-${width}-${height}`;
        return this.getTexture(key, () => createButtonTexture(text, width, height));
    }
}
