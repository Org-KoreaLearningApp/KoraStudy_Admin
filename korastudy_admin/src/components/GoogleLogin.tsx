// src/components/GoogleLogin.tsx
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebaseConfig";

const GoogleLogin = () => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      // Redirect to admin dashboard or handle successful login
    } catch (err) {
      console.error("Failed to login with Google", err);
    }
  };

  return (
    <div className="login-container">
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default GoogleLogin;