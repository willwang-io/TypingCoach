import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
    const [prompt, setPrompt] = useState("");

    useEffect(() => {
        fetch(`${API_URL}/api/prompt`)
            .then((response) => response.json())
            .then((data) => {
                setPrompt(data.text);
            })
            .catch((error) => {
                console.error("Failed to fetch prompt:", error);
            });
    }, []);

    return (
        <main>
            <p>{prompt}</p>
        </main>
    );
}

export default App
