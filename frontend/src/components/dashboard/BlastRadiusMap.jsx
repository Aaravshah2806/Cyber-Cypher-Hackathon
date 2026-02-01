import { useContext } from "react";
import { Target, AlertTriangle } from "lucide-react";
import { LabelsContext } from "../../App";
import "./BlastRadiusMap.css";

function BlastRadiusMap({ merchants = [], signals = [] }) {
  const labels = useContext(LabelsContext);

  // Map signals to merchants to determine severity
  const merchantSeverityMap = {};
  signals.forEach((sig) => {
    if (sig.merchant_id) {
      const currentSev = merchantSeverityMap[sig.merchant_id];
      if (sig.severity === "CRITICAL") {
        merchantSeverityMap[sig.merchant_id] = "critical";
      } else if (sig.severity === "ERROR" || sig.severity === "WARN") {
        if (currentSev !== "critical") {
          merchantSeverityMap[sig.merchant_id] = "warn";
        }
      }
    }
  });

  // Demo merchants if none provided
  const displayMerchants =
    merchants.length > 0
      ? merchants
      : [
          { id: "m1", name: "Lux Modern", logo: "LM" },
          { id: "m2", name: "Velvet Direct", logo: "VD" },
          { id: "m3", name: "Nordic Soul", logo: "NS" },
          { id: "m4", name: "Apex Parts", logo: "AP" },
          { id: "m5", name: "TechFlow Pro", logo: "TP" },
          { id: "m6", name: "Glow Studio", logo: "GS" },
          { id: "m7", name: "Urban Edge", logo: "UE" },
          { id: "m8", name: "Zenith Retail", logo: "ZR" },
        ];

  return (
    <div className="blast-radius-map">
      <div className="blast-radius-header">
        <h3 className="blast-radius-title">
          <Target size={20} className="text-success" />
          The Blast Radius Map
        </h3>
        <div className="badge badge-outline">Live Coverage</div>
      </div>

      <div className="merchant-grid">
        {displayMerchants.map((merchant) => {
          const severity = merchantSeverityMap[merchant.id] || "nominal";
          return (
            <div key={merchant.id} className={`merchant-card ${severity}`}>
              {severity === "critical" && <div className="pulse-red" />}
              <div className="merchant-logo">
                {merchant.logo || merchant.name[0]}
              </div>
              <span className="merchant-name">{merchant.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BlastRadiusMap;
