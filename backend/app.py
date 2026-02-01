"""
HealFlow Backend - New Implementation
Flask API with Gemini AI Integration
"""

from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from dotenv import load_dotenv
import os
import random
import threading
from datetime import datetime, timedelta
import json

# Load environment variables
load_dotenv()

# Import local modules
import database as db
from config import get_ui_labels, get_system_config, get_ooda_stages, RISK_THRESHOLDS

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Gemini AI Setup
GEMINI_AVAILABLE = False
genai_client = None

try:
    from google import genai
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if GEMINI_API_KEY:
        genai_client = genai.Client(api_key=GEMINI_API_KEY)
        GEMINI_AVAILABLE = True
        print("✅ Gemini AI configured successfully")
    else:
        print("⚠️ GEMINI_API_KEY not found")
except ImportError:
    print("⚠️ google-genai not installed")


# ==================== API ROUTES ====================

# ---------- Health & Config ----------

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "gemini_available": GEMINI_AVAILABLE,
        "version": get_system_config()["version"]
    })


@app.route('/api/config/labels', methods=['GET'])
def get_labels():
    """Get all UI labels for frontend - no hard-coded text"""
    return jsonify(get_ui_labels())


@app.route('/api/config/system', methods=['GET'])
def get_config():
    """Get system configuration"""
    return jsonify(get_system_config())


@app.route('/api/config/ooda-stages', methods=['GET'])
def get_stages():
    """Get OODA stage configuration"""
    return jsonify(get_ooda_stages())


# ---------- System Status ----------

@app.route('/api/system/status', methods=['GET'])
def get_system_status():
    """Get current system status"""
    status = db.get_system_status()
    if not status:
        return jsonify({
            "status": "nominal",
            "active_nodes": 42,
            "active_agents": 12,
            "uptime": 99.998,
            "latency": 42,
            "version": "CMD_V1.0.0"
        })
    return jsonify(status)


@app.route('/api/system/metrics', methods=['GET'])
def get_metrics():
    """Get current system metrics"""
    period = request.args.get('period', 'day')
    tier_param = request.args.get('tier')
    tiers = tier_param.split(',') if tier_param else None
    phase = request.args.get('phase')
    time_period = request.args.get('time_period')
    
    metrics = db.get_current_metrics(tier=tiers, phase=phase, time_period=time_period)
    
    if not metrics:
        # Return default metrics
        metrics = {
            "revenue_protected": 425000,
            "revenue_protected_change": 12,
            "dev_hours_saved": 1240,
            "dev_hours_saved_change": 5,
            "auto_resolution_rate": 94.2,
            "auto_resolution_rate_change": 2,
            "migration_health_score": 98.4,
            "migration_health_change": 0.4,
            "active_migrations": 42
        }
    
    return jsonify(metrics)


@app.route('/api/system/metrics/history', methods=['GET'])
def get_metrics_history():
    """Get historical metrics"""
    period = request.args.get('period', 'day')
    limit = int(request.args.get('limit', 24))
    history = db.get_metrics_history(period, limit)
    return jsonify({"data": history})


# ---------- Signals ----------

@app.route('/api/signals', methods=['GET'])
def get_signals():
    """Get all signals with optional filtering"""
    limit = int(request.args.get('limit', 50))
    status = request.args.get('status')
    severity = request.args.get('severity')
    phase = request.args.get('phase')
    time_period = request.args.get('time_period')
    
    # Handle tiers as list (comma separated)
    tier_param = request.args.get('tier')
    tiers = tier_param.split(',') if tier_param else None
    
    signals = db.get_all_signals(
        limit=limit, 
        status=status, 
        severity=severity,
        tier=tiers,
        phase=phase,
        time_period=time_period
    )
    
    return jsonify({
        "data": signals,
        "pagination": {
            "total": len(signals),
            "limit": limit,
            "offset": 0,
            "hasMore": False
        }
    })


@app.route('/api/signals/<signal_id>', methods=['GET'])
def get_signal(signal_id):
    """Get a specific signal"""
    signal = db.get_signal(signal_id)
    if not signal:
        abort(404, description="Signal not found")
    return jsonify(signal)


