export type MarketSection =
  | 'entrance'
  | 'fish'
  | 'prawns'
  | 'shellfish'
  | 'premium'
  | 'preparation'
  | 'delivery';

export interface CameraTarget {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
}

export const cameraTargets: Record<MarketSection, CameraTarget> = {
  entrance: {
    position: [0, 2.2, 14],
    lookAt: [0, 1.5, 0],
    fov: 55,
  },
  fish: {
    position: [-4.5, 1.6, 4],
    lookAt: [-4.5, 1.0, -1],
    fov: 48,
  },
  prawns: {
    position: [4.5, 1.8, 3],
    lookAt: [4.5, 1.2, -2],
    fov: 45,
  },
  shellfish: {
    position: [4.5, 1.8, -3.5],
    lookAt: [4.5, 1.2, -8],
    fov: 45,
  },
  premium: {
    position: [0, 2, -6.5],
    lookAt: [0, 1.3, -12],
    fov: 42,
  },
  preparation: {
    position: [-3, 1.8, -7.5],
    lookAt: [-3, 1.2, -12],
    fov: 45,
  },
  delivery: {
    position: [0, 2.5, -14],
    lookAt: [0, 1.5, -18],
    fov: 50,
  },
};

export const sectionOrder: MarketSection[] = [
  'entrance',
  'fish',
  'prawns',
  'shellfish',
  'premium',
  'preparation',
  'delivery',
];

export const sectionLabels: Record<MarketSection, string> = {
  entrance: 'Entrance',
  fish: 'Fresh Fish',
  prawns: 'Prawns',
  shellfish: 'Shellfish',
  premium: 'Premium Catch',
  preparation: 'Preparation',
  delivery: 'Delivery',
};
