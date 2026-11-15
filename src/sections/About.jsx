import { Link } from "react-router-dom";
import "../styles/About.css";

function About() {
  return (
    <section className="about" id="about">
      <div className="about-container">
        <div className="about-left">
          <span className="section-label">WHO WE ARE</span>
          <h2>
            THE
            <br />
            <span>STARREX IDENTITY.</span>
          </h2>
          <p>
            STARREX TECHNOLOGIES is a Software Studio focused on
            building innovative digital experiences and reliable 
            software solutions. We bring together creativity, technical expertise
            and a commitment to excellence to help businesses
            turn imaginations into meaningful outcomes.
          </p>
          <p>
            From modern websites to software developments, we
            believe every solution should be built with purpose and precision.
          </p>
          <p>
            At Starrex, we believe technology should do more than 
            solve problems... it should create opportunities, drive
            progress and shape the future of your business.
          </p>
          <Link to="/services" className="about-link">
            Discover What We Do <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="about-right">
          <div className="about-card">
            <span className="card-number">01</span>
            <h3>Innovation</h3>
            <p>Exploring new possibilities through technology and creative thinking.</p>
          </div>
          <div className="about-card">
            <span className="card-number">02</span>
            <h3>Precision</h3>
            <p>Building thoughtful solutions with attention to every detail.</p>
          </div>
          <div className="about-card">
            <span className="card-number">03</span>
            <h3>Excellence</h3>
            <p>Striving for quality in everything we create and deliver.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;