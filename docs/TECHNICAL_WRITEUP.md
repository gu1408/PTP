# CIVICLENS — TECHNICAL WRITE-UP & ARCHITECTURAL SPECIFICATION

## 1. Problem Context & Architectural Objectives
Municipalities face thousands of daily citizen complaints arriving in unstructured formats across disparate channels. Traditional complaint systems fail due to:
1. **Manual Triage Delay**: Tickets sit in generic queues for days before being read by human operators.
2. **Severity Misclassification**: Life-threatening emergencies (e.g. sparking electrical wires outside a school) are handled with the same urgency as routine potholes or streetlights.
3. **Misrouting**: Citizens often do not know which department owns an issue (e.g. stormwater flooding routed to water supply instead of drainage).
4. **Duplicate Dispatch**: Multiple citizens report the same road crater or fallen tree, resulting in duplicate contractor callouts and wasted public funds.
5. **Language Barriers**: Citizens reporting in Kannada or regional languages are delayed or ignored due to administrative language mismatches.

CivicLens solves these challenges through an autonomous, real-time AI triage engine with deterministic safety guarantees.

---

## 2. Deterministic AI Triage Pipeline

### Step 1: Ingestion & Language Detection
When a citizen types a complaint, CivicLens performs Unicode character analysis:
- Kannada Unicode range (`\u0C80`–`\u0CFF`)
- Devanagari/Hindi Unicode range (`\u0900`–`\u097F`)
- English standard ASCII

### Step 2: Multi-Layer Categorization & Severity Assessment
CivicLens employs a dual-engine architecture:
- **Primary Cloud Engine**: Google Gemini 1.5 Flash API invoked with strict JSON schema constraints.
- **Resilient Fallback Engine**: Deterministic civic natural language pattern engine covering safety hazards, road infrastructure, sanitation, electrical grids, horticulture, and drainage.

### Step 3: Safety-First Severity Assignment
Severity is determined by public safety risk, urgency, and vulnerability context:
- **CRITICAL**: Exposed live electrical conductors, active sparking near schools/children, collapsing structures, open manholes.
- **HIGH**: Arterial road craters causing vehicular crashes, ruptured water mains, fallen trees blocking hospital approach roads, stormwater backflow into basements.
- **MEDIUM**: Uncollected market garbage, moderate leaks, foul odors.
- **LOW**: Flickering streetlights, small dry branches, minor litter.

### Step 4: Deterministic Department Routing Policy
To prevent bureaucratic misrouting, AI categories map deterministically to municipal departments:
- `Roads` → **Road Maintenance Department**
- `Waste` → **Solid Waste Management Department**
- `Water` → **Water Supply Department**
- `Electricity` → **Electrical Department**
- `Trees` → **Parks and Horticulture Department**
- `Drainage` → **Stormwater Drainage Department**

Municipal officers maintain complete authority to override department or severity assignments, with all overrides recorded in the immutable activity log.

---

## 3. Intelligent Risk Scoring Formula
While the 4 official severity tiers (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) govern queue order, CivicLens calculates an explainable 0–100 numerical risk score for finer granularity:

$$\text{Risk Score} = \text{Base}(\text{Severity}) + \Delta_{\text{vulnerability}} + \Delta_{\text{transit}} + \Delta_{\text{danger}}$$

Where:
- $\text{Base}(\text{CRITICAL}) = 85$
- $\text{Base}(\text{HIGH}) = 65$
- $\text{Base}(\text{MEDIUM}) = 45$
- $\text{Base}(\text{LOW}) = 20$
- $\Delta_{\text{vulnerability}} = +8$ if near schools, daycares, or hospitals
- $\Delta_{\text{transit}} = +6$ if on arterial roads, metro corridors, or markets
- $\Delta_{\text{danger}} = +6$ if active collisions, sparking, or structural failure reported

*Safety Invariant*: A `MEDIUM` severity ticket with maximum contextual modifiers can never score higher than an unresolved `HIGH` severity ticket.

---

## 4. Smart Duplicate Detection Algorithm
CivicLens compares incoming complaints against all active unresolved tickets using:
1. **Jaccard Token Similarity** over normalized, stopword-filtered keyword sets.
2. **Spatial Ward Match**: A match in the same municipal ward provides a $+0.35$ affinity bonus.
3. **Landmark Overlap**: Token overlap in specific street or pillar locations provides an additional $+0.25$ bonus.

When a match exceeds the $0.55$ threshold:
- A `DuplicateGroup` is created or updated.
- The new submission is linked as a related ticket under the primary master ticket.
- **Preservation Principle**: The ticket is never silently dropped, ensuring citizen transparency.

---

## 5. UI/UX Design System
The frontend follows a modern civic-tech design system:
- **Deep Navy Base** (`#090d16` and `#0f172a`) conveys administrative authority and high visual contrast.
- **Severity Color Hierarchy**:
  - Critical: Crimson Red (`#ef4444`) with pulse animation
  - High: Ember Orange (`#f97316`)
  - Medium: Amber Yellow (`#eab308`)
  - Low/Resolved: Emerald Green (`#22c55e`)
- **Real-Time AI Preview**: Submissions display a debounced live AI classification badge before the citizen hits submit.
- **Dual User Flow**: Citizen Submission & Tracking Portal on one side; Officer Triage Command Center with Recharts analytics on the other.
