import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  const {user, setUser, loading, setLoading} = context;


  const handleLogin = async ({email, password}) => {
    setLoading(true);
    try {
      const data = await login({email, password});
      
      // Sync with backend via getMe (validate cookie), fallback to login data
      let syncedUser = data.user;
      try {
        const meResponse = await getMe();
        syncedUser = meResponse.data.user || data.user;
      } catch (syncErr) {
        console.error('Post-login getMe sync failed:', syncErr);
      }
      
      setUser(syncedUser);
      return { success: true };
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  const handleRegister = async ({username, email, password}) => {
    setLoading(true);
    try {
      const data = await register({username, email, password});
      setUser(data.user);
      return { success: true };
    } catch (err) {
      console.error('Register failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      return { success: true };
    } catch (err) {
      console.error('Logout failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    user, 
    loading, 
    handleRegister, 
    handleLogin, 
    handleLogout 
  };
};


