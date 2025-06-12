import { auth, provider, signInWithPopup, signOut } from "./utils/firebase";
import { useEffect, useState } from "react";
import { secureHello } from "./utils/functionHandler";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        secureHello()
          .then((res) => console.log(res.data))
          .catch((err) => console.error(err));
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      {user ? (
        <>
          <p>Welcome, {user.displayName}</p>
          <img src={user.photoURL} alt="profile" width={50} />
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Sign in with Google</button>
      )}
    </div>
  );
}

export default App;
