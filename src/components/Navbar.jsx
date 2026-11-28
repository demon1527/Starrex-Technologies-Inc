import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const navigation = [
  { label: "Home", to: "/", end: true },
  { label: "Projects", to: "/projects" },
  { label: "Services", to: "/services" },
  { label: "Software", to: "/software-development" },
  { label: "Products", to: "/products" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact", contact: true },
];

function Navbar() {
  // The menu counts as open only on the page it was opened on, so it closes
  // by itself on any route change (links, back/forward button).
  const [openPath, setOpenPath] = useState(null);
  const location = useLocation();
  const isOpen = openPath === location.pathname;
  const closeMenu = () => setOpenPath(null);
  const toggleMenu = () => setOpenPath(isOpen ? null : location.pathname);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpenPath(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <header className={`navbar${isOpen ? " navbar-open" : ""}`}>
      <Link
        to="/"
        className="navbar-logo"
        aria-label="Starrex Technologies home"
        onClick={closeMenu}
      >
        <img src="/starrex-logo.png" alt="Starrex Technologies" />
      </Link>

      <button
        className="navbar-toggle"
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="primary-navigation"
        onClick={toggleMenu}
      >
        <span />
        <span />
        <span />
      </button>

      <nav
        className={`navbar-links${isOpen ? " is-open" : ""}`}
        id="primary-navigation"
        aria-label="Main navigation"
      >
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              [
                item.contact ? "navbar-contact" : "",
                isActive ? "active" : "",
              ]
                .filter(Boolean)
                .join(" ")
            }
            onClick={closeMenu}
          >
            {item.label}
            {item.contact && <span aria-hidden="true">↗</span>}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;