@app.route('/api/signals', methods=['POST'])
def create_signal():
    """Create a new signal"""
    data = request.get_json()
    
    if not data:
        abort(400, description="Request body is required")
    
    required_fields = ['type', 'severity', 'source']
    for field in required_fields:
        if field not in data:
            abort(400, description=f"Field '{field}' is required")
    
    # Validate severity
    valid_severities = ['CRITICAL', 'ERROR', 'WARN', 'INFO', 'SYSTEM']
    if data.get('severity') not in valid_severities:
        abort(400, description=f"Severity must be one of: {valid_severities}")
    
    signal = db.create_signal(data)
    db.log_audit('create', 'signal', signal['id'], details=data)
    
    return jsonify(signal), 201


@app.route('/api/signals/<signal_id>', methods=['PUT', 'PATCH'])
def update_signal(signal_id):
    """Update a signal status"""
    data = request.get_json()
    if not data:
        abort(400, description="Request body required")
    
    signal = db.update_signal(signal_id, data)
    if not signal:
        abort(404, description="Signal not found")
        
    db.log_audit('update', 'signal', signal_id, details=data)
    return jsonify(signal)


@app.route('/api/signals/generate', methods=['POST'])
def generate_signal():
    """Generate a random demo signal"""
    signal_types = [
        {"type": "404_SPIKE_DETECTED", "severity": "CRITICAL", "source": "Shopify_webhook", "endpoint": "/api/v1/checkout/payment"},
        {"type": "STRIPE_LATENCY_HIGH", "severity": "WARN", "source": "PaymentGateway", "endpoint": "/api/v1/payments/process"},
        {"type": "DB_SYNC_SUCCESS", "severity": "INFO", "source": "DatabaseSync", "endpoint": "/internal/sync"},
        {"type": "TOKEN_INVALID", "severity": "ERROR", "source": "AuthService", "endpoint": "/api/v1/auth/verify"},
        {"type": "HEARTBEAT", "severity": "SYSTEM", "source": "SystemMonitor", "endpoint": None},
    ]
    
    # Get a random merchant to associate with this signal
    merchant_id = None
    try:
        with db.get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM merchants")
            ids = [row[0] for row in cursor.fetchall()]
            if ids:
                merchant_id = random.choice(ids)
    except Exception as e:
        print(f"Error fetching merchants: {e}")

    # Select random signal type
    selected = random.choice(signal_types)
    selected['merchant_id'] = merchant_id
    selected['metadata'] = {
        "error": "NOT_FOUND" if selected['severity'] == 'CRITICAL' else None,
        "latency": f"{random.randint(50, 900)}ms",
        "source": selected['source']
    }
    
    signal = db.create_signal(selected)
    return jsonify(signal), 201


# ---------- Agents ----------

@app.route('/api/agents', methods=['GET'])
def get_agents():
    """Get all agents"""
    status = request.args.get('status')
    agent_type = request.args.get('type')
    agents = db.get_all_agents(status=status, agent_type=agent_type)
    return jsonify({"data": agents})


@app.route('/api/agents/<agent_id>', methods=['GET'])
def get_agent(agent_id):
    """Get a specific agent"""
    agent = db.get_agent(agent_id)
    if not agent:
        abort(404, description="Agent not found")
    return jsonify(agent)


@app.route('/api/agents/<agent_id>/current-task', methods=['GET'])
def get_agent_current_task(agent_id):
    """Get agent's current task"""
    agent = db.get_agent(agent_id)
    if not agent:
        abort(404, description="Agent not found")
    
    if not agent.get('current_task_signal_id'):
        return jsonify({"message": "Agent has no active task"})
    
    signal = db.get_signal(agent['current_task_signal_id'])
    
    return jsonify({
        "agent": agent,
        "signal": signal,
        "stage": agent.get('current_task_stage'),
        "progress": agent.get('current_task_progress', 0)
    })


# ---------- OODA Processes ----------

@app.route('/api/ooda-processes/<process_id>', methods=['GET'])
def get_ooda_process(process_id):
    """Get an OODA process by ID"""
    process = db.get_ooda_process(process_id)
    if not process:
        abort(404, description="OODA process not found")
    return jsonify(process)


