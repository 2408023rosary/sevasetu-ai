import { ArrowRight, BrainCircuit, CheckCircle2, Upload } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Report",
    description:
      "Describe the civic issue, upload an image, and provide its location.",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "AI analyzes",
    description:
      "AI helps identify the category, severity, priority, and possible duplicates.",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Authorities resolve",
    description:
      "The complaint reaches the appropriate workflow while citizens track progress.",
  },
];

function HowItWorks() {
  return (
    <section className="section how-section" id="how-it-works">
      <div className="section-container">
        <div className="section-heading centered">
          <span className="section-eyebrow">Simple workflow</span>

          <h2>
            Three steps from
            <span> problem to progress.</span>
          </h2>

          <p>
            SevaSetu removes the uncertainty from civic reporting.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div className="step-wrapper" key={step.number}>
                <article className="step-card">
                  <div className="step-top">
                    <span className="step-number">{step.number}</span>

                    <div className="step-icon">
                      <Icon size={23} />
                    </div>
                  </div>

                  <h3>{step.title}</h3>

                  <p>{step.description}</p>
                </article>

                {index < steps.length - 1 && (
                  <ArrowRight className="step-arrow" size={22} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;