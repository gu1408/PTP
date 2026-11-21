import { processComplaintWithAI, classifyLocally } from './aiService.js';
import { db } from './db.js';
import { detectDuplicate } from './duplicateService.js';

console.log('====================================================');
console.log('   CIVICLENS AUTOMATED COMPREHENSIVE TEST SUITE   ');
console.log('====================================================\n');

const testCases = [
  {
    name: '1. Exposed electrical wire near children / school',
    text: 'Exposed live electrical wire hanging loose near kindergarten entrance with sparks.',
    location: '4th Cross, Malleshwaram',
    expectedCategory: 'Electricity',
    expectedSeverity: 'CRITICAL',
    expectedDepartment: 'Electrical Department'
  },
  {
    name: '2. Large pothole causing accidents',
    text: 'Large deep crater pothole on arterial road has caused multiple two-wheelers to crash.',
    location: '100ft Ring Road, Indiranagar',
    expectedCategory: 'Roads',
    expectedSeverity: 'HIGH',
    expectedDepartment: 'Road Maintenance Department'
  },
  {
    name: '3. Overflowing garbage near a market',
    text: 'Massive pile of rotting uncollected municipal garbage near vegetable market producing awful stench and flies.',
    location: 'Gandhi Bazaar Circle',
    expectedCategory: 'Waste',
    expectedSeverity: 'MEDIUM',
    expectedDepartment: 'Solid Waste Management Department'
  },
  {
    name: '4. Water leakage on a main road',
    text: 'Drinking water pipeline ruptured on 80ft main road flooding clean water continuously.',
    location: '80ft Road, Koramangala',
    expectedCategory: 'Water',
    expectedSeverity: 'HIGH',
    expectedDepartment: 'Water Supply Department'
  },
  {
    name: '5. Fallen tree blocking a road',
    text: 'Huge storm fallen tree branch completely blocking arterial vehicular transit to hospital.',
    location: 'Hospital Approach Road, Jayanagar',
    expectedCategory: 'Trees',
    expectedSeverity: 'HIGH',
    expectedDepartment: 'Parks and Horticulture Department'
  },
  {
    name: '6. Blocked drainage causing flooding',
    text: 'Stormwater drain severely blocked with silt, monsoon rainwater flooding basement of houses.',
    location: 'Silver Springs, Whitefield',
    expectedCategory: 'Drainage',
    expectedSeverity: 'HIGH',
    expectedDepartment: 'Stormwater Drainage Department'
  },
  {
    name: '7. Regional Language Complaint (Kannada)',
    text: 'ಮಾರುಕಟ್ಟೆ ಬಳಿ ಕಸದ ರಾಶಿ ಬಿದ್ದಿದೆ ಮತ್ತು ದುರ್ವಾಸನೆ ಬೀರುತ್ತಿದೆ.',
    location: 'Basavanagudi Market',
    expectedCategory: 'Waste',
    expectedDepartment: 'Solid Waste Management Department'
  }
];

let passed = 0;
let total = testCases.length;

for (const tc of testCases) {
  const result = classifyLocally(tc.text, tc.location);
  console.log(`[TEST] ${tc.name}`);
  console.log(`  -> Input: "${tc.text}"`);
  console.log(`  -> Detected Category: ${result.category} (Expected: ${tc.expectedCategory})`);
  console.log(`  -> Detected Severity: ${result.severity} ${tc.expectedSeverity ? `(Expected: ${tc.expectedSeverity})` : ''}`);
  console.log(`  -> Assigned Dept: ${result.department} (Expected: ${tc.expectedDepartment})`);
  console.log(`  -> Reason: "${result.reason}"`);
  console.log(`  -> Detected Language: ${result.detected_language}`);
  console.log(`  -> Priority Score: ${result.priority_score}/100 | AI Confidence: ${result.confidence}`);

  const catMatch = result.category === tc.expectedCategory;
  const deptMatch = result.department === tc.expectedDepartment;
  const sevMatch = !tc.expectedSeverity || result.severity === tc.expectedSeverity;

  if (catMatch && deptMatch && sevMatch) {
    console.log('  ✅ PASSED\n');
    passed++;
  } else {
    console.error('  ❌ MISMATCH\n');
  }
}

console.log('--- TESTING DUPLICATE DETECTION ---');
const existingTickets = [
  {
    id: 'TKT-1002',
    category: 'Roads',
    status: 'Pending',
    summary: 'Large dangerous pothole right in the middle of 100 Feet Road',
    complaint: {
      originalText: 'Large dangerous pothole right in the middle of 100 Feet Road',
      ward: 'Ward 08 - Indiranagar',
      location: '100 Feet Road'
    }
  }
];

const dupCheck = detectDuplicate(
  'Another huge pothole on 100 Feet road near metro, vehicles skidding',
  'Ward 08 - Indiranagar',
  '100 Feet Road',
  existingTickets
);

console.log('Duplicate Check Result:', dupCheck);
if (dupCheck.isDuplicate) {
  console.log('  ✅ Smart Duplicate Detection PASSED\n');
  passed++;
} else {
  console.error('  ❌ Smart Duplicate Detection FAILED\n');
}
total++;

console.log('--- TESTING PRIORITY SORTING LOGIC ---');
const sortedTickets = db.getAllTickets();
console.log(`Retrieved ${sortedTickets.length} tickets from database.`);
const severitiesOrder = sortedTickets.map(t => `${t.id}: ${t.severity} (${t.status})`);
console.log('Priority Order:');
severitiesOrder.slice(0, 5).forEach((item, i) => console.log(`  ${i+1}. ${item}`));

const isCriticalFirst = sortedTickets[0].severity === 'CRITICAL';
if (isCriticalFirst) {
  console.log('  ✅ CRITICAL tickets prioritized at the top of queue! PASSED\n');
  passed++;
} else {
  console.error('  ❌ Sorting MISMATCH\n');
}
total++;

console.log('====================================================');
console.log(`RESULT: ${passed}/${total} TESTS PASSED (${Math.round((passed/total)*100)}%)`);
console.log('====================================================');

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
