# HealFlow AI - Complete UI/UX & Technical Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Design System](#design-system)
3. [Screen-by-Screen Breakdown](#screen-by-screen-breakdown)
4. [Component Library](#component-library)
5. [Data Architecture](#data-architecture)
6. [API Requirements](#api-requirements)
7. [User Flows](#user-flows)
8. [Technical Specifications](#technical-specifications)

---

## 1. System Overview

### Product Description
HealFlow is an autonomous AI-powered system monitoring platform designed to detect, analyze, and resolve critical issues in e-commerce infrastructure with minimal human intervention. The system uses OODA (Observe, Orient, Decide, Act) loop methodology combined with chain-of-thought reasoning to protect revenue and reduce engineering overhead.

### Core Value Propositions
- **Revenue Protection**: Monitors and prevents revenue loss from system failures
- **Development Hours Saved**: Automated issue resolution reducing manual intervention
- **Auto-Resolution**: High percentage of issues resolved without human involvement
- **ROI Tracking**: Comprehensive analytics on financial impact

### User Personas
1. **Engineering Leaders**: Monitor system health, review ROI, approve high-risk fixes
2. **DevOps Engineers**: Review auto-resolutions, handle manual interventions
3. **Product Managers**: Track business impact, migration health
4. **System Administrators**: Configure agents, manage integrations

---

## 2. Design System

### Color Palette

#### Primary Colors
```css
/* Background & Base */
--bg-primary: #0A1F1F;           /* Deep dark teal - main background */
--bg-secondary: #0D2626;         /* Slightly lighter teal - cards */
--bg-tertiary: #0F2D2D;          /* Card hover state */

/* Accent Colors */
--accent-primary: #00FF9D;       /* Bright cyan/green - CTAs, success */
--accent-secondary: #00CC7D;     /* Darker accent - hover states */
--accent-glow: rgba(0, 255, 157, 0.15); /* Glow effects */

/* Status Colors */
--status-critical: #FF4444;      /* Critical errors */
--status-warning: #FFB84D;       /* Warnings */
--status-info: #4D9FFF;          /* Information */
--status-success: #00FF9D;       /* Success states */

/* Text Colors */
--text-primary: #FFFFFF;         /* Primary text */
--text-secondary: #8B9A9A;       /* Secondary text, labels */
--text-tertiary: #5A6B6B;        /* Disabled, timestamps */
--text-accent: #00FF9D;          /* Highlighted text, links */

/* Border & Dividers */
--border-subtle: #1A3333;        /* Subtle borders */
--border-medium: #2A4444;        /* Standard borders */
--border-accent: #00FF9D;        /* Highlighted borders */
```

#### Semantic Colors
```css
/* Revenue & Financial */
--revenue-positive: #00FF9D;
--revenue-negative: #FF4444;
--revenue-neutral: #8B9A9A;

/* Status Indicators */
--status-live: #00FF9D;
--status-processing: #FFB84D;
--status-error: #FF4444;
--status-resolved: #4D9FFF;
--status-waiting: #8B9A9A;
```

### Typography

#### Font Stack
```css
--font-primary: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
```

#### Type Scale
```css
/* Headers */
--text-h1: 32px;      /* weight: 700, line-height: 1.2 */
--text-h2: 24px;      /* weight: 600, line-height: 1.3 */
--text-h3: 20px;      /* weight: 600, line-height: 1.4 */
--text-h4: 18px;      /* weight: 600, line-height: 1.4 */

/* Body */
--text-body-lg: 16px; /* weight: 400, line-height: 1.6 */
--text-body: 14px;    /* weight: 400, line-height: 1.5 */
--text-body-sm: 12px; /* weight: 400, line-height: 1.5 */

/* Code/Mono */
--text-code: 13px;    /* weight: 400, line-height: 1.6 */
--text-code-sm: 11px; /* weight: 400, line-height: 1.5 */

/* Labels */
--text-label: 11px;   /* weight: 600, line-height: 1.4, letter-spacing: 0.5px */
--text-label-lg: 13px;/* weight: 500, line-height: 1.4 */
```

### Spacing System
```css
/* Base unit: 4px */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
```

### Border Radius
```css
--radius-sm: 4px;   /* Small elements, badges */
--radius-md: 8px;   /* Buttons, inputs */
--radius-lg: 12px;  /* Cards, panels */
--radius-xl: 16px;  /* Large containers */
```

### Shadows & Effects
```css
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2);
--shadow-glow: 0 0 20px rgba(0, 255, 157, 0.15);

--blur-sm: blur(8px);
--blur-md: blur(16px);
```

### Animation
```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 3. Screen-by-Screen Breakdown

### 3.1 Command Center (Main Dashboard)

**Route**: `/dashboard` or `/`

**Purpose**: Primary monitoring interface showing real-time system health, active agents, and human intervention queue.

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│ Header: Logo | Stats Bar | Search | Brief Me | Notifications   │
├─────────────┬──────────────────────┬───────────────────────────┤
│ Sidebar     │ Live Signal Log      │ HIL Queue                 │
│             │                      │                           │
│ - ROI       ├──────────────────────┤                           │
│ - Live Mon  │ The Brain            │                           │
│ - Logs      │ (OODA Visualizer)    │                           │
│             │                      │                           │
│ Filters     │                      │                           │
│             │                      │                           │
└─────────────┴──────────────────────┴───────────────────────────┘
│ Footer: System Status | Active Nodes | Uptime | Latency        │
└─────────────────────────────────────────────────────────────────┘
```

#### Header (Global)
**Height**: 64px
**Background**: `--bg-secondary` with subtle bottom border

**Components**:
1. **Logo & Product Name**
   - Position: Left aligned, 24px padding
   - Logo: 32x32px, green animated icon
   - Text: "HealFlow" with "COMMAND" badge
   - Badge styling: `--text-label`, `--accent-primary`, 4px padding

2. **Stats Bar** (3 metrics)
   - Layout: Horizontal flex, 32px gap
   - Each metric:
     - Label: `--text-label`, `--text-secondary`, uppercase
     - Value: `--text-h3`, `--text-primary`, bold
     - Change indicator: Small percentage with arrow, colored by status
   
   Metrics:
   - **Revenue Protected**: `$425,000`, `+12%` (green)
   - **Dev Hours Saved**: `1,240 hrs`, `+5%` (green)
   - **Auto-Resolution**: `94.2%`, `+2%` (green)

3. **Search Bar**
   - Width: 360px
   - Height: 40px
   - Placeholder: "Search systems or events..."
   - Icon: Magnifying glass (left, 16px)
   - Border: `--border-subtle`, focus: `--border-accent` with glow

4. **Brief Me Button**
   - Type: Primary CTA
   - Icon: AI sparkle icon (left)
   - Text: "Brief Me"
   - Background: `--accent-primary`
   - Hover: Slight glow effect

5. **Notification Bell**
   - Icon: Bell, 20px
   - Badge: Red dot for unread (8px diameter)
   - Hover: Background highlight

6. **Settings Gear**
   - Icon: Gear, 20px
   - Hover: Rotate animation

7. **User Avatar**
   - Size: 36px circle
   - Border: 2px `--accent-primary`
   - Contains: User photo or initials

#### Sidebar (Left Panel)
**Width**: 240px
**Background**: `--bg-primary`

**Structure**:

1. **Navigation Section**
   - Title: "COMMAND CENTER" (`--text-label`)
   - Items:
     - ROI Analytics (chart icon)
     - Live Monitoring (pulse icon) - active state
     - Merchant Logs (list icon)
   - Active state: `--accent-primary` left border (3px), background tint

2. **Global Filters Section**
   - Title: "GLOBAL FILTERS" (`--text-label`)
   - Filters:
     - **Time Period**: Dropdown
       - Options: Last 24 Hours, Last 7 Days, Last 30 Days, Custom
       - Default: "Last 24 Hours"
     - **Migration Phase**: Dropdown
       - Options: All Phases, Pre-Migration, Migration, Post-Migration
       - Default: "All Phases"
     - **Merchant Tier**: Multi-select chips
       - Options: Enterprise, Mid-Market, SME
       - Visual: Pill-shaped chips with remove X

3. **Emergency Controls** (Bottom)
   - **Fail-Safe Toggle**
     - Label: "FAIL-SAFE" (`--status-critical`)
     - Description: "Deactivate autonomous mode for all active migrations"
     - Switch: Large toggle
   - **Emergency Stop Button**
     - Full width
     - Background: `--status-critical`
     - Text: "EMERGENCY STOP"
     - Icon: Warning triangle

#### Center Panel - Live Signal Log
**Width**: ~35% of remaining space
**Background**: `--bg-secondary`
**Border-radius**: `--radius-lg`

**Header**:
- Icon: Circle (pulsing animation)
- Title: "LIVE SIGNAL LOG"
- Badge: "LIVE FEED" (green, pulsing)

**Content**: Scrollable log of events
- Max visible: ~8-10 entries
- Auto-scroll: Latest at top

**Log Entry Structure**:
```
┌─ Severity Badge ─────────────────────── Timestamp ─┐
│  CRITICAL: 404_SPIKE_DETECTED          14:02:11    │
│  Endpoint: /api/v1/checkout/payment                │
│  { "error": "NOT_FOUND", "latency": "840ms",       │
│    "source": "Shopify_webhook" }                   │
└────────────────────────────────────────────────────┘
```

**Entry Components**:
1. **Left Border**: 3px, color coded by severity
   - CRITICAL: `--status-critical`
   - WARN: `--status-warning`
   - INFO: `--status-info`
   - ERROR: `--status-critical`
   - SYSTEM: `--accent-primary`

2. **Header Line**:
   - Severity badge: `--text-label`, colored background
   - Event name: `--text-code`, white
   - Timestamp: `--text-body-sm`, `--text-tertiary`, right-aligned

3. **Body**:
   - Primary info: `--text-body`, `--text-secondary`
   - JSON/Code: `--text-code-sm`, `--font-mono`, syntax highlighted

**Severity Levels**:
- CRITICAL: Red background, white text
- ERROR: Red background, white text
- WARN: Orange background, dark text
- INFO: Blue background, white text
- SYSTEM: Green background, white text

#### Center Panel - The Brain (OODA Visualizer)
**Width**: Same as Live Signal Log
**Background**: `--bg-secondary`
**Border-radius**: `--radius-lg`

**Header**:
- Icon: Brain/AI icon (green)
- Title: "THE BRAIN (OODA VISUALIZER)"
- Badge: "AGENT ACTIVE: #882" (green, animated pulse)

**OODA Flow Visual**:
```
    ○ OBSERVE
    │
    ↓
    ○ ORIENT
    │
    ↓
    ● DECIDE ← Currently active (filled, pulsing)
    │
    ↓
    ○ ACT
```

**Stage Indicators**:
- Inactive: Outlined circle (16px), `--border-subtle`
- Active: Filled circle (20px), `--accent-primary`, pulsing animation
- Complete: Filled circle (16px), green checkmark
- Connection lines: 2px, `--border-subtle`, animated flow when active

**Current Task Card**:
- Background: `--bg-tertiary`
- Border: 1px `--border-accent`
- Padding: 16px
- Border-radius: `--radius-md`

**Content**:
1. **Title**: "Issue Resolution Agent"
   - Font: `--text-h4`, `--text-primary`

2. **Description**: "Handling 404 Spike on Checkout"
   - Font: `--text-body`, `--text-secondary`

3. **Progress Bar**:
   - Label: "TASK EXECUTION: 64% COMPLETED"
   - Height: 8px
   - Background: `--bg-primary`
   - Fill: `--accent-primary` with gradient
   - Border-radius: 4px

4. **Chain-of-Thought Reasoning**:
   - Title: "CHAIN-OF-THOUGHT REASONING" with collapse toggle
   - Background: Darker inset panel
   - Font: `--text-code-sm`, `--font-mono`
   - Numbered list format:
   ```
   1. Detecting abnormal spike in 404 responses from /checkout gateway.
   2. Comparing current log pattern with migration schema v2.1. 
      Identification: Missing legacy session mapping.
   3. Hypothesis: API Gateway middleware is dropping headers from 
      legacy session tokens.
   4. Proposed Decision: Re-route traffic through Legacy-Bridge node 
      and inject token-fix-script.
   5. Waiting for human approval for High-Risk action (Revenue at 
      risk)...
   ```

5. **Status Indicator** (Bottom):
   - Text: "PROCESSING..." (animated dots)
   - Color: `--status-warning`

#### Right Panel - HIL Queue (Human-in-Loop)
**Width**: ~30% of remaining space
**Background**: `--bg-secondary`
**Border-radius**: `--radius-lg`

**Header**:
- Icon: User icon with notification badge
- Title: "HIL QUEUE"
- Badge: Count indicator "2" (number of pending items)

**Queue Item Structure**:
```
┌────────────────────────────────────────────────────┐
│ Critical: Checkout API Failing                     │
│ Root Cause: Invalid Token Format detected in...   │
│                                                    │
│ REVENUE AT RISK              STABILITY INDEX      │
│ $12,500/hr                   42%                  │
│                                                    │
│ [✓ Approve]  [Reject]                            │
└────────────────────────────────────────────────────┘
```

**Card Components**:
1. **Header**:
   - Title: `--text-body-lg`, `--text-primary`, bold
   - Description: `--text-body`, `--text-secondary`, 2-line truncation

2. **Metrics Row**:
   - Layout: 2 columns
   - Each metric:
     - Label: `--text-label`, uppercase, colored by severity
     - Value: `--text-h3`, bold
     - Revenue label: `--status-critical` background
     - Stability: Colored by percentage (red <50%, orange 50-75%, green >75%)

3. **Action Buttons**:
   - Layout: Horizontal, full width
   - **Approve**: 
     - Background: `--accent-primary`
     - Width: 60%
     - Icon: Checkmark
     - Hover: Slight glow
   - **Reject**:
     - Background: Transparent
     - Border: 1px `--border-medium`
     - Width: 38%
     - Hover: Border color to `--status-critical`

4. **Empty State** (when queue is empty):
   - Dashed border box
   - Icon: Checkmark circle (large, centered)
   - Text: "WAITING FOR NEXT SIGNAL..."
   - Color: `--text-tertiary`

#### Footer (Global)
**Height**: 48px
**Background**: `--bg-primary`
**Border-top**: 1px `--border-subtle`

**Content** (Left to right):
1. **System Status**:
   - Icon: Green dot (pulsing)
   - Text: "SYSTEM NOMINAL"
   - Font: `--text-label`

2. **Divider** (vertical line)

3. **Active Nodes**:
   - Label: "NODES:"
   - Value: "42 ONLINE"
   - Icon: Server icon

4. **Divider**

5. **Active Agents**:
   - Label: "ACTIVE AGENTS:"
   - Value: "12"
   - Icon: AI/robot icon

6. **Divider**

7. **System Uptime** (right section):
   - Label: "UPTIME:"
   - Value: "99.998%"
   - Color: `--accent-primary`

8. **Divider**

9. **Latency**:
   - Label: "LATENCY:"
   - Value: "42MS"
   - Color: `--accent-primary`

10. **Version** (far right):
    - Text: "CMD_V1.8.4"
    - Font: `--text-code-sm`
    - Color: `--text-tertiary`

---

### 3.2 Config Diff & Documentation Screen

**Route**: `/incident/:id/config`

**Purpose**: Show configuration differences between current (error) state and proposed fix, with AI-generated documentation.

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│ [← Back to Command Center]    Config Diff & Documentation      │
│                                INCIDENT_#882                    │
├──────────────────────┬───────────────────┬──────────────────────┤
│ Current Config       │ Proposed Fix      │ Documentation        │
│ (ERROR DETECTED)     │ (HEALFLOW FIX)    │ Snippets            │
│                      │                   │                      │
│ JSON with errors     │ JSON with fixes   │ - Doc links         │
│ highlighted          │ highlighted       │ - Explanations      │
│                      │                   │ - Best practices    │
├──────────────────────┴───────────────────┴──────────────────────┤
│ HealFlow Agent Explanation                                      │
│ [Detailed reasoning from AI]                                    │
├─────────────────────────────────────────────────────────────────┤
│ Footer: [Export JSON] [Apply Fix]                             │
└─────────────────────────────────────────────────────────────────┘
```

#### Header
**Background**: `--bg-secondary`
**Padding**: 24px
**Border-bottom**: 1px `--border-subtle`

**Components**:
1. **Back Button**:
   - Icon: Left arrow
   - Text: "BACK TO COMMAND CENTER"
   - Type: Text button with hover underline

2. **Title Section**:
   - Main title: "Config Diff & Documentation"
   - Subtitle: "INCIDENT_#882" badge (green background)

3. **Action Buttons** (right):
   - **Export JSON**: Secondary button
   - **Apply Fix**: Primary button (`--accent-primary`), larger

#### Three-Column Layout
**Gap**: 16px between columns
**Column ratio**: 40% | 40% | 20%

##### Column 1: Current Configuration
**Header**:
- Icon: Warning triangle (red)
- Title: "CURRENT CONFIGURATION"
- Badge: "ERROR DETECTED" (red background)

**Content**:
- Background: `--bg-primary`
- Border: 1px `--border-subtle`
- Border-radius: `--radius-lg`
- Padding: 16px

**Code Block**:
- Font: `--font-mono`, `--text-code`
- Line numbers: `--text-tertiary`
- Syntax highlighting:
  - Keys: `--text-secondary`
  - Strings: `#7FD5B2` (light cyan)
  - Values: `--text-primary`
  - Booleans: `#FFB84D` (orange)

**Error Highlighting**:
- Lines with errors: Red background (`rgba(255, 68, 68, 0.1)`)
- Left border: 3px `--status-critical`
- Example errors:
  ```json
  "session_mapping": "auto",      ← Red highlight
  "token_injection": false,       ← Red highlight
  ```

##### Column 2: Proposed Correction
**Header**:
- Icon: Checkmark circle (green)
- Title: "PROPOSED CORRECTION"
- Badge: "HEALFLOW SUGGESTION" (green background)

**Content**: Same styling as Column 1

**Fix Highlighting**:
- Lines with fixes: Green background (`rgba(0, 255, 157, 0.1)`)
- Left border: 3px `--accent-primary`
- Example fixes:
  ```json
  "session_mapping": "strict_legacy_v2",  ← Green highlight
  "token_injection": true,                ← Green highlight
  "injection_script": "legacy_fix_v1.js", ← Green highlight (new line)
  ```

##### Column 3: Documentation Snippets
**Header**:
- Icon: Document icon
- Title: "DOCUMENTATION SNIPPETS"

**Content**: Card-based list

**Document Card Structure**:
```
┌────────────────────────────────┐
│ DOC-MIG-772           [↗]     │
│                                │
│ Legacy Session Persistence     │
│                                │
│ When migrating from legacy     │
│ architectures, the             │
│ session_mapping parameter...   │
└────────────────────────────────┘
```

**Card Components**:
1. **Header Row**:
   - Doc ID: `--text-label`, `--accent-primary`
   - External link icon: Top right

2. **Title**:
   - Font: `--text-body-lg`, bold
   - Color: `--text-primary`
   - Margin: 8px top/bottom

3. **Description**:
   - Font: `--text-body-sm`
   - Color: `--text-secondary`
   - Max lines: 3, truncated with ellipsis

4. **Hover State**:
   - Border: `--border-accent`
   - Background: Slight lighten
   - Cursor: pointer

**Search Bar** (bottom of column):
- Placeholder: "SEARCH ALL DOCS"
- Icon: Magnifying glass
- Width: 100%

#### Bottom Panel: HealFlow Agent Explanation
**Background**: `--bg-primary`
**Border-top**: 1px `--border-subtle`
**Padding**: 24px

**Header**:
- Icon: AI brain icon (green)
- Title: "HEALFLOW AGENT EXPLANATION"

**Content**:
- Font: `--text-body`
- Color: `--text-secondary`
- Line-height: 1.6

**Text Formatting**:
- Bold key terms: `--text-primary`, bold
- Code snippets inline: `--font-mono`, `--accent-primary` background
- Links: `--text-accent`, underline on hover

**Example**:
```
The detected 404 spike is caused by a failure in the legacy session bridge.
The current configuration uses auto session mapping, which is failing to 
recognize headers from your legacy Shopify Plus storefront.

Based on the Migration Documentation (Section 4.2: Session Persistence), 
I have proposed switching to strict_legacy_v2 and enabling token_injection.
This will ensure that legacy auth tokens are correctly re-signed before 
being passed to the new checkout gateway.
```

**Footer Section**:
- **Cited Document**:
  - Icon: Document icon
  - Text: "CITED: DOC-MIG-772"
  - Badge: Confidence indicator "CONFIDENCE: 98.4%"

#### Footer Action Bar
**Background**: `--bg-secondary`
**Padding**: 16px 24px
**Border-top**: 1px `--border-accent` (subtle glow)

**Components**:
1. **Status Section** (left):
   - Icon: AI processing icon
   - Text: "AGENT STATUS: RESOLVING"
   - Subtext: "ANALYSIS TIME: 1.2s"
   - Font: `--text-label`

2. **Context Indicator** (center-left):
   - Text: "CONTEXT: SHOP_PROD_MIGRATION"
   - Icon: Info circle (tooltip on hover)

3. **Action Buttons** (right):
   - **Export JSON**:
     - Type: Secondary
     - Icon: Download
     - Text: "Export JSON"
   
   - **Apply Fix**:
     - Type: Primary
     - Background: `--accent-primary`
     - Icon: Lightning bolt
     - Text: "Apply Fix"
     - Hover: Glow effect

---

### 3.3 ROI Dashboard

**Route**: `/roi` or `/analytics`

**Purpose**: Executive dashboard showing revenue impact, time savings, and system efficiency metrics.

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│ Header: [Navigation] ROI Dashboard                             │
├─────────────────────────────────────────────────────────────────┤
│                    Revenue & ROI Impact                         │
│ Autonomous monitoring active across 42 active migrations       │
├─────────────────┬─────────────────┬───────────────────────────┤
│ Total Revenue   │ Engineering     │ Migration Health          │
│ Protected       │ Hours Saved     │ Score                     │
│                 │                 │                           │
│ $1,245,800      │ 452 hrs         │ 98.4%                     │
│ ↗12.5%          │ ↗8.2%           │ ↗0.4%                     │
├─────────────────┴─────────────────┴───────────────────────────┤
│                                                                 │
│ [Revenue at Risk Trends - Line Chart]                         │
│                                                                 │
├────────────────────┬────────────────────────────────────────────┤
│ Auto-Resolved vs   │ Recent Critical Interventions              │
│ Human Intervention │ [Table]                                    │
│ [Bar Chart]        │                                            │
│                    │                                            │
└────────────────────┴────────────────────────────────────────────┘
```

#### Header
- Standard navigation
- Title: "ROI Dashboard"
- Breadcrumb: "System Health > Migrations > Security"
- Tab navigation for different views

#### Status Bar
**Background**: Gradient from `--bg-secondary` to transparent
**Padding**: 32px
**Alignment**: Center

**Content**:
1. **Main Title**: "Revenue & ROI Impact"
   - Font: `--text-h1`
   - Color: `--text-primary`
   - Margin-bottom: 8px

2. **Subtitle**: "Autonomous monitoring active across 42 active migrations."
   - Font: `--text-body`
   - Color: `--text-secondary`

3. **Status Indicators** (inline):
   - "STATUS" badge: "AUTONOMOUS" (green, pulsing)
   - "LAST INTERVENTION": "4m 12s ago" (timestamp)

#### Metric Cards (Top Row)
**Layout**: 3 equal-width cards with 24px gap
**Card styling**:
- Background: `--bg-secondary`
- Border: 1px `--border-subtle`
- Border-radius: `--radius-lg`
- Padding: 24px
- Hover: Subtle lift animation, border color to `--border-accent`

**Card Structure**:
```
┌────────────────────────────────┐
│ [Icon] Total Revenue Protected │
│                                │
│ $1,245,800                     │
│ ↗12.5%                         │
│                                │
│ Projected ROI for current...  │
└────────────────────────────────┘
```

**Components**:
1. **Header**:
   - Icon: Shield (revenue), Clock (hours), Heart-pulse (health)
   - Size: 24px
   - Color: `--accent-primary`
   - Title: `--text-label`, `--text-secondary`

2. **Primary Value**:
   - Font: `--text-h1`
   - Color: `--text-primary`
   - Margin: 16px top/bottom

3. **Change Indicator**:
   - Arrow icon: Up/down based on trend
   - Percentage: `--text-body-lg`
   - Color: Green for positive, red for negative
   - Background: Colored with 10% opacity

4. **Description** (footer):
   - Font: `--text-body-sm`
   - Color: `--text-tertiary`
   - Max 2 lines

#### Revenue at Risk Trends (Chart)
**Card Layout**: Full width, 400px height

**Header**:
- Title: "Revenue at Risk Trends"
- Subtitle: "Hourly monitoring of potential funnel leakages"
- Filter: Time range selector (right aligned)

**Chart Type**: Line chart with area fill
**Library**: Chart.js or Recharts

**Styling**:
- Background: `--bg-primary`
- Grid lines: `--border-subtle`, dashed
- Line color: `--accent-primary`
- Area fill: Gradient from `rgba(0, 255, 157, 0.2)` to transparent
- Data points: 8px circles, `--accent-primary`
- Hover: Tooltip with exact values

**Data Display**:
- X-axis: Time (00:00 - 23:59)
- Y-axis: Dollar amount ($0 - Peak value)
- Peak indicator: Badge showing "$42k Peak" with red background

**Annotations**:
- Critical events marked with vertical line
- Label showing intervention time

#### Auto-Resolved vs Human (Bar Chart)
**Card Layout**: Half width (left), 350px height

**Header**:
- Title: "Auto-Resolved vs Human"
- Subtitle: "Last 7 days efficiency split"
- Badge: "85% AI Ratio", "+5% VS LAST WEEK" (green)

**Chart Type**: Stacked bar chart

**Styling**:
- Bars: Vertical, rounded corners
- Auto-resolved: `--accent-primary`
- Human intervention: `--text-tertiary` (gray)
- Width: 40px per bar
- Gap: 16px

**Data Display**:
- X-axis: Days (MON, TUE, WED, THU, FRI)
- Y-axis: Count (0-100)
- Legend: Bottom, horizontal
  - "Auto-Resolved" with green dot
  - "Human Intervention" with gray dot

**Interaction**:
- Hover: Show exact counts in tooltip
- Click: Drill down to incidents for that day

#### Recent Critical Interventions (Table)
**Card Layout**: Half width (right)

**Header**:
- Title: "Recent Critical Interventions"
- Action: "VIEW ALL INTERVENTIONS" (link, right aligned)

**Table Structure**:

| Merchant Name | Incident Type | Resolution Time | Protected Impact | Status |
|---------------|---------------|-----------------|------------------|--------|

**Column Specifications**:

1. **Merchant Name**:
   - Width: 25%
   - Content: Logo (32x32px) + Name
   - Font: `--text-body`, bold
   - Example: "LM Lux Modern"

2. **Incident Type**:
   - Width: 30%
   - Font: `--text-body`
   - Color: `--text-secondary`
   - Example: "Cart API Latency (Migration UAT)"

3. **Resolution Time**:
   - Width: 15%
   - Font: `--text-body`
   - Color: `--text-primary`
   - Format: "1m 14s", "48s", "4m 52s"

4. **Protected Impact**:
   - Width: 15%
   - Font: `--text-body-lg`, bold
   - Color: `--accent-primary`
   - Format: "$12,450", "$8,200", "$4,120"

5. **Status**:
   - Width: 15%
   - Type: Badge
   - Variants:
     - "AUTO-FIXED": Green background
     - "RESOLVED": Blue background
     - "PENDING": Orange background

**Row Styling**:
- Height: 64px
- Border-bottom: 1px `--border-subtle`
- Hover: Background to `--bg-tertiary`, cursor pointer
- Click: Navigate to incident detail

**Empty State**: 
- Message: "No critical interventions in selected period"
- Icon: Checkmark circle
- Color: `--text-tertiary`

---

## 4. Component Library

### 4.1 Buttons

#### Primary Button
```jsx
<button className="btn-primary">
  <Icon /> {/* Optional */}
  <span>Button Text</span>
</button>
```

**Styling**:
```css
.btn-primary {
  background: var(--accent-primary);
  color: var(--bg-primary);
  font-size: var(--text-body-lg);
  font-weight: 600;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: var(--transition-base);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary:hover {
  background: var(--accent-secondary);
  box-shadow: var(--shadow-glow);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  background: var(--text-tertiary);
  cursor: not-allowed;
  opacity: 0.5;
}
```

**Variants**:
- **Large**: padding: 16px 32px, font-size: --text-h4
- **Small**: padding: 8px 16px, font-size: --text-body
- **Icon-only**: padding: 12px, width: 44px, height: 44px

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-medium);
  /* Rest same as primary */
}

.btn-secondary:hover {
  border-color: var(--accent-primary);
  background: rgba(0, 255, 157, 0.05);
}
```

#### Danger Button
```css
.btn-danger {
  background: var(--status-critical);
  color: var(--text-primary);
  /* Rest same as primary */
}

.btn-danger:hover {
  background: #CC3636;
  box-shadow: 0 0 20px rgba(255, 68, 68, 0.3);
}
```

### 4.2 Badges

```jsx
<span className="badge badge--success">LIVE FEED</span>
<span className="badge badge--critical">REVENUE AT RISK</span>
<span className="badge badge--info">PROCESSING</span>
```

**Base Styling**:
```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--text-label);
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* Variants */
.badge--success {
  background: var(--accent-primary);
  color: var(--bg-primary);
}

.badge--critical {
  background: var(--status-critical);
  color: var(--text-primary);
}

.badge--warning {
  background: var(--status-warning);
  color: var(--bg-primary);
}

.badge--info {
  background: var(--status-info);
  color: var(--text-primary);
}

.badge--neutral {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-medium);
}
```

**With Pulsing Animation**:
```css
.badge--pulse::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
```

### 4.3 Cards

```jsx
<div className="card">
  <div className="card__header">
    <Icon className="card__icon" />
    <h3 className="card__title">Card Title</h3>
    <span className="card__badge">Badge</span>
  </div>
  <div className="card__body">
    {/* Content */}
  </div>
  <div className="card__footer">
    {/* Actions */}
  </div>
</div>
```

**Styling**:
```css
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: var(--transition-base);
}

.card:hover {
  border-color: var(--border-medium);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.card__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-subtle);
}

.card__icon {
  width: 20px;
  height: 20px;
  color: var(--accent-primary);
}

.card__title {
  font-size: var(--text-label);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex: 1;
}

.card__badge {
  margin-left: auto;
}

.card__body {
  padding: 20px;
}

.card__footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  gap: 12px;
}
```

**Variants**:
- **Compact**: Reduced padding (12px)
- **Highlighted**: Border color `--border-accent`, subtle glow
- **Clickable**: Add cursor: pointer, active state

### 4.4 Metric Display

```jsx
<div className="metric">
  <div className="metric__label">
    <Icon />
    <span>Metric Name</span>
  </div>
  <div className="metric__value">$1,245,800</div>
  <div className="metric__change metric__change--positive">
    <ArrowUpIcon />
    <span>+12.5%</span>
  </div>
  <p className="metric__description">Projected ROI for current billing cycle</p>
</div>
```

**Styling**:
```css
.metric {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric__label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--text-label);
  color: var(--text-secondary);
  text-transform: uppercase;
}

.metric__value {
  font-size: var(--text-h1);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.metric__change {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--text-body);
  font-weight: 600;
  width: fit-content;
}

.metric__change--positive {
  background: rgba(0, 255, 157, 0.1);
  color: var(--accent-primary);
}

.metric__change--negative {
  background: rgba(255, 68, 68, 0.1);
  color: var(--status-critical);
}

.metric__description {
  font-size: var(--text-body-sm);
  color: var(--text-tertiary);
  margin: 0;
}
```

### 4.5 Code Block

```jsx
<pre className="code-block">
  <div className="code-block__header">
    <span className="code-block__language">JSON</span>
    <button className="code-block__copy">Copy</button>
  </div>
  <code className="code-block__content">
    {/* Syntax highlighted code */}
  </code>
</pre>
```

**Styling**:
```css
.code-block {
  background: var(--bg-primary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  overflow: hidden;
  font-family: var(--font-mono);
  font-size: var(--text-code);
}

.code-block__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-subtle);
}

.code-block__language {
  font-size: var(--text-label);
  color: var(--text-secondary);
  text-transform: uppercase;
}

.code-block__copy {
  background: transparent;
  border: none;
  color: var(--text-accent);
  cursor: pointer;
  font-size: var(--text-body-sm);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
}

.code-block__copy:hover {
  background: rgba(0, 255, 157, 0.1);
}

.code-block__content {
  display: block;
  padding: 16px;
  overflow-x: auto;
  line-height: 1.6;
}

/* Syntax highlighting tokens */
.token.property { color: var(--text-secondary); }
.token.string { color: #7FD5B2; }
.token.number { color: #FFB84D; }
.token.boolean { color: #FFB84D; }
.token.null { color: #FF4444; }
.token.key { color: #A0D4E8; }
```

**Error/Success Highlighting**:
```css
.code-block__line--error {
  background: rgba(255, 68, 68, 0.1);
  border-left: 3px solid var(--status-critical);
  margin-left: -16px;
  padding-left: 13px;
}

.code-block__line--success {
  background: rgba(0, 255, 157, 0.1);
  border-left: 3px solid var(--accent-primary);
  margin-left: -16px;
  padding-left: 13px;
}
```

### 4.6 Progress Bar

```jsx
<div className="progress">
  <div className="progress__label">
    <span>Task Execution</span>
    <span>64%</span>
  </div>
  <div className="progress__bar">
    <div className="progress__fill" style={{ width: '64%' }} />
  </div>
</div>
```

**Styling**:
```css
.progress {
  width: 100%;
}

.progress__label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: var(--text-label);
  color: var(--text-secondary);
  text-transform: uppercase;
}

.progress__bar {
  height: 8px;
  background: var(--bg-primary);
  border-radius: 4px;
  overflow: hidden;
}

.progress__fill {
  height: 100%;
  background: linear-gradient(90deg, 
    var(--accent-primary) 0%, 
    var(--accent-secondary) 100%
  );
  transition: width var(--transition-slow);
  position: relative;
}

/* Animated shimmer effect */
.progress__fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### 4.7 Toggle Switch

```jsx
<label className="toggle">
  <input type="checkbox" className="toggle__input" />
  <span className="toggle__slider"></span>
  <span className="toggle__label">Autonomous Mode</span>
</label>
```

**Styling**:
```css
.toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.toggle__input {
  display: none;
}

.toggle__slider {
  position: relative;
  width: 48px;
  height: 24px;
  background: var(--border-medium);
  border-radius: 12px;
  transition: var(--transition-base);
}

.toggle__slider::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  left: 2px;
  top: 2px;
  background: var(--text-primary);
  border-radius: 50%;
  transition: var(--transition-base);
}

.toggle__input:checked + .toggle__slider {
  background: var(--accent-primary);
}

.toggle__input:checked + .toggle__slider::before {
  transform: translateX(24px);
}

.toggle__label {
  font-size: var(--text-body);
  color: var(--text-primary);
}
```

### 4.8 Dropdown / Select

```jsx
<div className="select">
  <select className="select__input">
    <option>Last 24 Hours</option>
    <option>Last 7 Days</option>
    <option>Last 30 Days</option>
    <option>Custom Range</option>
  </select>
  <ChevronDownIcon className="select__icon" />
</div>
```

**Styling**:
```css
.select {
  position: relative;
  width: 100%;
}

.select__input {
  width: 100%;
  padding: 10px 36px 10px 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--text-body);
  cursor: pointer;
  appearance: none;
  transition: var(--transition-base);
}

.select__input:hover {
  border-color: var(--border-medium);
}

.select__input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(0, 255, 157, 0.1);
}

.select__icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--text-secondary);
  pointer-events: none;
}
```

### 4.9 Input Field

```jsx
<div className="input-group">
  <label className="input-group__label">Label</label>
  <div className="input-group__wrapper">
    <SearchIcon className="input-group__icon" />
    <input 
      type="text" 
      className="input-group__input" 
      placeholder="Search..."
    />
  </div>
  <span className="input-group__helper">Helper text</span>
</div>
```

**Styling**:
```css
.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group__label {
  font-size: var(--text-label);
  color: var(--text-secondary);
  text-transform: uppercase;
  font-weight: 600;
}

.input-group__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-group__icon {
  position: absolute;
  left: 12px;
  width: 16px;
  height: 16px;
  color: var(--text-tertiary);
  pointer-events: none;
}

.input-group__input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  background: var(--bg-primary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--text-body);
  transition: var(--transition-base);
}

.input-group__input::placeholder {
  color: var(--text-tertiary);
}

.input-group__input:hover {
  border-color: var(--border-medium);
}

.input-group__input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(0, 255, 157, 0.1);
}

