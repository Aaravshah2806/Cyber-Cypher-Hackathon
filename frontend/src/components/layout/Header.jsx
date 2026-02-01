import { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Zap, DollarSign, Clock, Target, Activity, Play, Loader, AlertTriangle, X, ShieldCheck } from 'lucide-react';
import { LabelsContext } from '../../App';
import * as api from '../../services/api';
import { formatCurrency, formatNumber, formatPercent } from '../../services/config';
import './Header.css';

// Demo scenarios for hackathon presentation
const DEMO_SCENARIOS = [
  {
    type: '404_SPIKE_DETECTED',
    severity: 'CRITICAL',
    source: 'Shopify_webhook',
    endpoint: '/api/v1/checkout/payment',
    metadata: { error: 'NOT_FOUND', affected_users: 1247, revenue_at_risk: 45000 }
  },
  {
    type: 'STRIPE_LATENCY_HIGH',
    severity: 'WARN',
    source: 'PaymentGateway',
    endpoint: '/api/v1/payments/process',
    metadata: { latency: '847ms', threshold: '200ms', transactions_affected: 89 }
  },
  {
    type: 'TOKEN_INVALID',
    severity: 'ERROR',
    source: 'AuthService',
    endpoint: '/api/v1/auth/verify',
    metadata: { error: 'JWT_EXPIRED', failed_logins: 342 }
  },
  {
    type: 'INVENTORY_SYNC_FAILED',
    severity: 'CRITICAL',
    source: 'InventoryService',
    endpoint: '/api/v1/inventory/sync',
    metadata: { error: 'DB_CONNECTION_LOST', products_affected: 1523 }
  },
  {
    type: 'CART_ABANDONMENT_SPIKE',
    severity: 'WARN',
    source: 'AnalyticsEngine',
    endpoint: '/api/v1/cart/status',
    metadata: { abandonment_rate: '34%', baseline: '12%', carts_abandoned: 567 }
  },
  {
    type: 'DB_SCHEMA_CORRUPTION',
    severity: 'CRITICAL',
    source: 'DatabaseGuard',
    endpoint: '/internal/db/migration',
    metadata: { error: 'TABLE_MISMATCH', table: 'legacy_sessions', risk: 'HIGH_DATA_LOSS' }
  }
];

function Header({ metrics, systemStatus, onDemoSignal }) {
  const labels = useContext(LabelsContext);
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(false);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [briefOpen, setBriefOpen] = useState(false);
  const [briefData, setBriefData] = useState(null);
  const [briefLoading, setBriefLoading] = useState(false);
  const [simulationOpen, setSimulationOpen] = useState(false);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState('404_SPIKE_DETECTED');

  /* Notification Logic */
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
      {
        id: 'n1',
        type: 'critical',
        title: 'High latency on Payment Gateway',
        time: '2 mins ago',
        read: false
      },
      {
        id: 'n2',
        type: 'warning',
        title: 'Migration Drift Detected',
        time: '15 mins ago',
        read: false
      },
      {
        id: 'n3',
        type: 'info',
        title: 'Daily Backup Completed',
        time: '1 hour ago',
        read: true
      },
      {
        id: 'n4',
        type: 'hil',
        title: 'New HIL Request: Schema Approval',
        time: 'Just now',
        read: false
      }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications([]); // Clear list as requested by user
  };

  const handleBriefMe = async () => {
    setBriefOpen(true);
    setBriefLoading(true);
    try {
      const res = await fetch('/api/brief');
      const data = await res.json();
      setBriefData(data);
    } catch (err) {
      console.error('Failed to get brief:', err);
      setBriefData({ error: 'Failed to generate brief' });
    } finally {
      setBriefLoading(false);
    }
  };

  const handleInjectDemo = async () => {
    setDemoLoading(true);
    try {
      const scenario = DEMO_SCENARIOS[scenarioIndex];
      setScenarioIndex((scenarioIndex + 1) % DEMO_SCENARIOS.length);
      
      const signalRes = await fetch('/api/signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scenario)
      });
      const signal = await signalRes.json();
      
      // Add notification for the new signal
      const newNotification = {
        id: `n_${Date.now()}`,
        type: signal.severity === 'CRITICAL' ? 'critical' : signal.severity === 'WARN' ? 'warning' : 'info',
        title: `New Signal: ${signal.type?.replace(/_/g, ' ') || 'System Event'}`,
        time: 'Just now',
        read: false
      };
      setNotifications(prev => [newNotification, ...prev]);

      if (onDemoSignal) {
        onDemoSignal(signal, null);
      }
      
    } catch (err) {
      console.error('Demo injection failed:', err);
    } finally {
      setDemoLoading(false);
    }
  };

