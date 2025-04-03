/**
 * English translations
 */
export interface Translation {
  // General
  languageName: string;
  loading: string;
  error: string;
  retry: string;
  cancel: string;
  save: string;
  search: string;
  edit: string;
  delete: string;
  add: string;
  saveChanges: string;
  startOver: string;
  all: string;
  viewAll: string;
  readMore: string;
  learnMore: string;
  close: string;
  yes: string;
  no: string;

  // Layout & Navigation
  home: string;
  healthArticles: string;
  symptomChecker: string;
  dietPlans: string;
  hospitalFinder: string;
  medicationReminders: string;
  governmentSchemes: string;
  myProfile: string;
  openMainMenu: string;
  closeMenu: string;
  menu: string;
  profile: string;
  preferences: string;
  healthData: string;
  
  // Offline
  offlineWarning: string;
  offlineModeDataDescription: string;
  offlineMode: string;
  savedForOffline: string;
  offlineModeEnabled: string;
  availableOffline: string;
  partialOffline: string;
  onlineOnly: string;
  tryWhenOnline: string;

  // Home page
  heroTitle: string;
  heroSubtitle: string;
  checkSymptoms: string;
  findHospitals: string;
  ruralHealthcare: string;
  essentialHealthcareFeatures: string;
  latestHealthArticles: string;
  viewAllArticles: string;
  findHospitalsNearYou: string;
  viewAllHospitals: string;
  governmentHealthcareSchemes: string;
  accessAnytimeAnywhere: string;
  downloadAppDescription: string;
  downloadForAndroid: string;
  saveForOfflineUse: string;

  // Feature names & descriptions
  symptomCheckerDescription: string;
  dietPlansDescription: string;
  hospitalFinderDescription: string;
  medicationRemindersDescription: string;
  healthArticlesDescription: string;
  governmentSchemesDescription: string;
  viewDietPlans: string;
  setReminders: string;
  readArticles: string;
  viewSchemes: string;

  // Health Articles
  searchArticles: string;
  noArticlesFound: string;
  WHO: string;
  healthTips: string;
  nutrition: string;
  womensHealth: string;
  childHealth: string;
  chronicDisease: string;
  mentalHealth: string;
  diseaseAwareness: string;
  
  // Clean water article
  cleanWaterTitle: string;
  cleanWaterSummary: string;
  cleanWaterContent: string;
  
  // Seasonal diseases article
  seasonalDiseasesTitle: string;
  seasonalDiseasesSummary: string;
  seasonalDiseasesContent: string;
  
  // Nutritious foods article
  nutritiousFoodsTitle: string;
  nutritiousFoodsSummary: string;
  nutritiousFoodsContent: string;
  
  // Maternal health article
  maternalHealthTitle: string;
  maternalHealthSummary: string;
  maternalHealthContent: string;
  
  // Vaccination article
  vaccinationTitle: string;
  vaccinationSummary: string;
  vaccinationContent: string;
  
  // Diabetes management article
  diabetesManagementTitle: string;
  diabetesManagementSummary: string;
  diabetesManagementContent: string;
  
  // Mental health article
  mentalHealthTitle: string;
  mentalHealthSummary: string;
  mentalHealthContent: string;
  
  // Tobacco harm article
  tobaccoHarmTitle: string;
  tobaccoHarmSummary: string;
  tobaccoHarmContent: string;

  // Symptom Checker
  howToUseSymptomChecker: string;
  symptomCheckerDescription: string;
  disclaimer: string;
  symptomCheckerDisclaimer: string;
  selectYourSymptoms: string;
  selectAllSymptomsYouAreExperiencing: string;
  noSymptomsSelected: string;
  pleaseSelectSymptoms: string;
  symptomCheckResults: string;
  possibleConditionsBasedOnSymptoms: string;
  noMatchingConditions: string;
  recommendedAction: string;
  noConditionsMatch: string;
  tryAddingMoreSymptoms: string;

  // Urgency levels
  'urgency.low': string;
  'urgency.medium': string;
  'urgency.high': string;
  'urgency.emergency': string;

  // Symptoms
  fever: string;
  feverDescription: string;
  highFever: string;
  highFeverDescription: string;
  cough: string;
  coughDescription: string;
  runnyNose: string;
  runnyNoseDescription: string;
  soreThroat: string;
  soreThroatDescription: string;
  congestion: string;
  congestionDescription: string;
  bodyAches: string;
  bodyAchesDescription: string;
  fatigue: string;
  fatigueDescription: string;
  shortnessOfBreath: string;
  shortnessOfBreathDescription: string;
  headache: string;
  headacheDescription: string;
  dizziness: string;
  dizzinessDescription: string;
  nausea: string;
  nauseaDescription: string;
  vomiting: string;
  vomitingDescription: string;
  diarrhea: string;
  diarrheaDescription: string;
  abdominalPain: string;
  abdominalPainDescription: string;
  chestPain: string;
  chestPainDescription: string;
  rash: string;
  rashDescription: string;
  itching: string;
  itchingDescription: string;
  jointPain: string;
  jointPainDescription: string;
  lossOfTaste: string;
  lossOfTasteDescription: string;
  hotSkin: string;
  hotSkinDescription: string;

