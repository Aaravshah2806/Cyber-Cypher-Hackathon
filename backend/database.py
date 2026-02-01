"""
HealFlow Database Service
SQLite-based persistent storage for all entities
"""

import sqlite3
import json
import os
import random
from datetime import datetime, timedelta
from contextlib import contextmanager
import os
import threading
import uuid

DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'healflow.db')

_local = threading.local()


def get_connection():
    """Get a thread-safe database connection"""
    if not hasattr(_local, 'connection'):
        _local.connection = sqlite3.connect(DATABASE_PATH, check_same_thread=False)
        _local.connection.row_factory = sqlite3.Row
    return _local.connection


@contextmanager
def get_db():
    """Context manager for database operations"""
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e


def generate_id(prefix=""):
    """Generate a unique ID with optional prefix"""
    return f"{prefix}{uuid.uuid4().hex[:12]}"


def init_database():
    """Initialize database with all required tables"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # System Status table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS system_status (
                id TEXT PRIMARY KEY,
                status TEXT NOT NULL DEFAULT 'nominal',
                active_nodes INTEGER DEFAULT 42,
                active_agents INTEGER DEFAULT 12,
                uptime REAL DEFAULT 99.998,
                latency INTEGER DEFAULT 42,
                version TEXT DEFAULT 'CMD_V1.0.0',
                updated_at TEXT
            )
        ''')
        
        # Merchants table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS merchants (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                tier TEXT DEFAULT 'mid_market',
                logo_url TEXT,
                migration_phase TEXT,
                created_at TEXT,
                updated_at TEXT
            )
        ''')
        
        # Signals table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS signals (
                id TEXT PRIMARY KEY,
                timestamp TEXT NOT NULL,
                severity TEXT NOT NULL,
                type TEXT NOT NULL,
                source TEXT NOT NULL,
                endpoint TEXT,
                merchant_id TEXT,
                metadata TEXT DEFAULT '{}',
                agent_id TEXT,
                status TEXT DEFAULT 'pending',
                created_at TEXT
            )
        ''')
        
        # Agents table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS agents (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                type TEXT DEFAULT 'issue_resolution',
                status TEXT DEFAULT 'idle',
                current_task_signal_id TEXT,
                current_task_stage TEXT,
                current_task_progress INTEGER DEFAULT 0,
                current_task_started_at TEXT,
                capabilities TEXT DEFAULT '[]',
                total_resolutions INTEGER DEFAULT 0,
                success_rate REAL DEFAULT 0,
                avg_resolution_time REAL DEFAULT 0,
                revenue_protected REAL DEFAULT 0,
                created_at TEXT,
                updated_at TEXT
            )
        ''')
        
        # OODA Processes table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ooda_processes (
                id TEXT PRIMARY KEY,
                agent_id TEXT NOT NULL,
                signal_id TEXT NOT NULL,
                started_at TEXT NOT NULL,
                completed_at TEXT,
                observe_status TEXT DEFAULT 'pending',
                observe_findings TEXT DEFAULT '[]',
                observe_completed_at TEXT,
                orient_status TEXT DEFAULT 'pending',
                orient_context TEXT,
                orient_related_incidents TEXT DEFAULT '[]',
                orient_completed_at TEXT,
                decide_status TEXT DEFAULT 'pending',
                decide_chain_of_thought TEXT DEFAULT '[]',
                decide_proposed_solution TEXT,
                decide_completed_at TEXT,
                act_status TEXT DEFAULT 'pending',
                act_actions TEXT DEFAULT '[]',
                act_completed_at TEXT
            )
        ''')
        
        # HIL Requests table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS hil_requests (
                id TEXT PRIMARY KEY,
                agent_id TEXT NOT NULL,
                signal_id TEXT NOT NULL,
                ooda_process_id TEXT,
                created_at TEXT NOT NULL,
                priority TEXT DEFAULT 'medium',
                title TEXT NOT NULL,
                description TEXT,
                root_cause TEXT,
                proposed_action TEXT NOT NULL,
                metrics TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                resolution TEXT,
                expires_at TEXT
            )
        ''')
        
        # Config Diffs table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS config_diffs (
                id TEXT PRIMARY KEY,
                incident_id TEXT NOT NULL,
                current_config TEXT NOT NULL,
                current_errors TEXT DEFAULT '[]',
                proposed_config TEXT NOT NULL,
                proposed_changes TEXT DEFAULT '[]',
                documentation TEXT DEFAULT '[]',
                explanation TEXT NOT NULL,
                confidence REAL DEFAULT 0,
                cited_docs TEXT DEFAULT '[]',
                created_at TEXT
            )
        ''')
        
        # Incidents table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS incidents (
                id TEXT PRIMARY KEY,
                signal_id TEXT NOT NULL,
                merchant_id TEXT NOT NULL,
                type TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                severity TEXT DEFAULT 'medium',
                status TEXT DEFAULT 'detected',
                detected_at TEXT NOT NULL,
                resolved_at TEXT,
                resolution_time INTEGER,
                resolution_type TEXT,
                revenue_protected REAL DEFAULT 0,
                affected_users INTEGER DEFAULT 0,
                downtime INTEGER DEFAULT 0,
                agent_id TEXT,
                ooda_process_id TEXT,
                hil_request_id TEXT,
                config_diff_id TEXT,
                timeline TEXT DEFAULT '[]',
                created_at TEXT,
                updated_at TEXT
            )
        ''')
        
        # Metrics table (time-series)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS metrics (
                id TEXT PRIMARY KEY,
                timestamp TEXT NOT NULL,
                period TEXT DEFAULT 'hour',
                revenue_protected REAL DEFAULT 0,
                revenue_protected_change REAL DEFAULT 0,
                dev_hours_saved REAL DEFAULT 0,
                dev_hours_saved_change REAL DEFAULT 0,
                auto_resolution_rate REAL DEFAULT 0,
                auto_resolution_rate_change REAL DEFAULT 0,
                total_incidents INTEGER DEFAULT 0,
                auto_resolved INTEGER DEFAULT 0,
                human_intervention INTEGER DEFAULT 0,
                migration_health_score REAL DEFAULT 0,
                migration_health_change REAL DEFAULT 0,
                active_migrations INTEGER DEFAULT 0,
                created_at TEXT
            )
        ''')
        
        # Revenue at Risk (time-series)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS revenue_at_risk (
                id TEXT PRIMARY KEY,
                timestamp TEXT NOT NULL,
                amount REAL NOT NULL,
                incidents_count INTEGER DEFAULT 0,
                created_at TEXT
            )
        ''')
        
        # Ghost Mitigations table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ghost_mitigations (
                id TEXT PRIMARY KEY,
                signal_id TEXT NOT NULL,
                action_taken TEXT NOT NULL,
                revenue_protected REAL DEFAULT 0,
                created_at TEXT
            )
        ''')
        
        # Audit Log table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS audit_log (
                id TEXT PRIMARY KEY,
                timestamp TEXT NOT NULL,
                action_type TEXT NOT NULL,
                entity_type TEXT NOT NULL,
                entity_id TEXT,
                actor TEXT DEFAULT 'system',
                details TEXT
            )
        ''')
        
        # Initialize system status if not exists
        cursor.execute('SELECT COUNT(*) FROM system_status')
        if cursor.fetchone()[0] == 0:
            cursor.execute('''
                INSERT INTO system_status (id, status, updated_at)
                VALUES (?, ?, ?)
            ''', (generate_id('sys_'), 'nominal', datetime.utcnow().isoformat()))
        
        # Seed initial data
        _seed_initial_data(cursor)
        
        # Refresh timestamps to keep demo data fresh
        _shift_timestamps(cursor)
        
        conn.commit()


def _seed_initial_data(cursor):
    """Seed initial demo data"""
    now = datetime.utcnow()
    
    # Check if data already exists
    cursor.execute('SELECT COUNT(*) FROM merchants')
    if cursor.fetchone()[0] > 0:
        return
    
    # Seed merchants
    merchants = [
        (generate_id('merch_'), 'Lux Modern', 'enterprise', None, 'migration', now.isoformat()),
        (generate_id('merch_'), 'Velvet Direct', 'enterprise', None, 'post-migration', now.isoformat()),
        (generate_id('merch_'), 'Nordic Soul', 'mid_market', None, 'migration', now.isoformat()),
        (generate_id('merch_'), 'Apex Parts', 'mid_market', None, 'pre-migration', now.isoformat()),
        (generate_id('merch_'), 'TechFlow Pro', 'enterprise', None, 'migration', now.isoformat()),
    ]
    cursor.executemany('''
        INSERT INTO merchants (id, name, tier, logo_url, migration_phase, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', merchants)
    
    # Seed agents
    agents = [
        (generate_id('agent_'), 'Issue Resolution Agent', 'issue_resolution', 'active', 156, 94.2, 45.3, 425000, now.isoformat()),
        (generate_id('agent_'), 'Migration Monitor', 'monitoring', 'idle', 89, 97.1, 12.1, 180000, now.isoformat()),
        (generate_id('agent_'), 'Security Sentinel', 'security', 'idle', 34, 99.8, 8.4, 95000, now.isoformat()),
    ]
    cursor.executemany('''
        INSERT INTO agents (id, name, type, status, total_resolutions, success_rate, avg_resolution_time, revenue_protected, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', agents)
    
    # Seed current metrics
    metrics_id = generate_id('metric_')
    cursor.execute('''
        INSERT INTO metrics (
            id, timestamp, period, revenue_protected, revenue_protected_change,
            dev_hours_saved, dev_hours_saved_change, auto_resolution_rate, auto_resolution_rate_change,
            total_incidents, auto_resolved, human_intervention, migration_health_score,
            migration_health_change, active_migrations, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        metrics_id, now.isoformat(), 'day', 
        425000, 12, 1240, 5, 94.2, 2,
        156, 147, 9, 98.4, 0.4, 42, now.isoformat()
    ))
    
    # Seed sample signals - Create a rich history for 30d view
    signals = []
    
    # 1. Recent signals (Last 24h) - 8 signals
    for i in range(8):
        offset_mins = i * 45 + random.randint(0, 30)
        ts = (now - timedelta(minutes=offset_mins)).isoformat()
        signals.append((
            generate_id('sig_'), 
            ts, 
            random.choice(['INFO', 'WARN', 'SYSTEM']), 
            random.choice(['DB_SYNC_SUCCESS', 'HEARTBEAT', 'CACHE_REFRESH', 'API_LATENCY_SPIKE']),
            'SystemMonitor', 
            '/internal/health', 
            'resolved'
        ))
        
    # 2. Last Week signals (2-7 days ago) - 10 signals
    for i in range(10):
        offset_days = random.randint(1, 6)
        offset_hours = random.randint(0, 23)
        ts = (now - timedelta(days=offset_days, hours=offset_hours)).isoformat()
        signals.append((
            generate_id('sig_'),
            ts,
            random.choice(['WARN', 'ERROR', 'INFO']),
            random.choice(['PAYMENT_DECLINE_SPIKE', 'INVENTORY_MISMATCH', 'LOGIN_FAILURE_RATE']),
            'PaymentGateway' if i % 2 == 0 else 'InventoryService',
            '/api/v1/checkout' if i % 2 == 0 else '/api/v1/stock',
            'resolved'
        ))

    # 3. Last Month signals (8-29 days ago) - 12 signals
    for i in range(12):
        offset_days = random.randint(8, 29)
        offset_hours = random.randint(0, 23)
        ts = (now - timedelta(days=offset_days, hours=offset_hours)).isoformat()
        signals.append((
            generate_id('sig_'),
            ts,
            random.choice(['CRITICAL', 'ERROR', 'WARN']),
            random.choice(['DB_SCHEMA_CORRUPTION', 'LEGACY_BRIDGE_FAILURE', 'TOKEN_INVALID']),
            'LegacyBridge',
            '/api/v1/legacy/sync',
            'resolved' # Old signals are resolved
        ))

    # Assign random merchants to these historical signals
    merchant_ids = []
    if merchants: # Check if merchants list exists locally or query db
       # We just inserted them, their IDs are in `merchants` list variable
       merchant_ids = [m[0] for m in merchants]

    for sig in signals:
        # Convert tuple to list to append merchant_id
        sig_list = list(sig)
        merch_id = random.choice(merchant_ids) if merchant_ids else None
        
        # Insert with random merchant
        cursor.execute('''
            INSERT INTO signals (id, timestamp, severity, type, source, endpoint, status, merchant_id, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (*sig_list, merch_id, now.isoformat()))
    
    # Seed revenue at risk data (last 24 hours, hourly)
    for i in range(24):
        hour_time = now - timedelta(hours=23-i)
        amount = 15000 + (i * 1200) + ((i % 5) * 3000)
        if i == 14:  # Peak at 2 PM
            amount = 42000
        cursor.execute('''
            INSERT INTO revenue_at_risk (id, timestamp, amount, incidents_count, created_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (generate_id('risk_'), hour_time.isoformat(), amount, i % 4 + 1, now.isoformat()))
    
        # Seed sample incidents for table
    merchant_ids = [m[0] for m in merchants]
    incidents = [
        (generate_id('inc_'), signals[0][0], merchant_ids[0], 'Cart API Latency (Migration UAT)', 'Cart API Latency', None, 'critical', 'resolved', (now - timedelta(hours=2)).isoformat(), now.isoformat(), 74, 'auto_fixed', 12450),
        (generate_id('inc_'), signals[1][0], merchant_ids[1], 'Payment Webhook Failover', 'Payment Webhook Failover', None, 'high', 'resolved', (now - timedelta(hours=4)).isoformat(), now.isoformat(), 48, 'auto_fixed', 8200),
        (generate_id('inc_'), signals[2][0], merchant_ids[2], 'Stock Sync Discrepancy', 'Stock Sync Discrepancy', None, 'medium', 'resolved', (now - timedelta(hours=6)).isoformat(), now.isoformat(), 292, 'human_resolved', 4120),
        (generate_id('inc_'), signals[3][0], merchant_ids[3], 'Checkout CSS Injection (Security)', 'Security Alert', None, 'low', 'resolved', (now - timedelta(hours=8)).isoformat(), now.isoformat(), 10, 'auto_fixed', 2900),
    ]
    for inc in incidents:
        cursor.execute('''
            INSERT INTO incidents (
                id, signal_id, merchant_id, type, title, description, severity, status,
                detected_at, resolved_at, resolution_time, resolution_type, revenue_protected, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (*inc, now.isoformat()))


def _shift_timestamps(cursor):
    """Shift all timestamps to make the latest activity recent"""
    # Find the most recent signal
    cursor.execute('SELECT MAX(timestamp) FROM signals')
    latest_str = cursor.fetchone()[0]
    
    if not latest_str:
        return
        
    latest = datetime.fromisoformat(latest_str)
    now = datetime.utcnow()
    
    # Calculate shift needed (target: latest was just now, to keep history valid)
    shift = now - latest
    
    # Only shift if latest is older than 5 minutes (avoids shifting on every single restart if already recent)
    if shift.total_seconds() > 300:
        print(f"   ⏱️ Shifting historical data by {shift}")
        
        # Shift signals
        cursor.execute('SELECT id, timestamp FROM signals')
        for row in cursor.fetchall():
            try:
                ts = datetime.fromisoformat(row[1])
                new_ts = (ts + shift).isoformat()
                cursor.execute('UPDATE signals SET timestamp = ? WHERE id = ?', (new_ts, row[0]))
            except:
                pass
            
        # Shift metrics
        cursor.execute('SELECT id, timestamp FROM metrics')
        for row in cursor.fetchall():
            try:
                ts = datetime.fromisoformat(row[1])
                new_ts = (ts + shift).isoformat()
                cursor.execute('UPDATE metrics SET timestamp = ? WHERE id = ?', (new_ts, row[0]))
            except:
                pass

        # Shift revenue_at_risk
        cursor.execute('SELECT id, timestamp FROM revenue_at_risk')
        for row in cursor.fetchall():
            try:
                ts = datetime.fromisoformat(row[1])
                new_ts = (ts + shift).isoformat()
                cursor.execute('UPDATE revenue_at_risk SET timestamp = ? WHERE id = ?', (new_ts, row[0]))
            except:
                pass
        
        # Update incidents
        cursor.execute('SELECT id, detected_at, resolved_at FROM incidents')
        for row in cursor.fetchall():
            try:
                t1 = datetime.fromisoformat(row[1]) if row[1] else None
                t2 = datetime.fromisoformat(row[2]) if row[2] else None
                
                u_params = []
                u_sql = "UPDATE incidents SET "
                
                if t1:
                    u_sql += "detected_at = ?, "
                    u_params.append((t1 + shift).isoformat())
                if t2:
                    u_sql += "resolved_at = ? "
                    u_params.append((t2 + shift).isoformat())
                else:
                    u_sql = u_sql.rstrip(", ")
                
                u_sql += " WHERE id = ?"
                u_params.append(row[0])
                
                cursor.execute(u_sql, u_params)
            except:
                pass


# ==================== HELPER FUNCTIONS ====================

def row_to_dict(row):
    """Convert sqlite Row to dictionary"""
    if row is None:
        return None
    return dict(row)


def rows_to_list(rows):
    """Convert list of sqlite Rows to list of dicts"""
    return [row_to_dict(row) for row in rows]


# ==================== SYSTEM STATUS ====================

def get_system_status():
    """Get current system status"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM system_status LIMIT 1')
        return row_to_dict(cursor.fetchone())


