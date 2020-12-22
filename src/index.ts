import {toJSON, toDOM} from 'domjson';
import 'selector-generator';

export function initObserver() {
    sendAllDOM();

    const generator = new SelectorGenerator() as any;
    const serializer = new XMLSerializer();

    const targetNode = document.getElementById('root');
    const config = { attributes: true, childList: true, subtree: true };

    const callback = function(mutationsList: MutationRecord[], observer: MutationObserver) {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                console.log('mutation', mutation)

                const selector = generator.getSelector(mutation.target);
                const htmlString = serializer.serializeToString(mutation.target);

                sendMessage({
                    operation: 'add',
                    selector,
                    htmlString,
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

function sendAllDOM() {
    const serializer = new XMLSerializer();

    const selector = '#root';
    const element = document.querySelector(selector);
    const htmlString = serializer.serializeToString(element);
    sendMessage({operation: 'add', htmlString, selector});
}

function update({htmlString, selector, operation}: ISyncEvent) {
    const element = document.querySelector(selector);

    if (!element) {
        throw Error('element not found');
    }

    console.log('UPDATER:', operation);

    switch(operation) {
        case 'add':
                // const parser = new DOMParser();
                // const doc = parser.parseFromString(html, "text/xml");
                // console.log('DOC', doc.documentElement);
                // element.appendChild(doc);
            element.innerHTML = '';
            element.insertAdjacentHTML('afterbegin', htmlString);
        case 'remove':
            // todo

    }
}

export function initListener() {
    window.addEventListener('message', function(event) {
        console.log('Updater - Receive event: ', event.data);
        update(event.data);
    })
}

interface ISyncEvent {
    operation: 'add' | 'remove',
    selector: string,
    htmlString?: string,
}

function sendMessage({
    operation,
    selector,
    htmlString,
}: ISyncEvent) {
    console.log('sendMessage', operation, selector, htmlString);
    window.parent.postMessage({
        operation,
        htmlString,
        selector,
    }, '*');
}

/* TODO list
    Добавить отправку всего html в начале


*/