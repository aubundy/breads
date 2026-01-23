import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      await fetch("/api/restaurants?lat=33.4093&lng=-86.8321&page=0&size=50")
        .then((response) => response.json())
        .then((data) => {
          console.log("Nearby Restaurants:", data);
          setRestaurants(data);
        })
        .catch((error) => {
          console.error("Error fetching nearby restaurants:", error);
        });
    };

    fetchRestaurants();
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        {restaurants.length > 0 && (
          <div>
            <h2>Nearby Restaurants:</h2>
            <ul>
              {restaurants.map((restaurant) => (
                <li key={restaurant.id}>
                  {restaurant.distanceMiles.toFixed(2)} miles -{" "}
                  {restaurant.name} - {restaurant.cuisine}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
