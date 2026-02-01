import { useContext, useState } from 'react';
import { LabelsContext } from '../../App';
import { formatRelativeTime } from '../../services/config';
import { Radio } from 'lucide-react';
import './LiveSignalLog.css';

function LiveSignalLog({ signals, onSignalClick }) {
  const labels = useContext(LabelsContext);

  const getSeverityClass = (severity) => {
    const map = {
      'CRITICAL': 'critical',
      'ERROR': 'error',
      'WARN': 'warn',
      'INFO': 'info',
      'SYSTEM': 'system'
    };
    return map[severity] || 'info';
  };

  const getSeverityLabel = (severity, labels) => {
    const map = {
      'CRITICAL': labels.severity_critical,
      'ERROR': labels.severity_error,
      'WARN': labels.severity_warn,
      'INFO': labels.severity_info,
      'SYSTEM': labels.severity_system
    };
    return map[severity] || severity;
  };

  const [filterStatus, setFilterStatus] = useState('active');

  // Filter signals based on status
  const filteredSignals = (signals || []).filter(s => {
    if (filterStatus === 'active') {
      return s.status !== 'resolved';
    } else {
      return s.status === 'resolved';
    }
  });

  return (
    <div className="card signal-log">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={18} className="card-header-icon" />
            <span className="card-title">{labels.signal_log_title}</span>
            {filterStatus === 'active' && <span className="badge badge-success badge-pulse">{filteredSignals.length}</span>}
        </div>
        
        <div className="signal-tabs">
            <button 
                className={`signal-tab ${filterStatus === 'active' ? 'active' : ''}`}
                onClick={() => setFilterStatus('active')}
            >
                Active
            </button>
            <button 
                className={`signal-tab ${filterStatus === 'completed' ? 'active' : ''}`}
                onClick={() => setFilterStatus('completed')}
            >
                Resolved
            </button>
        </div>
      </div>
      
      <div className="card-body signal-log-content">
        {filteredSignals.length > 0 ? (
          filteredSignals.map((signal) => (
            <div 
              key={signal.id} 
              className={`log-entry ${getSeverityClass(signal.severity)}`}
              onClick={() => onSignalClick?.(signal)}
            >
              <div className="log-header">
                <div className="log-header-left">
                  <span className={`badge badge-${getSeverityClass(signal.severity) === 'critical' || getSeverityClass(signal.severity) === 'error' ? 'critical' : getSeverityClass(signal.severity) === 'warn' ? 'warning' : getSeverityClass(signal.severity) === 'system' ? 'success' : 'info'}`}>
                    {getSeverityLabel(signal.severity, labels)}
                  </span>
                  <span className="log-type">{signal.type}</span>
                </div>
                <span className="log-time">
                  {formatRelativeTime(signal.timestamp)}
                </span>
              </div>
              <div className="log-body">
                {signal.source} {signal.endpoint && `→ ${signal.endpoint}`}
              </div>
              {signal.metadata?.error && (
                <div className="log-code">
                  {signal.metadata.error}
                </div>
              )}
               {signal.status === 'resolved' && (
                  <div className="log-status resolved">
                      Resolved by {signal.metadata?.resolved_by || 'System'}
                  </div>
              )}
            </div>
          ))
        ) : (
          <div className="signal-log-empty">
            <Radio size={24} className="empty-icon" />
            <span>{filterStatus === 'active' ? 'All systems nominal' : 'No resolved incidents'}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default LiveSignalLog;