def update_system_status(updates):
    """Update system status"""
    with get_db() as conn:
        cursor = conn.cursor()
        set_clause = ', '.join([f"{k} = ?" for k in updates.keys()])
        values = list(updates.values())
        values.append(datetime.utcnow().isoformat())
        cursor.execute(f'UPDATE system_status SET {set_clause}, updated_at = ?', values)


# ==================== METRICS ====================

def get_current_metrics():
    """Get most recent metrics"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM metrics ORDER BY timestamp DESC LIMIT 1')
        return row_to_dict(cursor.fetchone())


def get_metrics_history(period='day', limit=24):
    """Get historical metrics"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT * FROM metrics WHERE period = ?
            ORDER BY timestamp DESC LIMIT ?
        ''', (period, limit))
        return rows_to_list(cursor.fetchall())


# ==================== SIGNALS ====================

def create_signal(signal_data):
    """Create a new signal"""
    signal_id = generate_id('sig_')
    now = datetime.utcnow().isoformat()
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO signals (
                id, timestamp, severity, type, source, endpoint,
                merchant_id, metadata, agent_id, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            signal_id,
            signal_data.get('timestamp', now),
            signal_data.get('severity', 'INFO'),
            signal_data.get('type', 'UNKNOWN'),
            signal_data.get('source', 'Unknown'),
            signal_data.get('endpoint'),
            signal_data.get('merchant_id'),
            json.dumps(signal_data.get('metadata', {})),
            signal_data.get('agent_id'),
            signal_data.get('status', 'pending'),
            now
        ))
    return get_signal(signal_id)


def get_signal(signal_id):
    """Get a signal by ID"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM signals WHERE id = ?', (signal_id,))
        row = cursor.fetchone()
        if row:
            result = row_to_dict(row)
            result['metadata'] = json.loads(result.get('metadata', '{}'))
            return result
        return None


def get_all_signals(limit=50, status=None, severity=None, tier=None, phase=None, time_period=None):
    """Get all signals with optional filtering"""
    with get_db() as conn:
        cursor = conn.cursor()
        query = '''
            SELECT s.*, m.tier as merchant_tier, m.migration_phase
            FROM signals s
            LEFT JOIN merchants m ON s.merchant_id = m.id
        '''
        params = []
        conditions = []
        
        if status:
            conditions.append('s.status = ?')
            params.append(status)
        if severity:
            conditions.append('s.severity = ?')
            params.append(severity)
        
        if tier:
            # Handle multiple tiers if passed as list/comma-separated
            if isinstance(tier, list):
                placeholders = ','.join(['?'] * len(tier))
                tier_condition = f'm.tier IN ({placeholders})'
                params.extend(tier)
            else:
                tier_condition = 'm.tier = ?'
                params.append(tier)
            
            # Allow SYSTEM signals to bypass merchant tier filter
            conditions.append(f'({tier_condition} OR s.severity = "SYSTEM")')
                
        if phase and phase != 'all':
            conditions.append(f'(m.migration_phase = ? OR s.severity = "SYSTEM")')
            params.append(phase)
            
        if time_period:
            now = datetime.utcnow()
            if time_period == '24h':
                start_time = now - timedelta(hours=24)
            elif time_period == '7d':
                start_time = now - timedelta(days=7)
            elif time_period == '30d':
                start_time = now - timedelta(days=30)
            else:
                start_time = None
                
            if start_time:
                conditions.append('s.timestamp >= ?')
                params.append(start_time.isoformat())
        
        if conditions:
            query += ' WHERE ' + ' AND '.join(conditions)
        
        query += ' ORDER BY s.timestamp DESC LIMIT ?'
        params.append(limit)
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        result = []
        for row in rows:
            signal = row_to_dict(row)
            signal['metadata'] = json.loads(signal.get('metadata', '{}'))
            result.append(signal)
        return result


def update_signal(signal_id, updates):
    """Update a signal"""
    with get_db() as conn:
        cursor = conn.cursor()
        if 'metadata' in updates:
            updates['metadata'] = json.dumps(updates['metadata'])
        set_clause = ', '.join([f"{k} = ?" for k in updates.keys()])
        values = list(updates.values()) + [signal_id]
        cursor.execute(f'UPDATE signals SET {set_clause} WHERE id = ?', values)
    return get_signal(signal_id)


# ==================== AGENTS ====================

def get_all_agents(status=None, agent_type=None):
    """Get all agents with optional filtering"""
    with get_db() as conn:
        cursor = conn.cursor()
        query = 'SELECT * FROM agents'
        params = []
        conditions = []
        
        if status:
            conditions.append('status = ?')
            params.append(status)
        if agent_type:
            conditions.append('type = ?')
            params.append(agent_type)
        
        if conditions:
            query += ' WHERE ' + ' AND '.join(conditions)
        
        cursor.execute(query, params)
        return rows_to_list(cursor.fetchall())


def get_agent(agent_id):
    """Get an agent by ID"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM agents WHERE id = ?', (agent_id,))
        return row_to_dict(cursor.fetchone())


def update_agent(agent_id, updates):
    """Update an agent"""
    with get_db() as conn:
        cursor = conn.cursor()
        updates['updated_at'] = datetime.utcnow().isoformat()
        set_clause = ', '.join([f"{k} = ?" for k in updates.keys()])
        values = list(updates.values()) + [agent_id]
        cursor.execute(f'UPDATE agents SET {set_clause} WHERE id = ?', values)
    return get_agent(agent_id)


# ==================== OODA PROCESSES ====================

def create_ooda_process(agent_id, signal_id):
    """Create a new OODA process"""
    process_id = generate_id('ooda_')
    now = datetime.utcnow().isoformat()
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO ooda_processes (id, agent_id, signal_id, started_at, observe_status)
            VALUES (?, ?, ?, ?, 'active')
        ''', (process_id, agent_id, signal_id, now))
    return get_ooda_process(process_id)