.input-group__helper {
  font-size: var(--text-body-sm);
  color: var(--text-tertiary);
}

/* Error state */
.input-group--error .input-group__input {
  border-color: var(--status-critical);
}

.input-group--error .input-group__helper {
  color: var(--status-critical);
}
```

### 4.10 Table

```jsx
<div className="table-container">
  <table className="table">
    <thead>
      <tr>
        <th>Merchant</th>
        <th>Incident Type</th>
        <th>Time</th>
        <th>Impact</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div className="table__merchant">
            <img src="logo.png" alt="Lux Modern" />
            <span>Lux Modern</span>
          </div>
        </td>
        <td>Cart API Latency</td>
        <td>1m 14s</td>
        <td className="table__impact">$12,450</td>
        <td>
          <span className="badge badge--success">AUTO-FIXED</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

**Styling**:
```css
.table-container {
  width: 100%;
  overflow-x: auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-body);
}

.table thead {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-medium);
}

.table th {
  padding: 12px 16px;
  text-align: left;
  font-size: var(--text-label);
  color: var(--text-secondary);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.table tbody tr {
  border-bottom: 1px solid var(--border-subtle);
  transition: var(--transition-fast);
}

.table tbody tr:hover {
  background: var(--bg-tertiary);
  cursor: pointer;
}

.table tbody tr:last-child {
  border-bottom: none;
}

.table td {
  padding: 16px;
  color: var(--text-primary);
  vertical-align: middle;
}

.table__merchant {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table__merchant img {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.table__impact {
  font-weight: 600;
  color: var(--accent-primary);
}
```

