import { addChangeListener, addMouseListener, addScrollListener, initObserver, sendAllDOM, update, showSessionId } from '@/domUtils';
import { addSocketListener } from '@/utils';

export function initClient() {
    showSessionId();
    sendAllDOM();
    addChangeListener();
    addScrollListener();
    addMouseListener();
    initObserver();
}

export function initSupervisor() {
    addSocketListener(update);
}

