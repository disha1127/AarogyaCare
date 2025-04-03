/**
 * Diet plan interface
 */
export interface Diet {
  id: string;
  nameKey: string;
  descriptionKey: string;
  region: string;
  type: 'vegetarian' | 'non-vegetarian' | 'vegan';
  recommendedFoods: string[];
  foodsToAvoid: string[];
  sampleMeals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  };
  accommodatesAllergies: string[];
  suitableForConditions: string[];
  specialNotes?: string;
}

/**
 * Diet plans data
 */
export const diets: Diet[] = [
  {
    id: 'north-veg',
    nameKey: 'northIndianVegetarianDiet',
    descriptionKey: 'northIndianVegetarianDietDescription',
    region: 'north',
    type: 'vegetarian',
    recommendedFoods: [
      'wholeGrainsRoti',
      'dals',
      'paneer',
      'seasonalVegetables',
      'yogurt',
      'milk',
      'dryFruits'
    ],
    foodsToAvoid: [
      'refinedFlour',
      'excessSugar',
      'processedFoods',
      'deepFriedItems'
    ],
    sampleMeals: {
      breakfast: 'northIndianVegBreakfast',
      lunch: 'northIndianVegLunch',
      dinner: 'northIndianVegDinner',
      snacks: 'northIndianVegSnacks'
    },
    accommodatesAllergies: ['nuts', 'soy'],
    suitableForConditions: ['diabetes', 'hypertension', 'obesity', 'anemia']
  },
  {
    id: 'north-nonveg',
    nameKey: 'northIndianNonVegetarianDiet',
    descriptionKey: 'northIndianNonVegetarianDietDescription',
    region: 'north',
    type: 'non-vegetarian',
    recommendedFoods: [
      'wholeGrainsRoti',
      'dals',
      'leanChicken',
      'fish',
      'eggs',
      'seasonalVegetables',
      'yogurt'
    ],
    foodsToAvoid: [
      'redMeat',
      'refinedFlour',
      'excessSugar',
      'processedFoods',
      'deepFriedItems'
    ],
    sampleMeals: {
      breakfast: 'northIndianNonVegBreakfast',
      lunch: 'northIndianNonVegLunch',
      dinner: 'northIndianNonVegDinner',
      snacks: 'northIndianNonVegSnacks'
    },
    accommodatesAllergies: ['nuts', 'soy', 'gluten'],
    suitableForConditions: ['anemia', 'pregnancy']
  },
  {
    id: 'south-veg',
    nameKey: 'southIndianVegetarianDiet',
    descriptionKey: 'southIndianVegetarianDietDescription',
    region: 'south',
    type: 'vegetarian',
    recommendedFoods: [
      'rice',
      'millets',
      'idli',
      'dosa',
      'sambar',
      'rasam',
      'coconut',
      'curryLeaves',
      'tamarind'
    ],
    foodsToAvoid: [
      'excessSugar',
      'processedFoods',
      'refinedFlour',
      'deepFriedItems'
    ],
    sampleMeals: {
      breakfast: 'southIndianVegBreakfast',
      lunch: 'southIndianVegLunch',
      dinner: 'southIndianVegDinner',
      snacks: 'southIndianVegSnacks'
    },
    accommodatesAllergies: ['dairy', 'nuts'],
    suitableForConditions: ['diabetes', 'hypertension', 'heart-disease']
  },
  {
    id: 'south-nonveg',
    nameKey: 'southIndianNonVegetarianDiet',
    descriptionKey: 'southIndianNonVegetarianDietDescription',
    region: 'south',
    type: 'non-vegetarian',
    recommendedFoods: [
      'rice',
      'millets',
      'fish',
      'seafood',
      'chicken',
      'eggs',
      'sambar',
      'rasam',
      'coconut'
    ],
    foodsToAvoid: [
      'redMeat',
      'excessSugar',
      'processedFoods',
      'deepFriedItems'
    ],
    sampleMeals: {
      breakfast: 'southIndianNonVegBreakfast',
      lunch: 'southIndianNonVegLunch',
      dinner: 'southIndianNonVegDinner',
      snacks: 'southIndianNonVegSnacks'
    },
    accommodatesAllergies: ['dairy', 'gluten'],
    suitableForConditions: ['anemia', 'pregnancy', 'obesity']
  },
  {
    id: 'east-veg',
    nameKey: 'eastIndianVegetarianDiet',
    descriptionKey: 'eastIndianVegetarianDietDescription',
    region: 'east',
    type: 'vegetarian',
    recommendedFoods: [
      'rice',
      'dal',
      'mustardOil',
      'panchPhoran',
      'greens',
      'pumpkin',
      'bananaFlower',
      'milk'
    ],
    foodsToAvoid: [
      'refinedFlour',
      'excessSugar',
      'processedFoods',
      'deepFriedItems'
    ],
    sampleMeals: {
      breakfast: 'eastIndianVegBreakfast',
      lunch: 'eastIndianVegLunch',
      dinner: 'eastIndianVegDinner',
      snacks: 'eastIndianVegSnacks'
    },
    accommodatesAllergies: ['nuts', 'soy'],
    suitableForConditions: ['diabetes', 'anemia', 'obesity']
  },
  {
    id: 'east-nonveg',
    nameKey: 'eastIndianNonVegetarianDiet',
    descriptionKey: 'eastIndianNonVegetarianDietDescription',
    region: 'east',
    type: 'non-vegetarian',
    recommendedFoods: [
      'rice',
      'fish',
      'prawns',
      'eggs',
      'mustardOil',
      'greens',
      'pumpkin',
      'bananaFlower'
    ],
    foodsToAvoid: [
      'redMeat',
      'excessSugar',
      'processedFoods',
      'deepFriedItems'
    ],
    sampleMeals: {
      breakfast: 'eastIndianNonVegBreakfast',
      lunch: 'eastIndianNonVegLunch',
      dinner: 'eastIndianNonVegDinner',
      snacks: 'eastIndianNonVegSnacks'
    },
    accommodatesAllergies: ['dairy', 'gluten'],
    suitableForConditions: ['anemia', 'pregnancy']
  },
  {
    id: 'west-veg',
    nameKey: 'westIndianVegetarianDiet',
    descriptionKey: 'westIndianVegetarianDietDescription',
    region: 'west',
    type: 'vegetarian',
    recommendedFoods: [
      'bajra',
      'jowar',
      'wheat',
      'dals',
      'buttermilk',
      'groundnuts',
      'sesameSeeds',
      'jaggery'
    ],
    foodsToAvoid: [
      'refinedFlour',
      'excessSugar',
      'processedFoods',
      'deepFriedItems'
    ],
    sampleMeals: {
      breakfast: 'westIndianVegBreakfast',
      lunch: 'westIndianVegLunch',
      dinner: 'westIndianVegDinner',
      snacks: 'westIndianVegSnacks'
    },
    accommodatesAllergies: ['soy', 'seafood'],
    suitableForConditions: ['diabetes', 'hypertension', 'heart-disease']
  },
  {
    id: 'west-nonveg',
    nameKey: 'westIndianNonVegetarianDiet',
    descriptionKey: 'westIndianNonVegetarianDietDescription',
    region: 'west',
    type: 'non-vegetarian',
    recommendedFoods: [
      'bajra',
      'jowar',
      'wheat',
      'fish',
      'chicken',
      'eggs',
      'buttermilk',
      'groundnuts'
    ],
    foodsToAvoid: [
      'redMeat',
      'excessSugar',
      'processedFoods',
      'deepFriedItems'
    ],
    sampleMeals: {
      breakfast: 'westIndianNonVegBreakfast',
      lunch: 'westIndianNonVegLunch',
      dinner: 'westIndianNonVegDinner',
      snacks: 'westIndianNonVegSnacks'
    },
    accommodatesAllergies: ['dairy', 'gluten'],
    suitableForConditions: ['anemia', 'pregnancy']
  },
  {
    id: 'northeast-veg',
    nameKey: 'northeastIndianVegetarianDiet',
    descriptionKey: 'northeastIndianVegetarianDietDescription',
    region: 'northeast',
    type: 'vegetarian',
    recommendedFoods: [
      'rice',
      'bambooshoot',
      'fermentedFoods',
      'leafyGreens',
      'localFruits',
      'wildHerbs',
      'blackSesame'
    ],
    foodsToAvoid: [
      'refinedFlour',
      'excessSugar',
      'processedFoods',
      'deepFriedItems'
    ],
    sampleMeals: {
      breakfast: 'northeastIndianVegBreakfast',
      lunch: 'northeastIndianVegLunch',
      dinner: 'northeastIndianVegDinner',
      snacks: 'northeastIndianVegSnacks'
    },
    accommodatesAllergies: ['dairy', 'nuts', 'gluten'],
    suitableForConditions: ['diabetes', 'obesity']
  },
  {
    id: 'central-veg',
    nameKey: 'centralIndianVegetarianDiet',
    descriptionKey: 'centralIndianVegetarianDietDescription',
    region: 'central',
    type: 'vegetarian',
    recommendedFoods: [
      'wheat',
      'jowar',
      'besan',
      'dals',
      'localVegetables',
      'milk',
      'ghee'
    ],
    foodsToAvoid: [
      'refinedFlour',
      'excessSugar',
      'processedFoods',
      'deepFriedItems'
    ],
    sampleMeals: {
      breakfast: 'centralIndianVegBreakfast',
      lunch: 'centralIndianVegLunch',
      dinner: 'centralIndianVegDinner',
      snacks: 'centralIndianVegSnacks'
    },
    accommodatesAllergies: ['soy', 'seafood'],
    suitableForConditions: ['diabetes', 'hypertension'],
    specialNotes: 'centralIndianDietSpecialNotes'
  }
];
