import { auth, provider, signInWithPopup, signOut } from "./utils/firebase";
import { useEffect, useState } from "react";
import {
  createAlert,
  getUserAlerts,
  deleteAlert,
} from "./utils/functionHandler";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const alertsData = await getUserAlerts();
      setAlerts(alertsData.alerts);
      setLoading(false);
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

  useEffect(() => console.log(alerts), [alerts]);

  const createTestAlert = async () => {
    const newAlert = {
      app: "Tarot",
      subject: "New Reading",
      snippet: "A new tarot reading is ready!",
    };

    setLoading(true);
    await createAlert(newAlert);
    await fetchUserAlerts();
  };

  return (
    <div className="App flex flex-col items-center text-center">
      {user ? (
        <div>
          <h1>Welcome, {user.displayName}</h1>
          <div className="flex items-center m-3">
            <img
              className="w-[75px] rounded-full"
              src={user.photoURL}
              alt="profile"
            />
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
            <button className="btn btn-primary" onClick={createTestAlert}>
              Create test alert
            </button>
          </div>
          {loading ? (
            <h2>loading...</h2>
          ) : (
            <div>
              <h2>Alerts:</h2>
              {alerts.map((alert, index) => (
                <div className="flex items-center gap-2" key={index}>
                  <p>
                    {alert.subject}: {alert.snippet}
                  </p>
                  <button
                    onClick={async () => {
                      setLoading(true);
                      await deleteAlert({ alertId: alert.id });
                      await fetchUserAlerts();
                    }}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <button className="btn" onClick={handleLogin}>
          Sign in with Google
        </button>
      )}
    </div>
  );
}

export default App;