---

## 5. Data Architecture

### 5.1 Core Data Models

#### System Status
```typescript
interface SystemStatus {
  id: string;
  timestamp: Date;
  status: 'nominal' | 'degraded' | 'critical' | 'maintenance';
  activeNodes: number;
  activeAgents: number;
  uptime: number; // percentage
  latency: number; // milliseconds
  version: string;
}
```

#### Metrics
```typescript
interface Metrics {
  id: string;
  timestamp: Date;
  revenueProtected: {
    value: number;
    currency: 'USD';
    change: number; // percentage
    period: 'hour' | 'day' | 'week' | 'month';
  };
  devHoursSaved: {
    value: number;
    change: number; // percentage
    equivalentEngineers: number;
  };
  autoResolutionRate: {
    value: number; // percentage
    change: number; // percentage
    total: number;
    autoResolved: number;
    humanIntervention: number;
  };
  migrationHealthScore: {
    value: number; // percentage
    change: number; // percentage
    activeMigrations: number;
  };
}
```

#### Signal/Event
```typescript
interface SignalEvent {
  id: string;
  timestamp: Date;
  severity: 'CRITICAL' | 'ERROR' | 'WARN' | 'INFO' | 'SYSTEM';
  type: string; // e.g., "404_SPIKE_DETECTED", "STRIPE_LATENCY_HIGH"
  source: string; // e.g., "Shopify_webhook", "CheckoutAPI"
  endpoint?: string;
  merchantId: string;
  metadata: {
    [key: string]: any; // JSON payload
  };
  agentId?: string; // if assigned to agent
  status: 'pending' | 'processing' | 'resolved' | 'escalated';
}
```

