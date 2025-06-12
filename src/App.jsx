import { auth, provider, signInWithPopup, signOut } from "./utils/firebase";
import { useEffect, useState } from "react";
import {
  secureHello,
  createAlert,
  getUserAlerts,
} from "./utils/functionHandler";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const fetchUserAlerts = async () => {
    try {
      const alertsData = await getUserAlerts();
      setAlerts(alertsData.alerts);
    } catch (error) {
      console.error("Error fetching user alerts:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserAlerts();
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const createTestAlert = async () => {
    await createAlert({
      app: "Tarot",
      subject: "New Reading",
      snippet: "A new tarot reading is ready!",
    });
  };

  return (
    <div className="App">
      {user ? (
        <>
          <p>Welcome, {user.displayName}</p>
          <img src={user.photoURL} alt="profile" width={50} />
          <button onClick={handleLogout}>Logout</button>
          <button onClick={createTestAlert}>Create test alert</button>
          <div>
            <h2>Alerts:</h2>
            {alerts.map((alert, index) => (
              <div key={index}>
                <p>
                  {alert.subject}: {alert.snippet}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <button onClick={handleLogin}>Sign in with Google</button>
      )}
    </div>
  );
}

export default App;
