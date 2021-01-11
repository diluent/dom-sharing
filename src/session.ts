let SESSION_ID: string;

export const setSessionId = (sessionId: string) => {
    SESSION_ID = sessionId;
};

export const getSessionId = () => SESSION_ID;