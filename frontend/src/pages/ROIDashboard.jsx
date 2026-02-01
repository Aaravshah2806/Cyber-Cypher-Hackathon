import { useState, useEffect, useContext } from 'react';
import { LabelsContext } from '../App';
import { Header, Sidebar, Footer } from '../components/layout';
import { TrendingUp, DollarSign, Clock, Target, ArrowUpRight, Zap, User, Share2, FileText, Slack, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import * as api from '../services/api';
import { formatCurrency, formatNumber, formatPercent, formatDuration } from '../services/config';
import './ROIDashboard.css';

function ROIDashboard() {
  const labels = useContext(LabelsContext);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);
  const [revenueData, setRevenueData] = useState({ data: [], peak: null });
  const [resolutionData, setResolutionData] = useState({ data: [], summary: {} });
  const [interventions, setInterventions] = useState([]);
  const [maturityData, setMaturityData] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [filters, setFilters] = useState({
    timePeriod: '24h',
    migrationPhase: 'all',
    tiers: ['enterprise', 'mid_market', 'sme']
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [metricsRes, statusRes, revenueRes, resolutionRes, interventionsRes, maturityRes, leaderboardRes] = await Promise.all([
        api.getMetrics().catch(() => null),
        api.getSystemStatus().catch(() => null),
        api.getRevenueAtRisk(24).catch(() => ({ data: [], peak: null })),
        api.getResolutionStats(7).catch(() => ({ data: [], summary: {} })),
        api.getCriticalInterventions(10).catch(() => ({ data: [] })),
        api.getAutopilotMaturity(30).catch(() => ({ data: [] })),
        api.getFrictionLeaderboard(5).catch(() => ({ data: [] })),
      ]);

      setMetrics(metricsRes);
      setSystemStatus(statusRes);
      setRevenueData(revenueRes);
      setResolutionData(resolutionRes);
      setInterventions(interventionsRes.data || []);
      setMaturityData(maturityRes.data || []);
      setLeaderboard(leaderboardRes.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load ROI data:', err);
      setLoading(false);
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Format chart data
  const chartData = revenueData.data?.map((item, idx) => ({
    time: new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    revenue: item.amount,
  })) || [];

  async function handleExport(type) {
    setExportLoading(true);
    try {
      const res = type === 'slack' ? await api.exportToSlack() : await api.exportToPdf();
      alert(res.message);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExportLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="app-layout">
        <div className="loading-screen">
          <div className="badge badge-success badge-pulse">{labels.processing}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Header metrics={metrics} systemStatus={systemStatus} />
      
      <div className="main-content">
        <Sidebar filters={filters} onFilterChange={handleFilterChange} />
        
        <div className="roi-content">
          {/* Page Header */}
          <div className="roi-header">
            <div className="roi-header-text">
              <h1 className="roi-title">{labels.roi_title}</h1>
              <p className="roi-subtitle">
                {labels.roi_subtitle.replace('{count}', metrics?.active_migrations || 42)}
              </p>
            </div>
            <div className="roi-status-badges">
              <div className="status-badge">
                <span className="status-label">{labels.roi_status}</span>
                <span className="badge badge-success">{labels.roi_autonomous}</span>
              </div>
              <div className="roi-export-actions">
                <button 
                  className="btn btn-outline btn-sm action-btn" 
                  onClick={() => handleExport('slack')}
                  disabled={exportLoading}
                >
                  <Slack size={14} />
                  Share to Slack
                </button>
                <button 
                  className="btn btn-primary btn-sm action-btn" 
                  onClick={() => handleExport('pdf')}
                  disabled={exportLoading}
                >
                  <FileText size={14} />
                  Export PDF Report
                </button>
              </div>
            </div>
          </div>

          {/* Metrics Cards Row */}
          <div className="metrics-row">
            <div className="metric-card">
              <div className="metric-header">
                <DollarSign size={20} className="metric-icon" />
                <span className="metric-label">{labels.metric_revenue_protected}</span>
              </div>
              <div className="metric-value large">
                {formatCurrency(metrics?.revenue_protected ?? 425000)}
              </div>
              <div className="metric-change positive">
                <ArrowUpRight size={14} />
                +{metrics?.revenue_protected_change ?? 12}% from yesterday
              </div>
              <p className="metric-description">{labels.roi_projected}</p>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <Clock size={20} className="metric-icon" />
                <span className="metric-label">{labels.metric_dev_hours_saved}</span>
              </div>
              <div className="metric-value large">
                {formatNumber(metrics?.dev_hours_saved ?? 1240)}h
              </div>
              <div className="metric-change positive">
                <ArrowUpRight size={14} />
                +{metrics?.dev_hours_saved_change ?? 5}% this week
              </div>
              <p className="metric-description">
                {labels.roi_equivalent.replace('{count}', Math.round((metrics?.dev_hours_saved ?? 1240) / 160))}
              </p>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <Target size={20} className="metric-icon" />
                <span className="metric-label">{labels.metric_migration_health}</span>
              </div>
              <div className="metric-value large">
                {formatPercent(metrics?.migration_health_score ?? 98.4)}
              </div>
              <div className="metric-change positive">
                <ArrowUpRight size={14} />
                +{metrics?.migration_health_change ?? 0.4}% improvement
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="charts-row">
            {/* Revenue at Risk Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">{labels.revenue_trends_title}</h3>
                  <p className="chart-subtitle">{labels.revenue_trends_subtitle}</p>
                </div>
                {revenueData.peak && (
                  <div className="chart-peak">
                    <span className="peak-label">Peak:</span>
                    <span className="peak-value critical">
                      {formatCurrency(revenueData.peak.amount)}/hr
                    </span>
                  </div>
                )}
              </div>
              <div className="chart-body">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00FF9D" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00FF9D" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A3333" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#5A6B6B"
                      tick={{ fill: '#8B9A9A', fontSize: 11 }}
                    />
                    <YAxis 
                      stroke="#5A6B6B"
                      tick={{ fill: '#8B9A9A', fontSize: 11 }}
                      tickFormatter={(v) => `$${v/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{
                        background: '#0D2626',
                        border: '1px solid #2A4444',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                      formatter={(value) => [formatCurrency(value), 'At Risk']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#00FF9D" 
                      strokeWidth={2}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Resolution Stats Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">{labels.resolution_title}</h3>
                  <p className="chart-subtitle">{labels.resolution_subtitle}</p>
                </div>
                <div className="chart-stat">
                  <span className="stat-label">{labels.ai_ratio}</span>
                  <span className="stat-value success">
                    {resolutionData.summary?.overallAiRatio || 94}%
                  </span>
                </div>
              </div>
              <div className="chart-body">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={resolutionData.data || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A3333" />
                    <XAxis 
                      dataKey="period" 
                      stroke="#5A6B6B"
                      tick={{ fill: '#8B9A9A', fontSize: 11 }}
                    />
                    <YAxis 
                      stroke="#5A6B6B"
                      tick={{ fill: '#8B9A9A', fontSize: 11 }}
                    />
                    <Tooltip 
                      contentStyle={{
                        background: '#0D2626',
                        border: '1px solid #2A4444',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ color: '#8B9A9A' }}
                      formatter={(value) => <span style={{ color: '#8B9A9A' }}>{value}</span>}
                    />
                    <Bar 
                      dataKey="autoResolved" 
                      name="Auto-Resolved" 
                      fill="#00FF9D" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="humanIntervention" 
                      name="Human" 
                      fill="#4D9FFF" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* New Features Row: Autopilot Maturity & Friction Leaderboard */}
          <div className="charts-row">
            {/* Auto-Pilot Maturity Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">Auto-Pilot Maturity Score</h3>
                  <p className="chart-subtitle">AI Confidence Trend & Resolution Autonomy</p>
                </div>
                <div className="chart-stat">
                  <span className="stat-label">Current Maturity</span>
                  <span className="stat-value success">Level 4 (Elite)</span>
                </div>
              </div>
              <div className="chart-body">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={maturityData}>
                    <defs>
                      <linearGradient id="maturityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4D9FFF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4D9FFF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A3333" />
                    <XAxis 
                      dataKey="period" 
                      stroke="#5A6B6B"
                      tick={{ fill: '#8B9A9A', fontSize: 11 }}
                    />
                    <YAxis 
                      stroke="#5A6B6B"
                      tick={{ fill: '#8B9A9A', fontSize: 11 }}
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip 
                      contentStyle={{
                        background: '#0D2626',
                        border: '1px solid #2A4444',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="confidence" 
                      name="AI Confidence"
                      stroke="#4D9FFF" 
                      strokeWidth={3}
                      fill="url(#maturityGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Merchant Friction Leaderboard */}
            <div className="chart-card">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">Merchant Friction Leaderboard</h3>
                  <p className="chart-subtitle">Top merchants triggering signals</p>
                </div>
              </div>
              <div className="chart-body">
                <div className="leaderboard-list">
                  {leaderboard.map((item, index) => (
                    <div key={item.id} className="leaderboard-item">
                      <div className="leaderboard-rank">{index + 1}</div>
                      <div className="leaderboard-info">
                        <span className="leaderboard-name">{item.name}</span>
                        <span className="leaderboard-tier badge badge-outline">{item.tier}</span>
                      </div>
                      <div className="leaderboard-stats">
                        <span className="leaderboard-count">{item.signal_count}</span>
                        <span className="leaderboard-label">Signals</span>
                      </div>
                    </div>
                  ))}
                  {leaderboard.length === 0 && (
                    <div className="empty-state">No friction data available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Interventions Table */}
          <div className="interventions-section">
            <div className="section-header">
              <h3 className="section-title">{labels.interventions_title}</h3>
              <button className="btn btn-secondary btn-sm">{labels.view_all}</button>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>{labels.table_merchant}</th>
                    <th>{labels.table_incident_type}</th>
                    <th>{labels.table_resolution_time}</th>
                    <th>{labels.table_protected_impact}</th>
                    <th>{labels.table_status}</th>
                  </tr>
                </thead>
                <tbody>
                  {interventions.map((incident) => (
                    <tr key={incident.id}>
                      <td>
                        <div className="merchant-cell">
                          <div className="merchant-avatar">
                            {(incident.merchant_name || 'M')[0]}
                          </div>
                          <span>{incident.merchant_name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td>{incident.type}</td>
                      <td className="mono">{formatDuration(incident.resolution_time || 0)}</td>
                      <td className="mono success">{formatCurrency(incident.revenue_protected || 0)}</td>
                      <td>
                        <span className={`badge ${incident.resolution_type === 'auto_fixed' ? 'badge-success' : 'badge-info'}`}>
                          {incident.resolution_type === 'auto_fixed' ? labels.status_auto_fixed : labels.status_resolved}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {interventions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="empty-state">
                        No interventions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <Footer systemStatus={systemStatus} />
    </div>
  );
}

export default ROIDashboard;