  // Diet Plans
  createPersonalizedDietPlan: string;
  dietPlanDescription: string;
  selectYourRegion: string;
  chooseRegion: string;
  dietType: string;
  vegetarian: string;
  nonVegetarian: string;
  vegan: string;
  allergies: string;
  healthConditions: string;
  generateDietPlan: string;
  incompleteInformation: string;
  pleaseSelectRegionAndDietType: string;
  adaptedDietPlan: string;
  adaptedDietPlanDescription: string;
  noDietPlanFound: string;
  tryDifferentCriteria: string;
  yourPersonalizedDietPlan: string;
  adaptedDietPlanNote: string;
  personalizedDietPlanDescription: string;
  recommendedFoods: string;
  foodsToAvoid: string;
  sampleDietPlan: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  specialNotes: string;
  createAnotherDietPlan: string;

  // Regions
  northIndia: string;
  southIndia: string;
  eastIndia: string;
  westIndia: string;
  northeastIndia: string;
  centralIndia: string;

  // Diet plan names
  northIndianVegetarianDiet: string;
  northIndianVegetarianDietDescription: string;
  northIndianNonVegetarianDiet: string;
  northIndianNonVegetarianDietDescription: string;
  southIndianVegetarianDiet: string;
  southIndianVegetarianDietDescription: string;
  southIndianNonVegetarianDiet: string;
  southIndianNonVegetarianDietDescription: string;
  eastIndianVegetarianDiet: string;
  eastIndianVegetarianDietDescription: string;
  eastIndianNonVegetarianDiet: string;
  eastIndianNonVegetarianDietDescription: string;
  westIndianVegetarianDiet: string;
  westIndianVegetarianDietDescription: string;
  westIndianNonVegetarianDiet: string;
  westIndianNonVegetarianDietDescription: string;
  northeastIndianVegetarianDiet: string;
  northeastIndianVegetarianDietDescription: string;
  centralIndianVegetarianDiet: string;
  centralIndianVegetarianDietDescription: string;

  // Sample meals
  northIndianVegBreakfast: string;
  northIndianVegLunch: string;
  northIndianVegDinner: string;
  northIndianVegSnacks: string;
  northIndianNonVegBreakfast: string;
  northIndianNonVegLunch: string;
  northIndianNonVegDinner: string;
  northIndianNonVegSnacks: string;
  southIndianVegBreakfast: string;
  southIndianVegLunch: string;
  southIndianVegDinner: string;
  southIndianVegSnacks: string;
  southIndianNonVegBreakfast: string;
  southIndianNonVegLunch: string;
  southIndianNonVegDinner: string;
  southIndianNonVegSnacks: string;
  eastIndianVegBreakfast: string;
  eastIndianVegLunch: string;
  eastIndianVegDinner: string;
  eastIndianVegSnacks: string;
  eastIndianNonVegBreakfast: string;
  eastIndianNonVegLunch: string;
  eastIndianNonVegDinner: string;
  eastIndianNonVegSnacks: string;
  westIndianVegBreakfast: string;
  westIndianVegLunch: string;
  westIndianVegDinner: string;
  westIndianVegSnacks: string;
  westIndianNonVegBreakfast: string;
  westIndianNonVegLunch: string;
  westIndianNonVegDinner: string;
  westIndianNonVegSnacks: string;
  northeastIndianVegBreakfast: string;
  northeastIndianVegLunch: string;
  northeastIndianVegDinner: string;
  northeastIndianVegSnacks: string;
  centralIndianVegBreakfast: string;
  centralIndianVegLunch: string;
  centralIndianVegDinner: string;
  centralIndianVegSnacks: string;
  centralIndianDietSpecialNotes: string;

  // Food recommendations
  wholeGrainsRoti: string;
  dals: string;
  paneer: string;
  seasonalVegetables: string;
  yogurt: string;
  milk: string;
  dryFruits: string;
  refinedFlour: string;
  excessSugar: string;
  processedFoods: string;
  deepFriedItems: string;
  leanChicken: string;
  fish: string;
  eggs: string;
  redMeat: string;
  rice: string;
  millets: string;
  idli: string;
  dosa: string;
  sambar: string;
  rasam: string;
  coconut: string;
  curryLeaves: string;
  tamarind: string;
  seafood: string;
  mustardOil: string;
  panchPhoran: string;
  greens: string;
  pumpkin: string;
  bananaFlower: string;
  prawns: string;
  bajra: string;
  jowar: string;
  wheat: string;
  buttermilk: string;
  groundnuts: string;
  sesameSeeds: string;
  jaggery: string;
  bambooshoot: string;
  fermentedFoods: string;
  leafyGreens: string;
  localFruits: string;
  wildHerbs: string;
  blackSesame: string;
  besan: string;
  localVegetables: string;
  ghee: string;

  // Common conditions
  diabetes: string;
  hypertension: string;
  heartDisease: string;
  obesity: string;
  anemia: string;
  pregnancy: string;

  // Allergies
  dairy: string;
  nuts: string;
  seafood: string;
  gluten: string;
  soy: string;

  // Hospital Finder
  hospitalMap: string;
  hospitalList: string;
  searchHospitals: string;
  mapView: string;
  listView: string;
  governmentHospitals: string;
  privateHospitals: string;
  emergencyServicesOnly: string;
  noHospitalsFound: string;
  tryDifferentSearch: string;
  enterYourLocation: string;
  searchingFor: string;
  searchingDesc: string;
  loadingMapData: string;
  offlineMapWarning: string;
  locationError: string;
  locationErrorDesc: string;
  mapError: string;
  mapErrorDesc: string;
  offlineSearchError: string;
  offlineSearchErrorDesc: string;
  yourLocation: string;
  kmAway: string;
  24x7Emergency: string;
  govtFacility: string;
  privateFacility: string;