@app.route('/api/ooda/start', methods=['POST'])
def start_ooda_process():
    """Start a new OODA process for a signal"""
    data = request.get_json()
    signal_id = data.get('signal_id')
    
    if not signal_id:
        abort(400, description="signal_id is required")
    
    signal = db.get_signal(signal_id)
    if not signal:
        abort(404, description="Signal not found")
    
    # Get first available agent
    agents = db.get_all_agents(status='idle')
    if not agents:
        agents = db.get_all_agents()
    
    agent = agents[0] if agents else None
    if not agent:
        abort(500, description="No agents available")
    
    # Create OODA process
    process = db.create_ooda_process(agent['id'], signal_id)
    
    # Update agent status
    db.update_agent(agent['id'], {
        'status': 'processing',
        'current_task_signal_id': signal_id,
        'current_task_stage': 'observe',
        'current_task_progress': 0,
        'current_task_started_at': datetime.utcnow().isoformat()
    })
    
    # Update signal status
    db.update_signal(signal_id, {'status': 'processing', 'agent_id': agent['id']})
    
    return jsonify({
        "process": process,
        "agent": db.get_agent(agent['id']),
        "signal": db.get_signal(signal_id)
    }), 201


@app.route('/api/ooda/step', methods=['POST'])
def advance_ooda_step():
    """Advance OODA process by one step"""
    data = request.get_json()
    process_id = data.get('process_id')
    
    if not process_id:
        abort(400, description="process_id is required")
    
    process = db.get_ooda_process(process_id)
    if not process:
        abort(404, description="OODA process not found")
    
    signal = db.get_signal(process['signal_id'])
    agent = db.get_agent(process['agent_id'])
    
    # Determine current and next stage
    stages = ['observe', 'orient', 'decide', 'act']
    current_stage = None
    
    for stage in stages:
        if process.get(f'{stage}_status') == 'active':
            current_stage = stage
            break
    
    if not current_stage:
        # Find first pending stage
        for stage in stages:
            if process.get(f'{stage}_status') == 'pending':
                current_stage = stage
                db.update_ooda_process(process_id, {f'{stage}_status': 'active'})
                break
    
    if not current_stage:
        return jsonify({"message": "OODA process already complete", "process": process})
    
    # Generate stage output using Gemini or fallback
    stage_output = _generate_stage_output(current_stage, signal, process)
    
    # Update process with stage completion
    updates = {
        f'{current_stage}_status': 'complete',
        f'{current_stage}_completed_at': datetime.utcnow().isoformat()
    }
    
    if current_stage == 'observe':
        updates['observe_findings'] = stage_output.get('findings', [])
    elif current_stage == 'orient':
        updates['orient_context'] = stage_output.get('context', '')
        updates['orient_related_incidents'] = stage_output.get('related', [])
    elif current_stage == 'decide':
        updates['decide_chain_of_thought'] = stage_output.get('chain_of_thought', [])
        updates['decide_proposed_solution'] = stage_output.get('proposed_solution', {})
    elif current_stage == 'act':
        updates['act_actions'] = stage_output.get('actions', [])
        updates['completed_at'] = datetime.utcnow().isoformat()
    
    # Activate next stage
    stage_idx = stages.index(current_stage)
    if stage_idx < len(stages) - 1:
        next_stage = stages[stage_idx + 1]
        updates[f'{next_stage}_status'] = 'active'
        
        # Update agent progress
        progress = int((stage_idx + 1) / len(stages) * 100)
        db.update_agent(agent['id'], {
            'current_task_stage': next_stage,
            'current_task_progress': progress
        })
    else:
        # Process complete
        db.update_agent(agent['id'], {
            'status': 'idle',
            'current_task_signal_id': None,
            'current_task_stage': None,
            'current_task_progress': 0
        })
        db.update_signal(process['signal_id'], {'status': 'resolved'})
    
    db.update_ooda_process(process_id, updates)
    
    return jsonify({
        "stage_completed": current_stage,
        "output": stage_output,
        "process": db.get_ooda_process(process_id)
    })


def _generate_stage_output(stage, signal, process):
    """Generate output for OODA stage using Gemini or fallback"""
    if GEMINI_AVAILABLE and genai_client:
        try:
            return _generate_with_gemini(stage, signal, process)
        except Exception as e:
            print(f"Gemini error: {e}")
    
    # Fallback responses
    return _generate_fallback(stage, signal)