// Chaos Mode Scenarios - More variety for "Chaos Mode"
const CHAOS_SCENARIOS = [
  ...DEMO_SCENARIOS,
  { type: 'REDIS_SKEW_DETECTED', severity: 'WARN', source: 'CacheLayer', endpoint: '/internal/cache/shards', metadata: { skew_factor: '15%', shard_id: 'cache-us-east-1a' } },
  { type: 'DNS_RESOLUTION_SLOW', severity: 'WARN', source: 'NetworkMesh', endpoint: 'n/a', metadata: { avg_latency: '450ms', provider: 'CloudFlare_Backup' } },
  { type: 'MEMORY_LEAK_HOTSPOT', severity: 'CRITICAL', source: 'K8s_Monitor', endpoint: 'pod/payment-service-v34', metadata: { growth_rate: '20MB/min', risk: 'OOM_KILL_IMMINENT' } },
  { type: 'LLM_TOKEN_LIMIT', severity: 'ERROR', source: 'AI_Gateway', endpoint: '/api/v1/ai/generate', metadata: { model: 'gpt-4', tpm_current: 98000, tpm_limit: 100000 } },
  { type: 'S3_BUCKET_PERM_OPEN', severity: 'CRITICAL', source: 'SecurityScanner', endpoint: 's3://user-documents', metadata: { risk_level: 'HIGH', public_access: 'TRUE' } },
  { type: 'API_RATE_LIMIT_BREACH', severity: 'WARN', source: 'Gateway', endpoint: '/api/partner/sync', metadata: { client_id: 'partner_882', request_rate: '500/s' } },
  { type: 'PROMETHEUS_TARGET_DOWN', severity: 'ERROR', source: 'Observability', endpoint: 'scrape/metrics', metadata: { missing_targets: 4, cluster: 'prod-eu-west' } },
  { type: 'DEADLOCK_DETECTED', severity: 'CRITICAL', source: 'DatabaseMaster', endpoint: 'postgres://primary', metadata: { table: 'orders', wait_time: '50s' } },
  { type: 'SSL_CERT_24H_EXPIRY', severity: 'WARN', source: 'CertManager', endpoint: 'api.healflow.io', metadata: { issuer: 'LetsEncrypt', valid_until: '2026-02-02T10:00:00Z' } },
  { type: 'KAFKA_LAG_SPIKE', severity: 'ERROR', source: 'EventStream', endpoint: 'topic/order_events', metadata: { lag: 45000, consumer_group: 'invoice_processor' } }
];

  const handleTriggerSimulation = async () => {
    setSimulationLoading(true);
    try {
      const res = await api.triggerSimulation(selectedSimulation);
      
      const newNotification = {
        id: `sim_${Date.now()}`,
        type: 'critical',
        title: `CRITICAL: Simulation Underway - ${selectedSimulation}`,
        time: 'Just now',
        read: false
      };
      setNotifications(prev => [newNotification, ...prev]);

      if (onDemoSignal && res.signal) {
        onDemoSignal(res.signal, null);
      }
      setSimulationOpen(false);
    } catch (err) {
      console.error('Simulation trigger failed:', err);
    } finally {
      setSimulationLoading(false);
    }
  };

  const handleInjectMultiple = async () => {
    setDemoLoading(true);
    try {
      // Inject 6 random signals for maximum chaos
      for (let i = 0; i < 6; i++) {
        const scenario = CHAOS_SCENARIOS[Math.floor(Math.random() * CHAOS_SCENARIOS.length)];
        await fetch('/api/signals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scenario)
        });
        // Slightly faster injection
        await new Promise(r => setTimeout(r, 200));
      }
      
      const signalRes = await fetch('/api/signals?limit=1');
      const signalsData = await signalRes.json();
      const latestSignal = signalsData.data?.[0];
      
      // Add summary notification
      const chaosNotification = {
        id: `chaos_${Date.now()}`,
        type: 'critical',
        title: '⚠️ CHAOS MODE: 6 Critical Signals Injected',
        time: 'Just now',
        read: false
      };
      setNotifications(prev => [chaosNotification, ...prev]);
      
      if (onDemoSignal && latestSignal) {
        onDemoSignal(latestSignal, null);
      }
      
    } catch (err) {
      console.error('Multi-inject failed:', err);
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <div className="logo-section" onClick={() => navigate('/')}>
            <div className="logo-icon">
              <Zap size={24} />
            </div>
            <span className="logo-text">{labels.app_name}</span>
            <span className="badge badge-success">{labels.header_badge}</span>
          </div>

          <div className="metrics-bar">
            {/* ... metrics items ... */}
            <div className="metric-item">
              <DollarSign size={14} className="metric-icon" />
              <span className="metric-label">{labels.metric_revenue_protected}</span>
              <span className="metric-value">{formatCurrency(metrics?.revenue_protected ?? 425000)}</span>
              {(metrics?.revenue_protected_change ?? 12) > 0 && (
                <span className="metric-change positive">+{metrics?.revenue_protected_change ?? 12}%</span>
              )}
            </div>
            
            <div className="metric-divider" />
            
            <div className="metric-item">
              <Clock size={14} className="metric-icon" />
              <span className="metric-label">{labels.metric_dev_hours_saved}</span>
              <span className="metric-value">{formatNumber(metrics?.dev_hours_saved ?? 1240)}</span>
              {(metrics?.dev_hours_saved_change ?? 5) > 0 && (
                <span className="metric-change positive">+{metrics?.dev_hours_saved_change ?? 5}%</span>
              )}
            </div>
            
            <div className="metric-divider" />
            
            <div className="metric-item">
              <Target size={14} className="metric-icon" />
              <span className="metric-label">{labels.metric_auto_resolution}</span>
              <span className="metric-value">{formatPercent(metrics?.auto_resolution_rate ?? 94.2)}</span>
              {(metrics?.auto_resolution_rate_change ?? 2) > 0 && (
                <span className="metric-change positive">+{metrics?.auto_resolution_rate_change ?? 2}%</span>
              )}
            </div>
            
            <div className="metric-divider" />
            
            <div className="metric-item">
              <Activity size={14} className="metric-icon" />
              <span className="metric-label">{labels.metric_migration_health}</span>
              <span className="metric-value">{formatPercent(metrics?.migration_health_score ?? 98.4)}</span>
            </div>
          </div>
        </div>

        <div className="header-right">
          {/* Demo Buttons */}
          <div className="demo-buttons">
            <button 
              className="btn btn-demo btn-sm" 
              onClick={handleInjectDemo}
              disabled={demoLoading}
              title="Inject single signal and run OODA"
            >
              {demoLoading ? <Loader size={16} className="spinning" /> : <Play size={16} />}
              Demo Signal
            </button>
            
            <button 
              className="btn btn-demo-multi btn-sm" 
              onClick={handleInjectMultiple}
              disabled={demoLoading}
              title="Inject multiple signals at once"
            >
              <AlertTriangle size={16} />
              Chaos Mode
            </button>

            {/* Simulation Trigger Dropdown */}
            <div className="simulation-control">
              <button 
                className="btn btn-outline btn-sm action-btn" 
                onClick={() => setSimulationOpen(!simulationOpen)}
                title="Wargame Chaos Simulations"
              >
                <ShieldCheck size={16} />
                Simulate
              </button>
              
              {simulationOpen && (
                <div className="simulation-dropdown">
                  <div className="dropdown-header">
                    <h4>War Game Scenarios</h4>
                  </div>
                  <div className="dropdown-body">
                    <select 
                      value={selectedSimulation} 
                      onChange={(e) => setSelectedSimulation(e.target.value)}
                      className="sim-select"
                    >
                      <option value="404_SPIKE_DETECTED">Simulate 404 Spikes</option>
                      <option value="STRIPE_LATENCY_HIGH">Simulate Stripe Latency</option>
                      <option value="DB_SCHEMA_LOCK">Simulate DB Schema Lock</option>
                      <option value="LEGACY_SESSION_DROP">Simulate Session Loss</option>
                      <option value="BOT_ATTACK_UVP">Simulate Bot Attack</option>
                    </select>
                    <button 
                      className="btn btn-primary btn-block btn-sm"
                      onClick={handleTriggerSimulation}
                      disabled={simulationLoading}
                    >
                      {simulationLoading ? <Loader size={14} className="spinning" /> : "Run War Game"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <button className="btn btn-primary btn-sm" onClick={handleBriefMe}>
            <Zap size={16} />
            {labels.brief_me_button}
          </button>
          
          <div className="notification-wrapper" style={{ position: 'relative' }}>
            <button 
              className={`notification-btn ${showNotifications ? 'active' : ''}`}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>
                  <button className="text-btn" onClick={markAllRead}>
                    Mark all read
                  </button>
                </div>
                <div className="notification-list">
                  {notifications.map(n => (
                    <div key={n.id} className={`notification-item ${n.type} ${!n.read ? 'unread' : ''}`}>
                      <div className="notif-icon">
                        {n.type === 'critical' && <AlertTriangle size={14} />}
                        {n.type === 'hil' && <Target size={14} />}
                        {n.type === 'warning' && <Activity size={14} />}
                        {n.type === 'info' && <Bell size={14} />}
                      </div>
                      <div className="notif-content">
                        <span className="notif-title">{n.title}</span>
                        <span className="notif-time">{n.time}</span>
                      </div>
                      {!n.read && <div className="notif-dot" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Brief Me Modal */}
      {briefOpen && (
        <div className="modal-overlay" onClick={() => setBriefOpen(false)}>
          <div className="modal brief-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><Zap size={20} /> Executive Brief</h2>
              <button className="modal-close" onClick={() => setBriefOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {briefLoading ? (
                <div className="brief-loading">
                  <Loader size={32} className="spinning" />
                  <p>Generating AI-powered executive brief...</p>
                </div>
              ) : briefData ? (
                <>
                  <div className="brief-time">
                    <span className="brief-label">Time Range:</span>
                    <span>{briefData.time_range}</span>
                  </div>
                  
                  <div className="brief-highlights">
                    <h3>Key Highlights</h3>
                    <ul>
                      {briefData.highlights?.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="brief-stats">
                    <div className="brief-stat">
                      <span className="stat-value">{briefData.recent_incidents}</span>
                      <span className="stat-label">Recent Incidents</span>
                    </div>
                    <div className="brief-stat critical">
                      <span className="stat-value">{briefData.critical_items}</span>
                      <span className="stat-label">Critical Items</span>
                    </div>
                  </div>
                  
                  {briefData.ai_summary && (
                    <div className="brief-ai">
                      <h3>AI Analysis</h3>
                      <p>{briefData.ai_summary}</p>
                    </div>
                  )}
                  
                  <div className="brief-status">
                    <span className="badge badge-success">{briefData.status}</span>
                  </div>
                </>
              ) : (
                <p>No data available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
