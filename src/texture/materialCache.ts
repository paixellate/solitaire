import * as THREE from "three";
import { TextureCache } from "./textureCache";
import { Rank } from "../core/cards/rank";
import { Suit } from "../core/cards/suit";

export class MaterialCache {
    private static readonly instance: MaterialCache = new MaterialCache();
    private readonly materials: Map<string, THREE.MeshStandardMaterial>;

    private constructor() {
        this.materials = new Map();
    }

    public static getInstance(): MaterialCache {
        return MaterialCache.instance;
    }

    private getMaterial(key: string, textureLoader: () => THREE.Texture): THREE.MeshStandardMaterial {
        let material = this.materials.get(key);
        if (!material) {
            material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide,
                map: textureLoader(),
            });
            this.materials.set(key, material);
            material = this.materials.get(key);
            if (!material) {
                throw new Error("Failed to load material");
            }
        }
        return material;
    }

    public getCardMaterial(rank: Rank, suit: Suit, width: number, height: number): THREE.Material {
        const key = `${rank}-${suit}-${width}-${height}`;
        return this.getMaterial(key, () => TextureCache.getInstance().loadCardTexture(rank, suit, width, height));
    }

    public getCardBackMaterial(width: number, height: number): THREE.Material {
        const key = `back-${width}-${height}`;
        return this.getMaterial(key, () => TextureCache.getInstance().loadCardBackTexture(width, height));
    }

    public getButtonMaterial(text: string, color: THREE.Color, width: number, height: number): THREE.Material {
        const key = `${text}-${color.getHexString()}-${width}-${height}`;
        const material = this.getMaterial(key, () => TextureCache.getInstance().loadButtonTexture(text, width, height));
        material.color.set(color);
        return material;
    }
}
