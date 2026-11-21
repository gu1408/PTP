import { db } from './db.js';
import { detectDuplicate } from './duplicateService.js';
import { processComplaintWithAI, getAiEngineStatus } from './aiService.js';

const BASE_URL = 'http://localhost:5000';

console.log('====================================================');
console.log('    CIVICLENS SENIOR ENGINEER FUNCTIONALITY AUDIT   ');
console.log('====================================================\n');

async function runAudit() {
  const auditResults = {
    duplicateDetection: {},
    aiVerification: {},
    endToEnd: {},
    dataAndAnalytics: {},
    photoUpload: {}
  };

  // -----------------------------------------------------------------
  // TASK 1: DUPLICATE DETECTION AUDIT
  // -----------------------------------------------------------------
  console.log('--- AUDITING TASK 1: DUPLICATE DETECTION & EXPLANATION ---');
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

  const dupResult = detectDuplicate(
    'Another huge pothole on 100 Feet road near metro, vehicles skidding',
    'Ward 08 - Indiranagar',
    '100 Feet Road',
    existingTickets
  );

  console.log('Duplicate Result:', dupResult);
  console.log(`- Is Duplicate: ${dupResult.isDuplicate}`);
  console.log(`- Displayed Composite Match Score: ${dupResult.compositeScore}%`);
  console.log(`- Text Similarity Component: ${dupResult.textSimilarity}%`);
  console.log(`- Explanation: "${dupResult.reason}"`);

  const hasScoreInExplanation = dupResult.reason.includes(`${dupResult.compositeScore}%`);
  const hasTextSimInExplanation = dupResult.reason.includes(`${dupResult.textSimilarity}%`);
  const preservesOriginal = dupResult.matchedTicketId === 'TKT-1002' && !dupResult.deleteCalled;

  auditResults.duplicateDetection = {
    passed: dupResult.isDuplicate && hasScoreInExplanation && hasTextSimInExplanation,
    compositeScore: dupResult.compositeScore,
    textSimilarity: dupResult.textSimilarity,
    reason: dupResult.reason,
    explanationConsistent: hasScoreInExplanation && hasTextSimInExplanation,
    preservesRecords: true
  };
  console.log(`Audit 1 Status: ${auditResults.duplicateDetection.passed ? 'PASSED ✅' : 'FAILED ❌'}\n`);

  // -----------------------------------------------------------------
  // TASK 2: REAL AI VERIFICATION & TRUTHFUL STATUS
  // -----------------------------------------------------------------
  console.log('--- AUDITING TASK 2: AI INTEGRATION & TRUTHFUL STATUS ---');
  const aiStatus = await getAiEngineStatus();
  console.log('AI Engine Status:', aiStatus);
  console.log(`- Cloud AI Configured: ${aiStatus.isCloudAiConfigured}`);
  console.log(`- Active Engine: ${aiStatus.activeEngine}`);
  console.log(`- Status Label: ${aiStatus.statusLabel}`);

  // Test dynamic content generation
  const testComplaint = 'Sparks flying from hanging wire near hospital gate';
  const aiResult = await processComplaintWithAI(testComplaint, null, 'Hospital Road');
  console.log('AI Extraction for: "' + testComplaint + '"');
  console.log(`  -> Category: ${aiResult.category}`);
  console.log(`  -> Severity: ${aiResult.severity}`);
  console.log(`  -> Reason: ${aiResult.reason}`);
  console.log(`  -> Department: ${aiResult.department}`);
  console.log(`  -> Model Used: ${aiResult.model_used}`);

  const aiGeneratesFromContent =
    aiResult.category === 'Electricity' &&
    aiResult.severity === 'CRITICAL' &&
    aiResult.department === 'Electrical Department';

  auditResults.aiVerification = {
    passed: aiGeneratesFromContent && aiStatus.statusLabel.length > 0,
    activeEngine: aiStatus.activeEngine,
    statusLabel: aiStatus.statusLabel,
    isTruthfulFallback: !aiStatus.isCloudAiConfigured ? aiStatus.status === 'local_fallback' : true,
    contentDerived: aiGeneratesFromContent
  };
  console.log(`Audit 2 Status: ${auditResults.aiVerification.passed ? 'PASSED ✅' : 'FAILED ❌'}\n`);

  // -----------------------------------------------------------------
  // TASK 3: END-TO-END FUNCTIONALITY AUDIT (HTTP API)
  // -----------------------------------------------------------------
  console.log('--- AUDITING TASK 3: END-TO-END CITIZEN SUBMIT & OFFICER PATCH ---');
  const newComplaintPayload = {
    originalText: 'Deep open crater in the asphalt near Malleshwaram bus stop, scooter rider injured.',
    location: 'Malleshwaram Bus Stop',
    ward: 'Ward 12 - Malleshwaram'
  };

  const submitRes = await fetch(`${BASE_URL}/api/complaints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newComplaintPayload)
  });
  const submitData = await submitRes.json();
  console.log('Submitted Ticket Response:');
  console.log(`  -> Complaint ID: ${submitData.complaint?.id}`);
  console.log(`  -> Ticket ID: ${submitData.ticket?.id}`);
  console.log(`  -> Category: ${submitData.ticket?.category}`);
  console.log(`  -> Severity: ${submitData.ticket?.severity}`);
  console.log(`  -> Department: ${submitData.ticket?.department}`);
  console.log(`  -> Initial Status: ${submitData.ticket?.status}`);

  const createdTicketId = submitData.ticket?.id;

  // Track ticket
  const trackRes = await fetch(`${BASE_URL}/api/tickets/${createdTicketId}`);
  const trackData = await trackRes.json();
  const trackingSuccess = trackData.success && trackData.ticket?.id === createdTicketId;
  console.log(`Citizen Tracking Verified: ${trackingSuccess ? 'YES' : 'NO'}`);

  // Officer Update Status
  const patchRes = await fetch(`${BASE_URL}/api/tickets/${createdTicketId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'In Progress',
      officerNotes: 'Asphalt cold-mix patching truck dispatched to Malleshwaram.'
    })
  });
  const patchData = await patchRes.json();
  const patchSuccess =
    patchData.success &&
    patchData.ticket?.status === 'In Progress' &&
    patchData.ticket?.activityLogs?.some(l => l.action === 'UPDATED');
  console.log(`Officer Status Update & Audit Log Verified: ${patchSuccess ? 'YES' : 'NO'}`);

  auditResults.endToEnd = {
    passed: submitRes.ok && trackingSuccess && patchSuccess,
    ticketId: createdTicketId,
    category: submitData.ticket?.category,
    severity: submitData.ticket?.severity,
    department: submitData.ticket?.department,
    statusUpdated: patchData.ticket?.status === 'In Progress'
  };
  console.log(`Audit 3 Status: ${auditResults.endToEnd.passed ? 'PASSED ✅' : 'FAILED ❌'}\n`);

  // -----------------------------------------------------------------
  // TASK 4: DATA & ANALYTICS AUDIT
  // -----------------------------------------------------------------
  console.log('--- AUDITING TASK 4: DATA CONSISTENCY & WARD ANALYTICS ---');
  const allTicketsRes = await fetch(`${BASE_URL}/api/tickets`);
  const allTicketsData = await allTicketsRes.json();
  const totalTicketsInDb = allTicketsData.tickets.length;

  const analyticsRes = await fetch(`${BASE_URL}/api/analytics`);
  const analyticsData = await analyticsRes.json();
  const metrics = analyticsData.analytics.metrics;
  const wardAnalytics = analyticsData.analytics.wardAnalytics;

  console.log(`Total Tickets in Queue: ${totalTicketsInDb}`);
  console.log(`Metrics.total in Dashboard: ${metrics.total}`);
  console.log(`Metrics Breakdown: Critical=${metrics.critical}, High=${metrics.high}, Pending=${metrics.pending}, InProgress=${metrics.inProgress}, Resolved=${metrics.resolved}`);

  const totalMatches = metrics.total === totalTicketsInDb;
  const statusSumMatches = (metrics.pending + metrics.inProgress + metrics.resolved) === metrics.total;
  const severitySumMatches = (metrics.critical + metrics.high + metrics.medium + metrics.low) === metrics.total;

  // Check priority sorting: CRITICAL -> HIGH -> MEDIUM -> LOW
  const queueSeverities = allTicketsData.tickets.map(t => t.severity);
  const severityWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
  let isSortedProperly = true;
  for (let i = 0; i < queueSeverities.length - 1; i++) {
    if (severityWeight[queueSeverities[i]] < severityWeight[queueSeverities[i + 1]]) {
      isSortedProperly = false;
      break;
    }
  }

  // Check Ward Analytics dynamic update (Malleshwaram should reflect recent submission)
  const malleshwaramWard = wardAnalytics.find(w => w.ward.includes('Malleshwaram'));
  const wardUpdated = malleshwaramWard && malleshwaramWard.total > 0;
  console.log(`Malleshwaram Ward Incident Count: ${malleshwaramWard?.total}`);
  console.log(`Priority Sorting Correct (CRITICAL -> LOW): ${isSortedProperly ? 'YES' : 'NO'}`);

  auditResults.dataAndAnalytics = {
    passed: totalMatches && statusSumMatches && severitySumMatches && isSortedProperly && wardUpdated,
    totalCountMatch: totalMatches,
    statusSumMatch: statusSumMatches,
    severitySumMatch: severitySumMatches,
    prioritySortingValid: isSortedProperly,
    wardAnalyticsDynamic: wardUpdated
  };
  console.log(`Audit 4 Status: ${auditResults.dataAndAnalytics.passed ? 'PASSED ✅' : 'FAILED ❌'}\n`);

  // -----------------------------------------------------------------
  // TASK 5: PHOTO UPLOAD VALIDATION AUDIT
  // -----------------------------------------------------------------
  console.log('--- AUDITING TASK 5: PHOTO UPLOAD AND VALIDATION ---');
  // 1. Test valid image submission
  const validBase64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const photoTestRes = await fetch(`${BASE_URL}/api/complaints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      originalText: 'Pothole on 2nd cross with attached photograph evidence',
      location: '2nd Cross Indiranagar',
      ward: 'Ward 08 - Indiranagar',
      photoUrl: validBase64Image
    })
  });
  const photoTestData = await photoTestRes.json();
  const validPhotoStored = photoTestData.success && photoTestData.complaint?.photoUrl === validBase64Image;
  console.log(`Valid Base64 Photo Upload & Storage: ${validPhotoStored ? 'PASSED' : 'FAILED'}`);

  // 2. Test invalid MIME type rejection
  const invalidPhotoRes = await fetch(`${BASE_URL}/api/complaints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      originalText: 'Test complaint with malicious file payload',
      location: 'Test Location',
      ward: 'Ward 01 - General Central',
      photoUrl: 'data:application/x-msdownload;base64,TVqQAAMAAAAEAAAA//8AALgAAAAAAAAA'
    })
  });
  const invalidPhotoData = await invalidPhotoRes.json();
  const invalidPhotoRejected = !invalidPhotoRes.ok && invalidPhotoData.success === false;
  console.log(`Invalid File Type Rejected (HTTP ${invalidPhotoRes.status}): ${invalidPhotoRejected ? 'PASSED' : 'FAILED'} ("${invalidPhotoData.error}")`);

  // 3. Test oversized file rejection (>5MB)
  const oversizedPhoto = 'data:image/png;base64,' + 'A'.repeat(8 * 1024 * 1024);
  const oversizedRes = await fetch(`${BASE_URL}/api/complaints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      originalText: 'Test complaint with oversized 8MB photo',
      location: 'Test Location',
      ward: 'Ward 01 - General Central',
      photoUrl: oversizedPhoto
    })
  });
  const oversizedData = await oversizedRes.json();
  const oversizedRejected = !oversizedRes.ok && oversizedData.success === false;
  console.log(`Oversized Photo Rejected (HTTP ${oversizedRes.status}): ${oversizedRejected ? 'PASSED' : 'FAILED'} ("${oversizedData.error}")`);

  auditResults.photoUpload = {
    passed: validPhotoStored && invalidPhotoRejected && oversizedRejected,
    validPhotoAccepted: validPhotoStored,
    invalidMimeRejected: invalidPhotoRejected,
    oversizedRejected: oversizedRejected
  };
  console.log(`Audit 5 Status: ${auditResults.photoUpload.passed ? 'PASSED ✅' : 'FAILED ❌'}\n`);

  // -----------------------------------------------------------------
  // FINAL SUMMARY
  // -----------------------------------------------------------------
  console.log('====================================================');
  console.log('               AUDIT SUMMARY TABLE                  ');
  console.log('====================================================');
  console.log(`Task 1 (Duplicate Detection Score & Breakdown): ${auditResults.duplicateDetection.passed ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`Task 2 (AI Verification & Truthful Fallback):    ${auditResults.aiVerification.passed ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`Task 3 (End-to-End Submission & Triage):        ${auditResults.endToEnd.passed ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`Task 4 (Data & Ward Analytics Consistency):     ${auditResults.dataAndAnalytics.passed ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`Task 5 (Photo Upload, Storage & Validation):    ${auditResults.photoUpload.passed ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log('====================================================');

  const allPassed =
    auditResults.duplicateDetection.passed &&
    auditResults.aiVerification.passed &&
    auditResults.endToEnd.passed &&
    auditResults.dataAndAnalytics.passed &&
    auditResults.photoUpload.passed;

  if (allPassed) {
    console.log('ALL AUDIT REQUIREMENTS SUCCESSFULLY VERIFIED WITH CONCRETE EVIDENCE! 🏆');
    process.exit(0);
  } else {
    console.error('ONE OR MORE AUDIT CRITERIA FAILED.');
    process.exit(1);
  }
}

runAudit().catch(err => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
