import { useContext } from 'react';
import { CheckCircle, Server, Cpu, Clock, Gauge } from 'lucide-react';
import { LabelsContext } from '../../App';
import './Footer.css';

function Footer({ systemStatus }) {
  const labels = useContext(LabelsContext);
  
  const status = systemStatus || {
    status: 'nominal',
    active_nodes: 42,
    active_agents: 12,
    uptime: 99.998,
    latency: 42,
    version: 'CMD_V1.0.0'
  };

  return (
    <footer className="footer">
      <div className="footer-left">
        <div className="footer-status">
          <CheckCircle size={14} className="status-icon" />
          <span className="status-text">{labels.footer_system_nominal}</span>
        </div>
        <span className="footer-version">{status.version}</span>
      </div>

      <div className="footer-center">
        <div className="footer-metric">
          <Server size={12} />
          <span className="metric-label">{labels.footer_nodes}</span>
          <span className="metric-value">{status.active_nodes}</span>
          <span className="metric-status">{labels.footer_online}</span>
        </div>
        
        <div className="footer-divider" />
        
        <div className="footer-metric">
          <Cpu size={12} />
          <span className="metric-label">{labels.footer_active_agents}</span>
          <span className="metric-value">{status.active_agents}</span>
        </div>
        
        <div className="footer-divider" />
        
        <div className="footer-metric">
          <Clock size={12} />
          <span className="metric-label">{labels.footer_uptime}</span>
          <span className="metric-value">{status.uptime}%</span>
        </div>
        
        <div className="footer-divider" />
        
        <div className="footer-metric">
          <Gauge size={12} />
          <span className="metric-label">{labels.footer_latency}</span>
          <span className="metric-value">{status.latency}ms</span>
        </div>
      </div>

      <div className="footer-right">
        <span className="footer-time">
          {new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
          })} UTC
        </span>
      </div>
    </footer>
  );
}

export default Footer;