  // Medication Reminders
  addMedication: string;
  addMedicationReminder: string;
  editMedication: string;
  medicationReminderDescription: string;
  medicationName: string;
  enterMedicationName: string;
  dosage: string;
  enterDosage: string;
  frequency: string;
  selectFrequency: string;
  daily: string;
  twiceDaily: string;
  thriceDaily: string;
  weekly: string;
  monthly: string;
  time: string;
  notes: string;
  enterAnySpecialInstructions: string;
  addReminder: string;
  updateMedication: string;
  medicationUpdated: string;
  medicationReminderUpdatedSuccess: string;
  medicationAdded: string;
  medicationReminderSetSuccess: string;
  medicationRemoved: string;
  medicationReminderRemovedSuccess: string;
  medicationReminder: string;
  timeToTake: string;
  asPerPrescription: string;
  noMedicationReminders: string;
  addMedicationDescription: string;
  addYourFirstMedication: string;
  pleaseEnterMedicationNameAndTime: string;

  // Government Schemes
  searchSchemes: string;
  noSchemesFound: string;
  checkEligibility: string;
  healthInsurance: string;
  maternalHealth: string;
  medicines: string;
  specializedCare: string;
  diseaseControl: string;
  offlineSchemesNote: string;

  // SOS Emergency
  emergencySOS: string;
  sosDialogDescription: string;
  addEmergencyContact: string;
  enterPhoneNumber: string;
  yourEmergencyContacts: string;
  sendSOSAlert: string;
  contactAdded: string;
  emergencyContactAddedDesc: string;
  sosAlertSent: string;
  sosAlertSentDesc: string;

  // Profile
  personalInformation: string;
  personalInfoDescription: string;
  fullName: string;
  enterFullName: string;
  age: string;
  enterAge: string;
  gender: string;
  enterGender: string;
  bloodGroup: string;
  enterBloodGroup: string;
  allergies: string;
  enterAllergies: string;
  currentMedications: string;
  enterCurrentMedications: string;
  emergencyContact: string;
  enterEmergencyContact: string;
  profileSaved: string;
  profileSavedDescription: string;
  carePreferences: string;
  preferencesDescription: string;
  receiveEmergencyAlerts: string;
  receiveEmergencyAlertsDescription: string;
  shareDataWithDoctors: string;
  shareDataWithDoctorsDescription: string;
  enableOfflineAccess: string;
  enableOfflineAccessDescription: string;
  languagePreference: string;
  savePreferences: string;
  healthDataManagement: string;
  dataManagementDescription: string;
  healthDataSummary: string;
  complete: string;
  incomplete: string;
  active: string;
  set: string;
  notSet: string;
  lastUpdated: string;
  exportHealthData: string;
  clearAllData: string;
  dataExported: string;
  dataExportedDescription: string;
  dataCleared: string;
  dataClearedDescription: string;
  confirmClearData: string;

  // Footer
  footerTagline: string;
  quickLinks: string;
  resources: string;
  contact: string;
  healthEducation: string;
  emergencyContacts: string;
  dietNutrition: string;
  medicationGuide: string;
  firstAidTips: string;
  tollFree: string;
  ministryAddress: string;
  allRightsReserved: string;
  ruralHealthcareProject: string;

  // Other UI elements
  symptoms: string;
  articles: string;
  hospitals: string;
}

