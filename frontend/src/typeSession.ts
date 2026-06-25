export type TypingEvent = {
    type: "char";
    char: string;
    position: number;
    elapsed_ms: number;
};

export type TypingSession = {
    promptId: number;
    promptText: string;
    typedText: string;
    events: TypingEvent[];
    lastEventAt: number | null;
};

export function createTypingSession(promptId: number, promptText: string): TypingSession {
    return {
        promptId,
        promptText,
        typedText: "",
        events: [],
        lastEventAt: null,
    };
}

function elapsedSinceLastEvent(session: TypingSession, now: number) {
    if (session.lastEventAt === null) {
        return 0;
    }
    return Math.round(now - session.lastEventAt);
}

export function recordChar(session: TypingSession, char: string, position: number, now: number) {
    session.events.push({
        type: "char",
        char, 
        position,
        elapsed_ms: elapsedSinceLastEvent(session, now),
    });
    session.typedText += char;
    session.lastEventAt = now;
}

export function toTypingSessionPayload(session: TypingSession) {
    return {
        prompt_id: session.promptId,
        prompt_text_snapshot: session.promptText,
        typed_text: session.typedText,
        events: session.events,
    };
}