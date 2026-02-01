import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { LabelsContext } from '../App';
import { Header, Sidebar, Footer } from '../components/layout';
import { LiveSignalLog, OODAVisualizer, HILQueue, BlastRadiusMap } from '../components/dashboard';
import * as api from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const labels = useContext(LabelsContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data state
  const [metrics, setMetrics] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);
  const [signals, setSignals] = useState([]);
  const [agents, setAgents] = useState([]);
  const [hilRequests, setHilRequests] = useState([]);
  const [merchants, setMerchants] = useState([]);
  
  // OODA Demo State - managed locally for demo purposes
  const [activeOODA, setActiveOODA] = useState(null);
  const [activeAgent, setActiveAgent] = useState(null);
  const [activeSignal, setActiveSignal] = useState(null);
  const [demoHilRequests, setDemoHilRequests] = useState([]); // Separate state for demo HIL items
  
  // Filters
  const [filters, setFilters] = useState({
    timePeriod: '24h',
    migrationPhase: 'all',
    tiers: ['enterprise', 'mid_market', 'sme']
  });

  // Initialize data
  useEffect(() => {
    loadData();
    
    // Poll for updates every 3 seconds
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = useCallback(async () => {
    try {
      // Build filter params
      const signalParams = {
        limit: 50, // Increased limit to ensure we see filtered results
        tier: filters.tiers.join(','),
        phase: filters.migrationPhase,
        time_period: filters.timePeriod
      };

      const [metricsData, statusData, signalsData, agentsData, hilData, merchantsData] = await Promise.all([
        api.getMetrics(signalParams).catch(() => null),
        api.getSystemStatus().catch(() => null),
        api.getSignals(signalParams).catch(() => ({ data: [] })),
        api.getAgents().catch(() => ({ data: [] })),
        api.getHILRequests().catch(() => ({ data: [] })),
        fetch('/api/merchants').then(res => res.json()).catch(() => ({ data: [] })),
      ]);

      setMetrics(metricsData);
      setSystemStatus(statusData);
      setSignals(signalsData.data || []);
      setAgents(agentsData.data || []);
      setHilRequests(hilData.data || []);
      setMerchants(merchantsData.data || []);
      
      // Find active agent processing something (real backend logic)
      if (!activeOODA) { // Only override if not in demo mode
        const active = (agentsData.data || []).find(a => a.status === 'processing');
        if (active && active.current_task_signal_id) {
          setActiveAgent(active);
          const sig = (signalsData.data || []).find(s => s.id === active.current_task_signal_id);
          setActiveSignal(sig || null);
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to load data:', err);
      // Don't show error to user in demo mode, just log it
      setLoading(false);
    }
  }, [activeOODA, filters]); // Reload when filters change

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSignalClick = async (signal) => {
    console.log('Signal clicked:', signal);
    // Start OODA demo for this signal
    await runOODADemo(signal);
  };

  const handleApproveHIL = async (hilId) => {
    // Check if it's a demo request
    if (hilId.startsWith('hil_')) {
      console.log('Approving demo request:', hilId);
      setDemoHilRequests(prev => prev.filter(r => r.id !== hilId));
      
      // If we have an active OODA that was paused, resume it
      if (activeOODA && activeOODA.decide_proposed_solution?.risk_level === 'high') {
         // Resume the OODA loop!
         setActiveOODA(prev => ({
             ...prev,
             act_status: 'active'
         }));
         
         await new Promise(r => setTimeout(r, 2000));
         
         // Complete
         setActiveOODA(prev => ({
            ...prev,
            act_status: 'complete',
            act_actions: [
                { type: 'schema_change', description: 'Recreated legacy_session table via Migration v2.1.4' },
                { type: 'verify', description: 'Verified table integrity: OK' }
            ]
         }));
         
         // Mark Signal as RESOLVED on Backend
         try {
            await fetch(`/api/signals/${activeOODA.id ? 'n/a' : 'demo_signal_id_unavailable'}`, { 
                // Note: activeOODA doesn't store signal ID directly in this demo logic, but we can't easily get it here without state refactor.
                // Actually, activeSignal state holds it!
            });
            if (activeSignal && activeSignal.id) {
                 await fetch(`/api/signals/${activeSignal.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'resolved' })
                });
            }
         } catch (e) {
            console.error("Failed to resolve signal (HIL):", e);
         }
         
         // Clear after delay
         setTimeout(() => {
             setActiveOODA(null);
             setActiveAgent(null);
             setActiveSignal(null);
             loadData();
         }, 5000);
      }
      return;
    }

    try {
      await api.resolveHILRequest(hilId, 'approved');
      loadData();
    } catch (err) {
      console.error('Failed to approve:', err);
    }
  };

  const handleRejectHIL = async (hilId) => {
    if (hilId.startsWith('hil_')) {
        setDemoHilRequests(prev => prev.filter(r => r.id !== hilId));
        setActiveOODA(null);
        setActiveAgent(null);
        setActiveSignal(null);
        return;
    }

    try {
      await api.resolveHILRequest(hilId, 'rejected');
      loadData();
    } catch (err) {
      console.error('Failed to reject:', err);
    }
  };

  // Run OODA demo animation
  const runOODADemo = async (signal) => {
    const isHighRisk = signal.severity === 'CRITICAL' || signal.type === 'DB_SCHEMA_CORRUPTION';
    
    // ... (rest of function setup) ...
    const demoAgent = {
      id: 'demo_agent',
      name: 'DiagnosticsAgent',
      type: 'diagnostics',
      status: 'processing'
    };
    
    setActiveAgent(demoAgent);
    setActiveSignal(signal);
    
    // Stage 1: OBSERVE
    setActiveOODA({
      id: 'demo_ooda',
      observe_status: 'active',
      orient_status: 'pending',
      decide_status: 'pending',
      act_status: 'pending'
    });
    
    await new Promise(r => setTimeout(r, 2000));
    
    // Stage 2: ORIENT
    setActiveOODA({
      id: 'demo_ooda',
      observe_status: 'complete',
      observe_findings: [
        `Detected ${signal.severity} signal: ${signal.type}`,
        `Source: ${signal.source}`,
        'Analyzing pattern against historical data'
      ],
      orient_status: 'active',
      decide_status: 'pending',
      act_status: 'pending'
    });
    
    await new Promise(r => setTimeout(r, 2000));
    
    // Stage 3: DECIDE
    const decisionThinking = [
      'Detecting abnormal spike in responses from gateway.',
      'Comparing current log pattern with migration schema v2.1.',
      'Identification: Missing legacy session mapping.',
      'Hypothesis: API Gateway dropping headers from legacy tokens.'
    ];
    
    if (isHighRisk) {
      decisionThinking.push('Proposed Action: DROP and RECREATE legacy_session table.');
      decisionThinking.push('RISK ASSESSMENT: HIGH - Requires Human Approval.');
    }
    
    setActiveOODA({
      id: 'demo_ooda',
      observe_status: 'complete',
      observe_findings: [
        `Detected ${signal.severity} signal: ${signal.type}`,
        `Source: ${signal.source}`,
        'Analyzing pattern against historical data'
      ],
      orient_status: 'complete',
      orient_context: isHighRisk 
        ? 'CRITICAL: Data corruption detected in session table. Immediate intervention required.'
        : 'Signal indicates potential system issue affecting checkout flow.',
      decide_status: 'active',
      decide_chain_of_thought: decisionThinking,
      act_status: 'pending'
    });
    
    await new Promise(r => setTimeout(r, 2500));
    
    if (isHighRisk) {
        // PAUSE AT DECIDE FOR HIL
        setActiveOODA(prev => ({
            ...prev,
            decide_status: 'complete',
            decide_proposed_solution: {
                type: 'schema_change',
                description: 'Recreate legacy_session table',
                confidence: 88,
                risk_level: 'high'
            },
            act_status: 'pending' // Stays pending
        }));
        
        // Add to HIL Queue
        const newHilRequest = {
            id: `hil_${Date.now()}`,
            title: `Approve High-Risk Fix: ${signal.type}`,
            agent_id: 'demo_agent',
            signal_id: signal.id,
            status: 'pending',
            created_at: new Date().toISOString(),
            risk_level: 'high',
            proposed_action: {
                type: 'schema_change',
                description: 'DROP TABLE legacy_sessions; CREATE TABLE legacy_sessions ...',
                monitor_metrics: ['db_latency', 'active_sessions']
            },
            metrics: {
                confidence: 88,
                impact_scope: 'critical_path'
            }
        };
        
        setDemoHilRequests(prev => [newHilRequest, ...prev]);
        
        console.log("HIL Request added:", newHilRequest);
        return; // STOP HERE
    }
    
     // Stage 4: ACT (Only if not high risk)
    setActiveOODA({
      id: 'demo_ooda',
      observe_status: 'complete',
      orient_status: 'complete',
      decide_status: 'complete',
      decide_chain_of_thought: decisionThinking,
      decide_proposed_solution: {
        type: 'config_change',
        description: 'Apply session mapping fix',
        confidence: 94,
        risk_level: 'medium'
      },
      act_status: 'active'
    });
    
    await new Promise(r => setTimeout(r, 2000));


    
    // Complete
    setActiveOODA({
      id: 'demo_ooda',
      observe_status: 'complete',
      orient_status: 'complete',
      decide_status: 'complete',
      decide_chain_of_thought: decisionThinking,
      act_status: 'complete',
      act_actions: [
        { type: 'config_update', description: 'Update session_mapping to strict_legacy_v2' },
        { type: 'enable_feature', description: 'Enable token_injection' }
      ]
    });
    
    // Update Signal Status to RESOLVED on Backend
    try {
        await fetch(`/api/signals/${signal.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'resolved' })
        });
    } catch (e) {
        console.error("Failed to resolve signal:", e);
    }
    
    // Refresh data
    loadData();
  };

  // Demo signal handler from header
  // Demo signal handler from header
  const handleDemoSignal = async (signal, ooda) => {
    if (signal) {
      // Manually add signal to list to GUARANTEE it shows up regardless of filters
      setSignals(prev => [signal, ...prev]);
      
      // Also trigger OODA viz
      await runOODADemo(signal);
    }
    // Background refresh
    loadData();
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
    <div className="app-layout">
      <Header metrics={metrics} systemStatus={systemStatus} onDemoSignal={handleDemoSignal} />
      
      <div className="main-content">
        <Sidebar 
            filters={filters} 
            onFilterChange={handleFilterChange} 
        />
        
        <div className="content-area">
          <div className="panel">
            <BlastRadiusMap 
              merchants={merchants} 
              signals={signals} 
            />
            <LiveSignalLog 
              signals={signals} 
              onSignalClick={handleSignalClick}
            />
          </div>
          
          <div className="panel">
            <OODAVisualizer 
              oodaProcess={activeOODA}
              agent={activeAgent}
              signal={activeSignal}
            />
          </div>
          
          <div className="panel">
            <HILQueue 
              requests={[...demoHilRequests, ...hilRequests]}
              onApprove={handleApproveHIL}
              onReject={handleRejectHIL}
            />
          </div>
        </div>
      </div>
      
      <Footer systemStatus={systemStatus} />
    </div>
  );
}

export default Dashboard;