export const translations: Translation = {
  // General
  languageName: 'English',
  loading: 'Loading...',
  error: 'Error',
  retry: 'Retry',
  cancel: 'Cancel',
  save: 'Save',
  search: 'Search',
  edit: 'Edit',
  delete: 'Delete',
  add: 'Add',
  saveChanges: 'Save Changes',
  startOver: 'Start Over',
  all: 'All',
  viewAll: 'View All',
  readMore: 'Read more',
  learnMore: 'Learn more',
  close: 'Close',
  yes: 'Yes',
  no: 'No',

  // Layout & Navigation
  home: 'Home',
  healthArticles: 'Health Articles',
  symptomChecker: 'Symptom Checker',
  dietPlans: 'Diet Plans',
  hospitalFinder: 'Hospital Finder',
  medicationReminders: 'Medication Reminders',
  governmentSchemes: 'Government Schemes',
  myProfile: 'My Profile',
  openMainMenu: 'Open main menu',
  closeMenu: 'Close menu',
  menu: 'Menu',
  profile: 'Profile',
  preferences: 'Preferences',
  healthData: 'Health Data',
  
  // Offline
  offlineWarning: 'You are currently offline. Some features may be limited.',
  offlineModeDataDescription: 'You\'re currently in offline mode. Data changes will be synchronized when you reconnect.',
  offlineMode: 'Offline Mode',
  savedForOffline: 'Saved for offline use',
  offlineModeEnabled: 'Offline mode has been enabled. You can now access essential features without internet.',
  availableOffline: 'Available offline',
  partialOffline: 'Partial offline',
  onlineOnly: 'Online only',
  tryWhenOnline: 'Please try again when you are online to see all available schemes.',

  // Home page
  heroTitle: 'AI-Powered Healthcare for Rural Communities',
  heroSubtitle: 'Access essential healthcare services tailored for rural needs, even when offline. Your health companion, wherever you are.',
  checkSymptoms: 'Check Symptoms',
  findHospitals: 'Find Hospitals',
  ruralHealthcare: 'Rural healthcare',
  essentialHealthcareFeatures: 'Essential Healthcare Features',
  latestHealthArticles: 'Latest Health Articles',
  viewAllArticles: 'View all articles',
  findHospitalsNearYou: 'Find Hospitals Near You',
  viewAllHospitals: 'View all hospitals',
  governmentHealthcareSchemes: 'Government Healthcare Schemes',
  accessAnytimeAnywhere: 'Access Healthcare Anytime, Anywhere',
  downloadAppDescription: 'Download the AROGYA app to get offline access to all features, even without an internet connection.',
  downloadForAndroid: 'Download for Android',
  saveForOfflineUse: 'Save for Offline Use',

  // Feature names & descriptions
  symptomCheckerDescription: 'Check your symptoms and get guidance on potential health conditions using our AI-powered tool.',
  dietPlansDescription: 'Get personalized diet recommendations based on your region, allergies, and health conditions.',
  hospitalFinderDescription: 'Find the nearest hospitals and healthcare centers in your area with interactive maps.',
  medicationRemindersDescription: 'Never miss your medications with personalized reminders and dosage tracking.',
  healthArticlesDescription: 'Stay informed with the latest health articles from WHO and trusted sources.',
  governmentSchemesDescription: 'Access information about government healthcare schemes and benefits available for rural residents.',
  viewDietPlans: 'View diet plans',
  setReminders: 'Set reminders',
  readArticles: 'Read articles',
  viewSchemes: 'View schemes',

  // Health Articles
  searchArticles: 'Search articles...',
  noArticlesFound: 'No articles found matching your search criteria.',
  WHO: 'WHO',
  healthTips: 'Health Tips',
  nutrition: 'Nutrition',
  womensHealth: 'Women\'s Health',
  childHealth: 'Child Health',
  chronicDisease: 'Chronic Disease',
  mentalHealth: 'Mental Health',
  diseaseAwareness: 'Disease Awareness',
  
  // Clean water article
  cleanWaterTitle: 'Importance of Clean Water in Rural Areas',
  cleanWaterSummary: 'Learn about the critical impact of clean water on public health in rural communities and ways to ensure water safety.',
  cleanWaterContent: 'Clean and safe drinking water is fundamental to health and well-being, especially in rural areas where water sources may be limited or contaminated. This article discusses how access to clean water prevents waterborne diseases and improves overall community health.',
  
  // Seasonal diseases article
  seasonalDiseasesTitle: 'Preventing Seasonal Diseases During Monsoon',
  seasonalDiseasesSummary: 'Practical tips to safeguard yourself and your family from common monsoon-related illnesses like dengue and malaria.',
  seasonalDiseasesContent: 'The monsoon season brings relief from heat but also creates favorable conditions for disease vectors like mosquitoes. Learn about simple preventive measures to protect yourself and your family from seasonal diseases.',
  
  // Nutritious foods article
  nutritiousFoodsTitle: 'Affordable Nutritious Foods for Rural Families',
  nutritiousFoodsSummary: 'Discover budget-friendly nutritious foods that are locally available and can improve family health outcomes.',
  nutritiousFoodsContent: 'Good nutrition doesn\'t have to be expensive. This article highlights locally available, affordable foods that provide essential nutrients for a balanced diet and better health.',
  
  // Maternal health article
  maternalHealthTitle: 'Essential Maternal Health Practices',
  maternalHealthSummary: 'Important practices for maternal health that every pregnant woman should know for a healthy pregnancy.',
  maternalHealthContent: 'Proper maternal care is crucial for both mother and child. This article covers essential prenatal care, nutrition, warning signs, and the importance of institutional delivery.',
  
  // Vaccination article
  vaccinationTitle: 'Importance of Childhood Vaccinations',
  vaccinationSummary: 'Why vaccinations are essential for your child\'s health and the community\'s well-being.',
  vaccinationContent: 'Vaccines help protect children from serious diseases and their complications. This article explains the vaccination schedule, common myths, and the concept of herd immunity.',
  
  // Diabetes management article
  diabetesManagementTitle: 'Managing Diabetes in Rural Settings',
  diabetesManagementSummary: 'Practical approaches to diabetes management with limited resources in rural areas.',
  diabetesManagementContent: 'Managing diabetes can be challenging in rural areas with limited healthcare access. This article provides practical guidance on monitoring, diet, physical activity, and medication management.',
  
  // Mental health article
  mentalHealthTitle: 'Mental Health Awareness in Rural Areas',
  mentalHealthSummary: 'Breaking stigma and promoting mental health support in rural communities.',
  mentalHealthContent: 'Mental health issues often go unrecognized in rural areas due to stigma and lack of awareness. This article addresses common mental health concerns, signs to watch for, and available support options.',
  
  // Tobacco harm article
  tobaccoHarmTitle: 'The Dangers of Tobacco Use',
  tobaccoHarmSummary: 'Understanding the health risks of tobacco consumption and strategies for quitting.',
  tobaccoHarmContent: 'Tobacco use in various forms is a major health risk. This article explains the dangers of smoking and chewing tobacco, and provides strategies for quitting and seeking support.',

  // Symptom Checker
  howToUseSymptomChecker: 'How to Use the Symptom Checker',
  symptomCheckerDescription: 'Select all the symptoms you are experiencing to get potential health condition matches and recommended actions.',
  disclaimer: 'Disclaimer',
  symptomCheckerDisclaimer: 'This tool provides general information only and should not replace professional medical advice. Always consult a healthcare provider for diagnosis and treatment.',
  selectYourSymptoms: 'Select Your Symptoms',
  selectAllSymptomsYouAreExperiencing: 'Check all symptoms you are currently experiencing',
  noSymptomsSelected: 'No Symptoms Selected',
  pleaseSelectSymptoms: 'Please select at least one symptom to check',
  symptomCheckResults: 'Symptom Check Results',
  possibleConditionsBasedOnSymptoms: 'Possible conditions based on your symptoms',
  noMatchingConditions: 'No matching conditions found',
  recommendedAction: 'Recommended Action',
  noConditionsMatch: 'No conditions match your symptoms',
  tryAddingMoreSymptoms: 'Try adding more symptoms or consult a healthcare provider',

  // Urgency levels
  'urgency.low': 'Low Urgency',
  'urgency.medium': 'Medium Urgency',
  'urgency.high': 'High Urgency',
  'urgency.emergency': 'Medical Emergency',

  // Symptoms
  fever: 'Fever',
  feverDescription: 'Body temperature above normal (37.5°C / 99.5°F)',
  highFever: 'High Fever',
  highFeverDescription: 'Very high body temperature (39°C / 102.2°F or higher)',
  cough: 'Cough',
  coughDescription: 'Reflex action to clear airways',
  runnyNose: 'Runny Nose',
  runnyNoseDescription: 'Excess nasal drainage or discharge',
  soreThroat: 'Sore Throat',
  soreThroatDescription: 'Pain, scratchiness, or irritation in the throat',
  congestion: 'Congestion',
  congestionDescription: 'Blocked or stuffy nose',
  bodyAches: 'Body Aches',
  bodyAchesDescription: 'Generalized muscle and joint pain',
  fatigue: 'Fatigue',
  fatigueDescription: 'Extreme tiredness or lack of energy',
  shortnessOfBreath: 'Shortness of Breath',
  shortnessOfBreathDescription: 'Difficulty breathing or feeling like you can\'t get enough air',
  headache: 'Headache',
  headacheDescription: 'Pain in the head or upper neck',
  dizziness: 'Dizziness',
  dizzinessDescription: 'Feeling lightheaded, unsteady, or like the room is spinning',
  nausea: 'Nausea',
  nauseaDescription: 'Feeling of sickness with an urge to vomit',
  vomiting: 'Vomiting',
  vomitingDescription: 'Forceful expulsion of stomach contents through the mouth',
  diarrhea: 'Diarrhea',
  diarrheaDescription: 'Loose, watery stools occurring more frequently than usual',
  abdominalPain: 'Abdominal Pain',
  abdominalPainDescription: 'Pain felt in the area between the chest and groin',
  chestPain: 'Chest Pain',
  chestPainDescription: 'Discomfort or pain felt in or around the chest',
  rash: 'Rash',
  rashDescription: 'Abnormal change in skin color or texture',
  itching: 'Itching',
  itchingDescription: 'Irritating sensation causing a desire to scratch',
  jointPain: 'Joint Pain',
  jointPainDescription: 'Discomfort or pain in one or more joints',
  lossOfTaste: 'Loss of Taste or Smell',
  lossOfTasteDescription: 'Reduced or lost ability to taste or smell',
  hotSkin: 'Hot Skin',
  hotSkinDescription: 'Skin that feels unusually hot to touch, often dry',

  // Diet Plans
  createPersonalizedDietPlan: 'Create a Personalized Diet Plan',
  dietPlanDescription: 'Get a customized diet plan based on your region, preferences, and health conditions.',
  selectYourRegion: 'Select Your Region',
  chooseRegion: 'Choose your region',
  dietType: 'Diet Type',
  vegetarian: 'Vegetarian',
  nonVegetarian: 'Non-Vegetarian',
  vegan: 'Vegan',
  allergies: 'Allergies',
  healthConditions: 'Health Conditions',
  generateDietPlan: 'Generate Diet Plan',
  incompleteInformation: 'Incomplete Information',
  pleaseSelectRegionAndDietType: 'Please select your region and diet type',
  adaptedDietPlan: 'Adapted Diet Plan',
  adaptedDietPlanDescription: 'We\'ve adapted a diet plan to match your preferences as closely as possible.',
  noDietPlanFound: 'No Diet Plan Found',
  tryDifferentCriteria: 'Try different criteria to generate a diet plan',
  yourPersonalizedDietPlan: 'Your Personalized Diet Plan',
  adaptedDietPlanNote: 'Note: This plan has been adapted to best match your requirements. Some modifications may be needed.',
  personalizedDietPlanDescription: 'Based on your region, preferences, and health conditions',
  recommendedFoods: 'Recommended Foods',
  foodsToAvoid: 'Foods to Avoid',
  sampleDietPlan: 'Sample Diet Plan',
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snacks: 'Snacks',
  specialNotes: 'Special Notes',
  createAnotherDietPlan: 'Create Another Diet Plan',

  // Regions
  northIndia: 'North India',
  southIndia: 'South India',
  eastIndia: 'East India',
  westIndia: 'West India',
  northeastIndia: 'Northeast India',
  centralIndia: 'Central India',

  // Diet plan names
  northIndianVegetarianDiet: 'North Indian Vegetarian Diet',
  northIndianVegetarianDietDescription: 'A balanced vegetarian diet based on North Indian cuisine, rich in whole grains, lentils, and dairy.',
  northIndianNonVegetarianDiet: 'North Indian Non-Vegetarian Diet',
  northIndianNonVegetarianDietDescription: 'A balanced diet incorporating North Indian cuisine with lean meats, whole grains, and lentils.',
  southIndianVegetarianDiet: 'South Indian Vegetarian Diet',
  southIndianVegetarianDietDescription: 'A balanced diet based on South Indian cuisine, rich in rice, millets, lentils, and coconut.',
  southIndianNonVegetarianDiet: 'South Indian Non-Vegetarian Diet',
  southIndianNonVegetarianDietDescription: 'A balanced diet incorporating South Indian cuisine with fish, seafood, rice, and coconut.',
  eastIndianVegetarianDiet: 'East Indian Vegetarian Diet',
  eastIndianVegetarianDietDescription: 'A balanced vegetarian diet based on East Indian cuisine, featuring rice, lentils, and vegetables cooked in mustard oil.',
  eastIndianNonVegetarianDiet: 'East Indian Non-Vegetarian Diet',
  eastIndianNonVegetarianDietDescription: 'A balanced diet incorporating East Indian cuisine with fish, rice, and vegetables cooked in mustard oil.',
  westIndianVegetarianDiet: 'West Indian Vegetarian Diet',
  westIndianVegetarianDietDescription: 'A balanced vegetarian diet based on West Indian cuisine, featuring millets, wheat, and pulses.',
  westIndianNonVegetarianDiet: 'West Indian Non-Vegetarian Diet',
  westIndianNonVegetarianDietDescription: 'A balanced diet incorporating West Indian cuisine with seafood, chicken, millets, and wheat.',
  northeastIndianVegetarianDiet: 'Northeast Indian Vegetarian Diet',
  northeastIndianVegetarianDietDescription: 'A balanced vegetarian diet based on Northeast Indian cuisine, featuring rice, bamboo shoots, and fermented foods.',
  centralIndianVegetarianDiet: 'Central Indian Vegetarian Diet',
  centralIndianVegetarianDietDescription: 'A balanced vegetarian diet based on Central Indian cuisine, featuring wheat, besan, and local vegetables.',

  // Sample meals
  northIndianVegBreakfast: 'Whole wheat paratha with curd, or poha with vegetables',
  northIndianVegLunch: 'Roti, dal, seasonal vegetable curry, rice, and raita',
  northIndianVegDinner: 'Roti, mixed vegetable curry, dal, and small portion of rice',
  northIndianVegSnacks: 'Roasted chana, fruit, or vegetable cutlets',
  northIndianNonVegBreakfast: 'Whole wheat paratha with egg bhurji, or vegetable upma',
  northIndianNonVegLunch: 'Roti, chicken/fish curry, vegetable, rice, and raita',
  northIndianNonVegDinner: 'Roti, lean meat curry or dal, vegetable, and small portion of rice',
  northIndianNonVegSnacks: 'Boiled egg, fruit, or roasted makhana',
  southIndianVegBreakfast: 'Idli with sambar and chutney, or dosa with vegetable filling',
  southIndianVegLunch: 'Rice, sambar, rasam, vegetable poriyal, curd, and papad',
  southIndianVegDinner: 'Dosa or ragi roti with vegetable curry and small portion of rice',
  southIndianVegSnacks: 'Sundal, fruit, or steamed snacks like puttu',
  southIndianNonVegBreakfast: 'Appam with vegetable stew, or ragi porridge',
  southIndianNonVegLunch: 'Rice, fish curry, vegetable poriyal, rasam, and curd',
  southIndianNonVegDinner: 'Rice or dosa with fish curry or egg curry and vegetables',
  southIndianNonVegSnacks: 'Egg bonda, fruit, or roasted nuts',
  eastIndianVegBreakfast: 'Luchi with aloo sabzi, or chirer pulao (flattened rice with vegetables)',
  eastIndianVegLunch: 'Rice, dal, mixed vegetable curry, and chutney',
  eastIndianVegDinner: 'Rice or roti with dal and seasonal vegetable curry',
  eastIndianVegSnacks: 'Muri mixture, fruit, or steamed snacks like pitha',
  eastIndianNonVegBreakfast: 'Paratha with egg bhurji, or puffed rice with vegetables',
  eastIndianNonVegLunch: 'Rice, fish curry, vegetable fry, and dal',
  eastIndianNonVegDinner: 'Rice or roti with fish curry or egg curry and vegetables',
  eastIndianNonVegSnacks: 'Fish chop, fruit, or ghugni (yellow peas curry)',
  westIndianVegBreakfast: 'Thepla with curd, or upma with vegetables',
  westIndianVegLunch: 'Bajra/jowar roti, dal, vegetable sabzi, rice, and buttermilk',
  westIndianVegDinner: 'Roti, vegetable curry, and small portion of khichdi',
  westIndianVegSnacks: 'Dhokla, fruit, or roasted chana',
  westIndianNonVegBreakfast: 'Paratha with egg bhurji, or poha with vegetables',
  westIndianNonVegLunch: 'Bajra/jowar roti, fish/chicken curry, vegetable sabzi, rice, and buttermilk',
  westIndianNonVegDinner: 'Roti with fish curry or egg curry and vegetables',
  westIndianNonVegSnacks: 'Egg bhurji, fruit, or khandvi',
  northeastIndianVegBreakfast: 'Rice pancakes with vegetable stew, or steamed rice cakes',
  northeastIndianVegLunch: 'Rice, dal, mixed vegetable curry with bamboo shoots, and fermented foods',
  northeastIndianVegDinner: 'Rice with vegetable stew and fermented soybean chutney',
  northeastIndianVegSnacks: 'Steamed vegetable dumplings, fruits, or black rice pudding',
  centralIndianVegBreakfast: 'Poha with vegetables, or paratha with vegetable curry',
  centralIndianVegLunch: 'Roti, dal, vegetable curry, rice, and buttermilk',
  centralIndianVegDinner: 'Roti, mixed vegetable curry, and small portion of khichdi',
  centralIndianVegSnacks: 'Chila, fruit, or baked namkeen',
  centralIndianDietSpecialNotes: 'Include local seasonal fruits and vegetables. Stay well-hydrated with water, buttermilk, or herbal teas.',

  // Food recommendations
  wholeGrainsRoti: 'Whole grain rotis/chapatis',
  dals: 'Varieties of lentils (dal)',
  paneer: 'Cottage cheese (paneer)',
  seasonalVegetables: 'Seasonal vegetables',
  yogurt: 'Yogurt/curd',
  milk: 'Milk and milk products',
  dryFruits: 'Nuts and dry fruits',
  refinedFlour: 'Refined flour (maida)',
  excessSugar: 'Excess sugar and sweets',
  processedFoods: 'Processed and packaged foods',
  deepFriedItems: 'Deep-fried items',
  leanChicken: 'Lean chicken',
  fish: 'Fish',
  eggs: 'Eggs',
  redMeat: 'Red meat',
  rice: 'Rice',
  millets: 'Millets',
  idli: 'Idli',
  dosa: 'Dosa',
  sambar: 'Sambar',
  rasam: 'Rasam',
  coconut: 'Coconut',
  curryLeaves: 'Curry leaves',
  tamarind: 'Tamarind',
  seafood: 'Seafood',
  mustardOil: 'Mustard oil',
  panchPhoran: 'Panch phoran (five-spice blend)',
  greens: 'Leafy greens',
  pumpkin: 'Pumpkin',
  bananaFlower: 'Banana flower',
  prawns: 'Prawns',
  bajra: 'Bajra (pearl millet)',
  jowar: 'Jowar (sorghum)',
  wheat: 'Wheat',
  buttermilk: 'Buttermilk',
  groundnuts: 'Groundnuts',
  sesameSeeds: 'Sesame seeds',
  jaggery: 'Jaggery',
  bambooshoot: 'Bamboo shoots',
  fermentedFoods: 'Fermented foods',
  leafyGreens: 'Leafy greens',
  localFruits: 'Local fruits',
  wildHerbs: 'Wild herbs',
  blackSesame: 'Black sesame seeds',
  besan: 'Besan (gram flour)',
  localVegetables: 'Local vegetables',
  ghee: 'Ghee (clarified butter)',

  // Common conditions
  diabetes: 'Diabetes',
  hypertension: 'Hypertension (High Blood Pressure)',
  heartDisease: 'Heart Disease',
  obesity: 'Obesity',
  anemia: 'Anemia',
  pregnancy: 'Pregnancy',

  // Allergies
  dairy: 'Dairy',
  nuts: 'Nuts',
  seafood: 'Seafood',
  gluten: 'Gluten',
  soy: 'Soy',

  // Hospital Finder
  hospitalMap: 'Hospital Map',
  hospitalList: 'Hospital List',
  searchHospitals: 'Search hospitals by name, city or state...',
  mapView: 'Map View',
  listView: 'List View',
  governmentHospitals: 'Government Hospitals',
  privateHospitals: 'Private Hospitals',
  emergencyServicesOnly: 'Emergency Services Only',
  noHospitalsFound: 'No hospitals found matching your criteria',
  tryDifferentSearch: 'Try a different search or filter',
  enterYourLocation: 'Enter your location',
  searchingFor: 'Searching for "{location}"',
  searchingDesc: 'Finding hospitals near your location...',
  loadingMapData: 'Loading map data...',
  offlineMapWarning: 'Limited map functionality in offline mode. Some features may not work correctly.',
  locationError: 'Location Error',
  locationErrorDesc: 'Unable to access your location. Please check your permissions or enter location manually.',
  mapError: 'Map Error',
  mapErrorDesc: 'Unable to load the map. Please try again later.',
  offlineSearchError: 'Offline Search Unavailable',
  offlineSearchErrorDesc: 'Location search requires an internet connection. Please try again when online.',
  yourLocation: 'Your Location',
  kmAway: 'km away',
  24x7Emergency: '24/7 Emergency',
  govtFacility: 'Govt. Facility',
  privateFacility: 'Private Facility',

  // Medication Reminders
  addMedication: 'Add Medication',
  addMedicationReminder: 'Add Medication Reminder',
  editMedication: 'Edit Medication',
  medicationReminderDescription: 'Create reminders for your medications to never miss a dose.',
  medicationName: 'Medication Name',
  enterMedicationName: 'Enter medication name',
  dosage: 'Dosage',
  enterDosage: 'Enter dosage (e.g., 10mg, 1 tablet)',
  frequency: 'Frequency',
  selectFrequency: 'Select frequency',
  daily: 'Daily',
  twiceDaily: 'Twice Daily',
  thriceDaily: 'Thrice Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  time: 'Time',
  notes: 'Notes',
  enterAnySpecialInstructions: 'Enter any special instructions',
  addReminder: 'Add Reminder',
  updateMedication: 'Update Medication',
  medicationUpdated: 'Medication Updated',
  medicationReminderUpdatedSuccess: 'Your medication reminder has been updated successfully.',
  medicationAdded: 'Medication Added',
  medicationReminderSetSuccess: 'Your medication reminder has been set successfully.',
  medicationRemoved: 'Medication Removed',
  medicationReminderRemovedSuccess: 'Your medication reminder has been removed.',
  medicationReminder: 'Medication Reminder',
  timeToTake: 'Time to take',
  asPerPrescription: 'as per prescription',
  noMedicationReminders: 'No Medication Reminders',
  addMedicationDescription: 'Add reminders for your medications to help you take them on time.',
  addYourFirstMedication: 'Add Your First Medication',
  pleaseEnterMedicationNameAndTime: 'Please enter medication name and time',

  // Government Schemes
  searchSchemes: 'Search government schemes...',
  noSchemesFound: 'No schemes found matching your search criteria',
  checkEligibility: 'Check eligibility',
  healthInsurance: 'Health Insurance',
  maternalHealth: 'Maternal Health',
  medicines: 'Medicines',
  specializedCare: 'Specialized Care',
  diseaseControl: 'Disease Control',
  offlineSchemesNote: 'You are offline. Only schemes with offline access are displayed.',

  // SOS Emergency
  emergencySOS: 'Emergency SOS',
  sosDialogDescription: 'Add emergency contacts to send alerts in case of emergency.',
  addEmergencyContact: 'Add Emergency Contact',
  enterPhoneNumber: 'Enter phone number',
  yourEmergencyContacts: 'Your Emergency Contacts',
  sendSOSAlert: 'Send SOS Alert',
  contactAdded: 'Contact Added',
  emergencyContactAddedDesc: 'Emergency contact has been added successfully.',
  sosAlertSent: 'SOS Alert Sent',
  sosAlertSentDesc: 'Emergency alert has been sent to your contacts.',

  // Profile
  personalInformation: 'Personal Information',
  personalInfoDescription: 'Your basic information for personalized healthcare',
  fullName: 'Full Name',
  enterFullName: 'Enter your full name',
  age: 'Age',
  enterAge: 'Enter your age',
  gender: 'Gender',
  enterGender: 'Enter your gender',
  bloodGroup: 'Blood Group',
  enterBloodGroup: 'Enter your blood group',
  allergies: 'Allergies',
  enterAllergies: 'Enter any allergies you have',
  currentMedications: 'Current Medications',
  enterCurrentMedications: 'Enter any medications you are taking',
  emergencyContact: 'Emergency Contact',
  enterEmergencyContact: 'Enter emergency contact number',
  profileSaved: 'Profile Saved',
  profileSavedDescription: 'Your profile information has been saved successfully.',
  carePreferences: 'Care Preferences',
  preferencesDescription: 'Customize your healthcare experience',
  receiveEmergencyAlerts: 'Receive Emergency Alerts',
  receiveEmergencyAlertsDescription: 'Get alerts about health emergencies in your area',
  shareDataWithDoctors: 'Share Data with Doctors',
  shareDataWithDoctorsDescription: 'Allow doctors to access your health information',
  enableOfflineAccess: 'Enable Offline Access',
  enableOfflineAccessDescription: 'Store health data on your device for offline access',
  languagePreference: 'Language Preference',
  savePreferences: 'Save Preferences',
  healthDataManagement: 'Health Data Management',
  dataManagementDescription: 'Manage your health data, backups, and privacy',
  healthDataSummary: 'Health Data Summary',
  complete: 'Complete',
  incomplete: 'Incomplete',
  active: 'Active',
  set: 'Set',
  notSet: 'Not set',
  lastUpdated: 'Last updated',
  exportHealthData: 'Export Health Data',
  clearAllData: 'Clear All Data',
  dataExported: 'Data Exported',
  dataExportedDescription: 'Your health data has been exported successfully.',
  dataCleared: 'Data Cleared',
  dataClearedDescription: 'All your health data has been cleared from this device.',
  confirmClearData: 'Are you sure you want to clear all your health data? This action cannot be undone.',

  // Footer
  footerTagline: 'AI-driven healthcare for rural communities, providing essential services even without internet access.',
  quickLinks: 'Quick Links',
  resources: 'Resources',
  contact: 'Contact',
  healthEducation: 'Health Education',
  emergencyContacts: 'Emergency Contacts',
  dietNutrition: 'Diet & Nutrition',
  medicationGuide: 'Medication Guide',
  firstAidTips: 'First Aid Tips',
  tollFree: 'Toll Free',
  ministryAddress: 'Ministry of Health and Family Welfare, Government of India',
  allRightsReserved: 'All rights reserved.',
  ruralHealthcareProject: 'A project for rural healthcare access.',

  // Other UI elements
  symptoms: 'Symptoms',
  articles: 'Articles',
  hospitals: 'Hospitals'
};
