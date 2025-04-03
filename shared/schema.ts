import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  region: text("region"),
  language: text("language").default("en"),
  phone: text("phone"),
  emergencyContacts: jsonb("emergency_contacts").default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Articles schema
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  source: text("source").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  isOfflineAvailable: boolean("is_offline_available").default(false),
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
});

// Government schemes schema
export const schemes = pgTable("schemes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  eligibilityCriteria: text("eligibility_criteria"),
  benefits: text("benefits"),
  applicationProcess: text("application_process"),
  documentationRequired: jsonb("documentation_required"),
  isOfflineAvailable: boolean("is_offline_available").default(false),
});

export const insertSchemeSchema = createInsertSchema(schemes).omit({
  id: true,
});

// Hospitals schema
export const hospitals = pgTable("hospitals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code"),
  phone: text("phone"),
  email: text("email"),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  type: text("type").notNull(), // e.g., Government, Private, etc.
  services: jsonb("services"),
  emergencyServices: boolean("emergency_services").default(false),
  specialties: jsonb("specialties"),
});

export const insertHospitalSchema = createInsertSchema(hospitals).omit({
  id: true,
});

// Symptoms schema (for offline symptom checker)
export const symptoms = pgTable("symptoms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  possibleConditions: jsonb("possible_conditions").notNull(),
  severity: text("severity").notNull(), // mild, moderate, severe
  recommendedActions: jsonb("recommended_actions").notNull(),
});

export const insertSymptomSchema = createInsertSchema(symptoms).omit({
  id: true,
});

// Diet plans schema
export const dietPlans = pgTable("diet_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  forCondition: jsonb("for_condition").notNull(), // array of health conditions
  region: text("region").notNull(), // specific to region
  items: jsonb("items").notNull(), // food items
  nutrients: jsonb("nutrients"), // nutrient information
  restrictions: jsonb("restrictions"), // dietary restrictions
});

export const insertDietPlanSchema = createInsertSchema(dietPlans).omit({
  id: true,
});

// Medication reminders schema
export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  dosage: text("dosage").notNull(),
  frequency: text("frequency").notNull(), // e.g., once daily, twice daily
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  instructions: text("instructions"),
  reminderTimes: jsonb("reminder_times").notNull(), // Array of times to remind
  isActive: boolean("is_active").default(true),
});

export const insertMedicationSchema = createInsertSchema(medications).omit({
  id: true,
});

// Define relations after all tables are defined
export const usersRelations = relations(users, ({ many }) => ({
  medications: many(medications),
}));

export const medicationsRelations = relations(medications, ({ one }) => ({
  user: one(users, {
    fields: [medications.userId],
    references: [users.id],
  }),
}));

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

export type InsertScheme = z.infer<typeof insertSchemeSchema>;
export type Scheme = typeof schemes.$inferSelect;

export type InsertHospital = z.infer<typeof insertHospitalSchema>;
export type Hospital = typeof hospitals.$inferSelect;

export type InsertSymptom = z.infer<typeof insertSymptomSchema>;
export type Symptom = typeof symptoms.$inferSelect;

export type InsertDietPlan = z.infer<typeof insertDietPlanSchema>;
export type DietPlan = typeof dietPlans.$inferSelect;

export type InsertMedication = z.infer<typeof insertMedicationSchema>;
export type Medication = typeof medications.$inferSelect;
