import { Link } from "react-router-dom";
import "../styles/SoftwareDevelopment.css";

const solutions = [
  {
    number: "01",
    title: "Custom Business Software",
    description:
      "Purpose-built applications shaped around your operations, helping your team manage work with less friction.",
    points: ["Internal business tools", "Workflow-specific applications", "Centralized information systems"],
  },
  {
    number: "02",
    title: "Automation & Integrations",
    description:
      "Reduce repetitive work and connect the tools you already use through reliable, thoughtfully designed workflows.",
    points: ["Task and process automation", "Third-party API integrations", "Data flow and system connections"],
  },
  {
    number: "03",
    title: "Web-Based Applications",
    description:
      "Accessible, responsive applications that bring useful functionality to the browser on the devices your team relies on.",
    points: ["Interactive web applications", "Dashboards and management panels", "Responsive user experiences"],
  },
];

const stages = [
  ["01", "Understand", "We learn how your business works, what is slowing it down, and what the solution needs to achieve."],
  ["02", "Define", "We map the requirements, agree on the essential features, and establish a practical development plan."],
  ["03", "Develop", "We build in focused stages, keeping functionality, usability, and maintainability in view."],
  ["04", "Improve", "We test the result, refine the details, and prepare the solution to support your next steps."],
];

function SoftwareDevelopment() {
  return (
    <main className="software-page">
      <section className="software-hero">
        <div className="software-hero-content">
          <div className="hero-badge"><span className="status-dot" />SOFTWARE DEVELOPMENT</div>
          <h1>
            Software built
            <br />
            <span>around your</span>
            <br/>
            <span>world.</span>
          </h1>
          <p>
            The right software should make complicated work feel simpler.
            We create practical digital tools, applications and connected
            systems shaped around the way you work.
          </p>
          <div className="software-hero-actions">
            <Link to="/contact" className="software-button">
              Discuss Your Idea <span aria-hidden="true">↗</span>
            </Link>
            <a href="#software-solutions" className="software-secondary-link">
              Explore capabilities <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <div className="software-hero-note" aria-hidden="true">
          <span>THOUGHTFUL ENGINEERING</span>
          <strong>Built to<br />work smarter.</strong>
          <i>ST / 02</i>
        </div>
      </section>

      <section className="software-intro" id="software-solutions">
        <div className="software-intro-heading">
          <span className="section-label">WHAT WE BUILD</span>
          <h2>
            Tools that solve
            <br />
            <span>real problems.</span>
          </h2>
        </div>
        <p>
          No unnecessary complexity. Just useful technology designed with a
          clear purpose, a thoughtful user experience, and room to grow.
        </p>
      </section>

      <section className="software-solutions">
        {solutions.map((solution) => (
          <article className="software-solution-card" key={solution.number}>
            <div className="software-solution-top">
              <span>{solution.number} / SOLUTION</span>
              <span aria-hidden="true">↗</span>
            </div>
            <h3>{solution.title}</h3>
            <p>{solution.description}</p>
            <ul>
              {solution.points.map((point) => (
                <li key={point}><span aria-hidden="true">＋</span>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="software-value">
        <div>
          <span className="section-label">THE RIGHT APPROACH</span>
          <h2>
            Technology should
            <br />
            <span>work for you.</span>
          </h2>
        </div>
        <div className="software-value-copy">
          <p>
            Every project starts with understanding the problem—not jumping
            straight into code. We focus on what is useful today while making
            thoughtful decisions for tomorrow.
          </p>
          <div className="software-value-points">
            <span>Purpose before complexity</span>
            <span>Clear, usable experiences</span>
            <span>Built with room to grow</span>
          </div>
        </div>
      </section>

      <section className="software-process">
        <div className="software-process-heading">
          <span className="section-label">OUR PROCESS</span>
          <h2>
            From first thought
            <br />
            <span>to working solution.</span>
          </h2>
        </div>
        <div className="software-process-grid">
          {stages.map(([number, title, description]) => (
            <article className="software-process-step" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="software-cta">
        <span className="section-label">LET'S MAKE IT USEFUL</span>
        <h2>
          Have a problem
          <br />
          <span>worth solving?</span>
        </h2>
        <p>Tell us what you have in mind. Let's explore what the right software could make possible.</p>
        <Link to="/contact" className="software-button">
          Start a Conversation <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}

export default SoftwareDevelopment;
