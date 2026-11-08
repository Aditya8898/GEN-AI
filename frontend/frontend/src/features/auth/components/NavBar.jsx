import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./NavBar.scss";

const NavBar = () => {
  const { handleLogout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      navigate("/login");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Interview AI
        </Link>
        <div className="navbar-menu">
          {user && (
            <span className="navbar-user" style={{ color: "#94a3b8", fontSize: "14px", marginRight: "8px" }}>
              Hi, {user.username || user.email}
            </span>
          )}
          <Link to="/" className="navbar-link">
            Home
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