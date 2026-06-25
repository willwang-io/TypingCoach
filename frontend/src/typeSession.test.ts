import { describe, expect, it } from "vitest";

import {
    createTypingSession,
    recordChar,
    toTypingSessionPayload,
} from "./typeSession";

describe("typeSession", () => {
    it("creates an empty typing session", () => {
        const session = createTypingSession(1, "hello world");

        expect(session).toEqual({
            promptId: 1,
            promptText: "hello world",
            typedText: "",
            events: [],
            lastEventAt: null,
        });
    });

    it("records the first regular character event", () => {
        const session = createTypingSession(1, "ok");

        recordChar(session, "o", 0, 1000);

        expect(session.events).toEqual([
            {
                type: "char",
                char: "o",
                position: 0,
                elapsed_ms: 0,
            },
        ]);
        expect(session.typedText).toBe("o");
        expect(session.lastEventAt).toBe(1000);
    });

    it("records elapsed time between regular character events", () => {
        const session = createTypingSession(1, "ok");

        recordChar(session, "o", 0, 1000);
        recordChar(session, "k", 1, 1040);

        expect(session.events).toEqual([
            {
                type: "char",
                char: "o",
                position: 0,
                elapsed_ms: 0,
            },
            {
                type: "char",
                char: "k",
                position: 1,
                elapsed_ms: 40,
            },
        ]);
        expect(session.typedText).toBe("ok");
        expect(session.lastEventAt).toBe(1040);
    });

    it("maps the session to the backend payload shape", () => {
        const session = createTypingSession(7, "ok");
        recordChar(session, "o", 0, 1000);
        recordChar(session, "k", 1, 1040);

        expect(toTypingSessionPayload(session)).toEqual({
            prompt_id: 7,
            prompt_text_snapshot: "ok",
            typed_text: "ok",
            events: [
                {
                    type: "char",
                    char: "o",
                    position: 0,
                    elapsed_ms: 0,
                },
                {
                    type: "char",
                    char: "k",
                    position: 1,
                    elapsed_ms: 40,
                },
            ],
        });
    });
});