#### Agent
```typescript
interface Agent {
  id: string;
  name: string;
  type: 'issue_resolution' | 'monitoring' | 'migration' | 'security';
  status: 'active' | 'idle' | 'processing' | 'error';
  currentTask?: {
    signalId: string;
    stage: 'observe' | 'orient' | 'decide' | 'act';
    progress: number; // 0-100
    startedAt: Date;
    estimatedCompletion?: Date;
  };
  capabilities: string[];
  performanceMetrics: {
    totalResolutions: number;
    successRate: number; // percentage
    averageResolutionTime: number; // seconds
    revenueProtected: number;
  };
}
```

#### OODA Process
```typescript
interface OODAProcess {
  id: string;
  agentId: string;
  signalId: string;
  startedAt: Date;
  completedAt?: Date;
  stages: {
    observe: {
      status: 'pending' | 'active' | 'complete';
      findings: string[];
      dataPoints: any[];
      completedAt?: Date;
    };
    orient: {
      status: 'pending' | 'active' | 'complete';
      context: string;
      relatedIncidents: string[];
      completedAt?: Date;
    };
    decide: {
      status: 'pending' | 'active' | 'complete';
      chainOfThought: string[];
      proposedSolution: {
        type: 'auto_fix' | 'config_change' | 'rollback' | 'escalate';
        description: string;
        confidence: number; // 0-100
        estimatedImpact: {
          revenueAtRisk: number;
          affectedUsers: number;
          downtime: number; // seconds
        };
      };
      completedAt?: Date;
    };
    act: {
      status: 'pending' | 'active' | 'complete' | 'requires_approval';
      actions: Action[];
      completedAt?: Date;
    };
  };
}
```

