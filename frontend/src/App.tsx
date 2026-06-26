import { useEffect, useState } from "react";
import "./App.css";
import TypingPrompt from "./TypingPrompt";

const API_URL = import.meta.env.VITE_API_URL ?? "";

type PromptResponse = {
    text: string;
};

function App() {
    const [prompt, setPrompt] = useState("");

    useEffect(() => {
        let isActive = true;

        fetch(`${API_URL}/api/prompt`)
            .then((response) => response.json())
            .then((data: PromptResponse) => {
                if (isActive) {
                    setPrompt(data.text);
                }
            })
            .catch((error) => {
                if (!isActive) {
                    return;
                }

                console.error("Failed to fetch prompt:", error);
            });

        return () => {
            isActive = false;
        };
    }, []);

    return (
        <main>
            <TypingPrompt prompt={prompt} />
        </main>
    );
}

export default App;
