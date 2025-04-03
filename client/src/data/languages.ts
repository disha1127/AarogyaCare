export interface Language {
  code: string;
  name: string;
  translations?: Record<string, string>;
}

export const languages: Language[] = [
  {
    code: "en",
    name: "English",
    translations: {
      // Common translations
      home: "Home",
      healthArticles: "Health Articles",
      symptomChecker: "Symptom Checker",
      dietPlans: "Diet Plans",
      hospitalFinder: "Hospital Finder",
      governmentSchemes: "Government Schemes",
      medicationReminders: "Medication Reminders",
      offlineMessage: "You are currently offline. Some features may be limited.",
      
      // Homepage
      heroTitle: "AI-Powered Healthcare for Rural Communities",
      heroDescription: "Access essential healthcare services tailored for rural needs, even when offline. Your health companion, wherever you are.",
      checkSymptoms: "Check Symptoms",
      findHospitals: "Find Hospitals",
      
      // Feature sections
      essentialFeatures: "Essential Healthcare Features",
      latestArticles: "Latest Health Articles",
      viewAllArticles: "View all articles",
      readMore: "Read more",
      
      // Hospital finder
      nearbyHospitals: "Find Hospitals Near You",
      enterLocation: "Enter your location",
      
      // Footer
      quickLinks: "Quick Links",
      resources: "Resources",
      contact: "Contact",
      healthEducation: "Health Education",
      emergencyContacts: "Emergency Contacts",
      dietNutrition: "Diet & Nutrition",
      medicationGuide: "Medication Guide",
      firstAidTips: "First Aid Tips",
      tollFree: "Toll Free",
      ministryAddress: "Ministry of Health and Family Welfare, Government of India",
      copyright: "All rights reserved. A project for rural healthcare access.",
      
      // Download section
      accessAnytime: "Access Healthcare Anytime, Anywhere",
      downloadDescription: "Download the AROGYA app to get offline access to all features, even without an internet connection.",
      downloadAndroid: "Download for Android",
      saveOffline: "Save for Offline Use",
      
      // General UI elements
      loading: "Loading...",
      error: "An error occurred",
      retry: "Retry",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      
      // SOS
      emergencySOS: "Emergency SOS",
      emergencyAlert: "Emergency Alert",
      sosConfirmation: "Are you sure you want to send an emergency alert? This will notify your emergency contacts with your current location.",
      sendEmergencyAlert: "Send Emergency Alert",
      emergencyAlertSent: "Emergency Alert Sent",
      emergencyContactsNotified: "Your emergency contacts have been notified of your situation.",
      
      // Offline storage
      offlineDataSaved: "Offline Data Saved",
      offlineDataSavedDescription: "Essential healthcare information has been saved for offline use.",
      offlineDataError: "Error Saving Offline Data",
      offlineDataErrorDescription: "There was a problem saving data for offline use. Please try again."
    }
  },
  {
    code: "hi",
    name: "हिन्दी",
    translations: {
      // Common translations
      home: "होम",
      healthArticles: "स्वास्थ्य लेख",
      symptomChecker: "लक्षण जांचकर्ता",
      dietPlans: "आहार योजनाएं",
      hospitalFinder: "अस्पताल खोजक",
      governmentSchemes: "सरकारी योजनाएं",
      medicationReminders: "दवा रिमाइंडर",
      offlineMessage: "आप वर्तमान में ऑफलाइन हैं। कुछ सुविधाएं सीमित हो सकती हैं।",
      
      // Homepage
      heroTitle: "ग्रामीण समुदायों के लिए AI-संचालित स्वास्थ्य सेवा",
      heroDescription: "ग्रामीण आवश्यकताओं के लिए अनुकूलित आवश्यक स्वास्थ्य सेवाओं तक पहुंच, यहां तक कि ऑफलाइन भी। जहां भी आप हों, आपका स्वास्थ्य साथी।",
      checkSymptoms: "लक्षण जांचें",
      findHospitals: "अस्पताल खोजें",
      
      // Feature sections
      essentialFeatures: "आवश्यक स्वास्थ्य सेवा सुविधाएं",
      latestArticles: "नवीनतम स्वास्थ्य लेख",
      viewAllArticles: "सभी लेख देखें",
      readMore: "और पढ़ें",
      
      // Hospital finder
      nearbyHospitals: "अपने नजदीकी अस्पताल खोजें",
      enterLocation: "अपना स्थान दर्ज करें",
      
      // Footer
      quickLinks: "त्वरित लिंक",
      resources: "संसाधन",
      contact: "संपर्क",
      healthEducation: "स्वास्थ्य शिक्षा",
      emergencyContacts: "आपातकालीन संपर्क",
      dietNutrition: "आहार और पोषण",
      medicationGuide: "दवा गाइड",
      firstAidTips: "प्राथमिक चिकित्सा टिप्स",
      tollFree: "टोल फ्री",
      ministryAddress: "स्वास्थ्य और परिवार कल्याण मंत्रालय, भारत सरकार",
      copyright: "सर्वाधिकार सुरक्षित। ग्रामीण स्वास्थ्य सेवा पहुंच के लिए एक परियोजना।",
      
      // Download section
      accessAnytime: "कभी भी, कहीं भी स्वास्थ्य सेवा प्राप्त करें",
      downloadDescription: "AROGYA ऐप डाउनलोड करें और इंटरनेट कनेक्शन के बिना भी सभी सुविधाओं तक ऑफलाइन पहुंच प्राप्त करें।",
      downloadAndroid: "Android के लिए डाउनलोड करें",
      saveOffline: "ऑफलाइन उपयोग के लिए सहेजें",
      
      // General UI elements
      loading: "लोड हो रहा है...",
      error: "एक त्रुटि हुई",
      retry: "पुनः प्रयास करें",
      cancel: "रद्द करें",
      save: "सहेजें",
      delete: "हटाएं",
      edit: "संपादित करें",
      
      // SOS
      emergencySOS: "आपातकालीन SOS",
      emergencyAlert: "आपातकालीन अलर्ट",
      sosConfirmation: "क्या आप वाकई एक आपातकालीन अलर्ट भेजना चाहते हैं? यह आपके आपातकालीन संपर्कों को आपके वर्तमान स्थान के साथ सूचित करेगा।",
      sendEmergencyAlert: "आपातकालीन अलर्ट भेजें",
      emergencyAlertSent: "आपातकालीन अलर्ट भेजा गया",
      emergencyContactsNotified: "आपके आपातकालीन संपर्कों को आपकी स्थिति के बारे में सूचित कर दिया गया है।",
      
      // Offline storage
      offlineDataSaved: "ऑफलाइन डेटा सहेजा गया",
      offlineDataSavedDescription: "आवश्यक स्वास्थ्य जानकारी ऑफलाइन उपयोग के लिए सहेज ली गई है।",
      offlineDataError: "ऑफलाइन डेटा सहेजने में त्रुटि",
      offlineDataErrorDescription: "ऑफलाइन उपयोग के लिए डेटा सहेजने में समस्या हुई। कृपया पुनः प्रयास करें।"
    }
  },
  {
    code: "bn",
    name: "বাংলা",
    translations: {
      // Basic translations for Bengali
      home: "হোম",
      healthArticles: "স্বাস্থ্য নিবন্ধ",
      symptomChecker: "লক্ষণ পরীক্ষক",
      dietPlans: "খাদ্য পরিকল্পনা",
      hospitalFinder: "হাসপাতাল খুঁজুন",
      governmentSchemes: "সরকারি প্রকল্প",
      medicationReminders: "ওষুধ রিমাইন্ডার",
      offlineMessage: "আপনি বর্তমানে অফলাইনে আছেন। কিছু বৈশিষ্ট্য সীমিত হতে পারে।"
    }
  },
  {
    code: "te",
    name: "తెలుగు",
    translations: {
      // Basic translations for Telugu
      home: "హోమ్",
      healthArticles: "ఆరోగ్య వ్యాసాలు",
      symptomChecker: "లక్షణాల తనిఖీ",
      dietPlans: "ఆహార ప్రణాళికలు",
      hospitalFinder: "ఆసుపత్రి కనుగొనేవారు",
      governmentSchemes: "ప్రభుత్వ పథకాలు",
      medicationReminders: "మందుల రిమైండర్లు",
      offlineMessage: "మీరు ప్రస్తుతం ఆఫ్‌లైన్‌లో ఉన్నారు. కొన్ని ఫీచర్లు పరిమితం కావచ్చు."
    }
  },
  {
    code: "ta",
    name: "தமிழ்",
    translations: {
      // Basic translations for Tamil
      home: "முகப்பு",
      healthArticles: "ஆரோக்கிய கட்டுரைகள்",
      symptomChecker: "அறிகுறி சரிபார்ப்பான்",
      dietPlans: "உணவு திட்டங்கள்",
      hospitalFinder: "மருத்துவமனை தேடி",
      governmentSchemes: "அரசு திட்டங்கள்",
      medicationReminders: "மருந்து நினைவூட்டல்கள்",
      offlineMessage: "நீங்கள் தற்போது ஆஃப்லைனில் இருக்கிறீர்கள். சில அம்சங்கள் வரம்புக்கு உட்பட்டவை."
    }
  }
];