def _generate_with_gemini(stage, signal, process):
    """Use Gemini to generate stage output"""
    prompts = {
        'observe': f"""Analyze this system signal and identify key observations:
Signal: {json.dumps(signal)}
Return JSON with 'findings' array of 3-5 key observations.""",
        
        'orient': f"""Given these signal observations, provide context:
Signal: {json.dumps(signal)}
Findings: {json.dumps(process.get('observe_findings', []))}
Return JSON with 'context' string and 'related' array of related incident patterns.""",
        
        'decide': f"""Based on analysis, determine root cause and solution:
Signal: {json.dumps(signal)}
Context: {process.get('orient_context', '')}
Return JSON with:
- 'chain_of_thought': array of 5 reasoning steps
- 'proposed_solution': object with 'type', 'description', 'confidence', 'risk_level'""",
        
        'act': f"""Generate action plan for resolution:
Signal: {json.dumps(signal)}
Solution: {json.dumps(process.get('decide_proposed_solution', {}))}
Return JSON with 'actions' array containing action objects with 'type' and 'description'."""
    }
    
    prompt = prompts.get(stage, "Analyze the signal")
    
    response = genai_client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )
    text = response.text
    
    # Try to parse JSON from response
    try:
        # Find JSON in response
        start = text.find('{')
        end = text.rfind('}') + 1
        if start >= 0 and end > start:
            return json.loads(text[start:end])
    except:
        pass
    
    return _generate_fallback(stage, signal)


def _generate_fallback(stage, signal):
    """Generate fallback stage output"""
    signal_type = signal.get('type', 'UNKNOWN')
    severity = signal.get('severity', 'INFO')
    
    if stage == 'observe':
        return {
            "findings": [
                f"Detected {severity} signal: {signal_type}",
                f"Source: {signal.get('source', 'Unknown')}",
                f"Endpoint affected: {signal.get('endpoint', 'N/A')}",
                "Analyzing pattern against historical data",
                "Correlating with recent system changes"
            ]
        }
    elif stage == 'orient':
        return {
            "context": f"Signal {signal_type} indicates potential system issue. Analyzing impact on checkout flow and revenue.",
            "related": ["Similar pattern observed 3 days ago", "Migration phase correlation detected"]
        }
    elif stage == 'decide':
        return {
            "chain_of_thought": [
                f"Detecting abnormal spike in responses from {signal.get('endpoint', 'gateway')}.",
                "Comparing current log pattern with migration schema v2.1. Identification: Missing legacy session mapping.",
                "Hypothesis: API Gateway middleware is dropping headers from legacy session tokens.",
                "Proposed Decision: Re-route traffic through Legacy-Bridge node and inject token-fix-script.",
                "Waiting for human approval for High-Risk action (Revenue at risk)..."
            ],
            "proposed_solution": {
                "type": "config_change",
                "description": "Apply session mapping fix and enable token injection",
                "confidence": 87,
                "risk_level": "high" if severity == 'CRITICAL' else "medium"
            }
        }
    elif stage == 'act':
        return {
            "actions": [
                {"type": "config_update", "description": "Update session_mapping to strict_legacy_v2"},
                {"type": "enable_feature", "description": "Enable token_injection"},
                {"type": "deploy_script", "description": "Deploy legacy_fix_v1.js"}
            ]
        }
    
    return {}


# ---------- HIL Requests ----------

@app.route('/api/hil-requests', methods=['GET'])
def get_hil_requests():
    """Get all pending HIL requests"""
    status = request.args.get('status', 'pending')
    requests = db.get_pending_hil_requests() if status == 'pending' else []
    return jsonify({"data": requests, "count": len(requests)})


@app.route('/api/hil-requests/<hil_id>', methods=['GET'])
def get_hil_request(hil_id):
    """Get a specific HIL request"""
    hil = db.get_hil_request(hil_id)
    if not hil:
        abort(404, description="HIL request not found")
    return jsonify(hil)


