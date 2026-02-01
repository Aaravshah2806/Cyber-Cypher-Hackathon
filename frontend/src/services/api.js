/**
 * HealFlow API Service
 * All API calls to backend - no hard-coded text
 */

const API_BASE = "/api";

// Generic fetch wrapper with error handling
async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ==================== Config & Labels ====================

export async function getUILabels() {
  return fetchApi("/config/labels");
}

export async function getSystemConfig() {
  return fetchApi("/config/system");
}

export async function getOODAStages() {
  return fetchApi("/config/ooda-stages");
}

// ==================== System Status ====================

export async function getSystemStatus() {
  return fetchApi("/system/status");
}

export async function getMetrics(params = "day") {
  // Backwards compatibility: if string, treat as period
  if (typeof params === "string") {
    return fetchApi(`/system/metrics?period=${params}`);
  }
  // Otherwise serialize params object
  const query = new URLSearchParams(params).toString();
  return fetchApi(`/system/metrics?${query}`);
}

export async function getMetricsHistory(period = "day", limit = 24) {
  return fetchApi(`/system/metrics/history?period=${period}&limit=${limit}`);
}

// ==================== Signals ====================

export async function getSignals(params = {}) {
  const query = new URLSearchParams(params).toString();
  return fetchApi(`/signals${query ? `?${query}` : ""}`);
}

export async function getSignal(signalId) {
  return fetchApi(`/signals/${signalId}`);
}

export async function createSignal(data) {
  return fetchApi("/signals", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function generateSignal() {
  return fetchApi("/signals/generate", { method: "POST" });
}

// ==================== Agents ====================

export async function getAgents(params = {}) {
  const query = new URLSearchParams(params).toString();
  return fetchApi(`/agents${query ? `?${query}` : ""}`);
}

export async function getAgent(agentId) {
  return fetchApi(`/agents/${agentId}`);
}

export async function getAgentCurrentTask(agentId) {
  return fetchApi(`/agents/${agentId}/current-task`);
}

// ==================== OODA Processes ====================

export async function getOODAProcess(processId) {
  return fetchApi(`/ooda-processes/${processId}`);
}

export async function startOODAProcess(signalId) {
  return fetchApi("/ooda/start", {
    method: "POST",
    body: JSON.stringify({ signal_id: signalId }),
  });
}

export async function advanceOODAStep(processId) {
  return fetchApi("/ooda/step", {
    method: "POST",
    body: JSON.stringify({ process_id: processId }),
  });
}

// ==================== HIL Requests ====================

export async function getHILRequests(status = "pending") {
  return fetchApi(`/hil-requests?status=${status}`);
}

export async function getHILRequest(hilId) {
  return fetchApi(`/hil-requests/${hilId}`);
}

export async function createHILRequest(data) {
  return fetchApi("/hil-requests", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function resolveHILRequest(hilId, action, notes = null) {
  return fetchApi(`/hil-requests/${hilId}/resolve`, {
    method: "POST",
    body: JSON.stringify({ action, notes }),
  });
}

// ==================== Config Diffs ====================

export async function getConfigDiff(diffId) {
  return fetchApi(`/config-diffs/${diffId}`);
}

export async function applyConfigDiff(diffId) {
  return fetchApi(`/config-diffs/${diffId}/apply`, { method: "POST" });
}

// ==================== Incidents ====================

export async function getIncidents(params = {}) {
  const query = new URLSearchParams(params).toString();
  return fetchApi(`/incidents${query ? `?${query}` : ""}`);
}

export async function getIncident(incidentId) {
  return fetchApi(`/incidents/${incidentId}`);
}

// ==================== Analytics ====================

export async function getRevenueAtRisk(hours = 24) {
  return fetchApi(`/analytics/revenue-at-risk?hours=${hours}`);
}

export async function getResolutionStats(days = 7) {
  return fetchApi(`/analytics/resolution-stats?days=${days}`);
}

export async function getCriticalInterventions(limit = 10) {
  return fetchApi(`/analytics/critical-interventions?limit=${limit}`);
}

export async function getAutopilotMaturity(days = 30) {
  return fetchApi(`/analytics/autopilot-maturity?days=${days}`);
}

export async function getFrictionLeaderboard(limit = 5) {
  return fetchApi(`/analytics/friction-leaderboard?limit=${limit}`);
}

// ==================== Simulations ====================

export async function triggerSimulation(type, severity = "CRITICAL") {
  return fetchApi("/simulations/trigger", {
    method: "POST",
    body: JSON.stringify({ type, severity }),
  });
}

// ==================== Exports ====================

export async function exportToSlack() {
  return fetchApi("/export/slack", { method: "POST" });
}

export async function exportToPdf() {
  return fetchApi("/export/pdf", { method: "POST" });
}

// ==================== Ghost Mitigations ====================

export async function getGhostMitigations(limit = 50) {
  return fetchApi(`/ghost-mitigations?limit=${limit}`);
}

// ==================== Brief ====================

export async function generateBrief() {
  return fetchApi("/brief");
}

// ==================== Audit ====================

export async function getAuditLog(limit = 100) {
  return fetchApi(`/audit-log?limit=${limit}`);
}

// ==================== Health ====================

export async function healthCheck() {
  return fetchApi("/health");
}
