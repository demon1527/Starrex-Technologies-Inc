import { Link, useNavigate } from "react-router-dom";
import "../styles/Services.css";

const services = [
  {
    number: "01",
    icon: "⌘",
    title: "Web Development",
    intro:
      "Websites that do more than look good. We build responsive, high-performance digital experiences that help your business make a strong impression and grow online.",
    features: [
      "Custom website design and development",
      "Responsive experiences across all devices",
      "Performance, accessibility, and SEO foundations",
      "Scalable, maintainable front-end architecture",
    ],
    outcome: "A polished online presence built around your goals.",
    tags: ["React", "Responsive Design", "UI / UX", "Performance"],
    link: "/projects",
    linkText: "Explore our work",
  },
  {
    number: "02",
    icon: "✳",
    title: "Software Development",
    intro:
      "Purpose-built software that makes complex work simpler. We turn your requirements into practical tools and systems designed around the way your business operates.",
    features: [
      "Custom software tailored to your workflow",
      "Process and task automation",
      "Business tools and application development",
      "Integrations that connect your existing tools",
    ],
    outcome: "Practical technology that saves time and solves real problems.",
    tags: ["Custom Software", "Automation", "Integrations", "Applications"],
    link: "/contact",
    linkText: "Discuss your project",
  },
];

const process = [
  {
    number: "01",
    title: "Discover",
    description:
      "We start by understanding your goals, challenges, audience, and what success should look like.",
  },
  {
    number: "02",
    title: "Plan",
    description:
      "We shape the requirements into a clear direction, scope, and practical project roadmap.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "We develop the solution with care, keeping usability, performance, and reliability in focus.",
  },
  {
    number: "04",
    title: "Refine",
    description:
      "We test, improve, and prepare your solution for launch, with room to grow as your needs evolve.",
  },
];

const reasons = [
  {
    number: "01",
    title: "Built around your goals",
    description:
      "We begin with your needs, not a one-size-fits-all template. Every decision has a purpose.",
  },
  {
    number: "02",
    title: "Thoughtful by design",
    description:
      "We care about the details: clear experiences, clean implementation, and dependable results.",
  },
  {
    number: "03",
    title: "Ready to evolve",
    description:
      "We build with the future in mind, so your digital solution can adapt as your business grows.",
  },
];

function Services() {
  const navigate = useNavigate();

  return (
    <main className="services-page">
      <section className="services-hero">
        <div className="services-hero-content">
          <span className="section-label">WHAT WE DO</span>
          <h1>
            Technology with
            <br />
            <span>Purpose.</span>
          </h1>
          <p>
            From powerful websites to purpose-built software, we turn ideas
            into digital solutions that move your business forward.
          </p>
          <div className="services-hero-actions">
            <Link to="/contact" className="services-button services-button-primary">
              Start a Project <span aria-hidden="true">↗</span>
            </Link>
            <a href="#our-services" className="services-text-link">
              Explore our services <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="services-hero-foot">
          <span>01 / 02 — OUR EXPERTISE</span>
          <span>DESIGNED TO MOVE YOU FORWARD</span>
        </div>
      </section>

      <section className="services-offerings" id="our-services">
        <div className="services-section-heading">
          <div>
            <span className="section-label">OUR EXPERTISE</span>
            <h2>
              Two disciplines.
              <br />
              <span>One clear purpose.</span>
            </h2>
          </div>
          <p>
            The right technology should make things easier, work better, and
            create room for what comes next.
          </p>
        </div>

        <div className="services-offering-list">
          {services.map((service) => (
            <article
              className={`services-offering-card ${service.number === "01" ? "services-offering-card-clickable" : ""}`}
              key={service.number}
              onClick={service.number === "01" ? () => navigate("/projects") : undefined}
              onKeyDown={service.number === "01" ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate("/projects");
                }
              } : undefined}
              role={service.number === "01" ? "link" : undefined}
              tabIndex={service.number === "01" ? 0 : undefined}
            >
              <div className="services-offering-top">
                <span className="services-offering-icon" aria-hidden="true">
                  {service.icon}
                </span>
                <span className="services-offering-number">{service.number}</span>
              </div>

              <div className="services-offering-body">
                <div className="services-offering-copy">
                  <h3>{service.title}</h3>
                  <p>{service.intro}</p>
                  <div className="services-tags">
                    {service.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="services-outcome">
                    <span className="services-outcome-dot" />
                    {service.outcome}
                  </div>
                  <Link to={service.link} className="services-card-link">
                    {service.linkText} <span aria-hidden="true">↗</span>
                  </Link>
                </div>

                <div className="services-feature-panel">
                  <span className="services-feature-label">WHAT'S INCLUDED</span>
                  <ul>
                    {service.features.map((feature) => (
                      <li key={feature}>
                        <span aria-hidden="true">↗</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="services-process">
        <div className="services-process-heading">
          <span className="section-label">HOW WE WORK</span>
          <h2>
            A clear path from
            <br />
            <span>idea to execution.</span>
          </h2>
          <p>
            Good work comes from a thoughtful process. We keep every stage
            focused, collaborative, and moving in the right direction.
          </p>
        </div>

        <div className="services-process-grid">
          {process.map((step) => (
            <article className="services-process-step" key={step.number}>
              <span className="services-process-number">{step.number}</span>
              <div className="services-process-line" />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="services-difference">
        <div className="services-difference-heading">
          <span className="section-label">THE STARREX APPROACH</span>
          <h2>
            More than code.
            <br />
            <span>A better way forward.</span>
          </h2>
        </div>

        <div className="services-reasons">
          {reasons.map((reason) => (
            <article className="services-reason" key={reason.number}>
              <span>{reason.number}</span>
              <div>
                <h3>{reason.title}</h3>
                <p>{reason.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="services-cta">
        <span className="section-label">HAVE AN IDEA IN MIND?</span>
        <h2>
          Let's build something
          <br />
          <span>that moves you forward.</span>
        </h2>
        <p>
          Tell us what you're working towards. We'll help you explore the right
          digital solution for your next step.
        </p>
        <Link to="/contact" className="services-button services-button-primary">
          Let's Talk <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}

export default Services;
