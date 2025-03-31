import * as THREE from "three";
import { createCardBackTexture, createCardTexture } from "./card";
import { Suit } from "../core/suit";
import { Rank } from "../core/rank";

export class TextureManager {
    private static readonly instance: TextureManager = new TextureManager();
    private readonly textures: Map<string, THREE.Texture>;
    private readonly textureLoader: THREE.TextureLoader;

    private constructor() {
        this.textures = new Map();
        this.textureLoader = new THREE.TextureLoader();
    }

    public static getInstance(): TextureManager {
        return TextureManager.instance;
    }

    public loadCardTexture(rank: Rank, suit: Suit, width: number, height: number): THREE.Texture {
        let cardTexture = this.textures.get(rank + suit);
        if (!cardTexture) {
            this.textures.set(rank + suit, this.textureLoader.load(createCardTexture(rank, suit, width, height)));
            cardTexture = this.textures.get(rank + suit);
            if (!cardTexture) {
                throw new Error("Failed to load card texture");
            }
        }
        return cardTexture;
    }

    public loadCardBackTexture(width: number, height: number): THREE.Texture {
        let cardBackTexture = this.textures.get("back");
        if (!cardBackTexture) {
            this.textures.set("back", this.textureLoader.load(createCardBackTexture(width, height)));
            cardBackTexture = this.textures.get("back");
            if (!cardBackTexture) {
                throw new Error("Failed to load card back texture");
            }
        }
        return cardBackTexture;
    }
}

export class MaterialManager {
    private static readonly instance: MaterialManager = new MaterialManager();
    private readonly materials: Map<string, THREE.Material>;

    private constructor() {
        this.materials = new Map();
    }

    public static getInstance(): MaterialManager {
        return MaterialManager.instance;
    }

    public getMaterial(rank: Rank, suit: Suit, width: number, height: number): THREE.Material {
        let material = this.materials.get(rank + suit);
        if (!material) {
            material = new THREE.MeshStandardMaterial({ 
                color: 0xffffff,
                side: THREE.DoubleSide,
                map: TextureManager.getInstance().loadCardTexture(rank, suit, width, height)
            });
            this.materials.set(rank + suit, material);
            material = this.materials.get(rank + suit);
            if (!material) {
                throw new Error("Failed to load material");
            }
        }
        return material;
    }

    public getCardBackMaterial(width: number, height: number): THREE.Material {
        let material = this.materials.get("back");
        if (!material) {
            material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide,
                map: TextureManager.getInstance().loadCardBackTexture(width, height)
            });
            this.materials.set("back", material);
            material = this.materials.get("back");
            if (!material) {
                throw new Error("Failed to load material");
            }
        }
        return material;
    }
}