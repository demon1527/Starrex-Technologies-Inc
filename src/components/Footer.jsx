import { Link } from "react-router-dom";
import "../styles/Footer.css";
import { FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import { contactInfo } from "../utils/contactInfo";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src="/starrex-logo.png" alt="Starrex Technologies" />
            </Link>

            <p>Building the Future Through Technology.</p>

            <div className="footer-socials">
              <a
                href={`mailto:${contactInfo.email}`}
                aria-label="Email Starrex Technologies"
                title="Email"
              >
                <SiGmail />
              </a>
              <a
                href={contactInfo.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Starrex Technologies on WhatsApp"
                title="WhatsApp"
              >
                <FaWhatsapp />
              </a>
              <a
                href={contactInfo.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Starrex Technologies on Instagram"
                title="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          <nav className="footer-links" aria-label="Footer">
            <Link to="/about">About</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </nav>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Starrex Technologies Inc. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;