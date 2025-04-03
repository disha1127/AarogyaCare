import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csvtojson from 'csvtojson';

// In ES modules, __dirname is not directly available, so we recreate it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, '../client/src/data/hospitals.ts');

async function processHospitalData() {
  try {
    // Base coordinates for random distribution around state/region centers
    const stateCoordinates = {
      "Andhra Pradesh": { lat: 15.9129, lng: 79.7400 },
      "Arunachal Pradesh": { lat: 28.2180, lng: 94.7278 },
      "Assam": { lat: 26.2006, lng: 92.9376 },
      "Bihar": { lat: 25.0961, lng: 85.3131 },
      "Chhattisgarh": { lat: 21.2787, lng: 81.8661 },
      "Goa": { lat: 15.2993, lng: 74.1240 },
      "Gujarat": { lat: 22.2587, lng: 71.1924 },
      "Haryana": { lat: 29.0588, lng: 76.0856 },
      "Himachal Pradesh": { lat: 31.1048, lng: 77.1734 },
      "Jharkhand": { lat: 23.6102, lng: 85.2799 },
      "Karnataka": { lat: 15.3173, lng: 75.7139 },
      "Kerala": { lat: 10.8505, lng: 76.2711 },
      "Madhya Pradesh": { lat: 22.9734, lng: 78.6569 },
      "Maharashtra": { lat: 19.7515, lng: 75.7139 },
      "Manipur": { lat: 24.6637, lng: 93.9063 },
      "Meghalaya": { lat: 25.4670, lng: 91.3662 },
      "Mizoram": { lat: 23.1645, lng: 92.9376 },
      "Nagaland": { lat: 26.1584, lng: 94.5624 },
      "Odisha": { lat: 20.9517, lng: 85.0985 },
      "Punjab": { lat: 31.1471, lng: 75.3412 },
      "Rajasthan": { lat: 27.0238, lng: 74.2179 },
      "Sikkim": { lat: 27.5330, lng: 88.5122 },
      "Tamil Nadu": { lat: 11.1271, lng: 78.6569 },
      "Telangana": { lat: 18.1124, lng: 79.0193 },
      "Tripura": { lat: 23.9408, lng: 91.9882 },
      "Uttar Pradesh": { lat: 26.8467, lng: 80.9462 },
      "Uttarakhand": { lat: 30.0668, lng: 79.0193 },
      "West Bengal": { lat: 22.9868, lng: 87.8550 },
      "Delhi": { lat: 28.7041, lng: 77.1025 }
    };

    const createRandomCoordinatesForState = (state) => {
      const baseCoords = stateCoordinates[state] || { lat: 20.5937, lng: 78.9629 }; // Default to center of India
      const latOffset = (Math.random() - 0.5) * 2; // ±1 degree
      const lngOffset = (Math.random() - 0.5) * 2; // ±1 degree
      return {
        latitude: (baseCoords.lat + latOffset).toFixed(5),
        longitude: (baseCoords.lng + lngOffset).toFixed(5)
      };
    };

    // Hospital types and services based on different categories
    const hospitalTypes = {
      "government": ["Government", "Public", "District Hospital"],
      "military": ["Military", "Armed Forces", "Defence"],
      "railway": ["Railway"],
      "esic": ["ESIC", "Employees State Insurance"],
      "ayush": ["AYUSH", "Ayurvedic", "Unani", "Siddha", "Homeopathic"],
      "private": ["Private", "Corporate", "Trust"]
    };

    const services = [
      ["Emergency", "General Medicine", "Surgery", "Pediatrics", "Obstetrics"],
      ["Primary Care", "Maternal Health", "Child Health", "Family Planning"],
      ["Primary Care", "Immunization", "Basic Medicine"],
      ["Tertiary Care", "Specialized Surgery", "Oncology", "Neurology", "Cardiology"],
      ["Emergency", "Surgery", "Cardiac Care", "Dialysis"],
      ["Basic Healthcare", "Vaccinations", "Health Education", "First Aid"]
    ];

    const specialties = [
      ["General Medicine", "Orthopedics"],
      ["Family Medicine"],
      ["General Practice"],
      ["Neurosurgery", "Cardiology", "Oncology", "Orthopedics"],
      ["Cardiology", "Neurology", "Gastroenterology"],
      ["General Surgery", "Orthopedics", "Pediatrics", "Gynecology"],
      ["Cardiology", "Nephrology", "Orthopedics"],
      ["Neurology", "Cardiology", "Nephrology", "Oncology"],
      ["Obstetrics", "Pediatrics"],
      ["Tribal Medicine", "Infectious Diseases"],
      ["Mobile Healthcare"]
    ];

    // Paths to CSV files
    const csvFiles = [
      '../temp_extracted/AYUSHHospitals.csv',
      '../temp_extracted/Hospitals and Beds maintained by Ministry of Defence.csv',
      '../temp_extracted/Hospitals and beds maintained by Railways.csv',
      '../temp_extracted/Employees State Insurance Corporation .csv',
      '../temp_extracted/Hospitals_and_Beds_statewise.csv',
      '../temp_extracted/Number of Government Hospitals and Beds in Rural and Urban Areas .csv'
    ];

    // Process hospital data from multiple sources
    let hospitalId = 1;
    const hospitals = [];

    // Function to determine hospital type
    const getHospitalType = (source, name = '') => {
      if (source.includes('Defence') || source.includes('Military')) return 'Military';
      if (source.includes('Railways')) return 'Railway';
      if (source.includes('ESIC')) return 'ESIC';
      if (source.includes('AYUSH')) return 'AYUSH';
      if (name.includes('Private') || name.includes('Corporate')) return 'Private';
      return 'Government';
    };

    // Function to generate a random hospital name based on type and location
    const generateHospitalName = (type, state, location = '') => {
      const prefixes = {
        'Government': ['District', 'General', 'Civil', 'Community', 'State', 'Rural'],
        'Military': ['Military', 'Army', 'Naval', 'Air Force', 'Defence'],
        'Railway': ['Railway', 'Central Railway', 'Northern Railway', 'Southern Railway'],
        'ESIC': ['ESIC', 'ESI', 'Employees State Insurance'],
        'AYUSH': ['AYUSH', 'Ayurvedic', 'Unani', 'Siddha', 'Homeopathic', 'Yoga'],
        'Private': ['City', 'Apollo', 'Fortis', 'Max', 'Columbia Asia', 'Medanta']
      };
      
      const suffixes = ['Hospital', 'Medical Center', 'Health Center', 'Medical College & Hospital', 'Community Health Center'];
      
      const prefix = prefixes[type] ? prefixes[type][Math.floor(Math.random() * prefixes[type].length)] : '';
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      const locationName = location || state;
      
      return `${prefix} ${suffix}, ${locationName}`;
    };

    // Generate random email and phone based on hospital name
    const generateContactInfo = (name) => {
      const sanitizedName = name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(' ')
        .slice(0, 2)
        .join('.');
      
      const randomDigits = Math.floor(Math.random() * 9000) + 1000;
      const email = `info@${sanitizedName.replace(/\s+/g, '')}.org`;
      
      // Generate realistic Indian phone numbers
      const stateCode = Math.floor(Math.random() * 9) + 1; // 1-9
      const areaCode = Math.floor(Math.random() * 900) + 100; // 100-999
      const subscriberNumber = Math.floor(Math.random() * 9000000) + 1000000; // 7 digits
      const phone = `0${stateCode}${areaCode}-${subscriberNumber}`.substring(0, 12);
      
      return { email, phone };
    };

    // Generate random zip code for Indian states
    const generateZipCode = () => {
      const firstDigit = Math.floor(Math.random() * 8) + 1; // 1-8
      const remainingDigits = Math.floor(Math.random() * 90000) + 10000; // 10000-99999
      return `${firstDigit}${remainingDigits}`;
    };

    // Process each CSV file
    for (const file of csvFiles) {
      try {
        const filePath = path.join(__dirname, file);
        if (!fs.existsSync(filePath)) {
          console.log(`File not found: ${filePath}`);
          continue;
        }
        
        const source = path.basename(file, '.csv');
        const jsonArray = await csvtojson().fromFile(filePath);
        
        // Process each row in the CSV
        for (const row of jsonArray) {
          // Skip header or empty rows
          if (!row || Object.keys(row).length === 0) continue;
          
          // Extract state/location information
          let state = '';
          let city = '';
          let hospitalCount = 0;
          
          // Different files have different formats, so try different column names
          Object.keys(row).forEach(key => {
            if (key.includes('State') || key.includes('-2')) {
              state = row[key];
            }
            if (key.includes('Govt.') || key.includes('-3') || key.includes('Number')) {
              // Try to parse hospital count if available
              const count = parseInt(row[key], 10);
              if (!isNaN(count)) hospitalCount = count;
            }
          });
          
          if (!state || state === '-2') continue;
          
          // Determine hospital type
          const hospitalType = getHospitalType(source);
          
          // Generate hospitals for this state based on count
          // Limit to a reasonable number for demonstration
          const numHospitalsToGenerate = Math.min(hospitalCount || 2, 5);
          
          for (let i = 0; i < numHospitalsToGenerate; i++) {
            // Generate random city within state if not provided
            if (!city) {
              const cities = {
                "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore"],
                "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang"],
                "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat"],
                "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur"],
                "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba"],
                "Goa": ["Panaji", "Margao", "Vasco da Gama", "Ponda"],
                "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
                "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala"],
                "Himachal Pradesh": ["Shimla", "Mandi", "Dharamshala", "Solan"],
                "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
                "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Mangaluru"],
                "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
                "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior"],
                "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
                "Manipur": ["Imphal", "Thoubal", "Churachandpur", "Ukhrul"],
                "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh"],
                "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Kolasib"],
                "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Wokha"],
                "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur"],
                "Punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar"],
                "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
                "Sikkim": ["Gangtok", "Namchi", "Mangan", "Gyalshing"],
                "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
                "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
                "Tripura": ["Agartala", "Dharmanagar", "Udaipur", "Kailashahar"],
                "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi"],
                "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani"],
                "West Bengal": ["Kolkata", "Asansol", "Siliguri", "Durgapur"],
                "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi"]
              };
              
              const stateCities = cities[state] || ["Unknown City"];
              city = stateCities[Math.floor(Math.random() * stateCities.length)];
            }
            
            // Generate coordinates for this location
            const coords = createRandomCoordinatesForState(state);
            
            // Generate a hospital name
            const name = generateHospitalName(hospitalType, state, city);
            
            // Generate contact information
            const { email, phone } = generateContactInfo(name);
            
            // Generate random services and specialties
            const serviceSet = services[Math.floor(Math.random() * services.length)];
            const specialtySet = specialties[Math.floor(Math.random() * specialties.length)];
            const hasEmergencyServices = serviceSet.includes("Emergency") || Math.random() > 0.6;
            
            // Create hospital object
            hospitals.push({
              id: hospitalId++,
              name,
              address: `${Math.floor(Math.random() * 500) + 1}, ${['Main Road', 'Hospital Road', 'Medical Center Road', 'Healthcare Avenue'][Math.floor(Math.random() * 4)]}`,
              city,
              state,
              zipCode: generateZipCode(),
              phone,
              email,
              latitude: coords.latitude,
              longitude: coords.longitude,
              type: hospitalType,
              services: serviceSet,
              emergencyServices: hasEmergencyServices,
              specialties: specialtySet
            });
          }
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }

    // Write hospital data to output file
    const fileContent = `import { Hospital } from "@shared/schema";

export const hospitals: Hospital[] = ${JSON.stringify(hospitals, null, 2)};
`;

    fs.writeFileSync(outputPath, fileContent);
    console.log(`Successfully wrote ${hospitals.length} hospitals to ${outputPath}`);
  } catch (error) {
    console.error('Error processing hospital data:', error);
  }
}

processHospitalData();