#### Human-in-Loop (HIL) Request
```typescript
interface HILRequest {
  id: string;
  agentId: string;
  signalId: string;
  oodaProcessId: string;
  createdAt: Date;
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  rootCause: string;
  proposedAction: {
    type: string;
    description: string;
    configDiff?: ConfigDiff;
    riskLevel: 'high' | 'medium' | 'low';
  };
  metrics: {
    revenueAtRisk: number;
    revenueAtRiskPeriod: 'hour' | 'day';
    stabilityIndex: number; // 0-100
    affectedMerchants: number;
    affectedUsers: number;
  };
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  resolution?: {
    action: 'approved' | 'rejected';
    by: string; // user ID
    at: Date;
    notes?: string;
  };
  expiresAt: Date;
}
```

#### Config Diff
```typescript
interface ConfigDiff {
  incidentId: string;
  current: {
    config: object; // JSON config
    errors: ConfigError[];
  };
  proposed: {
    config: object; // JSON config
    changes: ConfigChange[];
  };
  documentation: DocumentationSnippet[];
  explanation: string;
  confidence: number; // 0-100
  citedDocs: string[]; // Document IDs
}

interface ConfigError {
  line: number;
  key: string;
  value: any;
  reason: string;
}

interface ConfigChange {
  line: number;
  type: 'added' | 'modified' | 'removed';
  key: string;
  oldValue?: any;
  newValue?: any;
  reason: string;
}

interface DocumentationSnippet {
  id: string; // e.g., "DOC-MIG-772"
  title: string;
  category: string;
  content: string; // excerpt
  relevance: number; // 0-100
  url?: string;
}
```

