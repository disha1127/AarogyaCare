import {
  type User,
  type InsertUser,
  type Article,
  type InsertArticle,
  type Scheme,
  type InsertScheme,
  type Hospital,
  type InsertHospital,
  type Symptom,
  type InsertSymptom,
  type DietPlan,
  type InsertDietPlan,
  type Medication,
  type InsertMedication
} from "@shared/schema";

// Define the interface for our storage
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;

  // Article operations
  getArticles(): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  getOfflineArticles(): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;

  // Government scheme operations
  getSchemes(): Promise<Scheme[]>;
  getScheme(id: number): Promise<Scheme | undefined>;
  getOfflineSchemes(): Promise<Scheme[]>;
  createScheme(scheme: InsertScheme): Promise<Scheme>;

  // Hospital operations
  getHospitals(): Promise<Hospital[]>;
  getHospital(id: number): Promise<Hospital | undefined>;
  getHospitalsByLocation(lat: number, lng: number, radius: number): Promise<Hospital[]>;
  createHospital(hospital: InsertHospital): Promise<Hospital>;

  // Symptom operations
  getSymptoms(): Promise<Symptom[]>;
  getSymptom(id: number): Promise<Symptom | undefined>;
  getSymptomByName(name: string): Promise<Symptom | undefined>;
  createSymptom(symptom: InsertSymptom): Promise<Symptom>;

  // Diet plan operations
  getDietPlans(): Promise<DietPlan[]>;
  getDietPlan(id: number): Promise<DietPlan | undefined>;
  getDietPlansByCondition(condition: string): Promise<DietPlan[]>;
  getDietPlansByRegion(region: string): Promise<DietPlan[]>;
  createDietPlan(dietPlan: InsertDietPlan): Promise<DietPlan>;

  // Medication reminder operations
  getMedicationsByUser(userId: number): Promise<Medication[]>;
  getMedication(id: number): Promise<Medication | undefined>;
  createMedication(medication: InsertMedication): Promise<Medication>;
  updateMedication(id: number, medication: Partial<Medication>): Promise<Medication | undefined>;
  deleteMedication(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private articles: Map<number, Article>;
  private schemes: Map<number, Scheme>;
  private hospitals: Map<number, Hospital>;
  private symptoms: Map<number, Symptom>;
  private dietPlans: Map<number, DietPlan>;
  private medications: Map<number, Medication>;
  
  private userIdCounter: number;
  private articleIdCounter: number;
  private schemeIdCounter: number;
  private hospitalIdCounter: number;
  private symptomIdCounter: number;
  private dietPlanIdCounter: number;
  private medicationIdCounter: number;

  constructor() {
    this.users = new Map();
    this.articles = new Map();
    this.schemes = new Map();
    this.hospitals = new Map();
    this.symptoms = new Map();
    this.dietPlans = new Map();
    this.medications = new Map();
    
    this.userIdCounter = 1;
    this.articleIdCounter = 1;
    this.schemeIdCounter = 1;
    this.hospitalIdCounter = 1;
    this.symptomIdCounter = 1;
    this.dietPlanIdCounter = 1;
    this.medicationIdCounter = 1;
    
    // Initialize with some data
    this.seedData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Article operations
  async getArticles(): Promise<Article[]> {
    return Array.from(this.articles.values());
  }

  async getArticle(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }
  
  async getOfflineArticles(): Promise<Article[]> {
    return Array.from(this.articles.values()).filter(
      (article) => article.isOfflineAvailable
    );
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.articleIdCounter++;
    const article: Article = { ...insertArticle, id };
    this.articles.set(id, article);
    return article;
  }

  // Government scheme operations
  async getSchemes(): Promise<Scheme[]> {
    return Array.from(this.schemes.values());
  }

  async getScheme(id: number): Promise<Scheme | undefined> {
    return this.schemes.get(id);
  }
  
  async getOfflineSchemes(): Promise<Scheme[]> {
    return Array.from(this.schemes.values()).filter(
      (scheme) => scheme.isOfflineAvailable
    );
  }

  async createScheme(insertScheme: InsertScheme): Promise<Scheme> {
    const id = this.schemeIdCounter++;
    const scheme: Scheme = { ...insertScheme, id };
    this.schemes.set(id, scheme);
    return scheme;
  }

  // Hospital operations
  async getHospitals(): Promise<Hospital[]> {
    return Array.from(this.hospitals.values());
  }

  async getHospital(id: number): Promise<Hospital | undefined> {
    return this.hospitals.get(id);
  }

  async getHospitalsByLocation(lat: number, lng: number, radius: number): Promise<Hospital[]> {
    // Simple proximity calculation using Euclidean distance
    return Array.from(this.hospitals.values()).filter(hospital => {
      const hospitalLat = parseFloat(hospital.latitude);
      const hospitalLng = parseFloat(hospital.longitude);
      
      // Calculate distance using Euclidean distance (simplified for demo)
      const distance = Math.sqrt(
        Math.pow(hospitalLat - lat, 2) + Math.pow(hospitalLng - lng, 2)
      );
      
      // Convert to approximate kilometers (very rough approximation)
      const distanceKm = distance * 111;
      
      return distanceKm <= radius;
    });
  }

  async createHospital(insertHospital: InsertHospital): Promise<Hospital> {
    const id = this.hospitalIdCounter++;
    const hospital: Hospital = { ...insertHospital, id };
    this.hospitals.set(id, hospital);
    return hospital;
  }

  // Symptom operations
  async getSymptoms(): Promise<Symptom[]> {
    return Array.from(this.symptoms.values());
  }

  async getSymptom(id: number): Promise<Symptom | undefined> {
    return this.symptoms.get(id);
  }

  async getSymptomByName(name: string): Promise<Symptom | undefined> {
    return Array.from(this.symptoms.values()).find(
      (symptom) => symptom.name.toLowerCase() === name.toLowerCase()
    );
  }

  async createSymptom(insertSymptom: InsertSymptom): Promise<Symptom> {
    const id = this.symptomIdCounter++;
    const symptom: Symptom = { ...insertSymptom, id };
    this.symptoms.set(id, symptom);
    return symptom;
  }

  // Diet plan operations
  async getDietPlans(): Promise<DietPlan[]> {
    return Array.from(this.dietPlans.values());
  }

  async getDietPlan(id: number): Promise<DietPlan | undefined> {
    return this.dietPlans.get(id);
  }

  async getDietPlansByCondition(condition: string): Promise<DietPlan[]> {
    return Array.from(this.dietPlans.values()).filter(plan => 
      (plan.forCondition as string[]).includes(condition)
    );
  }

  async getDietPlansByRegion(region: string): Promise<DietPlan[]> {
    return Array.from(this.dietPlans.values()).filter(plan => 
      plan.region.toLowerCase() === region.toLowerCase()
    );
  }

  async createDietPlan(insertDietPlan: InsertDietPlan): Promise<DietPlan> {
    const id = this.dietPlanIdCounter++;
    const dietPlan: DietPlan = { ...insertDietPlan, id };
    this.dietPlans.set(id, dietPlan);
    return dietPlan;
  }

  // Medication reminder operations
  async getMedicationsByUser(userId: number): Promise<Medication[]> {
    return Array.from(this.medications.values()).filter(
      medication => medication.userId === userId
    );
  }

  async getMedication(id: number): Promise<Medication | undefined> {
    return this.medications.get(id);
  }

  async createMedication(insertMedication: InsertMedication): Promise<Medication> {
    const id = this.medicationIdCounter++;
    const medication: Medication = { ...insertMedication, id };
    this.medications.set(id, medication);
    return medication;
  }

  async updateMedication(id: number, medicationData: Partial<Medication>): Promise<Medication | undefined> {
    const medication = await this.getMedication(id);
    if (!medication) return undefined;
    
    const updatedMedication = { ...medication, ...medicationData };
    this.medications.set(id, updatedMedication);
    return updatedMedication;
  }

  async deleteMedication(id: number): Promise<boolean> {
    return this.medications.delete(id);
  }

  // Seed initial data
  private seedData() {
    // Seed initial data for demo purposes
    // This would normally be done via API endpoints

    // Seed some articles
    this.createArticle({
      title: "Importance of Clean Water in Rural Areas",
      content: "Clean water is essential for human health. Many waterborne diseases such as cholera, diarrhea, dysentery, hepatitis A, typhoid, and polio can be prevented through access to clean water...",
      summary: "Learn about the critical impact of clean water on public health in rural communities and ways to ensure water safety.",
      source: "WHO",
      imageUrl: "https://images.unsplash.com/photo-1559941727-6fb446e7e8ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Water Safety",
      publishedAt: new Date("2023-05-10"),
      isOfflineAvailable: true
    });

    this.createArticle({
      title: "Preventing Seasonal Diseases During Monsoon",
      content: "The monsoon season brings relief from the summer heat but also creates favorable conditions for disease-causing pathogens. Vector-borne diseases like malaria and dengue spike during this season...",
      summary: "Practical tips to safeguard yourself and your family from common monsoon-related illnesses like dengue and malaria.",
      source: "Health Tips",
      imageUrl: "https://images.unsplash.com/photo-1580281657702-257584239a42?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Seasonal Health",
      publishedAt: new Date("2023-06-05"),
      isOfflineAvailable: true
    });

    this.createArticle({
      title: "Affordable Nutritious Foods for Rural Families",
      content: "Nutrition plays a vital role in maintaining good health. In rural areas, focusing on locally available, seasonal foods can provide essential nutrients without straining the household budget...",
      summary: "Discover budget-friendly nutritious foods that are locally available and can improve family health outcomes.",
      source: "Nutrition",
      imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Nutrition",
      publishedAt: new Date("2023-06-18"),
      isOfflineAvailable: true
    });

    // Seed government schemes
    this.createScheme({
      name: "Ayushman Bharat",
      description: "Health insurance scheme providing coverage up to ₹5 lakhs per family per year for secondary and tertiary care hospitalization.",
      category: "Health Insurance",
      eligibilityCriteria: "Families identified based on deprivation categories in rural and occupational criteria in urban areas.",
      benefits: "Cashless and paperless access to healthcare services at public and private empaneled hospitals.",
      applicationProcess: "Eligible citizens can check their enrollment status online or through Common Service Centers.",
      documentationRequired: ["Aadhaar Card", "Ration Card", "Income Certificate"],
      isOfflineAvailable: true
    });

    this.createScheme({
      name: "Janani Suraksha Yojana",
      description: "Cash assistance scheme for pregnant women to encourage institutional delivery and reduce maternal and infant mortality.",
      category: "Maternal Health",
      eligibilityCriteria: "Below poverty line pregnant women who opt for delivery in government or accredited private health facilities.",
      benefits: "Cash incentive which varies by rural or urban areas, ranging from ₹600 to ₹1400.",
      applicationProcess: "Registration at local health center or through ASHA worker.",
      documentationRequired: ["BPL Card", "Aadhaar Card", "Bank Account Details"],
      isOfflineAvailable: true
    });

    this.createScheme({
      name: "Jan Aushadhi Scheme",
      description: "Provides quality generic medicines at affordable prices through dedicated outlets known as Jan Aushadhi Kendras.",
      category: "Affordable Medicines",
      eligibilityCriteria: "Available to all citizens.",
      benefits: "Access to quality medicines at prices lower than the market prices.",
      applicationProcess: "No application needed. Visit the nearest Jan Aushadhi Kendra.",
      documentationRequired: [],
      isOfflineAvailable: true
    });

    this.createScheme({
      name: "National Programme for Control of Blindness",
      description: "Aims to reduce the prevalence of blindness through early identification and treatment of eye diseases.",
      category: "Eye Care",
      eligibilityCriteria: "Available to all citizens, especially those with vision impairments.",
      benefits: "Free eye check-ups, cataract surgery, and provision of spectacles for school children.",
      applicationProcess: "Register at eye camps or government hospitals.",
      documentationRequired: ["Identification proof"],
      isOfflineAvailable: true
    });

    // Seed hospitals
    this.createHospital({
      name: "District Hospital",
      address: "Main Road, Sambalpur",
      city: "Sambalpur",
      state: "Odisha",
      zipCode: "768001",
      phone: "0663-2520100",
      email: "dh.sambalpur@gov.in",
      latitude: "21.466",
      longitude: "83.975",
      type: "Government",
      services: ["Emergency", "General Medicine", "Surgery", "Pediatrics", "Obstetrics"],
      emergencyServices: true,
      specialties: ["General Medicine", "Orthopedics"]
    });

    this.createHospital({
      name: "Community Health Center",
      address: "Near Bus Stand, Bargarh",
      city: "Bargarh",
      state: "Odisha",
      zipCode: "768028",
      phone: "0664-2345678",
      email: "chc.bargarh@gov.in",
      latitude: "21.346",
      longitude: "83.828",
      type: "Government",
      services: ["Primary Care", "Maternal Health", "Child Health", "Family Planning"],
      emergencyServices: false,
      specialties: ["Family Medicine"]
    });

    this.createHospital({
      name: "Primary Health Center",
      address: "Hirakud Dam Colony, Hirakud",
      city: "Hirakud",
      state: "Odisha",
      zipCode: "768016",
      phone: "0663-2456789",
      email: "phc.hirakud@gov.in",
      latitude: "21.511",
      longitude: "83.872",
      type: "Government",
      services: ["Primary Care", "Immunization", "Basic Medicine"],
      emergencyServices: false,
      specialties: ["General Practice"]
    });

    // Seed symptoms
    this.createSymptom({
      name: "Fever",
      description: "Elevated body temperature above the normal range of 36-37°C (98-100°F)",
      possibleConditions: ["Common Cold", "Flu", "Malaria", "Typhoid", "COVID-19"],
      severity: "moderate",
      recommendedActions: [
        "Rest and stay hydrated",
        "Take over-the-counter fever reducers like paracetamol",
        "Seek medical attention if fever persists for more than 3 days or is accompanied by severe symptoms"
      ]
    });

    this.createSymptom({
      name: "Cough",
      description: "A sudden, forceful expulsion of air from the lungs that helps clear the lung airways of irritants",
      possibleConditions: ["Common Cold", "Flu", "Bronchitis", "Asthma", "COVID-19"],
      severity: "mild",
      recommendedActions: [
        "Stay hydrated",
        "Use honey and warm liquids to soothe throat",
        "Seek medical attention if cough persists for more than 2 weeks or is accompanied by blood/thick mucus"
      ]
    });

    this.createSymptom({
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
    });

    // Seed diet plans
    this.createDietPlan({
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
    });

    this.createDietPlan({
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
    });

    this.createDietPlan({
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
    });
  }
}

export const storage = new MemStorage();