def get_ooda_process(process_id):
    """Get an OODA process by ID"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM ooda_processes WHERE id = ?', (process_id,))
        row = cursor.fetchone()
        if row:
            result = row_to_dict(row)
            # Parse JSON fields
            for field in ['observe_findings', 'orient_related_incidents', 'decide_chain_of_thought', 
                         'decide_proposed_solution', 'act_actions']:
                if result.get(field):
                    try:
                        result[field] = json.loads(result[field])
                    except:
                        pass
            return result
        return None


def update_ooda_process(process_id, updates):
    """Update an OODA process"""
    with get_db() as conn:
        cursor = conn.cursor()
        # Serialize JSON fields
        for field in ['observe_findings', 'orient_related_incidents', 'decide_chain_of_thought',
                     'decide_proposed_solution', 'act_actions']:
            if field in updates and not isinstance(updates[field], str):
                updates[field] = json.dumps(updates[field])
        
        set_clause = ', '.join([f"{k} = ?" for k in updates.keys()])
        values = list(updates.values()) + [process_id]
        cursor.execute(f'UPDATE ooda_processes SET {set_clause} WHERE id = ?', values)
    return get_ooda_process(process_id)


# ==================== HIL REQUESTS ====================

def create_hil_request(hil_data):
    """Create a new HIL request"""
    hil_id = generate_id('hil_')
    now = datetime.utcnow()
    expires = now + timedelta(minutes=5)
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO hil_requests (
                id, agent_id, signal_id, ooda_process_id, created_at,
                priority, title, description, root_cause, proposed_action,
                metrics, status, expires_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            hil_id,
            hil_data.get('agent_id'),
            hil_data.get('signal_id'),
            hil_data.get('ooda_process_id'),
            now.isoformat(),
            hil_data.get('priority', 'medium'),
            hil_data.get('title'),
            hil_data.get('description'),
            hil_data.get('root_cause'),
            json.dumps(hil_data.get('proposed_action', {})),
            json.dumps(hil_data.get('metrics', {})),
            'pending',
            expires.isoformat()
        ))
    return get_hil_request(hil_id)


def get_hil_request(hil_id):
    """Get a HIL request by ID"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM hil_requests WHERE id = ?', (hil_id,))
        row = cursor.fetchone()
        if row:
            result = row_to_dict(row)
            result['proposed_action'] = json.loads(result.get('proposed_action', '{}'))
            result['metrics'] = json.loads(result.get('metrics', '{}'))
            if result.get('resolution'):
                result['resolution'] = json.loads(result['resolution'])
            return result
        return None


