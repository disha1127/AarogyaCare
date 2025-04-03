import { DietPlan } from "@shared/schema";

export const dietPlans: DietPlan[] = [
  {
    id: 1,
    name: "Diabetes Management Diet",
    description: "A balanced diet plan to help manage blood sugar levels for diabetic patients",
    forCondition: ["Diabetes"],
    region: "North India",
    items: [
      "Breakfast: Barley porridge with mixed nuts",
      "Mid-morning: Guava or apple",
      "Lunch: 2 rotis, mixed vegetable curry, dal, curd",
      "Evening: Roasted chana with lemon juice",
      "Dinner: 1 roti, bottle gourd curry, small bowl of dal"
    ],
    nutrients: {
      calories: 1800,
      carbohydrates: "50%",
      protein: "20%",
      fat: "30%"
    },
    restrictions: ["Avoid white rice", "Limit sweet fruits", "Avoid sugar and jaggery"]
  },
  {
    id: 2,
    name: "Heart Healthy Diet",
    description: "A diet plan focused on cardiovascular health",
    forCondition: ["Hypertension", "Heart Disease"],
    region: "South India",
    items: [
      "Breakfast: Idli with sambar (no coconut chutney)",
      "Mid-morning: Orange or apple",
      "Lunch: Brown rice, vegetable curry, rasam, small piece of fish",
      "Evening: Sprouts salad",
      "Dinner: 2 multigrain dosas with vegetable curry"
    ],
    nutrients: {
      calories: 1600,
      carbohydrates: "55%",
      protein: "20%",
      fat: "25%"
    },
    restrictions: ["Low salt", "Avoid fried foods", "Limit coconut use"]
  },
  {
    id: 3,
    name: "Anemia Recovery Diet",
    description: "Iron-rich diet for recovering from anemia",
    forCondition: ["Anemia"],
    region: "East India",
    items: [
      "Breakfast: Oats porridge with jaggery and seeds",
      "Mid-morning: Amla juice with honey",
      "Lunch: Rice, spinach dal, vegetable curry with drumsticks, curd",
      "Evening: Dates and nuts",
      "Dinner: 2 rotis, green leafy vegetable curry, small bowl of lentils"
    ],
    nutrients: {
      calories: 2000,
      carbohydrates: "60%",
      protein: "15%",
      fat: "25%"
    },
    restrictions: ["Avoid tea/coffee with meals as they inhibit iron absorption"]
  },
  {
    id: 4,
    name: "Digestive Health Diet",
    description: "Diet plan for better digestive health and gut wellness",
    forCondition: ["Irritable Bowel Syndrome", "Acidity", "Constipation"],
    region: "West India",
    items: [
      "Breakfast: Upma with vegetables or Poha",
      "Mid-morning: Papaya or banana",
      "Lunch: 2 jowar rotis, vegetable curry, buttermilk",
      "Evening: Steamed mung beans with coconut",
      "Dinner: Khichdi with ghee, light vegetable soup"
    ],
    nutrients: {
      calories: 1700,
      carbohydrates: "55%",
      protein: "18%",
      fat: "27%"
    },
    restrictions: ["Avoid spicy foods", "Limit caffeine", "Avoid processed foods"]
  },
  {
    id: 5,
    name: "Pregnancy Nutrition Plan",
    description: "Nutritious diet for pregnant women to support maternal and fetal health",
    forCondition: ["Pregnancy"],
    region: "North India",
    items: [
      "Breakfast: Paratha with curd and a small serving of fruit",
      "Mid-morning: Milk with dry fruits",
      "Lunch: Rice, dal, vegetable curry, raita, and a small piece of jaggery",
      "Evening: Fruit or vegetable chaat",
      "Dinner: 2 rotis, paneer curry, vegetable salad"
    ],
    nutrients: {
      calories: 2200,
      carbohydrates: "50%",
      protein: "25%",
      fat: "25%"
    },
    restrictions: ["Avoid unpasteurized dairy", "Limit caffeine", "No alcohol"]
  },
  {
    id: 6,
    name: "Weight Management Diet",
    description: "Balanced diet to help maintain healthy weight with regional foods",
    forCondition: ["Obesity", "Overweight"],
    region: "South India",
    items: [
      "Breakfast: Vegetable upma or ragi dosa",
      "Mid-morning: Buttermilk or coconut water",
      "Lunch: Small portion of rice, sambar, vegetable curry, kachumber salad",
      "Evening: Cucumber or carrot sticks with hummus",
      "Dinner: 1 millet roti, vegetable stew, small bowl of curd"
    ],
    nutrients: {
      calories: 1500,
      carbohydrates: "45%",
      protein: "25%",
      fat: "30%"
    },
    restrictions: ["Limit rice portions", "Avoid fried foods", "Reduce sugar intake"]
  },
  {
    id: 7,
    name: "Child Growth Diet (2-5 years)",
    description: "Nutrient-rich diet for growing children",
    forCondition: ["Child Growth", "Malnutrition"],
    region: "Central India",
    items: [
      "Breakfast: Ragi porridge with milk and banana",
      "Mid-morning: Boiled egg or fruit",
      "Lunch: Rice, dal with vegetables, curd",
      "Evening: Milkshake or vegetable paratha",
      "Dinner: Khichdi with vegetables, small cup of milk before bed"
    ],
    nutrients: {
      calories: 1400,
      carbohydrates: "50%",
      protein: "30%",
      fat: "20%"
    },
    restrictions: []
  },
  {
    id: 8,
    name: "Senior Citizen Nutrition Plan",
    description: "Easy-to-digest, nutrient-dense diet for elderly individuals",
    forCondition: ["Elderly Care"],
    region: "East India",
    items: [
      "Breakfast: Soft idli with sambar or vegetable stew",
      "Mid-morning: Fruit yogurt or soft fruit",
      "Lunch: Khichdi with vegetables, curd, and a small piece of fruit",
      "Evening: Vegetable soup with a few whole grain crackers",
      "Dinner: Soft rice, fish curry or dal, steamed vegetables"
    ],
    nutrients: {
      calories: 1600,
      carbohydrates: "55%",
      protein: "20%",
      fat: "25%"
    },
    restrictions: ["Easy to chew foods", "Low salt", "Small frequent meals"]
  },
  {
    id: 9,
    name: "Immunity Boosting Diet",
    description: "Diet rich in vitamins and minerals to enhance immune function",
    forCondition: ["Low Immunity", "Frequent Infections"],
    region: "West India",
    items: [
      "Breakfast: Vegetable poha with peanuts",
      "Mid-morning: Citrus fruit or amla juice",
      "Lunch: 2 rotis, turmeric vegetable curry, dal, curd with garlic",
      "Evening: Nuts and seeds mix",
      "Dinner: Vegetable khichdi with ghee, turmeric milk before bed"
    ],
    nutrients: {
      calories: 1800,
      carbohydrates: "52%",
      protein: "23%",
      fat: "25%"
    },
    restrictions: []
  },
  {
    id: 10,
    name: "Post-Surgery Recovery Diet",
    description: "Easily digestible, protein-rich diet to aid healing after surgery",
    forCondition: ["Post-Surgery", "Recovery"],
    region: "North India",
    items: [
      "Breakfast: Oatmeal with milk and honey",
      "Mid-morning: Protein smoothie with fruits",
      "Lunch: Soft khichdi with ghee, vegetable soup",
      "Evening: Custard or pudding",
      "Dinner: Soft rotis, dal, well-cooked vegetables"
    ],
    nutrients: {
      calories: 1900,
      carbohydrates: "45%",
      protein: "30%",
      fat: "25%"
    },
    restrictions: ["Avoid spicy foods", "Easy to digest meals", "Small frequent portions"]
  }
];
