import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import "../styles/Contact.css";

function Contact() {
  const form = useRef();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [budget, setBudget] = useState("");
  const [customBudget, setCustomBudget] = useState("");

  const [timeline, setTimeline] = useState("");
  const [customTimeline, setCustomTimeline] = useState("");

  const sendEmail = async (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus("");

    try {
      await emailjs.sendForm(
        "service_j6fz85g",
        "template_t34ea1k",
        form.current,
        "zXsop6LBzihBZMjqU"
      );

      setStatus("success");
      form.current.reset();

      setBudget("");
      setCustomBudget("");
      setTimeline("");
      setCustomTimeline("");
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">

      {/* HERO */}
      <section className="contact-hero">
        <div className="hero-badge">
          <span className="status-dot" />
          LET'S WORK TOGETHER
        </div>

        <h1>
          Have a Project
          <br />
          <span>In Mind?</span>
        </h1>

        <p>
          Tell us what you're planning. We'll work with you
          to turn your ideas into powerful digital solutions.
        </p>
      </section>

      {/* ORDER FORM */}
      <section className="contact-container">

        <div className="contact-info">
          <span className="section-label">START A PROJECT</span>

          <h2>
            Let's build
            <br />
            something <span>great.</span>
          </h2>

          <p>
            Whether you need a website or custom software,
            we'd love to hear about your project.
          </p>

          <div className="contact-note">
            <span className="contact-note-icon">✳</span>
            <div>
              <h3>Have an idea?</h3>
              <p>
                Share your requirements and let's explore
                how we can bring your vision to life.
              </p>
            </div>
          </div>
        </div>

        <form
          className="contact-form"
          ref={form}
          onSubmit={sendEmail}
        >

          <div className="form-heading">
            <span>PROJECT INQUIRY</span>
            <p>Fill in the details below to get started.</p>
          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="from_name"
                placeholder="Your name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="reply_to"
                placeholder="you@example.com"
                required
              />
            </div>

          </div>

          <div className="form-group">
            <label>Service Required *</label>

            <select name="service" required defaultValue="">
              <option value="" disabled>Select a service</option>
              <option>Website Development</option>
              <option>E-Commerce Website</option>
              <option>Software Development</option>
              <option>Business Automation</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-row">

            {/* BUDGET */}
            <div className="form-group">
              <label>Estimated Budget</label>

              <select
                value={budget}
                onChange={(e) => {
                  setBudget(e.target.value);
                  setCustomBudget("");
                }}
              >
                <option value="">Select your budget</option>
                <option>Under $100</option>
                <option>$100 – $300</option>
                <option>$300 – $500</option>
                <option>$500 – $1,000</option>
                <option value="custom">Your Price</option>
              </select>

              <input
                type="hidden"
                name="budget"
                value={
                  budget === "custom"
                    ? `Your Price: ${customBudget}`
                    : budget
                }
              />

              {budget === "custom" && (
                <input
                  type="text"
                  value={customBudget}
                  onChange={(e) => setCustomBudget(e.target.value)}
                  placeholder="Enter your proposed budget..."
                  aria-label="Your custom budget"
                  required
                />
              )}
            </div>

            {/* TIMELINE */}
            <div className="form-group">
              <label>Preferred Timeline</label>

              <select
                value={timeline}
                onChange={(e) => {
                  setTimeline(e.target.value);
                  setCustomTimeline("");
                }}
              >
                <option value="">Select timeline</option>
                <option>As soon as possible</option>
                <option>Within 2 weeks</option>
                <option>Within a month</option>
                <option>1–3 months</option>
                <option value="custom">Your Duration</option>
              </select>

              <input
                type="hidden"
                name="timeline"
                value={
                  timeline === "custom"
                    ? `Your Duration: ${customTimeline}`
                    : timeline
                }
              />

              {timeline === "custom" && (
                <input
                  type="text"
                  value={customTimeline}
                  onChange={(e) => setCustomTimeline(e.target.value)}
                  placeholder="Describe your preferred duration..."
                  aria-label="Your custom duration"
                  required
                />
              )}
            </div>

          </div>

          {/* PROJECT DETAILS */}
          <div className="form-group">
            <label>Project Details *</label>

            <textarea
              name="message"
              rows="5"
              placeholder="Tell us about your project, requirements, and ideas..."
              required
            />
          </div>

          <button
            type="submit"
            className="contact-submit"
            disabled={loading}
          >
            {loading ? "SENDING..." : "SUBMIT PROJECT REQUEST"}
            {!loading && <span>↗</span>}
          </button>

          {status === "success" && (
            <div className="form-success">
              <div className="success-icon">✓</div>
              <div>
                <h3>Inquiry Submitted!</h3>
                <p>
                  Thank you for reaching out. We'll be in touch with you soon.
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <p className="form-error">
              Something went wrong. Please try again.
            </p>
          )}

          <p className="form-disclaimer">
            We'll review your inquiry and get back to you.
          </p>

        </form>

      </section>

    </main>
  );
}

export default Contact;