def get_pending_hil_requests():
    """Get all pending HIL requests"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT * FROM hil_requests WHERE status = 'pending'
            ORDER BY created_at DESC
        ''')
        rows = cursor.fetchall()
        result = []
        for row in rows:
            hil = row_to_dict(row)
            hil['proposed_action'] = json.loads(hil.get('proposed_action', '{}'))
            hil['metrics'] = json.loads(hil.get('metrics', '{}'))
            result.append(hil)
        return result


def resolve_hil_request(hil_id, action, notes=None, decided_by='human_operator'):
    """Resolve a HIL request"""
    with get_db() as conn:
        cursor = conn.cursor()
        resolution = {
            'action': action,
            'by': decided_by,
            'at': datetime.utcnow().isoformat(),
            'notes': notes
        }
        cursor.execute('''
            UPDATE hil_requests SET status = ?, resolution = ? WHERE id = ?
        ''', (action, json.dumps(resolution), hil_id))
    return get_hil_request(hil_id)


# ==================== CONFIG DIFFS ====================

def create_config_diff(diff_data):
    """Create a new config diff"""
    diff_id = generate_id('diff_')
    now = datetime.utcnow().isoformat()
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO config_diffs (
                id, incident_id, current_config, current_errors,
                proposed_config, proposed_changes, documentation,
                explanation, confidence, cited_docs, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            diff_id,
            diff_data.get('incident_id'),
            json.dumps(diff_data.get('current_config', {})),
            json.dumps(diff_data.get('current_errors', [])),
            json.dumps(diff_data.get('proposed_config', {})),
            json.dumps(diff_data.get('proposed_changes', [])),
            json.dumps(diff_data.get('documentation', [])),
            diff_data.get('explanation', ''),
            diff_data.get('confidence', 0),
            json.dumps(diff_data.get('cited_docs', [])),
            now
        ))
    return get_config_diff(diff_id)


def get_config_diff(diff_id):
    """Get a config diff by ID"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM config_diffs WHERE id = ?', (diff_id,))
        row = cursor.fetchone()
        if row:
            result = row_to_dict(row)
            for field in ['current_config', 'current_errors', 'proposed_config',
                         'proposed_changes', 'documentation', 'cited_docs']:
                if result.get(field):
                    try:
                        result[field] = json.loads(result[field])
                    except:
                        pass
            return result
        return None


