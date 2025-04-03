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
  type InsertMedication,
  users,
  articles,
  schemes,
  hospitals,
  symptoms,
  dietPlans,
  medications
} from "@shared/schema";
import { db } from "./db";
import { and, eq, ilike, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

// Define the interface for our storage
export interface IStorage {
  // Session store for authentication
  sessionStore: session.Store;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
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

export class DatabaseStorage implements IStorage {
  // Session store for authentication
  sessionStore: session.Store;

  constructor() {
    // Initialize PostgreSQL session store
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Article operations
  async getArticles(): Promise<Article[]> {
    return await db.select().from(articles);
  }

  async getArticle(id: number): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article;
  }
  
  async getOfflineArticles(): Promise<Article[]> {
    return await db.select().from(articles).where(eq(articles.isOfflineAvailable, true));
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db.insert(articles).values(insertArticle).returning();
    return article;
  }

  // Government scheme operations
  async getSchemes(): Promise<Scheme[]> {
    return await db.select().from(schemes);
  }

  async getScheme(id: number): Promise<Scheme | undefined> {
    const [scheme] = await db.select().from(schemes).where(eq(schemes.id, id));
    return scheme;
  }
  
  async getOfflineSchemes(): Promise<Scheme[]> {
    return await db.select().from(schemes).where(eq(schemes.isOfflineAvailable, true));
  }

  async createScheme(insertScheme: InsertScheme): Promise<Scheme> {
    const [scheme] = await db.insert(schemes).values(insertScheme).returning();
    return scheme;
  }

  // Hospital operations
  async getHospitals(): Promise<Hospital[]> {
    return await db.select().from(hospitals);
  }

  async getHospital(id: number): Promise<Hospital | undefined> {
    const [hospital] = await db.select().from(hospitals).where(eq(hospitals.id, id));
    return hospital;
  }

  async getHospitalsByLocation(lat: number, lng: number, radius: number): Promise<Hospital[]> {
    // Using PostgreSQL's built-in earth distance functions
    // Convert lat/long to radians and calculate distance
    const result = await db.execute<Hospital>(sql`
      SELECT *,
      6371 * 2 * ASIN(SQRT(
        POWER(SIN((CAST(${lat} AS float) - CAST(latitude AS float)) * PI() / 180 / 2), 2) +
        COS(CAST(${lat} AS float) * PI() / 180) *
        COS(CAST(latitude AS float) * PI() / 180) *
        POWER(SIN((CAST(${lng} AS float) - CAST(longitude AS float)) * PI() / 180 / 2), 2)
      )) AS distance
      FROM hospitals
      WHERE 6371 * 2 * ASIN(SQRT(
        POWER(SIN((CAST(${lat} AS float) - CAST(latitude AS float)) * PI() / 180 / 2), 2) +
        COS(CAST(${lat} AS float) * PI() / 180) *
        COS(CAST(latitude AS float) * PI() / 180) *
        POWER(SIN((CAST(${lng} AS float) - CAST(longitude AS float)) * PI() / 180 / 2), 2)
      )) <= ${radius}
      ORDER BY distance
    `);
    return result.rows;
  }

  async createHospital(insertHospital: InsertHospital): Promise<Hospital> {
    const [hospital] = await db.insert(hospitals).values(insertHospital).returning();
    return hospital;
  }

  // Symptom operations
  async getSymptoms(): Promise<Symptom[]> {
    return await db.select().from(symptoms);
  }

  async getSymptom(id: number): Promise<Symptom | undefined> {
    const [symptom] = await db.select().from(symptoms).where(eq(symptoms.id, id));
    return symptom;
  }

  async getSymptomByName(name: string): Promise<Symptom | undefined> {
    const [symptom] = await db.select().from(symptoms).where(ilike(symptoms.name, name));
    return symptom;
  }

  async createSymptom(insertSymptom: InsertSymptom): Promise<Symptom> {
    const [symptom] = await db.insert(symptoms).values(insertSymptom).returning();
    return symptom;
  }

  // Diet plan operations
  async getDietPlans(): Promise<DietPlan[]> {
    return await db.select().from(dietPlans);
  }

  async getDietPlan(id: number): Promise<DietPlan | undefined> {
    const [dietPlan] = await db.select().from(dietPlans).where(eq(dietPlans.id, id));
    return dietPlan;
  }

  async getDietPlansByCondition(condition: string): Promise<DietPlan[]> {
    // Using PostgreSQL's JSON contains operator
    return await db.select().from(dietPlans).where(
      sql`${dietPlans.forCondition} ? ${condition}`
    );
  }

  async getDietPlansByRegion(region: string): Promise<DietPlan[]> {
    return await db.select().from(dietPlans).where(
      ilike(dietPlans.region, `%${region}%`)
    );
  }

  async createDietPlan(insertDietPlan: InsertDietPlan): Promise<DietPlan> {
    const [dietPlan] = await db.insert(dietPlans).values(insertDietPlan).returning();
    return dietPlan;
  }

  // Medication reminder operations
  async getMedicationsByUser(userId: number): Promise<Medication[]> {
    return await db.select().from(medications).where(eq(medications.userId, userId));
  }

  async getMedication(id: number): Promise<Medication | undefined> {
    const [medication] = await db.select().from(medications).where(eq(medications.id, id));
    return medication;
  }

  async createMedication(insertMedication: InsertMedication): Promise<Medication> {
    const [medication] = await db.insert(medications).values(insertMedication).returning();
    return medication;
  }

  async updateMedication(id: number, medicationData: Partial<Medication>): Promise<Medication | undefined> {
    const [updatedMedication] = await db
      .update(medications)
      .set(medicationData)
      .where(eq(medications.id, id))
      .returning();
    return updatedMedication;
  }

  async deleteMedication(id: number): Promise<boolean> {
    const result = await db
      .delete(medications)
      .where(eq(medications.id, id))
      .returning({ id: medications.id });
    return result.length > 0;
  }
  
  // Method to seed initial data into the database
  async seedInitialData() {
    // Check if data already exists before seeding
    const articleCount = await db.select({ count: sql<number>`count(*)` }).from(articles);
    if (articleCount[0].count > 0) {
      console.log("Database already has data, skipping seed");
      return;
    }
    
    console.log("Seeding initial data...");
    
    // Seed articles
    await db.insert(articles).values([
      {
        title: "Importance of Clean Water in Rural Areas",
        content: "Clean water is essential for human health. Many waterborne diseases such as cholera, diarrhea, dysentery, hepatitis A, typhoid, and polio can be prevented through access to clean water...",
        summary: "Learn about the critical impact of clean water on public health in rural communities and ways to ensure water safety.",
        source: "WHO",
        imageUrl: "https://images.unsplash.com/photo-1559941727-6fb446e7e8ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        category: "Water Safety",
        publishedAt: new Date("2023-05-10"),
        isOfflineAvailable: true
      },
      {
        title: "Preventing Seasonal Diseases During Monsoon",
        content: "The monsoon season brings relief from the summer heat but also creates favorable conditions for disease-causing pathogens. Vector-borne diseases like malaria and dengue spike during this season...",
        summary: "Practical tips to safeguard yourself and your family from common monsoon-related illnesses like dengue and malaria.",
        source: "Health Tips",
        imageUrl: "https://images.unsplash.com/photo-1580281657702-257584239a42?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        category: "Seasonal Health",
        publishedAt: new Date("2023-06-05"),
        isOfflineAvailable: true
      },
      {
        title: "Affordable Nutritious Foods for Rural Families",
        content: "Nutrition plays a vital role in maintaining good health. In rural areas, focusing on locally available, seasonal foods can provide essential nutrients without straining the household budget...",
        summary: "Discover budget-friendly nutritious foods that are locally available and can improve family health outcomes.",
        source: "Nutrition",
        imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        category: "Nutrition",
        publishedAt: new Date("2023-06-18"),
        isOfflineAvailable: true
      }
    ]);

    // Seed government schemes
    await db.insert(schemes).values([
      {
        name: "Ayushman Bharat",
        description: "Health insurance scheme providing coverage up to ₹5 lakhs per family per year for secondary and tertiary care hospitalization.",
        category: "Health Insurance",
        eligibilityCriteria: "Families identified based on deprivation categories in rural and occupational criteria in urban areas.",
        benefits: "Cashless and paperless access to healthcare services at public and private empaneled hospitals.",
        applicationProcess: "Eligible citizens can check their enrollment status online or through Common Service Centers.",
        documentationRequired: ["Aadhaar Card", "Ration Card", "Income Certificate"],
        isOfflineAvailable: true
      },
      {
        name: "Janani Suraksha Yojana",
        description: "Cash assistance scheme for pregnant women to encourage institutional delivery and reduce maternal and infant mortality.",
        category: "Maternal Health",
        eligibilityCriteria: "Below poverty line pregnant women who opt for delivery in government or accredited private health facilities.",
        benefits: "Cash incentive which varies by rural or urban areas, ranging from ₹600 to ₹1400.",
        applicationProcess: "Registration at local health center or through ASHA worker.",
        documentationRequired: ["BPL Card", "Aadhaar Card", "Bank Account Details"],
        isOfflineAvailable: true
      },
      {
        name: "Jan Aushadhi Scheme",
        description: "Provides quality generic medicines at affordable prices through dedicated outlets known as Jan Aushadhi Kendras.",
        category: "Affordable Medicines",
        eligibilityCriteria: "Available to all citizens.",
        benefits: "Access to quality medicines at prices lower than the market prices.",
        applicationProcess: "No application needed. Visit the nearest Jan Aushadhi Kendra.",
        documentationRequired: [],
        isOfflineAvailable: true
      },
      {
        name: "National Programme for Control of Blindness",
        description: "Aims to reduce the prevalence of blindness through early identification and treatment of eye diseases.",
        category: "Eye Care",
        eligibilityCriteria: "Available to all citizens, especially those with vision impairments.",
        benefits: "Free eye check-ups, cataract surgery, and provision of spectacles for school children.",
        applicationProcess: "Register at eye camps or government hospitals.",
        documentationRequired: ["Identification proof"],
        isOfflineAvailable: true
      }
    ]);

    // Seed hospitals
    await db.insert(hospitals).values([
      {
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
      },
      {
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
      },
      {
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
      }
    ]);

    // Seed symptoms
    await db.insert(symptoms).values([
      {
        name: "Fever",
        description: "Elevated body temperature above the normal range of 36-37°C (98-100°F)",
        possibleConditions: ["Common Cold", "Flu", "Malaria", "Typhoid", "COVID-19"],
        severity: "moderate",
        recommendedActions: [
          "Rest and stay hydrated",
          "Take over-the-counter fever reducers like paracetamol",
          "Seek medical attention if fever persists for more than 3 days"
        ]
      },
      {
        name: "Cough",
        description: "Sudden expulsion of air from the lungs to clear the air passages",
        possibleConditions: ["Common Cold", "Bronchitis", "Asthma", "Pneumonia", "COVID-19"],
        severity: "mild",
        recommendedActions: [
          "Stay hydrated",
          "Use honey for soothing (except for children under 1 year)",
          "Use over-the-counter cough suppressants if needed",
          "Seek medical help if cough persists for more than 2 weeks"
        ]
      },
      {
        name: "Headache",
        description: "Pain in any region of the head",
        possibleConditions: ["Tension Headache", "Migraine", "Sinus Infection", "Dehydration"],
        severity: "mild",
        recommendedActions: [
          "Rest in a quiet, dark room",
          "Apply cold or warm compress",
          "Take over-the-counter pain relievers",
          "Stay hydrated",
          "Seek medical attention for severe or recurring headaches"
        ]
      }
    ]);

    // Seed diet plans
    await db.insert(dietPlans).values([
      {
        name: "Diabetic Diet Plan",
        description: "A balanced diet plan suitable for people with diabetes to help maintain blood sugar levels",
        forCondition: ["Diabetes", "Metabolic Syndrome"],
        region: "North India",
        items: [
          "Breakfast: Whole grain roti with vegetable sabzi",
          "Mid-morning: Apple or guava with a handful of nuts",
          "Lunch: Brown rice, dal, vegetable curry, and a small bowl of yogurt",
          "Evening snack: Roasted chana with spices",
          "Dinner: Multigrain roti with vegetable curry and a small bowl of buttermilk"
        ],
        nutrients: {
          calories: "1800-2000 per day",
          carbohydrates: "50-55%",
          proteins: "20-25%",
          fats: "20-30%"
        },
        restrictions: ["Added sugar", "White rice", "Processed snacks", "Sweetened beverages"]
      },
      {
        name: "Heart-Healthy Diet",
        description: "Diet plan focused on cardiovascular health, suitable for hypertension and heart disease prevention",
        forCondition: ["Hypertension", "Heart Disease"],
        region: "East India",
        items: [
          "Breakfast: Whole grain poha with vegetables",
          "Mid-morning: Orange or papaya",
          "Lunch: Mixed rice with fish curry (low oil), leafy vegetable sabzi",
          "Evening snack: Roasted makhana (fox nuts)",
          "Dinner: Multigrain roti with dal and vegetable curry"
        ],
        nutrients: {
          calories: "1600-1800 per day",
          carbohydrates: "45-50%",
          proteins: "25-30%",
          fats: "20-25% (emphasizing omega-3 fatty acids)"
        },
        restrictions: ["Excess salt", "Red meat", "Full-fat dairy", "Fried foods", "Packaged snacks"]
      }
    ]);
    
    console.log("Initial data seeding complete");
  }
}

// Export a singleton instance of the storage
export const storage = new DatabaseStorage();