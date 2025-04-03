import { Symptom } from "@shared/schema";

export const symptoms: Symptom[] = [
  {
    id: 1,
    name: "Fever",
    description: "Elevated body temperature above the normal range of 36-37°C (98-100°F)",
    possibleConditions: ["Common Cold", "Flu", "Malaria", "Typhoid", "COVID-19"],
    severity: "moderate",
    recommendedActions: [
      "Rest and stay hydrated",
      "Take over-the-counter fever reducers like paracetamol",
      "Seek medical attention if fever persists for more than 3 days or is accompanied by severe symptoms"
    ]
  },
  {
    id: 2,
    name: "Cough",
    description: "A sudden, forceful expulsion of air from the lungs that helps clear the lung airways of irritants",
    possibleConditions: ["Common Cold", "Flu", "Bronchitis", "Asthma", "COVID-19"],
    severity: "mild",
    recommendedActions: [
      "Stay hydrated",
      "Use honey and warm liquids to soothe throat",
      "Seek medical attention if cough persists for more than 2 weeks or is accompanied by blood/thick mucus"
    ]
  },
  {
    id: 3,
    name: "Headache",
    description: "Pain in any region of the head",
    possibleConditions: ["Tension Headache", "Migraine", "Sinus Infection", "Dehydration", "High Blood Pressure"],
    severity: "mild",
    recommendedActions: [
      "Rest in a quiet, dark room",
      "Apply a cold or warm compress to the head",
      "Drink water as dehydration can cause headaches",
      "Take over-the-counter pain relievers",
      "Seek medical attention if headache is severe or accompanied by confusion, stiff neck, or high fever"
    ]
  },
  {
    id: 4,
    name: "Nausea",
    description: "Discomfort in the stomach with an urge to vomit",
    possibleConditions: ["Food Poisoning", "Gastroenteritis", "Pregnancy", "Motion Sickness", "Migraine"],
    severity: "moderate",
    recommendedActions: [
      "Sip clear liquids or ginger tea",
      "Eat small, bland meals",
      "Avoid strong odors, greasy or spicy foods",
      "Rest in a cool, well-ventilated area",
      "Seek medical attention if nausea persists for more than 2 days or is accompanied by severe abdominal pain"
    ]
  },
  {
    id: 5,
    name: "Shortness of Breath",
    description: "Difficulty breathing or the feeling of not getting enough air",
    possibleConditions: ["Asthma", "Anxiety", "Pneumonia", "Heart Failure", "COVID-19"],
    severity: "severe",
    recommendedActions: [
      "Sit upright and try to stay calm",
      "Use prescribed inhalers if you have asthma",
      "Seek immediate medical attention if severe or accompanied by chest pain, blue lips, or confusion",
      "Call emergency services if the person is unable to speak in full sentences"
    ]
  },
  {
    id: 6,
    name: "Diarrhea",
    description: "Loose, watery stools occurring more than three times in a day",
    possibleConditions: ["Food Poisoning", "Gastroenteritis", "Irritable Bowel Syndrome", "Parasitic Infection", "Medication Side Effect"],
    severity: "moderate",
    recommendedActions: [
      "Stay hydrated with water, clear broths, and electrolyte solutions",
      "Avoid dairy, fatty, sugary, or spicy foods",
      "Eat small, bland meals",
      "Seek medical attention if diarrhea lasts more than 2 days, or is accompanied by severe pain, fever above 102°F (39°C), or bloody stools"
    ]
  },
  {
    id: 7,
    name: "Abdominal Pain",
    description: "Pain felt anywhere between the chest and groin",
    possibleConditions: ["Gastritis", "Appendicitis", "Kidney Stones", "Ulcers", "Food Poisoning"],
    severity: "moderate",
    recommendedActions: [
      "Rest and avoid solid foods if pain is severe",
      "Apply a warm compress to the abdomen for cramps",
      "Avoid NSAIDs if you suspect an ulcer",
      "Seek immediate medical attention if pain is severe, accompanied by fever, vomiting, or if the abdomen is tender to touch"
    ]
  },
  {
    id: 8,
    name: "Fatigue",
    description: "Extreme tiredness resulting from mental or physical exertion or illness",
    possibleConditions: ["Anemia", "Thyroid Disorders", "Depression", "Sleep Apnea", "Diabetes"],
    severity: "mild",
    recommendedActions: [
      "Ensure adequate sleep (7-9 hours for adults)",
      "Eat a balanced diet with adequate iron and vitamins",
      "Engage in regular moderate exercise",
      "Manage stress through relaxation techniques",
      "Seek medical attention if fatigue persists for more than two weeks despite adequate rest"
    ]
  },
  {
    id: 9,
    name: "Joint Pain",
    description: "Discomfort, aches, or soreness in any of the body's joints",
    possibleConditions: ["Arthritis", "Gout", "Rheumatoid Arthritis", "Lupus", "Injury"],
    severity: "moderate",
    recommendedActions: [
      "Rest the affected joint",
      "Apply ice for acute pain or heat for chronic pain",
      "Take over-the-counter pain relievers as directed",
      "Maintain a healthy weight to reduce stress on joints",
      "Seek medical attention if joint pain is accompanied by swelling, redness, or inability to move the joint"
    ]
  },
  {
    id: 10,
    name: "Rash",
    description: "A change in the color or texture of the skin",
    possibleConditions: ["Allergic Reaction", "Eczema", "Psoriasis", "Fungal Infection", "Chickenpox"],
    severity: "mild",
    recommendedActions: [
      "Avoid scratching the affected area",
      "Keep the area clean and dry",
      "Use mild, fragrance-free soaps",
      "Apply over-the-counter hydrocortisone cream for itching",
      "Seek medical attention if the rash spreads rapidly, is accompanied by fever, or causes blisters or open sores"
    ]
  },
  {
    id: 11,
    name: "Sore Throat",
    description: "Pain, scratchiness or irritation of the throat that often worsens when swallowing",
    possibleConditions: ["Common Cold", "Strep Throat", "Tonsillitis", "Laryngitis", "Allergies"],
    severity: "mild",
    recommendedActions: [
      "Gargle with warm salt water",
      "Drink warm liquids such as tea with honey",
      "Use throat lozenges or sprays",
      "Rest your voice",
      "Seek medical attention if sore throat lasts more than a week, or is accompanied by difficulty breathing or swallowing"
    ]
  },
  {
    id: 12,
    name: "Dizziness",
    description: "A sensation of spinning or lightheadedness",
    possibleConditions: ["Low Blood Pressure", "Ear Infection", "Anemia", "Dehydration", "Vertigo"],
    severity: "moderate",
    recommendedActions: [
      "Sit or lie down immediately when feeling dizzy",
      "Avoid sudden movements or position changes",
      "Stay hydrated",
      "Avoid caffeine, alcohol, and tobacco",
      "Seek medical attention if dizziness is severe, persistent, or accompanied by other symptoms like headache, hearing loss, or difficulty speaking"
    ]
  },
  {
    id: 13,
    name: "Chest Pain",
    description: "Discomfort or pain in the chest area",
    possibleConditions: ["Heart Attack", "Angina", "Pneumonia", "Acid Reflux", "Panic Attack"],
    severity: "severe",
    recommendedActions: [
      "Call emergency services immediately if you suspect a heart attack",
      "Rest and try to stay calm",
      "Take previously prescribed medications if applicable (like nitroglycerin for known angina)",
      "Do not ignore chest pain, especially if it spreads to the arm, jaw, or back, or is accompanied by shortness of breath, nausea, or sweating"
    ]
  },
  {
    id: 14,
    name: "Runny Nose",
    description: "Excess nasal drainage, which can be clear, white, yellow, or green",
    possibleConditions: ["Common Cold", "Allergies", "Sinusitis", "Flu", "Foreign Body in Nose"],
    severity: "mild",
    recommendedActions: [
      "Stay hydrated to thin mucus",
      "Use a humidifier to moisten the air",
      "Try saline nasal sprays or rinses",
      "Rest and avoid irritants like smoke or strong perfumes",
      "Seek medical attention if symptoms persist for more than 10 days or are accompanied by high fever or severe headache"
    ]
  },
  {
    id: 15,
    name: "Vomiting",
    description: "Forceful expulsion of stomach contents through the mouth",
    possibleConditions: ["Food Poisoning", "Gastroenteritis", "Migraine", "Pregnancy", "Appendicitis"],
    severity: "moderate",
    recommendedActions: [
      "Stay hydrated with small sips of clear fluids",
      "Avoid solid foods until vomiting stops",
      "Gradually introduce bland foods like rice, toast, or bananas",
      "Seek immediate medical attention if vomiting blood, experiencing severe abdominal pain, signs of dehydration, or if vomiting lasts more than 24 hours"
    ]
  }
];
