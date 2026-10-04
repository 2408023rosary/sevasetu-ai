import {
  BrainCircuit,
  MapPinned,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-powered analysis",
    description:
      "Automatically classify complaints, identify severity, and help prioritize issues.",
  },
  {
    icon: MapPinned,
    title: "Location-aware reports",
    description:
      "Attach precise locations so authorities can understand exactly where an issue exists.",
  },
  {
    icon: MessageSquareText,
    title: "Transparent tracking",
    description:
      "Follow every complaint through a clear status timeline from submission to resolution.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted civic platform",
    description:
      "A structured digital channel connecting citizens and civic authorities.",
  },
];

function FeatureSection() {
  return (
    <section className="section features-section" id="features">
      <div className="section-container">
        <div className="section-heading">
          <span className="section-eyebrow">Why SevaSetu?</span>

          <h2>
            From reporting a problem to
            <span> getting it resolved.</span>
          </h2>

          <p>
            SevaSetu brings reporting, AI analysis, location intelligence, and
            complaint tracking together in one simple experience.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article className="feature-card" key={feature.title}>
                <div className="feature-icon">
                  <Icon size={23} />
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;