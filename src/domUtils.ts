import { sendMessage, ISyncPayload } from '@/utils';
import getCssSelector from 'css-selector-generator';

const serializer = new XMLSerializer();


function getSelector(element: Node) {
    // const generator = new SelectorGenerator() as any;
    // generator.getSelector(element);
    const options = {root: document.querySelector('body')};
    return getCssSelector(element, options);
}

export function initObserver() {
    const targetNode = document.getElementById('root');
    const config = { attributes: true, childList: true, subtree: true };

    const callback = function(mutationsList: MutationRecord[], observer: MutationObserver) {
        for(const mutation of mutationsList) {
            console.log('mutation', mutation)

            if (mutation.type === 'childList') {

                const selector = getSelector(mutation.target);
                const value = serializer.serializeToString(mutation.target);

                sendMessage({
                    operation: 'update',
                    selector,
                    value,
                });
            }
            else if (mutation.type === 'attributes') {
                console.log('The ' + mutation.attributeName + ' attribute was modified.');
                // TODO change attributes
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
    // observer.disconnect();
}

export function addChangeListener() {
    document.querySelectorAll('input').forEach((input: HTMLInputElement) => {
        const handler = (event: Event) => {
            const type = event.target.getAttribute('type');
            const isText = !type || type === 'text';
            sendMessage({
                operation: isText ? 'changeValue' : 'changeChecked',
                selector: getSelector(event.target as Node),
                value: isText ? event.target.value : event.target.checked,
            });
        }

        input.addEventListener('change', handler);
        input.addEventListener('keyup', handler);
    });

    document.querySelectorAll('textarea').forEach((input: HTMLTextAreaElement) => {
        const handler = (event: Event) => {
            sendMessage({
                operation: 'changeValue',
                selector: getSelector(event.target as Node),
                value: event.target.value,
            });
        }

        input.addEventListener('change', handler);
        input.addEventListener('keyup', handler);
    });
}

export function addMouseListener() {
    // TODO throttle
    document.addEventListener('mousemove', function(e) {
        sendMessage({
            operation: 'mouse',
            selector: 'body',
            value: {x: e.x, y: e.y},
        });
    });
}

export function addScrollListener() {
    let lastKnownScrollPositionX = 0;
    let lastKnownScrollPositionY = 0;
    let ticking = false;

    document.addEventListener('scroll', function(e) {
        lastKnownScrollPositionX = window.scrollX;
        lastKnownScrollPositionY = window.scrollY;
    
      if (!ticking) {
        requestAnimationFrame(function() {
            sendMessage({
                operation: 'scroll',
                selector: 'body', // todo сделать скрол элементов по селектору
                value: {x: lastKnownScrollPositionX, y: lastKnownScrollPositionY},
            });
          ticking = false;
        });
    
        ticking = true;
      }
    });
}

export function sendAllDOM() {
    const serializer = new XMLSerializer();

    const selector = 'body';
    const element = document.querySelector(selector);
    const value = serializer.serializeToString(element);
    sendMessage({operation: 'update', value, selector});

    const styleElements = document.querySelectorAll('head > style');

    styleElements.forEach(node => {
        const value = serializer.serializeToString(node);
        const selector = 'head';
        sendMessage({operation: 'updateHead', value, selector});
    })
}

export function update({value, selector, operation}: ISyncPayload) {
    const element = document.querySelector(selector);

    if (!element) {
        throw Error('element not found');
    }

    console.log('UPDATER:', operation);

    switch(operation) {
        case 'update':
            element.innerHTML = '';
            element.insertAdjacentHTML('afterbegin', value);
            break;
        case 'updateHead':
            element.insertAdjacentHTML('beforeend', value);
            break;
        case 'changeValue':
            element.value = value;
            break;
        case 'changeChecked':
            element.checked = value;
            break;
        case 'scroll':
            window.scrollTo(value.x, value.y);
            break;
        case 'mouse':
            renderPointer(value.x, value.y);
            break;
    }
}

function renderPointer(x: number, y: number) {
    const selector = 'pointer12345678';
    let pointer: HTMLDivElement = document.querySelector('.' + selector);

    if (pointer) {
        pointer.style.transform = `translate(${x}px, ${y}px)`;
        return;
    }

    pointer = document.createElement('div');
    pointer.className = selector;

    pointer.style.width = '10px';
    pointer.style.height = '10px';
    pointer.style.position = 'fixed';
    pointer.style.transform = `translate(${x}px, ${y}px)`;
    pointer.style['x-index'] = '100';
    pointer.style['background-color'] = 'red';
    pointer.style['border-radius'] = '5px';
    pointer.style.opacity = '.5';
    pointer.style.top = '0';
    pointer.style.left = '0';

    document.body.appendChild(pointer);
}

export function showSessionId() {
    const value = `
        <div style='position: fixed; top: 0; right: 0; background-color: #f1f1f1; padding: 5px;'>ID: 123</div>
    `;
    document.body.insertAdjacentHTML('beforeend', value);
}