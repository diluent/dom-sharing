import { addChangeListener, addMouseListener, addScrollListener, initObserver, sendAllDOM, update, showSessionId } from '@/domUtils';
import { addSocketListener } from '@/utils';
import { setSessionId } from '@/session';

export function initClient(sessionId: string) {
    setSessionId(sessionId);
    showSessionId();
    sendAllDOM();
    addChangeListener();
    addScrollListener();
    addMouseListener();
    initObserver();
}

export function initSupervisor(sessionId: string) {
    setSessionId(sessionId);
    addSocketListener(update);
}