@app.route('/api/hil-requests', methods=['POST'])
def create_hil_request():
    """Create a new HIL request"""
    data = request.get_json()
    
    required_fields = ['agent_id', 'signal_id', 'title', 'proposed_action', 'metrics']
    for field in required_fields:
        if field not in data:
            abort(400, description=f"Field '{field}' is required")
    
    hil = db.create_hil_request(data)
    db.log_audit('create', 'hil_request', hil['id'])
    
    return jsonify(hil), 201


@app.route('/api/hil-requests/<hil_id>/resolve', methods=['POST'])
def resolve_hil_request(hil_id):
    """Resolve (approve/reject) a HIL request"""
    data = request.get_json()
    action = data.get('action')
    notes = data.get('notes')
    
    if action not in ['approved', 'rejected']:
        abort(400, description="Action must be 'approved' or 'rejected'")
    
    hil = db.resolve_hil_request(hil_id, action, notes)
    if not hil:
        abort(404, description="HIL request not found")
    
    db.log_audit('resolve', 'hil_request', hil_id, details={'action': action})
    
    return jsonify(hil)


# ---------- Config Diffs ----------

@app.route('/api/config-diffs/<diff_id>', methods=['GET'])
def get_config_diff(diff_id):
    """Get a config diff by ID"""
    diff = db.get_config_diff(diff_id)
    if not diff:
        # Return demo config diff
        diff = _generate_demo_config_diff(diff_id)
    return jsonify(diff)


@app.route('/api/config-diffs', methods=['POST'])
def create_config_diff():
    """Create a new config diff"""
    data = request.get_json()
    diff = db.create_config_diff(data)
    return jsonify(diff), 201


@app.route('/api/config-diffs/<diff_id>/apply', methods=['POST'])
def apply_config_diff(diff_id):
    """Apply a config diff"""
    diff = db.get_config_diff(diff_id)
    if not diff:
        abort(404, description="Config diff not found")
    
    db.log_audit('apply', 'config_diff', diff_id)
    
    return jsonify({
        "success": True,
        "appliedAt": datetime.utcnow().isoformat(),
        "message": "Configuration changes applied successfully"
    })


def _generate_demo_config_diff(incident_id):
    """Generate demo config diff data"""
    return {
        "id": incident_id,
        "incident_id": incident_id,
        "current_config": {
            "gateway": "v2.legacy_bridge",
            "auth_strategy": "jwt_standard",
            "session_mapping": "auto",
            "token_injection": False,
            "retry_policy": {
                "attempts": 3,
                "backoff": "exponential"
            },
            "endpoints": [
                "/api/v1/checkout",
                "/api/v1/payment"
            ]
        },
        "current_errors": [
            {"line": 4, "key": "session_mapping", "value": "auto", "reason": "Legacy sessions not recognized"},
            {"line": 5, "key": "token_injection", "value": False, "reason": "Tokens not being re-signed"}
        ],
        "proposed_config": {
            "gateway": "v2.legacy_bridge",
            "auth_strategy": "jwt_standard",
            "session_mapping": "strict_legacy_v2",
            "token_injection": True,
            "injection_script": "legacy_fix_v1.js",
            "retry_policy": {
                "attempts": 3,
                "backoff": "exponential"
            },
            "endpoints": [
                "/api/v1/checkout",
                "/api/v1/payment"
            ]
        },
        "proposed_changes": [
            {"line": 4, "type": "modified", "key": "session_mapping", "oldValue": "auto", "newValue": "strict_legacy_v2"},
            {"line": 5, "type": "modified", "key": "token_injection", "oldValue": False, "newValue": True},
            {"line": 6, "type": "added", "key": "injection_script", "newValue": "legacy_fix_v1.js"}
        ],
        "documentation": [
            {
                "id": "DOC-MIG-772",
                "title": "Legacy Session Persistence",
                "category": "Migration",
                "content": "When migrating from legacy architectures, the session_mapping parameter must be explicitly defined as strict_legacy_v2 if custom...",
                "relevance": 98
            },
            {
                "id": "AUTH-API-101",
                "title": "Token Injection Protocols",
                "category": "Authentication",
                "content": "Enabling token_injection allows the gateway to automatically append necessary JWT claims required by the backend fulfillment service...",
                "relevance": 85
            },
            {
                "id": "SYS-ERR-404",
                "title": "Common Migration 404s",
                "category": "Troubleshooting",
                "content": "Unexpected 404 errors at the checkout endpoint often indicate a failure in header propagation or session mismatch between...",
                "relevance": 76
            }
        ],
        "explanation": "The detected 404 spike is caused by a failure in the legacy session bridge. The current configuration uses auto session mapping, which is failing to recognize headers from your legacy Shopify Plus storefront.\n\nBased on the Migration Documentation (Section 4.2: Session Persistence), I have proposed switching to strict_legacy_v2 and enabling token_injection. This will ensure that legacy auth tokens are correctly re-signed before being passed to the new checkout gateway.",
        "confidence": 98.4,
        "cited_docs": ["DOC-MIG-772"]
    }


