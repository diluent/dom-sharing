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
                // console.log('A child node has been added or removed.', mutation);
                if (mutation.addedNodes && mutation.addedNodes.length) {
                    // const json = toJSON(mutation.addedNodes[0]);

                    const selector = generator.getSelector(mutation.target);

                    mutation.addedNodes.forEach(node => {
                        const htmlString = serializer.serializeToString(node);
                        sendMessage(htmlString, selector);
                    });
                }
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
    sendMessage(htmlString, selector);
}

function update({html, selector, type}) {
    const element = document.querySelector(selector);

    if (element && type === "syncDom") {
        console.log('UPDATER - try update');


        // const parser = new DOMParser();
        // const doc = parser.parseFromString(html, "text/xml");
        // console.log('DOC', doc.documentElement);
        // element.appendChild(doc);
        element.insertAdjacentHTML('beforeend', html);
    }
}

export function initListener() {
    window.addEventListener('message', function(event) {
        console.log('Updater - Receive event: ', event.data);
        update(event.data);
    })
}

function sendMessage(html: string, selector: string) {
    console.log('sendMessage', selector, html);
    window.parent.postMessage({
        type: 'syncDom',
        html,
        selector,
    }, '*');
}

/* TODO list
    Добавить отправку всего html в начале


*/