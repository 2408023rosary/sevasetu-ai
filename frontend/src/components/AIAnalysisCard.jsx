import {
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Copy,
} from "lucide-react";

function AIAnalysisCard({ analysis }) {
  if (!analysis) {
    return null;
  }

  return (
    <div className="ai-analysis-card">

      <div className="ai-analysis-header">

        <div className="ai-analysis-icon">
          <Sparkles size={20} />
        </div>

        <div>
          <strong>SevaSetu AI Analysis</strong>

          <p>
            Our system analyzed your complaint.
          </p>
        </div>

      </div>


      <div className="ai-analysis-grid">

        <div className="ai-analysis-item">

          <span>Detected issue</span>

          <strong>
            {analysis.category}
          </strong>

        </div>


        <div className="ai-analysis-item">

          <span>Severity</span>

          <strong
            className={`severity-${analysis.severity.toLowerCase()}`}
          >
            {analysis.severity}
          </strong>

        </div>


        <div className="ai-analysis-item">

          <span>Priority</span>

          <strong>
            {analysis.priority}
          </strong>

        </div>

      </div>


      {analysis.duplicate && (
        <div className="ai-duplicate-warning">

          <div className="ai-warning-icon">
            <Copy size={17} />
          </div>

          <div>

            <strong>
              Possible duplicate complaint
            </strong>

            <p>
              A similar complaint may already exist
              near this location.
            </p>

          </div>

        </div>
      )}


      <div className="ai-analysis-footer">

        {analysis.confidence >= 80 ? (
          <>
            <ShieldCheck size={15} />

            <span>
              AI confidence: {analysis.confidence}%
            </span>
          </>
        ) : (
          <>
            <AlertTriangle size={15} />

            <span>
              Please verify the detected information.
            </span>
          </>
        )}

      </div>

    </div>
  );
}

export default AIAnalysisCard;