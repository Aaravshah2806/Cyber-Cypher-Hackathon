"""
HealFlow Configuration
All UI text labels and settings - no hard-coded text in components
"""

# UI Text Labels - pulled by frontend via API
UI_LABELS = {
    # Header
    "app_name": "HealFlow",
    "header_badge": "COMMAND",
    "search_placeholder": "Search systems or events...",
    "brief_me_button": "Brief Me",
    
    # Metrics
    "metric_revenue_protected": "Revenue Protected",
    "metric_dev_hours_saved": "Dev Hours Saved",
    "metric_auto_resolution": "Auto-Resolution",
    "metric_migration_health": "Migration Health Score",
    
    # Sidebar Navigation
    "nav_command_center": "COMMAND CENTER",
    "nav_roi_analytics": "ROI Analytics",
    "nav_live_monitoring": "Live Monitoring", 
    "nav_merchant_logs": "Merchant Logs",
    
    # Sidebar Filters
    "filter_title": "GLOBAL FILTERS",
    "filter_time_period": "Time Period",
    "filter_migration_phase": "Migration Phase",
    "filter_merchant_tier": "Merchant Tier",
    
    # Time Period Options
    "time_last_24h": "Last 24 Hours",
    "time_last_7d": "Last 7 Days",
    "time_last_30d": "Last 30 Days",
    "time_custom": "Custom Range",
    
    # Migration Phase Options
    "phase_all": "All Phases",
    "phase_pre": "Pre-Migration",
    "phase_migration": "Migration",
    "phase_post": "Post-Migration",
    
    # Merchant Tiers
    "tier_enterprise": "Enterprise",
    "tier_mid_market": "Mid-Market",
    "tier_sme": "SME",
    
    # Emergency Controls
    "failsafe_title": "FAIL-SAFE",
    "failsafe_description": "Deactivate autonomous mode for all active migrations",
    "emergency_stop": "EMERGENCY STOP",
    
    # Live Signal Log
    "signal_log_title": "LIVE SIGNAL LOG",
    "signal_log_badge": "LIVE FEED",
    
    # The Brain (OODA)
    "brain_title": "THE BRAIN (OODA VISUALIZER)",
    "brain_agent_active": "AGENT ACTIVE",
    "ooda_observe": "OBSERVE",
    "ooda_orient": "ORIENT",
    "ooda_decide": "DECIDE",
    "ooda_act": "ACT",
    "task_execution": "TASK EXECUTION",
    "chain_of_thought_title": "CHAIN-OF-THOUGHT REASONING",
    "processing": "PROCESSING...",
    
    # HIL Queue
    "hil_title": "HIL QUEUE",
    "hil_revenue_at_risk": "REVENUE AT RISK",
    "hil_stability_index": "STABILITY INDEX",
    "hil_approve": "Approve",
    "hil_reject": "Reject",
    "hil_waiting": "WAITING FOR NEXT SIGNAL...",
    
    # Config Diff Page
    "config_diff_title": "Config Diff & Documentation",
    "back_to_command": "BACK TO COMMAND CENTER",
    "current_config_title": "CURRENT CONFIGURATION",
    "current_config_badge": "ERROR DETECTED",
    "proposed_config_title": "PROPOSED CORRECTION",
    "proposed_config_badge": "HEALFLOW SUGGESTION",
    "docs_title": "DOCUMENTATION SNIPPETS",
    "docs_search": "SEARCH ALL DOCS",
    "agent_explanation_title": "HEALFLOW AGENT EXPLANATION",
    "cited_label": "CITED",
    "confidence_label": "CONFIDENCE",
    "export_json": "Export JSON",
    "apply_fix": "Apply Fix",
    "agent_status": "AGENT STATUS",
    "analysis_time": "ANALYSIS TIME",
    "context_label": "CONTEXT",
    
    # ROI Dashboard
    "roi_title": "Revenue & ROI Impact",
    "roi_subtitle": "Autonomous monitoring active across {count} active migrations.",
    "roi_status": "STATUS",
    "roi_autonomous": "AUTONOMOUS",
    "roi_last_intervention": "LAST INTERVENTION",
    "roi_projected": "Projected ROI for current billing cycle",
    "roi_equivalent": "Equivalent to {count} full-time Engineers",
    "revenue_trends_title": "Revenue at Risk Trends",
    "revenue_trends_subtitle": "Hourly monitoring of potential funnel leakages",
    "resolution_title": "Auto-Resolved vs Human",
    "resolution_subtitle": "Last 7 days efficiency split",
    "ai_ratio": "AI Ratio",
    "interventions_title": "Recent Critical Interventions",
    "view_all": "VIEW ALL INTERVENTIONS",
    
    # Table Headers
    "table_merchant": "MERCHANT NAME",
    "table_incident_type": "INCIDENT TYPE",
    "table_resolution_time": "RESOLUTION TIME",
    "table_protected_impact": "PROTECTED IMPACT",
    "table_status": "STATUS",
    
    # Status Labels
    "status_auto_fixed": "AUTO-FIXED",
    "status_resolved": "RESOLVED",
    "status_pending": "PENDING",
    
    # Footer
    "footer_system_nominal": "SYSTEM NOMINAL",
    "footer_nodes": "NODES",
    "footer_online": "ONLINE",
    "footer_active_agents": "ACTIVE AGENTS",
    "footer_uptime": "UPTIME",
    "footer_latency": "LATENCY",
    
    # Severity Labels
    "severity_critical": "CRITICAL",
    "severity_error": "ERROR",
    "severity_warn": "WARN",
    "severity_info": "INFO",
    "severity_system": "SYSTEM",
}

# System Configuration
SYSTEM_CONFIG = {
    "version": "1.0.0",
    "default_time_period": "24h",
    "default_migration_phase": "all",
    "sla_timeout_seconds": 300,
    "max_signals_display": 50,
    "chart_refresh_interval_ms": 5000,
    "websocket_reconnect_interval_ms": 3000,
}

# Risk Thresholds
RISK_THRESHOLDS = {
    "critical": 10000,  # > $10,000/hour
    "high": 1000,       # $1,000 - $10,000/hour
    "medium": 100,      # $100 - $1,000/hour
    "low": 0            # < $100/hour
}

# OODA Stage Configuration
OODA_STAGES = [
    {"id": "observe", "label": UI_LABELS["ooda_observe"], "order": 1},
    {"id": "orient", "label": UI_LABELS["ooda_orient"], "order": 2},
    {"id": "decide", "label": UI_LABELS["ooda_decide"], "order": 3},
    {"id": "act", "label": UI_LABELS["ooda_act"], "order": 4},
]


def get_ui_labels():
    """Return all UI labels for frontend"""
    return UI_LABELS


def get_system_config():
    """Return system configuration"""
    return SYSTEM_CONFIG


def get_risk_thresholds():
    """Return risk thresholds"""
    return RISK_THRESHOLDS


def get_ooda_stages():
    """Return OODA stage configuration"""
    return OODA_STAGES
