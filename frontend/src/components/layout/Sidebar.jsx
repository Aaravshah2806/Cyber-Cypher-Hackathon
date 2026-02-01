import { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, TrendingUp, Activity, FileText, 
  ChevronDown, AlertOctagon 
} from 'lucide-react';
import { LabelsContext } from '../../App';
import './Sidebar.css';

function Sidebar({ filters, onFilterChange }) {
  const labels = useContext(LabelsContext);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: labels.nav_command_center },
    { path: '/roi', icon: TrendingUp, label: labels.nav_roi_analytics },
  ];

  const timePeriods = [
    { value: '24h', label: labels.time_last_24h },
    { value: '7d', label: labels.time_last_7d },
    { value: '30d', label: labels.time_last_30d },
    { value: 'custom', label: labels.time_custom },
  ];

  const migrationPhases = [
    { value: 'all', label: labels.phase_all },
    { value: 'pre', label: labels.phase_pre },
    { value: 'migration', label: labels.phase_migration },
    { value: 'post', label: labels.phase_post },
  ];

  const merchantTiers = [
    { value: 'enterprise', label: labels.tier_enterprise },
    { value: 'mid_market', label: labels.tier_mid_market },
    { value: 'sme', label: labels.tier_sme },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-divider" />

      <div className="sidebar-filters">
        <h3 className="filter-title">{labels.filter_title}</h3>

        <div className="filter-group">
          <label className="filter-label">{labels.filter_time_period}</label>
          <div className="select">
            <select 
              className="select-input"
              value={filters?.timePeriod || '24h'}
              onChange={(e) => onFilterChange?.('timePeriod', e.target.value)}
            >
              {timePeriods.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">{labels.filter_migration_phase}</label>
          <div className="select">
            <select 
              className="select-input"
              value={filters?.migrationPhase || 'all'}
              onChange={(e) => onFilterChange?.('migrationPhase', e.target.value)}
            >
              {migrationPhases.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">{labels.filter_merchant_tier}</label>
          <div className="select">
            <select 
              className="select-input"
              value={filters?.tiers?.[0] || 'all'}
              onChange={(e) => {
                const val = e.target.value;
                onFilterChange?.('tiers', val === 'all' ? ['enterprise', 'mid_market', 'sme'] : [val]);
              }}
            >
              <option value="all">All Tiers</option>
              {merchantTiers.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>
        </div>
      </div>

      <div className="sidebar-spacer" />
    </aside>
  );
}

export default Sidebar;
