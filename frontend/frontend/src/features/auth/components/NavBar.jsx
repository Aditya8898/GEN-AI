import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./NavBar.scss";

const NavBar = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Interview AI
        </Link>
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          <Link to="/history" className="navbar-link">
            History
          </Link>
          <button onClick={handleLogoutClick} className="navbar-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;