# ==================== INCIDENTS ====================

def get_all_incidents(limit=50, status=None, severity=None):
    """Get all incidents with optional filtering"""
    with get_db() as conn:
        cursor = conn.cursor()
        query = '''
            SELECT i.*, m.name as merchant_name, m.logo_url as merchant_logo
            FROM incidents i
            LEFT JOIN merchants m ON i.merchant_id = m.id
        '''
        params = []
        conditions = []
        
        if status:
            conditions.append('i.status = ?')
            params.append(status)
        if severity:
            conditions.append('i.severity = ?')
            params.append(severity)
        
        if conditions:
            query += ' WHERE ' + ' AND '.join(conditions)
        
        query += ' ORDER BY i.detected_at DESC LIMIT ?'
        params.append(limit)
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        result = []
        for row in rows:
            incident = row_to_dict(row)
            if incident.get('timeline'):
                incident['timeline'] = json.loads(incident['timeline'])
            result.append(incident)
        return result


def get_incident(incident_id):
    """Get an incident by ID with full details"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT i.*, m.name as merchant_name, m.logo_url as merchant_logo
            FROM incidents i
            LEFT JOIN merchants m ON i.merchant_id = m.id
            WHERE i.id = ?
        ''', (incident_id,))
        row = cursor.fetchone()
        if row:
            result = row_to_dict(row)
            if result.get('timeline'):
                result['timeline'] = json.loads(result['timeline'])
            return result
        return None


# ==================== ANALYTICS ====================

# ==================== ANALYTICS ====================

def get_current_metrics(tier=None, phase=None, time_period=None):
    """Calculate current metrics based on live signals with filtering"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Build base WHERE clause for signals
        # Similar to get_all_signals but for aggregation
        conditions = ["s.status = 'resolved'"]
        params = []
        
        # Join with merchants if filtering by merchant props
        join_clause = "LEFT JOIN merchants m ON s.merchant_id = m.id"
        
        if tier:
            if isinstance(tier, list):
                placeholders = ','.join(['?'] * len(tier))
                tier_cond = f"m.tier IN ({placeholders})"
                params.extend(tier)
            else:
                tier_cond = "m.tier = ?"
                params.append(tier)
            # Allow SYSTEM signals to bypass merchant tier filter
            conditions.append(f"({tier_cond} OR s.severity = 'SYSTEM')")
            
        if phase and phase != 'all':
            conditions.append(f"(m.migration_phase = ? OR s.severity = 'SYSTEM')")
            params.append(phase)
            
        if time_period:
            now = datetime.utcnow()
            if time_period == '24h':
                start_time = now - timedelta(hours=24)
            elif time_period == '7d':
                start_time = now - timedelta(days=7)
            elif time_period == '30d':
                start_time = now - timedelta(days=30)
            else:
                start_time = None
                
            if start_time:
                conditions.append('s.timestamp >= ?')
                params.append(start_time.isoformat())
                
        where_clause = " WHERE " + " AND ".join(conditions) if conditions else ""
        
        # 1. Revenue Protected
        query = f'''
            SELECT s.severity, count(*) 
            FROM signals s
            {join_clause}
            {where_clause}
            GROUP BY s.severity
        '''
        cursor.execute(query, params)
        rows = cursor.fetchall()
        counts = {row[0]: row[1] for row in rows}
        
        # Enterprise-grade ROI calculations
        rev_protected = (
            counts.get('CRITICAL', 0) * 15000 + 
            counts.get('ERROR', 0) * 5000 + 
            counts.get('WARN', 0) * 1000 +
            counts.get('SYSTEM', 0) * 100
        )
        
        # 2. Dev Hours Saved
        dev_hours = (
            counts.get('CRITICAL', 0) * 2.5 + 
            counts.get('ERROR', 0) * 1.0 + 
            counts.get('WARN', 0) * 0.25 +
            counts.get('SYSTEM', 0) * 0.01
        )
        
        # 3. Auto Resolution Rate
        # Recalculate Total Resolved with filters
        cursor.execute(f"SELECT count(*) FROM signals s {join_clause} {where_clause}", params)
        total_resolved = cursor.fetchone()[0]
        
        # Recalculate Auto Resolved with filters
        auto_cond = list(conditions)
        auto_cond.append("(s.agent_id IS NOT NULL OR s.severity = 'SYSTEM' OR s.source = 'SystemMonitor')")
        auto_where = " WHERE " + " AND ".join(auto_cond)
        
        cursor.execute(f"SELECT count(*) FROM signals s {join_clause} {auto_where}", params)
        auto_resolved = cursor.fetchone()[0]
        
        auto_rate = (auto_resolved / total_resolved * 100) if total_resolved > 0 else 100
        
        # 4. Migration Health Score (Based on ACTIVE issues)
        # Filters apply to active issues too? Yes.
        active_cond = [c for c in conditions if c != "s.status = 'resolved'"]
        active_cond.append("s.status != 'resolved' AND s.status != 'processed'")
        active_where = " WHERE " + " AND ".join(active_cond)
        
        cursor.execute(f'''
            SELECT s.severity, count(*) 
            FROM signals s
            {join_clause}
            {active_where}
            GROUP BY s.severity
        ''', params) # Re-use params as they are same for filters
        
        active_rows = cursor.fetchall()
        active = {row[0]: row[1] for row in active_rows}
        
        # Deduction logic
        penalty = (
            active.get('CRITICAL', 0) * 15 + 
            active.get('ERROR', 0) * 5 + 
            active.get('WARN', 0) * 1
        )
        health_score = max(10, 100 - penalty)
        
        # Active Migrations (Filtered?)
        # If filtering by phase, this is just count of filtered results?
        # Let's keep it simple: count active migrations matching filter
        if tier:
            # We already have tier params logic above, reusing is tricky due to signal join
            # Simplified: just count all for now, or improve later
            cursor.execute("SELECT count(*) FROM merchants WHERE migration_phase = 'migration'")
        else:
            cursor.execute("SELECT count(*) FROM merchants WHERE migration_phase = 'migration'")
        active_migrations = cursor.fetchone()[0]
        
        return {
            "revenue_protected": rev_protected,
            "revenue_protected_change": 12,
            "dev_hours_saved": round(dev_hours, 1),
            "dev_hours_saved_change": 5,
            "auto_resolution_rate": round(auto_rate, 1),
            "auto_resolution_rate_change": 2,
            "migration_health_score": round(health_score, 1),
            "migration_health_change": -0.4 if penalty > 0 else 0.4,
            "total_incidents": total_resolved,
            "auto_resolved": auto_resolved,
            "human_intervention": total_resolved - auto_resolved,
            "active_migrations": active_migrations
        }


