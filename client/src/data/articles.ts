import { Article } from "@shared/schema";

export const articles: Article[] = [
  {
    id: 1,
    title: "Importance of Clean Water in Rural Areas",
    content: "Clean water is essential for human health. Many waterborne diseases such as cholera, diarrhea, dysentery, hepatitis A, typhoid, and polio can be prevented through access to clean water. In rural areas, where water sources may be shared with animals or susceptible to agricultural runoff, extra precautions should be taken.\n\nBoiling water for at least one minute is the most reliable method to kill harmful organisms. Alternatively, water filters designed to remove pathogens or water purification tablets can be used. Rainwater harvesting can provide a cleaner alternative when properly collected and stored.\n\nLocal governments and NGOs often provide resources for community water purification systems or training on how to treat water at home. Regular testing of water sources is advisable where possible.\n\nInvesting in clean water solutions is one of the most effective ways to improve public health in rural communities.",
    summary: "Learn about the critical impact of clean water on public health in rural communities and ways to ensure water safety.",
    source: "WHO",
    imageUrl: "https://images.unsplash.com/photo-1559941727-6fb446e7e8ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    category: "Water Safety",
    publishedAt: new Date("2023-05-10"),
    isOfflineAvailable: true
  },
  {
    id: 2,
    title: "Preventing Seasonal Diseases During Monsoon",
    content: "The monsoon season brings relief from the summer heat but also creates favorable conditions for disease-causing pathogens. Vector-borne diseases like malaria and dengue spike during this season as stagnant water provides breeding grounds for mosquitoes.\n\nTo protect yourself and your family, ensure there is no stagnant water around your home. Use mosquito nets or repellents, especially at dawn and dusk. Keep food covered to prevent contamination from flies. Maintain good personal hygiene and wash hands frequently.\n\nCommon monsoon illnesses include viral fevers, respiratory infections, and waterborne diseases. If you develop symptoms like fever, body aches, respiratory issues, or diarrhea, seek medical attention promptly.\n\nKeeping your surroundings clean and maintaining personal hygiene are your best defenses against monsoon-related illnesses.",
    summary: "Practical tips to safeguard yourself and your family from common monsoon-related illnesses like dengue and malaria.",
    source: "Health Tips",
    imageUrl: "https://images.unsplash.com/photo-1580281657702-257584239a42?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    category: "Seasonal Health",
    publishedAt: new Date("2023-06-05"),
    isOfflineAvailable: true
  },
  {
    id: 3,
    title: "Affordable Nutritious Foods for Rural Families",
    content: "Nutrition plays a vital role in maintaining good health. In rural areas, focusing on locally available, seasonal foods can provide essential nutrients without straining the household budget.\n\nLegumes (like lentils, chickpeas, and beans) are excellent sources of protein and fiber. Green leafy vegetables provide iron, calcium, and vitamins. Seasonal fruits are rich in vitamins and antioxidants. Whole grains like millets (ragi, jowar, bajra) are nutritionally superior to refined grains and often more affordable.\n\nHome gardening, even in small spaces, can supplement dietary needs. Mixed farming practices that include a variety of crops and, where possible, some animal products like milk or eggs, can ensure a more balanced diet.\n\nCommunity-based approaches, such as grain banks and seed exchanges, can also help improve food security and nutrition in rural areas.",
    summary: "Discover budget-friendly nutritious foods that are locally available and can improve family health outcomes.",
    source: "Nutrition",
    imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    category: "Nutrition",
    publishedAt: new Date("2023-06-18"),
    isOfflineAvailable: true
  },
  {
    id: 4,
    title: "Managing Diabetes in Rural Settings",
    content: "Diabetes management in rural areas comes with unique challenges, but effective control is possible with the right approach. Regular monitoring of blood sugar levels is essential. While glucometers may not be available to everyone, regular check-ups at the nearest health center can help track your condition.\n\nDietary management is crucial. Traditional millet-based foods are excellent for diabetics due to their low glycemic index. Limit polished rice and opt for brown rice or hand-pounded rice instead. Include plenty of vegetables in your diet and moderate your fruit intake, focusing on low-sugar options.\n\nPhysical activity is beneficial. Farming activities, walking, and traditional games all count as exercise. Try to be active for at least 30 minutes daily. Stress management through yoga or meditation can also help control blood sugar levels.\n\nAdhere to prescribed medications and don't discontinue them without medical advice. Community health workers can provide support with medication reminders and basic monitoring.",
    summary: "Learn practical strategies for managing diabetes effectively in rural settings with limited resources.",
    source: "Diabetes Care",
    imageUrl: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    category: "Chronic Diseases",
    publishedAt: new Date("2023-07-12"),
    isOfflineAvailable: true
  },
  {
    id: 5,
    title: "Maternal Health Care: Essential Practices for Rural Women",
    content: "Proper maternal healthcare is crucial for both mother and child, especially in rural areas where access to medical facilities might be limited. Early registration of pregnancy (within the first trimester) with a healthcare provider is essential. Attend all antenatal check-ups, even if you feel healthy.\n\nEnsure adequate nutrition during pregnancy. Include iron-rich foods like green leafy vegetables, jaggery, and seasonal fruits in your diet. Iron and folic acid supplements provided by health workers are important to prevent anemia.\n\nRecognize warning signs that require immediate medical attention: severe headache, blurred vision, swelling of face and hands, reduced fetal movement, bleeding, or fluid leakage. Plan ahead for your delivery, including transportation to a health facility and identifying potential blood donors.\n\nInstitutional deliveries are safest, but if home delivery is unavoidable, ensure a trained birth attendant is present. After delivery, continue healthcare visits for both mother and baby, and initiate breastfeeding within the first hour.",
    summary: "Important healthcare practices for pregnant women in rural areas to ensure safe pregnancy and childbirth.",
    source: "Maternal Health",
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d99b74?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    category: "Women's Health",
    publishedAt: new Date("2023-07-28"),
    isOfflineAvailable: false
  },
  {
    id: 6,
    title: "First Aid Skills Every Rural Household Should Know",
    content: "In rural areas where medical help may be distant, basic first aid knowledge can be lifesaving. For cuts and wounds, clean the area with clean water and mild soap, apply pressure to stop bleeding, and cover with a clean cloth. Keep the wound clean until it heals.\n\nFor burns, run cool (not cold) water over the area for 10-15 minutes. Don't apply ice, butter, or toothpaste. Cover with a clean, dry cloth and seek medical help for anything larger than a small area.\n\nFor fractures or suspected broken bones, immobilize the area without attempting to straighten the limb. Use whatever is available (sticks, rolled newspaper) to create a splint, and seek medical help immediately.\n\nKnow how to respond to choking: for adults and children, perform abdominal thrusts (Heimlich maneuver). For infants, give back blows and chest compressions.\n\nFor snake bites, keep the person calm and immobile, remove tight items like jewelry, position the bitten area below heart level if possible, and transport to medical help immediately. Don't cut the wound, apply a tourniquet, or attempt to suck out venom.\n\nCreate a basic first aid kit with bandages, antiseptic, scissors, and any essential medications your family might need.",
    summary: "Essential first aid techniques that can be lifesaving in emergencies when medical help is not immediately available.",
    source: "Emergency Care",
    imageUrl: "https://images.unsplash.com/photo-1597077864640-9482fc0a0063?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    category: "Emergency Care",
    publishedAt: new Date("2023-08-14"),
    isOfflineAvailable: true
  },
  {
    id: 7,
    title: "Improving Child Nutrition in the First 1000 Days",
    content: "The first 1000 days of life—from conception to a child's second birthday—represent a critical window for nutrition and development. Good nutrition during this period lays the foundation for a child's physical growth, brain development, and immune system function.\n\nFor pregnant women, a balanced diet rich in proteins, iron, calcium, and vitamins is essential. Continue nutritious eating while breastfeeding, as your diet affects breast milk quality.\n\nExclusive breastfeeding for the first six months provides all the nutrition a baby needs and offers crucial immunity benefits. After six months, introduce diverse complementary foods while continuing breastfeeding until at least age two.\n\nAs complementary feeding begins, ensure diversity in the child's diet. Include foods from all food groups: grains, pulses, dairy, fruits, vegetables, and, where available, small amounts of animal-source foods. Home-prepared foods are preferable to commercial baby foods. Feed actively and responsively, without force-feeding.\n\nRegular growth monitoring helps track a child's development. Community health workers can provide guidance on addressing growth faltering if it occurs.",
    summary: "Learn about the crucial importance of proper nutrition during the first 1000 days of a child's life for optimal development.",
    source: "Child Health",
    imageUrl: "https://images.unsplash.com/photo-1555252333-f7e2cb0654f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    category: "Child Health",
    publishedAt: new Date("2023-08-30"),
    isOfflineAvailable: false
  },
  {
    id: 8,
    title: "Managing Common Eye Problems in Rural Areas",
    content: "Eye problems are common in rural areas and can often be prevented or managed with simple measures. Protecting eyes from dust, bright sunlight, and agricultural chemicals is essential. Wear appropriate eye protection when working in dusty conditions or with chemicals.\n\nRegular handwashing helps prevent eye infections that spread through hand-to-eye contact. Conjunctivitis (red eye) is common and often contagious. If affected, clean the eye gently with clean water and avoid touching or rubbing. Keep personal items like towels separate to prevent spreading.\n\nCataract, a clouding of the eye lens causing blurry vision, is common among older adults. While it requires surgical intervention, early detection leads to better outcomes. Regular eye check-ups, especially for those over 50, are recommended at eye camps or rural health centers.\n\nVitamin A deficiency can lead to night blindness and more severe eye problems. Ensure adequate intake of green leafy vegetables, yellow fruits, dairy products, and eggs. Vitamin A supplements may be available through health programs.\n\nFor any eye injury, do not rub the eye. If something is stuck, don't try to remove it. Rinse with clean water and seek medical help. For chemical splashes, rinse continuously with clean water for 15-20 minutes and get medical attention immediately.",
    summary: "Practical advice on preventing and managing common eye problems in rural settings with limited access to specialized care.",
    source: "Eye Care",
    imageUrl: "https://images.unsplash.com/photo-1511551203524-9a24350a5771?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    category: "Eye Health",
    publishedAt: new Date("2023-09-15"),
    isOfflineAvailable: false
  },
  {
    id: 9,
    title: "Understanding Mental Health in Rural Communities",
    content: "Mental health issues exist in all communities, including rural ones, though they're often less recognized and discussed. Common mental health challenges include depression, anxiety, substance abuse, and in some cases, more severe conditions like schizophrenia or bipolar disorder.\n\nRecognize warning signs such as persistent sadness, excessive fears, severe mood changes, significant changes in eating or sleeping patterns, and thoughts of self-harm. These require attention and support.\n\nCommunity support plays a vital role. Family and community members can provide understanding, reduce isolation, and encourage seeking help. Religious leaders, village elders, and community health workers can be sources of support.\n\nStress management techniques like deep breathing, meditation, physical activity, and maintaining social connections are beneficial for everyone. Traditional practices like yoga have proven mental health benefits.\n\nReducing stigma through education and open conversations is essential. Mental health conditions are medical issues, not personal weaknesses or failings.\n\nWhile specialized mental health services may be limited in rural areas, primary healthcare workers are increasingly trained in basic mental health support. Severe conditions require medical attention, and in many regions, telemedicine options are becoming available for mental healthcare.",
    summary: "Insights into recognizing, addressing, and supporting mental health issues in rural communities where resources may be limited.",
    source: "Mental Health",
    imageUrl: "https://images.unsplash.com/photo-1474383645393-1a1b4ee6c952?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    category: "Mental Health",
    publishedAt: new Date("2023-10-02"),
    isOfflineAvailable: false
  },
  {
    id: 10,
    title: "Traditional Medicinal Plants with Proven Benefits",
    content: "Many traditional medicinal plants used in rural communities have scientifically validated health benefits. Tulsi (Holy Basil) has antimicrobial, anti-inflammatory, and adaptogenic properties. It's beneficial for respiratory conditions, stress, and boosting immunity. Consume as tea or chew fresh leaves.\n\nTurmeric contains curcumin, which has powerful anti-inflammatory and antioxidant properties. It's helpful for digestive issues, arthritis pain, and wound healing. Incorporate in cooking or consume with milk and black pepper to enhance absorption.\n\nNeem has antibacterial, antifungal, and insecticidal properties. It's used for skin conditions, as a natural pesticide, and for dental health. Use neem twigs for teeth cleaning or neem leaf paste for skin applications.\n\nAmla (Indian Gooseberry) is exceptionally rich in vitamin C and antioxidants. It supports immunity, digestion, and hair health. Consume fresh, as juice, or in preserved forms.\n\nAshwagandha is adaptogenic, helping the body manage stress. It also supports the nervous system and may improve energy levels. Available as powder to be taken with milk or water.\n\nWhile these plants offer benefits, they should complement rather than replace medical treatment for serious conditions. Proper identification is essential, as some plants have toxic look-alikes.",
    summary: "Discover scientifically supported benefits of traditional medicinal plants commonly found in rural areas and learn how to use them safely.",
    source: "Traditional Medicine",
    imageUrl: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    category: "Traditional Medicine",
    publishedAt: new Date("2023-10-20"),
    isOfflineAvailable: true
  }
];
