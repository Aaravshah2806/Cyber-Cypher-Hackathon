import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileCode, Sparkles, BookOpen, Download, CheckCircle, Brain } from 'lucide-react';
import { LabelsContext } from '../App';
import { Header, Footer } from '../components/layout';
import * as api from '../services/api';
import './ConfigDiff.css';

function ConfigDiff() {
  const labels = useContext(LabelsContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [diffData, setDiffData] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    loadDiff();
  }, [id]);

  async function loadDiff() {
    try {
      const data = await api.getConfigDiff(id);
      setDiffData(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load config diff:', err);
      setLoading(false);
    }
  }

  const handleApplyFix = async () => {
    setApplying(true);
    try {
      await api.applyConfigDiff(id);
      navigate('/');
    } catch (err) {
      console.error('Failed to apply fix:', err);
      setApplying(false);
    }
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(diffData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `config-diff-${id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderConfig = (config, errors = [], changes = [], isProposed = false) => {
    const lines = JSON.stringify(config, null, 2).split('\n');
    
    return lines.map((line, idx) => {
      const lineNum = idx + 1;
      let className = 'code-line';
      
      // Check for errors
      const hasError = errors.some(e => e.line === lineNum);
      const hasChange = changes.some(c => c.line === lineNum);
      
      if (hasError && !isProposed) {
        className += ' error';
      }
      if (hasChange && isProposed) {
        className += ' success';
      }
      
      return (
        <div key={idx} className={className}>
          <span className="line-number">{lineNum}</span>
          <span className="line-content">{formatCodeLine(line)}</span>
        </div>
      );
    });
  };

  const formatCodeLine = (line) => {
    // Basic JSON syntax highlighting
    return line
      .replace(/"([^"]+)":/g, '<span class="token-key">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span class="token-string">"$1"</span>')
      .replace(/: (\d+)/g, ': <span class="token-number">$1</span>')
      .replace(/: (true|false)/g, ': <span class="token-boolean">$1</span>')
      .replace(/: (null)/g, ': <span class="token-null">$1</span>');
  };

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
    <div className="app-layout config-diff-page">
      <Header />
      
      <div className="config-diff-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          {labels.back_to_command}
        </button>
        <h1 className="page-title">{labels.config_diff_title}</h1>
      </div>

      <div className="config-diff-content">
        {/* Current Config Panel */}
        <div className="config-panel current">
          <div className="panel-header">
            <FileCode size={18} />
            <span className="panel-title">{labels.current_config_title}</span>
            <span className="badge badge-critical">{labels.current_config_badge}</span>
          </div>
          <div className="panel-body code-block-wrapper">
            <pre className="code-content">
              {diffData?.current_config && renderConfig(
                diffData.current_config, 
                diffData.current_errors || []
              )}
            </pre>
          </div>
        </div>

        {/* Proposed Config Panel */}
        <div className="config-panel proposed">
          <div className="panel-header">
            <Sparkles size={18} />
            <span className="panel-title">{labels.proposed_config_title}</span>
            <span className="badge badge-success">{labels.proposed_config_badge}</span>
          </div>
          <div className="panel-body code-block-wrapper">
            <pre className="code-content">
              {diffData?.proposed_config && renderConfig(
                diffData.proposed_config,
                [],
                diffData.proposed_changes || [],
                true
              )}
            </pre>
          </div>
        </div>

        {/* Documentation Panel */}
        <div className="config-panel docs">
          <div className="panel-header">
            <BookOpen size={18} />
            <span className="panel-title">{labels.docs_title}</span>
            <button className="search-docs-btn">{labels.docs_search}</button>
          </div>
          <div className="panel-body">
            {diffData?.documentation?.map((doc, idx) => (
              <div key={idx} className="doc-card">
                <div className="doc-header">
                  <span className="doc-id">{doc.id}</span>
                  <span className="doc-category">{doc.category}</span>
                </div>
                <h4 className="doc-title">{doc.title}</h4>
                <p className="doc-content">{doc.content}</p>
                <div className="doc-relevance">
                  <span>Relevance: {doc.relevance}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Explanation Footer */}
      <div className="agent-explanation">
        <div className="explanation-header">
          <Brain size={20} className="brain-icon" />
          <span className="explanation-title">{labels.agent_explanation_title}</span>
          <div className="explanation-meta">
            <span className="badge badge-neutral">
              {labels.cited_label}: {diffData?.cited_docs?.join(', ') || 'N/A'}
            </span>
            <span className="badge badge-success">
              {labels.confidence_label}: {diffData?.confidence || 0}%
            </span>
          </div>
        </div>
        <div className="explanation-body">
          <p>{diffData?.explanation}</p>
        </div>
        <div className="explanation-actions">
          <button className="btn btn-secondary" onClick={handleExportJSON}>
            <Download size={16} />
            {labels.export_json}
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleApplyFix}
            disabled={applying}
          >
            <CheckCircle size={16} />
            {applying ? labels.processing : labels.apply_fix}
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default ConfigDiff;
