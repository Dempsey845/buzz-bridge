import { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch("https://helloworld-6x5volitjq-uc.a.run.app")
      .then((res) => res.text())
      .then((data) => console.log(data))
      .catch((err) => console.error("Function call error:", err));
  }, []);

  return <h1 className="bg-red-400">Hello world!</h1>;
}

export default App;
