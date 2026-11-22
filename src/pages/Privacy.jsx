import { Link } from "react-router-dom";
import LegalPage from "../components/LegalPage";
import { contactInfo } from "../utils/contactInfo";

function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="November 22, 2026">
      <p>
        This Privacy Policy explains what information Starrex Technologies
        (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects through this website, how
        we use it, and the choices you have.
      </p>

      <h2>Information you give us</h2>
      <p>
        When you send a project inquiry through the contact form, we receive the
        details you enter: your name, email address, the service you are
        interested in, your estimated budget and preferred timeline (if you
        choose to share them), and your message. If you contact us by email,
        WhatsApp or Instagram, we receive whatever you send us there.
      </p>

      <h2>Information collected automatically</h2>
      <p>
        Like most websites, the services that deliver this site may receive
        technical information such as your IP address, browser type, device and
        the pages requested. We do not use this information to identify you
        personally. This site does not currently use analytics or advertising
        trackers, and it does not set cookies for tracking or advertising.
      </p>

      <h2>How we use your information</h2>
      <ul>
        <li>To reply to your inquiry and discuss or quote your project.</li>
        <li>To keep records of our conversations and work with you.</li>
        <li>To keep the website secure and prevent spam or misuse.</li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2>Services that help us run the site</h2>
      <p>
        We use trusted third-party services to operate this website. They may
        process limited information as part of providing their service:
      </p>
      <ul>
        <li>Netlify, which hosts the website.</li>
        <li>EmailJS and Google (Gmail), which deliver contact form messages to us.</li>
        <li>Google Fonts, which provides the site&rsquo;s typeface.</li>
        <li>Cloudflare&rsquo;s cdnjs service, which delivers the Three.js library used by the 3D background.</li>
        <li>GitHub&rsquo;s raw content service, which delivers Earth texture images loaded by the 3D background. The site&rsquo;s own <code>saturn.js</code> background script is hosted by Netlify with the rest of the website.</li>
      </ul>
      <p>
        These providers may process data on servers outside your country and
        have their own privacy policies. If we add tools such as website
        analytics in the future, we will update this policy first.
      </p>

      <h2>How long we keep information</h2>
      <p>
        We keep inquiries for as long as needed to respond to you and to keep
        reasonable business records. You can ask us to delete your information
        at any time.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us to access, correct or delete the personal information we
        hold about you by emailing{" "}
        <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>. We will
        respond as soon as we reasonably can.
      </p>

      <h2>Security</h2>
      <p>
        We take reasonable steps to protect the information you send us, but no
        website or online service can be guaranteed to be completely secure.
      </p>

      <h2>Children</h2>
      <p>
        This website is not directed at children, and we do not knowingly collect
        personal information from them. If you believe a child has sent us
        information, contact us and we will delete it.
      </p>

      <h2>Links to other sites</h2>
      <p>
        This website links to other sites and services, such as Instagram,
        WhatsApp and websites of our clients. We are not responsible for their
        content or privacy practices.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The date at the top shows
        when it was last changed.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about this policy? Email{" "}
        <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a> or use
        our <Link to="/contact">contact page</Link>.
      </p>
    </LegalPage>
  );
}

export default Privacy;