# ---------- Incidents ----------

@app.route('/api/incidents', methods=['GET'])
def get_incidents():
    """Get all incidents"""
    limit = int(request.args.get('limit', 50))
    status = request.args.get('status')
    severity = request.args.get('severity')
    
    incidents = db.get_all_incidents(limit=limit, status=status, severity=severity)
    
    return jsonify({
        "data": incidents,
        "pagination": {
            "total": len(incidents),
            "limit": limit,
            "offset": 0,
            "hasMore": False
        }
    })


@app.route('/api/incidents/<incident_id>', methods=['GET'])
def get_incident(incident_id):
    """Get a specific incident with full details"""
    incident = db.get_incident(incident_id)
    if not incident:
        abort(404, description="Incident not found")
    return jsonify(incident)


# ---------- Analytics ----------

@app.route('/api/analytics/revenue-at-risk', methods=['GET'])
def get_revenue_at_risk():
    """Get revenue at risk trends"""
    hours = int(request.args.get('hours', 24))
    data = db.get_revenue_at_risk_data(hours)
    return jsonify(data)


@app.route('/api/analytics/resolution-stats', methods=['GET'])
def get_resolution_stats():
    """Get auto-resolved vs human resolution stats"""
    days = int(request.args.get('days', 7))
    stats = db.get_resolution_stats(days)
    return jsonify(stats)


@app.route('/api/analytics/critical-interventions', methods=['GET'])
def get_critical_interventions():
    """Get recent critical interventions"""
    limit = int(request.args.get('limit', 10))
    incidents = db.get_critical_interventions(limit)
    return jsonify({"data": incidents})


# ---------- Ghost Mitigations ----------

@app.route('/api/ghost-mitigations', methods=['GET'])
def get_ghost_mitigations():
    """Get all ghost mitigations"""
    limit = int(request.args.get('limit', 50))
    mitigations = db.get_ghost_mitigations(limit)
    return jsonify({"data": mitigations})


# ---------- Brief Me (Executive Summary) ----------

@app.route('/api/brief', methods=['GET'])
def generate_brief():
    """Generate executive summary"""
    metrics = db.get_current_metrics()
    incidents = db.get_all_incidents(limit=5)
    
    summary = {
        "generated_at": datetime.utcnow().isoformat(),
        "time_range": "Last 24 hours",
        "highlights": [
            f"Protected ${metrics.get('revenue_protected', 0):,.0f} in revenue",
            f"Saved {metrics.get('dev_hours_saved', 0):.0f} engineering hours",
            f"Achieved {metrics.get('auto_resolution_rate', 0):.1f}% auto-resolution rate",
            f"System health at {metrics.get('migration_health_score', 0):.1f}%"
        ],
        "recent_incidents": len(incidents),
        "critical_items": sum(1 for i in incidents if i.get('severity') == 'critical'),
        "status": "All systems operational"
    }
    
    if GEMINI_AVAILABLE and genai_client:
        try:
            prompt = f"""Generate a brief executive summary paragraph based on:
Metrics: {json.dumps(metrics)}
Recent incidents: {len(incidents)}
Keep it to 2-3 sentences, professional tone."""
            
            response = genai_client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt
            )
            summary["ai_summary"] = response.text
        except Exception as e:
            print(f"Brief generation error: {e}")
    
    return jsonify(summary)


# ---------- Audit Log ----------

@app.route('/api/audit-log', methods=['GET'])
def get_audit_log():
    """Get audit log"""
    limit = int(request.args.get('limit', 100))
    log = db.get_audit_log(limit)
    return jsonify({"data": log})


