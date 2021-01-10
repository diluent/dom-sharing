import { addChangeListener, addMouseListener, addScrollListener, initObserver, sendAllDOM, update } from '@/domUtils';
import { addSocketListener } from '@/utils';

export function initClient() {
    sendAllDOM();
    addChangeListener();
    addScrollListener();
    addMouseListener();
    initObserver();
}

export function initSupervisor() {
    addSocketListener(update);
}

