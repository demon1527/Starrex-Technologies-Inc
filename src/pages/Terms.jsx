import { Link } from "react-router-dom";
import LegalPage from "../components/LegalPage";
import { contactInfo } from "../utils/contactInfo";

function Terms() {
  return (
    <LegalPage title="Terms of Service" updated="November 18, 2026">
      <p>
        These Terms apply when you use the Starrex Technologies website. By
        using it, you agree to them. If you do not agree, please do not use the
        site.
      </p>

      <h2>About this website</h2>
      <p>
        This website provides information about the web and software development
        services offered by Starrex Technologies. Nothing here is a binding
        offer. Any work we do for you is covered by a separate written proposal
        or agreement, and prices or timelines discussed before that are
        estimates only.
      </p>

      <h2>Our content</h2>
      <p>
        The design, text, code, logo and graphics on this website belong to
        Starrex Technologies or are used with permission, unless stated
        otherwise. You may view the site for personal or business research, but
        you may not copy, resell or republish it without our written permission.
        Names, logos and websites of other companies belong to their owners.
      </p>

      <h2>Acceptable use</h2>
      <p>When using this website, you agree not to:</p>
      <ul>
        <li>Send spam, false inquiries or harmful or unlawful content through the contact form.</li>
        <li>Try to break, overload or gain unauthorized access to the website or its services.</li>
        <li>Use the site in a way that breaks any applicable law.</li>
      </ul>

      <h2>Third-party links and projects</h2>
      <p>
        This website may link to third-party websites and show work we have done
        for clients. Those sites and projects belong to their respective owners,
        and we are not responsible for their content or availability.
      </p>

      <h2>No warranty</h2>
      <p>
        The website is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;.
        We try to keep the information accurate and the site running, but we do
        not promise that it will always be error-free, up to date or
        uninterrupted.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent allowed by law, Starrex Technologies is not liable for any
        indirect or consequential loss arising from your use of this website or
        from relying on its content.
      </p>

      <h2>Privacy</h2>
      <p>
        How we handle your information is explained in our{" "}
        <Link to="/privacy">Privacy Policy</Link>.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these Terms from time to time. Continuing to use the site
        after a change means you accept the updated Terms.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about these Terms? Email{" "}
        <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>.
      </p>
    </LegalPage>
  );
}

export default Terms;
