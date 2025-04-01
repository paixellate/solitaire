// import { vec2, vec3 } from "../../vector";
// import { Card } from "../card";
// import { Rank } from "../rank";
// import { Suit } from "../suit";
// import { Pile } from "./pile";
// import { PileType } from "./pileType";
// import * as THREE from "three";

// export class DrawPiles {
//     private readonly wastePile: Pile;

//     constructor(
//         stockIndex: number,
//         wasteIndex: number,
//         width: number,
//         height: number,
//         position: THREE.Vector3,
//         wasteOffset: THREE.Vector3
//     ) {
//         this.wastePile = new Pile(wasteIndex, PileType.WASTE, width, height, vec3(
//             position.x + wasteOffset.x,
//             position.y + wasteOffset.y,
//             position.z,
//         ));
//         this.addDeckToStock();
//     }

//     private revealCard(): boolean {
//         if (this.stockPile.canPopCard()) {
//             const topCard = this.stockPile.popCardOrThrow();
//             topCard.makeFaceUp();
//             this.addCardToWaste(topCard);
//             return true;
//         }
//         return false;
//     }

//     public dealCard(): void {
//         if (this.revealCard()) {
//             return;
//         }

//         if (this.wastePile.canPopCard()) {
//             while (this.wastePile.canPopCard()) {
//                 const card = this.wastePile.popCardOrThrow();
//                 card.makeFaceDown();
//                 this.addCardToStock(card);
//             }
//             this.revealCard();
//         } else {
//             // do nothing
//         }
//     }
// }
