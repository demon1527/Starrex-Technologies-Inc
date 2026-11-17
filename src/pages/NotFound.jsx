import { Link } from "react-router-dom";
import "../styles/NotFound.css";

function NotFound() {
  return (
    <main className="notfound-page">
      <span className="notfound-code">404</span>
      <h1>
        Lost in <span>space.</span>
      </h1>
      <p>
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link to="/" className="notfound-button">
        Back to Home
        <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}

export default NotFound;
