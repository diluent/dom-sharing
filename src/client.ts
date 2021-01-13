import { addChangeListener, addMouseListener, addScrollListener, initObserver, sendAllDOM, update } from '@/domUtils';
import { addSocketListener, addSessionStartListener, start } from '@/utils';

export function initClient() {
    
    addSessionStartListener(() => {
        sendAllDOM();
        addChangeListener();
        addScrollListener();
        addMouseListener();
        initObserver();
    });
}

export function initSupervisor() {
    addSocketListener(update);
    start();
}