#### Incident
```typescript
interface Incident {
  id: string;
  signalId: string;
  merchantId: string;
  merchantName: string;
  merchantLogo?: string;
  type: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'detected' | 'processing' | 'resolved' | 'escalated';
  detectedAt: Date;
  resolvedAt?: Date;
  resolutionTime?: number; // seconds
  resolutionType: 'auto_fixed' | 'human_resolved' | 'pending';
  impact: {
    revenueProtected: number;
    affectedUsers: number;
    downtime: number; // seconds
  };
  agentId?: string;
  oodaProcessId?: string;
  hilRequestId?: string;
  configDiffId?: string;
  timeline: IncidentTimelineEntry[];
}

interface IncidentTimelineEntry {
  timestamp: Date;
  type: 'detection' | 'agent_assigned' | 'analysis_complete' | 
        'fix_proposed' | 'approval_requested' | 'fix_applied' | 
        'resolved' | 'escalated';
  description: string;
  metadata?: any;
}
```

### 5.2 Database Schema (PostgreSQL)

```sql
-- System Status
CREATE TABLE system_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL CHECK (status IN ('nominal', 'degraded', 'critical', 'maintenance')),
  active_nodes INTEGER NOT NULL,
  active_agents INTEGER NOT NULL,
  uptime DECIMAL(5,3) NOT NULL,
  latency INTEGER NOT NULL,
  version VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Merchants
CREATE TABLE merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('enterprise', 'mid_market', 'sme')),
  logo_url TEXT,
  migration_phase VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Signals/Events
CREATE TABLE signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  severity VARCHAR(10) NOT NULL CHECK (severity IN ('CRITICAL', 'ERROR', 'WARN', 'INFO', 'SYSTEM')),
  type VARCHAR(100) NOT NULL,
  source VARCHAR(100) NOT NULL,
  endpoint TEXT,
  merchant_id UUID REFERENCES merchants(id),
  metadata JSONB NOT NULL DEFAULT '{}',
  agent_id UUID,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'resolved', 'escalated')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  INDEX idx_signals_timestamp (timestamp DESC),
  INDEX idx_signals_merchant (merchant_id),
  INDEX idx_signals_severity (severity),
  INDEX idx_signals_status (status)
);

-- Agents
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('issue_resolution', 'monitoring', 'migration', 'security')),
  status VARCHAR(20) NOT NULL DEFAULT 'idle' CHECK (status IN ('active', 'idle', 'processing', 'error')),
  current_task_signal_id UUID REFERENCES signals(id),
  current_task_stage VARCHAR(20),
  current_task_progress INTEGER CHECK (current_task_progress BETWEEN 0 AND 100),
  current_task_started_at TIMESTAMPTZ,
  capabilities JSONB NOT NULL DEFAULT '[]',
  performance_metrics JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- OODA Processes
CREATE TABLE ooda_processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id),
  signal_id UUID NOT NULL REFERENCES signals(id),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  observe_status VARCHAR(20) DEFAULT 'pending',
  observe_findings JSONB DEFAULT '[]',
  observe_completed_at TIMESTAMPTZ,
  orient_status VARCHAR(20) DEFAULT 'pending',
  orient_context TEXT,
  orient_related_incidents JSONB DEFAULT '[]',
  orient_completed_at TIMESTAMPTZ,
  decide_status VARCHAR(20) DEFAULT 'pending',
  decide_chain_of_thought JSONB DEFAULT '[]',
  decide_proposed_solution JSONB,
  decide_completed_at TIMESTAMPTZ,
  act_status VARCHAR(20) DEFAULT 'pending',
  act_actions JSONB DEFAULT '[]',
  act_completed_at TIMESTAMPTZ,
  INDEX idx_ooda_agent (agent_id),
  INDEX idx_ooda_signal (signal_id)
);

-- HIL Requests
CREATE TABLE hil_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id),
  signal_id UUID NOT NULL REFERENCES signals(id),
  ooda_process_id UUID REFERENCES ooda_processes(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  root_cause TEXT,
  proposed_action JSONB NOT NULL,
  metrics JSONB NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  resolution JSONB,
  expires_at TIMESTAMPTZ NOT NULL,
  INDEX idx_hil_status (status),
  INDEX idx_hil_priority (priority),
  INDEX idx_hil_created (created_at DESC)
);

-- Config Diffs
CREATE TABLE config_diffs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL,
  current_config JSONB NOT NULL,
  current_errors JSONB NOT NULL DEFAULT '[]',
  proposed_config JSONB NOT NULL,
  proposed_changes JSONB NOT NULL DEFAULT '[]',
  documentation JSONB NOT NULL DEFAULT '[]',
  explanation TEXT NOT NULL,
  confidence INTEGER CHECK (confidence BETWEEN 0 AND 100),
  cited_docs JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Incidents
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID NOT NULL REFERENCES signals(id),
  merchant_id UUID NOT NULL REFERENCES merchants(id),
  type VARCHAR(100) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  status VARCHAR(20) NOT NULL DEFAULT 'detected' CHECK (status IN ('detected', 'processing', 'resolved', 'escalated')),
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolution_time INTEGER,
  resolution_type VARCHAR(20) CHECK (resolution_type IN ('auto_fixed', 'human_resolved', 'pending')),
  impact JSONB NOT NULL DEFAULT '{}',
  agent_id UUID REFERENCES agents(id),
  ooda_process_id UUID REFERENCES ooda_processes(id),
  hil_request_id UUID REFERENCES hil_requests(id),
  config_diff_id UUID REFERENCES config_diffs(id),
  timeline JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  INDEX idx_incidents_merchant (merchant_id),
  INDEX idx_incidents_status (status),
  INDEX idx_incidents_severity (severity),
  INDEX idx_incidents_detected (detected_at DESC)
);

-- Metrics (Time-series data)
CREATE TABLE metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  period VARCHAR(10) NOT NULL CHECK (period IN ('hour', 'day', 'week', 'month')),
  revenue_protected DECIMAL(12,2) NOT NULL,
  revenue_protected_change DECIMAL(5,2),
  dev_hours_saved DECIMAL(8,2) NOT NULL,
  dev_hours_saved_change DECIMAL(5,2),
  auto_resolution_rate DECIMAL(5,2) NOT NULL,
  auto_resolution_rate_change DECIMAL(5,2),
  total_incidents INTEGER NOT NULL,
  auto_resolved INTEGER NOT NULL,
  human_intervention INTEGER NOT NULL,
  migration_health_score DECIMAL(5,2) NOT NULL,
  migration_health_change DECIMAL(5,2),
  active_migrations INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  INDEX idx_metrics_timestamp (timestamp DESC),
  INDEX idx_metrics_period (period)
);

-- Revenue at Risk (Time-series)
CREATE TABLE revenue_at_risk (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  amount DECIMAL(12,2) NOT NULL,
  incidents_count INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  INDEX idx_risk_timestamp (timestamp DESC)
);
```

