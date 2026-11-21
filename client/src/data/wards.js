export const MUNICIPAL_WARDS = [
  "Ward 01 - General Central",
  "Ward 02 - Jayanagar",
  "Ward 04 - Basavanagudi",
  "Ward 08 - Indiranagar",
  "Ward 10 - Rajajinagar",
  "Ward 12 - Malleshwaram",
  "Ward 15 - Koramangala",
  "Ward 18 - BTM Layout",
  "Ward 20 - Whitefield",
  "Ward 24 - HSR Layout",
  "Ward 32 - Hebbal",
  "Ward 45 - Yelahanka"
];

export const TEST_PRESETS = [
  {
    id: "test-elec",
    label: "Live Wire near School",
    category: "Electricity",
    severity: "CRITICAL",
    ward: "Ward 12 - Malleshwaram",
    location: "4th Cross, Opposite Primary School Gate",
    text: "There is an exposed live electric wire hanging near the primary school gate on 4th cross. Sparks were seen this morning when it rained.",
    photoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "test-pothole",
    label: "Large Pothole / Accidents",
    category: "Roads",
    severity: "HIGH",
    ward: "Ward 08 - Indiranagar",
    location: "100 Feet Road, Near Metro Pillar 42",
    text: "Large dangerous pothole right in the middle of 100 Feet Road. Two two-wheelers skidded and fell yesterday night.",
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "test-waste-kannada",
    label: "Market Garbage (Kannada)",
    category: "Waste",
    severity: "MEDIUM",
    ward: "Ward 04 - Basavanagudi",
    location: "Gandhi Bazaar Market Road",
    text: "ಕಳೆದ ಮೂರು ದಿನಗಳಿಂದ ತರಕಾರಿ ಮಾರುಕಟ್ಟೆಯ ಬಳಿ ಕಸದ ರಾಶಿ ಬಿದ್ದಿದೆ ಮತ್ತು ದುರ್ವಾಸನೆ ಬೀರುತ್ತಿದೆ. ನೊಣಗಳ ಕಾಟ ಹೆಚ್ಚಾಗಿದೆ.",
    photoUrl: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "test-water",
    label: "Burst Water Pipeline",
    category: "Water",
    severity: "HIGH",
    ward: "Ward 15 - Koramangala",
    location: "7th Main, 3rd Block",
    text: "Main drinking water pipeline has ruptured on 7th Main. Potable water is flooding the street for the past 6 hours.",
    photoUrl: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "test-tree",
    label: "Fallen Tree Blocking Road",
    category: "Trees",
    severity: "HIGH",
    ward: "Ward 02 - Jayanagar",
    location: "Hospital Road, Opposite Bus Stop",
    text: "Heavy storm brought down a massive gulmohar tree branch completely blocking vehicle movement towards the government hospital.",
    photoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "test-drain",
    label: "Choked Drain / Flooding",
    category: "Drainage",
    severity: "HIGH",
    ward: "Ward 20 - Whitefield",
    location: "Silver Springs Layout, 2nd Cross",
    text: "Stormwater drain is completely choked with plastic and silt. Rainwater entered 3 basement garages.",
    photoUrl: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "test-light-low",
    label: "Streetlight Blinking (Low)",
    category: "Electricity",
    severity: "LOW",
    ward: "Ward 18 - BTM Layout",
    location: "5th A Main, BTM 2nd Stage",
    text: "Single LED street light blinking intermittently outside house #45. Night visibility is slightly reduced.",
    photoUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80"
  }
];
