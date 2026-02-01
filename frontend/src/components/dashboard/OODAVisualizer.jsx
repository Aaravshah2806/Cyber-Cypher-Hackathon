import { useContext } from 'react';
import { Brain, Circle, CheckCircle, Loader } from 'lucide-react';
import { LabelsContext } from '../../App';
import './OODAVisualizer.css';

function OODAVisualizer({ oodaProcess, agent, signal }) {
  const labels = useContext(LabelsContext);

  const stages = [
    { id: 'observe', label: labels.ooda_observe },
    { id: 'orient', label: labels.ooda_orient },
    { id: 'decide', label: labels.ooda_decide },
    { id: 'act', label: labels.ooda_act },
  ];

  const getStageStatus = (stageId) => {
    if (!oodaProcess) return 'pending';
    const status = oodaProcess[`${stageId}_status`];
    return status || 'pending';
  };

  const getChainOfThought = () => {
    if (!oodaProcess) return [];
    return oodaProcess.decide_chain_of_thought || [];
  };

  const currentStage = stages.find(s => getStageStatus(s.id) === 'active');

  return (
    <div className="card ooda-visualizer">
      <div className="card-header">
        <Brain size={18} className="card-header-icon" />
        <span className="card-title">{labels.brain_title}</span>
        {agent && (
          <span className="badge badge-success badge-pulse">{labels.brain_agent_active}</span>
        )}
      </div>

      <div className="card-body ooda-content">
        {/* Agent Info */}
        {agent && (
          <div className="agent-info">
            <div className="agent-name">{agent.name}</div>
            {signal && (
              <div className="agent-task">
                {labels.task_execution}: {signal.type}
              </div>
            )}
          </div>
        )}

        {/* OODA Stages */}
        <div className="ooda-stages">
          {stages.map((stage, idx) => {
            const status = getStageStatus(stage.id);
            return (
              <div key={stage.id} className={`ooda-stage ${status}`}>
                <div className="ooda-stage-indicator">
                  {status === 'complete' && <CheckCircle size={20} />}
                  {status === 'active' && <Loader size={20} className="spinning" />}
                  {status === 'pending' && <Circle size={20} />}
                </div>
                <div className="ooda-stage-content">
                  <span className="ooda-stage-label">{stage.label}</span>
                  {status === 'active' && (
                    <span className="ooda-stage-status">{labels.processing}</span>
                  )}
                </div>
                {idx < stages.length - 1 && (
                  <div className={`ooda-connector ${status === 'complete' ? 'complete' : ''}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Chain of Thought */}
        {getChainOfThought().length > 0 && (
          <div className="chain-of-thought">
            <div className="cot-header">
              <span className="cot-title">{labels.chain_of_thought_title}</span>
            </div>
            <div className="cot-content">
              {getChainOfThought().map((thought, idx) => (
                <div key={idx} className="cot-step">
                  <span className="cot-step-number">{idx + 1}</span>
                  <span className="cot-step-text">{thought}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!agent && !oodaProcess && (
          <div className="ooda-empty">
            <Brain size={32} className="empty-icon" />
            <span>{labels.hil_waiting}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default OODAVisualizer;
