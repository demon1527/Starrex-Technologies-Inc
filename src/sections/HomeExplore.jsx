import { Link } from "react-router-dom";
import "../styles/HomeExplore.css";

const pages = [
  {
    number: "01",
    title: "Projects",
    to: "/projects",
    cta: "See our work",
    description:
      "A look at what we've built so far: live websites, university work and our own brand site, with the tech behind each one.",
  },
  {
    number: "02",
    title: "Services",
    to: "/services",
    cta: "See what we do",
    description:
      "Web development and software development, plus the clear process we follow from the first idea to a finished product.",
  },
  {
    number: "03",
    title: "Software",
    to: "/software-development",
    cta: "Explore software",
    description:
      "Custom tools and automation built around the way your business actually works, designed to solve real problems.",
  },
  {
    number: "04",
    title: "About",
    to: "/about",
    cta: "Meet Starrex",
    description:
      "Who we are and what we stand for: innovation, precision and excellence in everything we create and deliver.",
  },
  {
    number: "05",
    title: "Contact",
    to: "/contact",
    cta: "Start a project",
    description:
      "Have something in mind? Tell us what you're planning and we'll help turn it into a powerful digital solution.",
  },
];

function HomeExplore() {
  return (
    <section className="home-explore" aria-labelledby="home-explore-title">
      <div className="home-explore-inner">
        <div className="home-explore-heading">
          <span className="section-label">EXPLORE STARREX</span>
          <h2 id="home-explore-title">
            Everything you need
            <br />
            <span>to know about us.</span>
          </h2>
          <p>
            Take a quick tour of the website. Each page shows a different side
            of how we think, build and work with our clients.
          </p>
        </div>

        <div className="home-explore-grid">
          {pages.map((page) => (
            <Link
              key={page.to}
              to={page.to}
              className="home-explore-card"
            >
              <span className="home-explore-number">{page.number}</span>
              <h3>{page.title}</h3>
              <p>{page.description}</p>
              <span className="home-explore-link">
                {page.cta} <span aria-hidden="true">↗</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeExplore;
