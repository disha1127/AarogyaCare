import { Scheme } from "@shared/schema";

export const schemes: Scheme[] = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
    name: "National Programme for Control of Blindness",
    description: "Aims to reduce the prevalence of blindness through early identification and treatment of eye diseases.",
    category: "Eye Care",
    eligibilityCriteria: "Available to all citizens, especially those with vision impairments.",
    benefits: "Free eye check-ups, cataract surgery, and provision of spectacles for school children.",
    applicationProcess: "Register at eye camps or government hospitals.",
    documentationRequired: ["Identification proof"],
    isOfflineAvailable: true
  },
  {
    id: 5,
    name: "National Health Mission - Rural Component",
    description: "Comprehensive health initiative to address the healthcare needs of rural populations.",
    category: "Primary Healthcare",
    eligibilityCriteria: "All residents of rural areas.",
    benefits: "Improved access to primary healthcare, maternal and child health services, and disease control programs.",
    applicationProcess: "Access services through local health centers, sub-centers, and ASHA workers.",
    documentationRequired: ["Varies by specific service"],
    isOfflineAvailable: true
  },
  {
    id: 6,
    name: "Rashtriya Arogya Nidhi",
    description: "Financial assistance for patients living below poverty line who are suffering from life-threatening diseases.",
    category: "Financial Assistance",
    eligibilityCriteria: "BPL patients requiring super specialty treatment for life-threatening conditions.",
    benefits: "One-time financial assistance up to ₹15 lakhs.",
    applicationProcess: "Apply through Medical Superintendent of the hospital where treatment is sought.",
    documentationRequired: ["BPL Certificate", "Medical Reports", "Hospital Recommendation", "Aadhaar Card"],
    isOfflineAvailable: false
  },
  {
    id: 7,
    name: "National AYUSH Mission",
    description: "Promotes AYUSH (Ayurveda, Yoga, Naturopathy, Unani, Siddha, Homeopathy) medical systems.",
    category: "Traditional Medicine",
    eligibilityCriteria: "Available to all citizens.",
    benefits: "Access to AYUSH healthcare services, medicinal plants cultivation support, and quality education in AYUSH systems.",
    applicationProcess: "Access services through AYUSH hospitals and dispensaries.",
    documentationRequired: ["Varies by specific service"],
    isOfflineAvailable: false
  },
  {
    id: 8,
    name: "Pradhan Mantri Matru Vandana Yojana",
    description: "Maternity benefit program providing partial compensation for wage loss and to improve health seeking behavior.",
    category: "Maternal Health",
    eligibilityCriteria: "Pregnant women and lactating mothers for first living child.",
    benefits: "Cash benefit of ₹5,000 in three installments.",
    applicationProcess: "Apply through Anganwadi Center or health worker.",
    documentationRequired: ["Aadhaar Card", "Bank Account Details", "MCP Card", "Identity Proof"],
    isOfflineAvailable: true
  },
  {
    id: 9,
    name: "Rashtriya Bal Swasthya Karyakram",
    description: "Child health screening and early intervention services for birth defects, diseases, and development delays.",
    category: "Child Health",
    eligibilityCriteria: "Children aged 0-18 years.",
    benefits: "Free health screening, early diagnosis, and management of 4 Ds – Defects, Deficiencies, Diseases, Development Delays.",
    applicationProcess: "Access through schools, Anganwadi centers, or dedicated mobile health teams.",
    documentationRequired: ["Child's identification details"],
    isOfflineAvailable: true
  },
  {
    id: 10,
    name: "National Mental Health Program",
    description: "Program to provide mental healthcare services and raise awareness about mental health issues.",
    category: "Mental Health",
    eligibilityCriteria: "Available to all citizens requiring mental health support.",
    benefits: "Access to mental health services at district hospitals, community health centers, and primary health centers.",
    applicationProcess: "Visit nearest health facility with mental health services.",
    documentationRequired: ["Identity proof for registration"],
    isOfflineAvailable: false
  },
  {
    id: 11,
    name: "National Tuberculosis Elimination Program",
    description: "Comprehensive program for early detection and treatment of Tuberculosis (TB).",
    category: "Disease Control",
    eligibilityCriteria: "All TB patients and those requiring testing.",
    benefits: "Free diagnosis, treatment, nutrition support, and financial incentives for treatment completion.",
    applicationProcess: "Visit nearest health facility for TB testing and treatment.",
    documentationRequired: ["Aadhaar Card", "Bank Account Details for financial support"],
    isOfflineAvailable: true
  },
  {
    id: 12,
    name: "Rashtriya Kishor Swasthya Karyakram",
    description: "Health program focusing on adolescent health and development.",
    category: "Adolescent Health",
    eligibilityCriteria: "Adolescents aged 10-19 years.",
    benefits: "Health services, counseling, nutrition support, and menstrual hygiene management.",
    applicationProcess: "Access through schools, Adolescent Friendly Health Clinics, or community outreach.",
    documentationRequired: ["School ID or age proof for certain services"],
    isOfflineAvailable: false
  }
];
