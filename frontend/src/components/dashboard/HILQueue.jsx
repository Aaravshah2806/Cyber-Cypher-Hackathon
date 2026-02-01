import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, Activity, Check, X, AlertTriangle } from 'lucide-react';
import { LabelsContext } from '../../App';
import { formatCurrency } from '../../services/config';
import './HILQueue.css';

function HILQueue({ requests, onApprove, onReject }) {
  const labels = useContext(LabelsContext);
  const navigate = useNavigate();

  const handleViewDiff = (request) => {
    navigate(`/config-diff/${request.id}`);
  };

  return (
    <div className="card hil-queue">
      <div className="card-header">
        <Users size={18} className="card-header-icon" />
        <span className="card-title">{labels.hil_title}</span>
        {requests && requests.length > 0 && (
          <span className="badge badge-warning">{requests.length}</span>
        )}
      </div>

      <div className="card-body hil-content">
        {requests && requests.length > 0 ? (
          requests.map((request) => (
            <div key={request.id} className="hil-card">
              <div className="hil-card-header">
                <AlertTriangle size={16} className="hil-icon" />
                <span className="hil-title">{request.title}</span>
              </div>
              
              <p className="hil-description">{request.description}</p>
              
              {request.root_cause && (
                <div className="hil-root-cause">
                  <span className="hil-root-cause-label">Root Cause:</span>
                  <span>{request.root_cause}</span>
                </div>
              )}

              <div className="hil-metrics">
                <div className="hil-metric">
                  <DollarSign size={14} />
                  <span className="hil-metric-label">{labels.hil_revenue_at_risk}</span>
                  <span className="hil-metric-value critical">
                    {formatCurrency(request.metrics?.revenue_at_risk || 12450)}
                  </span>
                </div>
                <div className="hil-metric">
                  <Activity size={14} />
                  <span className="hil-metric-label">{labels.hil_stability_index}</span>
                  <span className="hil-metric-value">
                    {request.metrics?.stability_index || 87}%
                  </span>
                </div>
              </div>

              <div className="hil-actions">
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleViewDiff(request)}
                >
                  View Diff
                </button>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => onReject?.(request.id)}
                >
                  <X size={14} />
                  {labels.hil_reject}
                </button>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => onApprove?.(request.id)}
                >
                  <Check size={14} />
                  {labels.hil_approve}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="hil-empty">
            <Users size={32} className="empty-icon" />
            <span>{labels.hil_waiting}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default HILQueue;