# ==================== ERROR HANDLERS ====================

@app.errorhandler(400)
def bad_request(e):
    return jsonify({"error": "Bad Request", "message": str(e.description)}), 400


@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not Found", "message": str(e.description)}), 404


@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": "Internal Server Error", "message": str(e)}), 500


# ==================== BACKGROUND TASKS ====================

def _background_worker():
    """Background task: Heartbeats + Auto-Resolution Agent"""
    import time
    print("🤖 AI Background Agent started")
    
    last_heartbeat = time.time()
    
    while True:
        try:
            with app.app_context():
                current_time = time.time()
                
                # 1. HEARTBEAT (Every 60s)
                if current_time - last_heartbeat > 60:
                    hb_signal = {
                        "type": "HEARTBEAT",
                        "severity": "SYSTEM",
                        "source": "SystemMonitor",
                        "endpoint": None,
                        "metadata": {"status": "nominal", "active_threads": threading.active_count()}
                    }
                    db.create_signal(hb_signal)
                    last_heartbeat = current_time
                
                # 2. AUTO-RESOLVE STALE SIGNALS
                # Find signals that are pending/processing for > 30 seconds (orphaned from frontend demo)
                pending_signals = db.get_all_signals(limit=20, status='pending')
                processing_signals = db.get_all_signals(limit=20, status='processing')
                
                all_candidates = pending_signals + processing_signals
                
                for sig in all_candidates:
                    # Parse timestamp
                    try:
                        sig_time = datetime.fromisoformat(sig['timestamp'])
                        # If older than 45 seconds, AI takes over
                        if (datetime.utcnow() - sig_time).total_seconds() > 45:
                            print(f"🤖 AI Agent auto-resolving stale signal: {sig['type']}")
                            
                            # Determine resolution based on severity
                            resolution_notes = "Auto-resolved by Background AI Agent"
                            
                            if sig['severity'] == 'CRITICAL':
                                # For critical, we might verify if it's already in HIL
                                # But per user request "should get complete", we'll resolve it
                                # assuming the "human" is absent (frontend closed).
                                resolution_notes += " (Emergency Protocol)"
                                
                            # Mark as resolved
                            db.update_signal(sig['id'], {
                                'status': 'resolved',
                                'agent_id': 'agent_background_ai',
                                'metadata': {
                                    **sig.get('metadata', {}),
                                    'resolution': resolution_notes,
                                    'resolved_by': 'HealFlow_Auto_GBK'
                                }
                            })
                            
                            # Create an incident record for it to show "work done"
                            merchant_id = sig.get('merchant_id') or 'merch_default'
                            db.get_connection().execute('''
                                INSERT INTO incidents (
                                    id, signal_id, merchant_id, type, title, description, severity, status,
                                    detected_at, resolved_at, resolution_time, resolution_type, revenue_protected, created_at
                                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            ''', (
                                db.generate_id('inc_auto_'), 
                                sig['id'], 
                                merchant_id, 
                                sig['type'], 
                                f"Auto-Resolved: {sig['type']}", 
                                resolution_notes, 
                                sig['severity'].lower(), 
                                'resolved', 
                                sig['timestamp'], 
                                datetime.utcnow().isoformat(), 
                                45, 
                                'auto_fixed', 
                                random.randint(1000, 50000), 
                                datetime.utcnow().isoformat()
                            ))
                            db.get_connection().commit()
                            
                    except Exception as e:
                        print(f"Error processing signal {sig['id']}: {e}")
            
            # Sleep briefly
            time.sleep(10)
                
        except Exception as e:
            print(f"Background worker error: {e}")
            time.sleep(10)

# ==================== MAIN ====================

if __name__ == '__main__':
    print("\n🚀 HealFlow Backend Starting...")
    print(f"   Gemini AI: {'✅ Enabled' if GEMINI_AVAILABLE else '⚠️ Disabled'}")
    print(f"   Database: {db.DATABASE_PATH}")
    
    # Initialize DB (which refreshes timestamps)
    db.init_database()
    
    # Start background worker (only if main process)
    if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
        worker_thread = threading.Thread(target=_background_worker, daemon=True)
        worker_thread.start()
    
    print("\n")
    app.run(host='0.0.0.0', port=5000, debug=True)