---

## 6. API Requirements

### 6.1 REST API Endpoints

#### Base URL
```
Production: https://api.healflow.ai/v1
Staging: https://api-staging.healflow.ai/v1
```

#### Authentication
```http
Authorization: Bearer {jwt_token}
X-API-Key: {api_key}
```

### 6.2 Endpoint Specifications

#### System Status
```http
GET /system/status
Response: SystemStatus
```

```http
GET /system/metrics
Query Parameters:
  - period: hour | day | week | month (default: day)
Response: Metrics
```

#### Signals/Events
```http
GET /signals
Query Parameters:
  - severity: CRITICAL | ERROR | WARN | INFO | SYSTEM
  - status: pending | processing | resolved | escalated
  - merchant_id: UUID
  - limit: number (default: 50, max: 100)
  - offset: number (default: 0)
Response: {
  data: SignalEvent[],
  pagination: {
    total: number,
    limit: number,
    offset: number,
    hasMore: boolean
  }
}
```

```http
GET /signals/{id}
Response: SignalEvent
```

```http
POST /signals
Body: {
  type: string,
  severity: string,
  source: string,
  endpoint?: string,
  merchantId: string,
  metadata: object
}
Response: SignalEvent
```

#### Agents
```http
GET /agents
Query Parameters:
  - status: active | idle | processing | error
  - type: issue_resolution | monitoring | migration | security
Response: Agent[]
```

```http
GET /agents/{id}
Response: Agent
```

```http
GET /agents/{id}/current-task
Response: {
  oodaProcess: OODAProcess,
  signal: SignalEvent,
  hilRequest?: HILRequest
}
```

#### OODA Processes
```http
GET /ooda-processes/{id}
Response: OODAProcess
```

```http
GET /signals/{signalId}/ooda-process
Response: OODAProcess
```

#### HIL Requests
```http
GET /hil-requests
Query Parameters:
  - status: pending | approved | rejected | expired
  - priority: critical | high | medium | low
Response: HILRequest[]
```

```http
GET /hil-requests/{id}
Response: HILRequest
```

```http
POST /hil-requests/{id}/resolve
Body: {
  action: 'approved' | 'rejected',
  notes?: string
}
Response: HILRequest
```

#### Config Diffs
```http
GET /config-diffs/{id}
Response: ConfigDiff
```

```http
POST /config-diffs/{id}/apply
Response: {
  success: boolean,
  appliedAt: Date,
  result: object
}
```

#### Incidents
```http
GET /incidents
Query Parameters:
  - status: detected | processing | resolved | escalated
  - severity: critical | high | medium | low
  - merchant_id: UUID
  - from: ISO Date
  - to: ISO Date
  - limit: number
  - offset: number
Response: {
  data: Incident[],
  pagination: PaginationInfo
}
```

```http
GET /incidents/{id}
Response: Incident & {
  signal: SignalEvent,
  merchant: Merchant,
  agent?: Agent,
  oodaProcess?: OODAProcess,
  hilRequest?: HILRequest,
  configDiff?: ConfigDiff
}
```

#### Analytics
```http
GET /analytics/revenue-at-risk
Query Parameters:
  - from: ISO Date
  - to: ISO Date
  - interval: hour | day (default: hour)
Response: {
  data: Array<{
    timestamp: Date,
    amount: number,
    incidentsCount: number
  }>,
  peak: {
    amount: number,
    timestamp: Date
  }
}
```

```http
GET /analytics/resolution-stats
Query Parameters:
  - from: ISO Date
  - to: ISO Date
  - group_by: day | week | month
Response: {
  data: Array<{
    period: string,
    autoResolved: number,
    humanIntervention: number,
    total: number,
    aiRatio: number
  }>,
  summary: {
    totalAutoResolved: number,
    totalHumanIntervention: number,
    overallAiRatio: number
  }
}
```

```http
GET /analytics/critical-interventions
Query Parameters:
  - limit: number (default: 10)
Response: Incident[]
```

### 6.3 WebSocket Events

#### Connection
```
wss://api.healflow.ai/v1/ws
```

#### Authentication
```json
{
  "type": "auth",
  "token": "jwt_token"
}
```

#### Subscribe to Events
```json
{
  "type": "subscribe",
  "channels": ["signals", "hil_requests", "system_status", "agents"]
}
```

#### Event Types

**New Signal**
```json
{
  "type": "signal.new",
  "data": SignalEvent
}
```

**Signal Status Updated**
```json
{
  "type": "signal.updated",
  "data": SignalEvent
}
```

**New HIL Request**
```json
{
  "type": "hil.new",
  "data": HILRequest
}
```

**HIL Request Resolved**
```json
{
  "type": "hil.resolved",
  "data": HILRequest
}
```

**Agent Status Changed**
```json
{
  "type": "agent.status",
  "data": {
    "agentId": string,
    "status": string,
    "currentTask": object | null
  }
}
```

**OODA Stage Changed**
```json
{
  "type": "ooda.stage_changed",
  "data": {
    "processId": string,
    "stage": "observe" | "orient" | "decide" | "act",
    "status": "active" | "complete"
  }
}
```

**System Status Changed**
```json
{
  "type": "system.status",
  "data": SystemStatus
}
```

---

## 7. User Flows

### 7.1 Critical Incident Resolution Flow

```
1. System detects anomaly (404 spike)
   ↓
2. Signal logged in Live Signal Log (left panel)
   ↓
3. Agent auto-assigned, OODA process begins
   ↓
4. "The Brain" visualizer shows active OODA stage
   ↓
5. Chain-of-thought reasoning displays in real-time
   ↓
6. Agent reaches "DECIDE" stage
   ↓
7. Risk assessment: High revenue impact detected
   ↓
8. HIL Request created (appears in right panel queue)
   ↓
9. User reviews:
   - Root cause explanation
   - Revenue at risk
   - Stability index
   ↓
10. User clicks "Approve" or "Reject"
    ↓
11a. If Approved:
     - Navigate to Config Diff screen
     - Review proposed changes
     - Click "Apply Fix"
     - System applies configuration
     - Agent moves to "ACT" stage
     - Incident resolved
    
11b. If Rejected:
     - HIL request marked rejected
     - Agent logs rejection
     - Incident escalated to manual review
```

### 7.2 Configuration Review Flow

```
1. User clicks on HIL request
   ↓
2. Navigate to Config Diff screen (/incident/:id/config)
   ↓
3. Review three columns:
   - Current Config (errors highlighted)
   - Proposed Fix (changes highlighted)
   - Documentation snippets
   ↓
4. Read HealFlow Agent Explanation
   ↓
5. Click documentation snippets to learn more
   ↓
6. Decision:
   6a. Approve → Click "Apply Fix"
   6b. Need more info → Click doc links
   6c. Reject → Back to dashboard, click Reject
   ↓
7. If approved:
   - System applies configuration
   - Success notification
   - Return to dashboard
   - Incident marked as resolved
```

### 7.3 ROI Analysis Flow

```
1. User navigates to ROI Dashboard
   ↓
2. View high-level metrics cards:
   - Total revenue protected
   - Engineering hours saved
   - Migration health score
   ↓
3. Analyze trends:
   - Revenue at Risk chart (identify patterns)
   - Auto-Resolved vs Human chart (efficiency)
   ↓
4. Review Recent Critical Interventions table
   ↓
5. Click on specific incident to drill down
   ↓
6. View incident details:
   - Full timeline
   - Resolution approach
   - Impact metrics
   - Config changes applied
   ↓
7. Export data for reporting (optional)
```

### 7.4 Real-Time Monitoring Flow

```
1. User on Command Center dashboard
   ↓
2. Live Signal Log auto-updates (real-time)
   ↓
3. New critical signal appears
   ↓
4. Visual indicators:
   - Red left border
   - "CRITICAL" badge
   - Sound notification (optional)
   ↓
5. User observes:
   - "The Brain" shows agent processing
   - OODA stages progress
   - Chain-of-thought reasoning updates
   ↓
6. If requires approval:
   - HIL card appears in right panel
   - "Brief Me" button can summarize
   ↓
7. User takes action or continues monitoring
```