def get_revenue_at_risk_data(hours=24):
    """Get revenue at risk time series data"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT * FROM revenue_at_risk
            ORDER BY timestamp DESC LIMIT ?
        ''', (hours,))
        rows = rows_to_list(cursor.fetchall())
        
        # Find peak
        peak = max(rows, key=lambda x: x['amount']) if rows else None
        
        return {
            "data": list(reversed(rows)),
            "peak": peak
        }


def get_resolution_stats(days=7):
    """Get auto-resolved vs human resolution stats"""
    # Generate sample data for demo
    stats = []
    now = datetime.utcnow()
    days_labels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
    
    total_auto = 0
    total_human = 0
    
    for i in range(days):
        day = now - timedelta(days=days-1-i)
        auto = 15 + (i * 3) + (i % 3) * 2
        human = 3 + (i % 2)
        total_auto += auto
        total_human += human
        stats.append({
            'period': days_labels[i % 7],
            'autoResolved': auto,
            'humanIntervention': human,
            'total': auto + human,
            'aiRatio': round(auto / (auto + human) * 100, 1)
        })
    
    return {
        'data': stats,
        'summary': {
            'totalAutoResolved': total_auto,
            'totalHumanIntervention': total_human,
            'overallAiRatio': round(total_auto / (total_auto + total_human) * 100, 1)
        }
    }


def get_critical_interventions(limit=10):
    """Get recent critical interventions"""
    return get_all_incidents(limit=limit, status='resolved')


# ==================== GHOST MITIGATIONS ====================

def create_ghost_mitigation(signal_id, action_taken, revenue_protected):
    """Create a ghost mitigation record"""
    ghost_id = generate_id('ghost_')
    now = datetime.utcnow().isoformat()
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO ghost_mitigations (id, signal_id, action_taken, revenue_protected, created_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (ghost_id, signal_id, action_taken, revenue_protected, now))
    return ghost_id


def get_ghost_mitigations(limit=50):
    """Get all ghost mitigations"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT * FROM ghost_mitigations ORDER BY created_at DESC LIMIT ?
        ''', (limit,))
        return rows_to_list(cursor.fetchall())


# ==================== AUDIT LOG ====================

def log_audit(action_type, entity_type, entity_id, actor='system', details=None):
    """Add an audit log entry"""
    log_id = generate_id('audit_')
    now = datetime.utcnow().isoformat()
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO audit_log (id, timestamp, action_type, entity_type, entity_id, actor, details)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (log_id, now, action_type, entity_type, entity_id, actor, json.dumps(details) if details else None))
    return log_id


def get_audit_log(limit=100):
    """Get audit log entries"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT ?
        ''', (limit,))
        return rows_to_list(cursor.fetchall())


# Initialize database on module load
init_database()
