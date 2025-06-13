export interface Item {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: ItemType;
  effects?: ItemEffects;
}

export type ItemType = 'food' | 'potion' | 'equipment' | 'decoration';

export interface ItemEffects {
  health?: number;
  attack?: number;
  defense?: number;
  speed?: number;
  luck?: number;
  coins?: number;
  experience?: number;
} 