---

## 8. Technical Specifications

### 8.1 Frontend Stack

#### Framework & Libraries
```json
{
  "framework": "React 18.x",
  "language": "TypeScript 5.x",
  "build": "Vite",
  "router": "React Router v6",
  "state": "Zustand or Redux Toolkit",
  "styling": "CSS Modules + PostCSS",
  "charts": "Recharts or Chart.js",
  "websocket": "Socket.io-client",
  "http": "Axios",
  "forms": "React Hook Form",
  "icons": "Lucide React or Heroicons"
}
```

#### Project Structure
```
src/
├── components/
│   ├── common/          # Shared components
│   │   ├── Button/
│   │   ├── Badge/
│   │   ├── Card/
│   │   ├── Input/
│   │   └── ...
│   ├── layout/          # Layout components
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   ├── Footer/
│   │   └── ...
│   └── features/        # Feature-specific components
│       ├── signals/
│       ├── agents/
│       ├── hil/
│       └── ...
├── pages/
│   ├── Dashboard/
│   ├── ConfigDiff/
│   ├── ROIDashboard/
│   └── ...
├── hooks/               # Custom React hooks
├── services/            # API services
├── store/               # State management
├── styles/              # Global styles
├── types/               # TypeScript types
├── utils/               # Utility functions
└── App.tsx
```

### 8.2 Backend Stack

#### Technology
```json
{
  "runtime": "Node.js 20.x",
  "framework": "Express.js or Fastify",
  "language": "TypeScript",
  "database": "PostgreSQL 16",
  "cache": "Redis 7.x",
  "queue": "Bull or RabbitMQ",
  "websocket": "Socket.io",
  "orm": "Prisma or TypeORM",
  "auth": "JWT + Passport.js",
  "logging": "Winston or Pino",
  "monitoring": "Prometheus + Grafana"
}
```

#### Project Structure
```
src/
├── api/
│   ├── routes/          # API routes
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Express middlewares
│   └── validators/      # Request validation
├── services/            # Business logic
│   ├── agent/
│   ├── ooda/
│   ├── hil/
│   └── ...
├── models/              # Database models
├── repositories/        # Data access layer
├── websocket/           # WebSocket handlers
├── queue/               # Background jobs
├── utils/               # Utility functions
├── types/               # TypeScript types
└── server.ts
```

### 8.3 Infrastructure

#### Deployment
```yaml
Frontend:
  - Hosting: Vercel or Netlify
  - CDN: Cloudflare
  - Environment: Node.js 20.x

Backend:
  - Hosting: AWS ECS or Google Cloud Run
  - Load Balancer: AWS ALB or GCP Load Balancer
  - Scaling: Auto-scaling based on CPU/Memory

Database:
  - PostgreSQL: AWS RDS or Google Cloud SQL
  - Backup: Automated daily backups
  - Replication: Multi-AZ for high availability

Cache:
  - Redis: AWS ElastiCache or Google Memorystore
  - Purpose: Session storage, API caching, real-time data

Queue:
  - Message Broker: AWS SQS + SNS or Google Pub/Sub
  - Purpose: Background jobs, event processing
```

### 8.4 Performance Requirements

#### Response Times
- **API Endpoints**: < 100ms (p50), < 300ms (p99)
- **WebSocket Latency**: < 50ms
- **Page Load**: < 2s (First Contentful Paint)
- **Time to Interactive**: < 3s

#### Scalability
- **Concurrent Users**: Support 1,000+ simultaneous users
- **Events per Second**: Handle 10,000+ signal events
- **Database Connections**: Pool of 100+ connections
- **WebSocket Connections**: Support 5,000+ concurrent connections

#### Reliability
- **Uptime**: 99.9% availability
- **Data Persistence**: Zero data loss on failures
- **Failover**: Automatic failover in < 30s
- **Backup**: RPO < 5 minutes, RTO < 15 minutes

### 8.5 Security Requirements

#### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- API key authentication for integrations
- OAuth 2.0 for third-party integrations

#### Data Security
- TLS 1.3 for all connections
- Encryption at rest (AES-256)
- Secrets management (AWS Secrets Manager or Vault)
- Regular security audits

#### Compliance
- SOC 2 Type II compliance
- GDPR compliance for EU data
- Data retention policies
- Audit logging for all critical actions

### 8.6 Monitoring & Observability

#### Metrics
- Application metrics (Prometheus)
- Business metrics (custom dashboards)
- Infrastructure metrics (CloudWatch/Stackdriver)
- User behavior analytics

#### Logging
- Structured logging (JSON format)
- Log aggregation (ELK Stack or Google Cloud Logging)
- Error tracking (Sentry)
- Distributed tracing (Jaeger or OpenTelemetry)

#### Alerts
- Critical: System down, data loss
- High: Performance degradation, high error rates
- Medium: Resource usage warnings
- Low: Non-critical anomalies

---

## 9. Responsive Design

### 9.1 Breakpoints

```css
/* Mobile */
@media (max-width: 767px) {
  /* Single column layout */
  /* Stack panels vertically */
  /* Simplified navigation */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  /* Two column layout */
  /* Condensed sidebar */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Full three column layout */
  /* All features visible */
}

/* Large Desktop */
@media (min-width: 1440px) {
  /* Optimal viewing experience */
  /* Additional context panels */
}
```

### 9.2 Mobile Adaptations

**Command Center**:
- Sidebar collapses to hamburger menu
- Live Signal Log takes full width
- The Brain and HIL Queue accessible via tabs
- Bottom sheet for HIL actions

**Config Diff**:
- Tabs for Current/Proposed/Documentation
- Swipe between views
- Sticky action buttons at bottom

**ROI Dashboard**:
- Cards stack vertically
- Charts responsive, swipeable
- Table becomes horizontal scroll

---

## 10. Accessibility

### 10.1 WCAG 2.1 AA Compliance

- **Color Contrast**: All text meets 4.5:1 minimum
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: ARIA labels and landmarks
- **Focus Indicators**: Visible focus states on all interactive elements
- **Alt Text**: All images and icons have descriptive alt text

### 10.2 Implementation

```jsx
// Example: Accessible Button
<button
  className="btn-primary"
  aria-label="Approve configuration change"
  aria-describedby="approve-description"
>
  <CheckIcon aria-hidden="true" />
  <span>Approve</span>
</button>
<p id="approve-description" className="sr-only">
  This will apply the proposed configuration changes to resolve the incident
</p>
```

---

## 11. Testing Requirements

### 11.1 Unit Tests
- Component tests (React Testing Library)
- Service/utility function tests (Jest)
- Coverage target: 80%+

### 11.2 Integration Tests
- API endpoint tests
- Database interaction tests
- WebSocket communication tests

### 11.3 E2E Tests
- Critical user flows (Playwright or Cypress)
- Cross-browser testing
- Mobile responsiveness testing

---

## 12. Development Guidelines

### 12.1 Code Style

**TypeScript**:
```typescript
// Use explicit types
interface Props {
  title: string;
  onClose: () => void;
}

// Use const for components
const MyComponent: React.FC<Props> = ({ title, onClose }) => {
  // Implementation
};

// Export at declaration
export { MyComponent };
```

**CSS**:
```css
/* Use CSS custom properties */
.component {
  color: var(--text-primary);
  background: var(--bg-secondary);
}

/* BEM naming convention */
.block {}
.block__element {}
.block__element--modifier {}

/* Mobile-first approach */
.component {
  /* Base mobile styles */
}

@media (min-width: 768px) {
  .component {
    /* Tablet styles */
  }
}
```

### 12.2 Git Workflow

```
main (production)
  ↑
staging (pre-production)
  ↑
develop (integration)
  ↑
feature/* (feature branches)
```

**Commit Convention**:
```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Examples:
  feat(hil): add approval workflow
  fix(agents): resolve OODA stage transition bug
  docs(api): update endpoint documentation
```

---

## 13. Future Enhancements

### Phase 2 Features
- Multi-tenant support
- Advanced filtering and search
- Custom alert rules
- Incident playbooks
- Integration marketplace

### Phase 3 Features
- Machine learning-powered predictions
- Advanced analytics and reporting
- Mobile native apps
- Voice command interface
- AI assistant chat

---

This documentation provides complete specifications for building the HealFlow AI system. Each section can be handed to AI tools for implementation of specific features.
