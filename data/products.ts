export type PreparationOption = 'Whole' | 'Cleaned' | 'Curry Cut' | 'Fillet';

export type ProductCategory =
  | 'fish'
  | 'prawns'
  | 'shellfish'
  | 'premium'
  | 'fillet';

export interface MarketProduct {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  unit: string;
  freshness: string;
  description: string;
  preparationOptions: PreparationOption[];
  origin: string;
  /** Overrides the 3D model chosen from `category`. */
  model?: 'fish' | 'prawn' | 'crab' | 'lobster' | 'fillet';
}

export const products: MarketProduct[] = [
  {
    id: 'pomfret',
    name: 'Pomfret',
    category: 'fish',
    price: 2800,
    unit: 'kg',
    freshness: "Today's Catch",
    description:
      'Silver pomfret with delicate white flesh. A coastal favourite, prized for its mild flavour and tender texture.',
    preparationOptions: ['Whole', 'Cleaned', 'Curry Cut', 'Fillet'],
    origin: 'Arabian Sea',
  },
  {
    id: 'surmai',
    name: 'Surmai',
    category: 'fish',
    price: 3200,
    unit: 'kg',
    freshness: "Today's Catch",
    description:
      'King mackerel, known locally as Surmai. Firm, flavourful steaks perfect for grilling or frying.',
    preparationOptions: ['Whole', 'Cleaned', 'Curry Cut', 'Fillet'],
    origin: 'Arabian Sea',
  },
  {
    id: 'red-snapper',
    name: 'Red Snapper',
    category: 'fish',
    price: 2400,
    unit: 'kg',
    freshness: 'Fresh Today',
    description:
      'Vibrant red-skinned snapper with sweet, nutty flavour. Excellent baked whole or as fillets.',
    preparationOptions: ['Whole', 'Cleaned', 'Curry Cut', 'Fillet'],
    origin: 'Arabian Sea',
  },
  {
    id: 'hamour',
    name: 'Hamour',
    category: 'fish',
    price: 3600,
    unit: 'kg',
    freshness: 'Fresh Today',
    description:
      'Premium grouper, prized across the Gulf. Thick, moist flakes with a rich, buttery taste.',
    preparationOptions: ['Whole', 'Cleaned', 'Curry Cut', 'Fillet'],
    origin: 'Persian Gulf',
  },
  {
    id: 'rohu',
    name: 'Rohu',
    category: 'fish',
    price: 1800,
    unit: 'kg',
    freshness: 'Fresh Today',
    description:
      'Freshwater carp, a staple for traditional curries. Firm flesh that holds up beautifully to spices.',
    preparationOptions: ['Whole', 'Cleaned', 'Curry Cut', 'Fillet'],
    origin: 'Inland Waters',
  },
  {
    id: 'king-prawns',
    name: 'King Prawns',
    category: 'prawns',
    price: 3500,
    unit: 'kg',
    freshness: "Today's Catch",
    description:
      'Large, succulent jumbo prawns. Sweet and firm — ideal for grilling, curries, or tempura.',
    preparationOptions: ['Whole', 'Cleaned', 'Curry Cut', 'Fillet'],
    origin: 'Arabian Sea',
  },
  {
    id: 'shrimp',
    name: 'Tiger Shrimp',
    category: 'prawns',
    price: 2200,
    unit: 'kg',
    freshness: 'Fresh Today',
    description:
      'Medium tiger shrimp with distinctive stripes. Versatile and quick to cook.',
    preparationOptions: ['Whole', 'Cleaned', 'Curry Cut', 'Fillet'],
    origin: 'Coastal Farms',
  },
  {
    id: 'crab',
    name: 'Mud Crab',
    category: 'shellfish',
    price: 2800,
    unit: 'kg',
    freshness: 'Live Today',
    description:
      'Hard-shell mud crab, meaty and rich. A centrepiece for any seafood spread.',
    preparationOptions: ['Whole', 'Cleaned', 'Curry Cut', 'Fillet'],
    origin: 'Mangrove Coast',
  },
  {
    id: 'lobster',
    name: 'Lobster',
    category: 'premium',
    price: 6500,
    unit: 'kg',
    freshness: 'Live Today',
    description:
      'Spiny lobster, the crown of the catch. Sweet, tender tail meat — a true luxury.',
    preparationOptions: ['Whole', 'Cleaned', 'Curry Cut', 'Fillet'],
    origin: 'Deep Sea',
  },
  {
    id: 'hamour-fillet',
    name: 'Aged Hamour Fillet',
    category: 'premium',
    model: 'fillet',
    price: 5200,
    unit: 'kg',
    freshness: 'Premium Selection',
    description:
      'Hand-cut, dry-aged hamour fillet. Exceptionally tender with concentrated flavour.',
    preparationOptions: ['Whole', 'Cleaned', 'Curry Cut', 'Fillet'],
    origin: 'Persian Gulf',
  },
];

export const categoryLabels: Record<ProductCategory, string> = {
  fish: 'Fresh Fish',
  prawns: 'Prawns & Shrimp',
  shellfish: 'Shellfish',
  premium: 'Premium Catch',
  fillet: 'Fillets',
};
