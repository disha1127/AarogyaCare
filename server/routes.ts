import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertUserSchema,
  insertArticleSchema,
  insertSchemeSchema,
  insertHospitalSchema,
  insertSymptomSchema,
  insertDietPlanSchema,
  insertMedicationSchema
} from "@shared/schema";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  // Users API routes
  app.get("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't return the password
    const { password, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      const userData = req.body;
      const updatedUser = await storage.updateUser(id, userData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return the password
      const { password, ...userWithoutPassword } = updatedUser;
      return res.json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Articles API routes
  app.get("/api/articles", async (req, res) => {
    const articles = await storage.getArticles();
    return res.json(articles);
  });

  app.get("/api/articles/offline", async (req, res) => {
    const offlineArticles = await storage.getOfflineArticles();
    return res.json(offlineArticles);
  });

  app.get("/api/articles/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid article ID" });
    }
    
    const article = await storage.getArticle(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    
    return res.json(article);
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const articleData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(articleData);
      return res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid article data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create article" });
    }
  });

  // Government schemes API routes
  app.get("/api/schemes", async (req, res) => {
    const schemes = await storage.getSchemes();
    return res.json(schemes);
  });

  app.get("/api/schemes/offline", async (req, res) => {
    const offlineSchemes = await storage.getOfflineSchemes();
    return res.json(offlineSchemes);
  });

  app.get("/api/schemes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid scheme ID" });
    }
    
    const scheme = await storage.getScheme(id);
    if (!scheme) {
      return res.status(404).json({ message: "Scheme not found" });
    }
    
    return res.json(scheme);
  });

  app.post("/api/schemes", async (req, res) => {
    try {
      const schemeData = insertSchemeSchema.parse(req.body);
      const scheme = await storage.createScheme(schemeData);
      return res.status(201).json(scheme);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid scheme data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create scheme" });
    }
  });

  // Hospitals API routes
  app.get("/api/hospitals", async (req, res) => {
    const hospitals = await storage.getHospitals();
    return res.json(hospitals);
  });

  app.get("/api/hospitals/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid hospital ID" });
    }
    
    const hospital = await storage.getHospital(id);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    
    return res.json(hospital);
  });

  app.get("/api/hospitals/nearby", async (req, res) => {
    const latQuery = req.query.lat;
    const lngQuery = req.query.lng;
    const radiusQuery = req.query.radius || "10"; // Default radius of 10km
    
    if (!latQuery || !lngQuery) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }
    
    const lat = parseFloat(latQuery as string);
    const lng = parseFloat(lngQuery as string);
    const radius = parseFloat(radiusQuery as string);
    
    if (isNaN(lat) || isNaN(lng) || isNaN(radius)) {
      return res.status(400).json({ message: "Invalid location parameters" });
    }
    
    const nearbyHospitals = await storage.getHospitalsByLocation(lat, lng, radius);
    return res.json(nearbyHospitals);
  });

  app.post("/api/hospitals", async (req, res) => {
    try {
      const hospitalData = insertHospitalSchema.parse(req.body);
      const hospital = await storage.createHospital(hospitalData);
      return res.status(201).json(hospital);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid hospital data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create hospital" });
    }
  });

  // Symptoms API routes
  app.get("/api/symptoms", async (req, res) => {
    const symptoms = await storage.getSymptoms();
    return res.json(symptoms);
  });

  app.get("/api/symptoms/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid symptom ID" });
    }
    
    const symptom = await storage.getSymptom(id);
    if (!symptom) {
      return res.status(404).json({ message: "Symptom not found" });
    }
    
    return res.json(symptom);
  });

  app.get("/api/symptoms/name/:name", async (req, res) => {
    const name = req.params.name;
    
    const symptom = await storage.getSymptomByName(name);
    if (!symptom) {
      return res.status(404).json({ message: "Symptom not found" });
    }
    
    return res.json(symptom);
  });

  app.post("/api/symptoms", async (req, res) => {
    try {
      const symptomData = insertSymptomSchema.parse(req.body);
      const symptom = await storage.createSymptom(symptomData);
      return res.status(201).json(symptom);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid symptom data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create symptom" });
    }
  });

  // Diet plans API routes
  app.get("/api/diet-plans", async (req, res) => {
    const dietPlans = await storage.getDietPlans();
    return res.json(dietPlans);
  });

  app.get("/api/diet-plans/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid diet plan ID" });
    }
    
    const dietPlan = await storage.getDietPlan(id);
    if (!dietPlan) {
      return res.status(404).json({ message: "Diet plan not found" });
    }
    
    return res.json(dietPlan);
  });

  app.get("/api/diet-plans/condition/:condition", async (req, res) => {
    const condition = req.params.condition;
    
    const dietPlans = await storage.getDietPlansByCondition(condition);
    return res.json(dietPlans);
  });

  app.get("/api/diet-plans/region/:region", async (req, res) => {
    const region = req.params.region;
    
    const dietPlans = await storage.getDietPlansByRegion(region);
    return res.json(dietPlans);
  });

  app.post("/api/diet-plans", async (req, res) => {
    try {
      const dietPlanData = insertDietPlanSchema.parse(req.body);
      const dietPlan = await storage.createDietPlan(dietPlanData);
      return res.status(201).json(dietPlan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid diet plan data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create diet plan" });
    }
  });

  // Medication reminders API routes
  app.get("/api/medications/user/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const medications = await storage.getMedicationsByUser(userId);
    return res.json(medications);
  });

  app.get("/api/medications/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid medication ID" });
    }
    
    const medication = await storage.getMedication(id);
    if (!medication) {
      return res.status(404).json({ message: "Medication not found" });
    }
    
    return res.json(medication);
  });

  app.post("/api/medications", async (req, res) => {
    try {
      const medicationData = insertMedicationSchema.parse(req.body);
      const medication = await storage.createMedication(medicationData);
      return res.status(201).json(medication);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid medication data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create medication" });
    }
  });

  app.patch("/api/medications/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid medication ID" });
    }
    
    try {
      const medicationData = req.body;
      const updatedMedication = await storage.updateMedication(id, medicationData);
      
      if (!updatedMedication) {
        return res.status(404).json({ message: "Medication not found" });
      }
      
      return res.json(updatedMedication);
    } catch (error) {
      return res.status(500).json({ message: "Failed to update medication" });
    }
  });

  app.delete("/api/medications/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid medication ID" });
    }
    
    const success = await storage.deleteMedication(id);
    if (!success) {
      return res.status(404).json({ message: "Medication not found" });
    }
    
    return res.status(204).end();
  });

  const httpServer = createServer(app);

  return httpServer;
}
