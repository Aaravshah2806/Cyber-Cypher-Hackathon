/**
 * UI Configuration
 * Fallback labels when API is not available
 * These should match the backend config.py UI_LABELS
 */

export const DEFAULT_LABELS = {
  // Header
  app_name: "HealFlow",
  header_badge: "COMMAND",
  search_placeholder: "Search systems or events...",
  brief_me_button: "Brief Me",

  // Metrics
  metric_revenue_protected: "Revenue Protected",
  metric_dev_hours_saved: "Dev Hours Saved",
  metric_auto_resolution: "Auto-Resolution",
  metric_migration_health: "Migration Health Score",

  // Sidebar Navigation
  nav_command_center: "COMMAND CENTER",
  nav_roi_analytics: "ROI Analytics",
  nav_live_monitoring: "Live Monitoring",
  nav_merchant_logs: "Merchant Logs",

  // Sidebar Filters
  filter_title: "GLOBAL FILTERS",
  filter_time_period: "Time Period",
  filter_migration_phase: "Migration Phase",
  filter_merchant_tier: "Merchant Tier",

  // Time Period Options
  time_last_24h: "Last 24 Hours",
  time_last_7d: "Last 7 Days",
  time_last_30d: "Last 30 Days",
  time_custom: "Custom Range",

  // Migration Phase Options
  phase_all: "All Phases",
  phase_pre: "Pre-Migration",
  phase_migration: "Migration",
  phase_post: "Post-Migration",

  // Merchant Tiers
  tier_enterprise: "Enterprise",
  tier_mid_market: "Mid-Market",
  tier_sme: "SME",

  // Emergency Controls
  failsafe_title: "FAIL-SAFE",
  failsafe_description: "Deactivate autonomous mode for all active migrations",
  emergency_stop: "EMERGENCY STOP",

  // Live Signal Log
  signal_log_title: "LIVE SIGNAL LOG",
  signal_log_badge: "LIVE FEED",

  // The Brain (OODA)
  brain_title: "THE BRAIN (OODA VISUALIZER)",
  brain_agent_active: "AGENT ACTIVE",
  ooda_observe: "OBSERVE",
  ooda_orient: "ORIENT",
  ooda_decide: "DECIDE",
  ooda_act: "ACT",
  task_execution: "TASK EXECUTION",
  chain_of_thought_title: "CHAIN-OF-THOUGHT REASONING",
  processing: "PROCESSING...",

  // HIL Queue
  hil_title: "HIL QUEUE",
  hil_revenue_at_risk: "REVENUE AT RISK",
  hil_stability_index: "STABILITY INDEX",
  hil_approve: "Approve",
  hil_reject: "Reject",
  hil_waiting: "WAITING FOR NEXT SIGNAL...",

  // Config Diff Page
  config_diff_title: "Config Diff & Documentation",
  back_to_command: "BACK TO COMMAND CENTER",
  current_config_title: "CURRENT CONFIGURATION",
  current_config_badge: "ERROR DETECTED",
  proposed_config_title: "PROPOSED CORRECTION",
  proposed_config_badge: "HEALFLOW SUGGESTION",
  docs_title: "DOCUMENTATION SNIPPETS",
  docs_search: "SEARCH ALL DOCS",
  agent_explanation_title: "HEALFLOW AGENT EXPLANATION",
  cited_label: "CITED",
  confidence_label: "CONFIDENCE",
  export_json: "Export JSON",
  apply_fix: "Apply Fix",
  agent_status: "AGENT STATUS",
  analysis_time: "ANALYSIS TIME",
  context_label: "CONTEXT",

  // ROI Dashboard
  roi_title: "Revenue & ROI Impact",
  roi_subtitle:
    "Autonomous monitoring active across {count} active migrations.",
  roi_status: "STATUS",
  roi_autonomous: "AUTONOMOUS",
  roi_last_intervention: "LAST INTERVENTION",
  roi_projected: "Projected ROI for current billing cycle",
  roi_equivalent: "Equivalent to {count} full-time Engineers",
  revenue_trends_title: "Revenue at Risk Trends",
  revenue_trends_subtitle: "Hourly monitoring of potential funnel leakages",
  resolution_title: "Auto-Resolved vs Human",
  resolution_subtitle: "Last 7 days efficiency split",
  ai_ratio: "AI Ratio",
  interventions_title: "Recent Critical Interventions",
  view_all: "VIEW ALL INTERVENTIONS",

  // Table Headers
  table_merchant: "MERCHANT NAME",
  table_incident_type: "INCIDENT TYPE",
  table_resolution_time: "RESOLUTION TIME",
  table_protected_impact: "PROTECTED IMPACT",
  table_status: "STATUS",

  // Status Labels
  status_auto_fixed: "AUTO-FIXED",
  status_resolved: "RESOLVED",
  status_pending: "PENDING",

  // Footer
  footer_system_nominal: "SYSTEM NOMINAL",
  footer_nodes: "NODES",
  footer_online: "ONLINE",
  footer_active_agents: "ACTIVE AGENTS",
  footer_uptime: "UPTIME",
  footer_latency: "LATENCY",

  // Severity Labels
  severity_critical: "CRITICAL",
  severity_error: "ERROR",
  severity_warn: "WARN",
  severity_info: "INFO",
  severity_system: "SYSTEM",
};

// Helper to get label with fallback
export function getLabel(labels, key, fallback = "") {
  return labels?.[key] || DEFAULT_LABELS[key] || fallback;
}

// Format currency
export function formatCurrency(value, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Format number with commas
export function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

// Format percentage
export function formatPercent(value, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}

// Format time duration
export function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// Format timestamp to time
export function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

// Format timestamp to relative time
export function formatRelativeTime(timestamp) {
  if (!timestamp) return "";

  // Ensure timestamp is treated as UTC if it lacks timezone info
  // Python's datetime.utcnow().isoformat() doesn't include Z
  let timeStr = timestamp;
  if (
    typeof timeStr === "string" &&
    !timeStr.endsWith("Z") &&
    !timeStr.includes("+")
  ) {
    timeStr += "Z";
  }

  const date = new Date(timeStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 0) return "just now"; // Handle slight clock skew
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
