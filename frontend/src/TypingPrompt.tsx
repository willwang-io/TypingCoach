import { type ChangeEvent, useMemo, useState } from "react";

type TypingPromptProps = {
    prompt: string;
};

function TypingPrompt({ prompt }: TypingPromptProps) {
    const [inputValue, setInputValue] = useState("");
    const [curWordIdx, setCurWordIdx] = useState(0);
    const promptWords = useMemo(() => prompt.split(" "), [prompt]);
    const isComplete = curWordIdx >= promptWords.length;

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        const isLastWord = curWordIdx === promptWords.length - 1;
        const typedWord = isLastWord ? value.trimEnd() : value.slice(0, -1);

        if (isLastWord && typedWord === promptWords[curWordIdx]) {
            setCurWordIdx((idx) => idx + 1);
            setInputValue("");
            return;
        }

        if (!isLastWord && value.endsWith(" ")) {
            if (typedWord === promptWords[curWordIdx]) {
                setCurWordIdx((idx) => idx + 1);
                setInputValue("");
                return;
            }
        }

        setInputValue(isLastWord ? value.trimEnd() : value);
    };

    return (
        <>
            <div>
                {promptWords.map((word, idx) => (
                    <span
                        key={`${word}-${idx}`}
                        style={{ color: idx < curWordIdx ? "green" : "inherit" }}
                    >
                        {word}
                        {idx < promptWords.length - 1 ? " " : ""}
                    </span>
                ))}
            </div>
            <div>
                {isComplete ? (
                    <span>Done!</span>
                ) : (
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                )}
            </div>
        </>
    );
}

export default TypingPrompt;
