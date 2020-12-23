import {toJSON, toDOM} from 'domjson';
// import 'selector-generator';
import getCssSelector from 'css-selector-generator';

const serializer = new XMLSerializer();

function getSelector(element: Node) {
    // const generator = new SelectorGenerator() as any;
    // generator.getSelector(element);
    const options = {root: document.querySelector('body')};
    return getCssSelector(element, options);
}

export function initObserver() {
    sendAllDOM();
    addChangeListener();


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

                // mutation.addedNodes.forEach(node => {
                //     const htmlString = serializer.serializeToString(node);
                //     sendMessage({
                //         operation: 'add',
                //         selector,
                //         htmlString,
                //     });
                // });

                // mutation.removedNodes.forEach(node => {
                // });
            }
            else if (mutation.type === 'attributes') {
                console.log('The ' + mutation.attributeName + ' attribute was modified.');
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
    // observer.disconnect();
}

function addChangeListener() {
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
}

function sendAllDOM() {
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

function update({value, selector, operation}: ISyncEvent) {
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
    }
}

export function initListener() {
    window.addEventListener('message', function(event) {
        console.log('Updater - Receive event: ', event.data);
        update(event.data);
    })
}

interface ISyncEvent {
    operation: 'update' | 'updateHead' | 'changeValue' | 'changeChecked',
    selector: string,
    value?: string,
}

function sendMessage({
    operation,
    selector,
    value,
}: ISyncEvent) {
    console.log('sendMessage', operation, selector, value);
    window.parent.postMessage({
        operation,
        value,
        selector,
    }, '*');
}

/* TODO list
    Добавить отправку всего html в начале


*/