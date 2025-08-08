const eventToggleMenuButtons = (config) => {

    let containerID = config?.containerID;
    let childrenContainerID = config?.childrenContainerID;

    let blur = config?.blur ?? true;
    let click = config?.click ?? true;

    let container = document.querySelector(containerID);
    let containerChildren = document.querySelector(childrenContainerID);

    if (blur) {
        container.setAttribute('tabindex', '0');
        container.addEventListener('blur', () => {
            setTimeout(() => {
                containerChildren.classList.add('hidden');
            }, 150);
        });
    }


    if (click) {
        container.addEventListener('click', (event) => {
            containerChildren.classList.toggle('hidden');
        });
    }


};


const eventBlurElement = (config) => {
    let elementID = config?.elementID;
    let element = document.querySelector(elementID);
    element.setAttribute('tabindex', '0');
    element.focus();

    element.addEventListener('blur', () => {
        setTimeout(() => {
            element.remove();
        }, 150);
    });
}

const parseToNode = (html) => {
    const template = document.createRange().createContextualFragment(html);

    return template.firstElementChild;
};


const isExtension = () => {

    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
        return true;
    } else if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.id) {
        return true;
    } else {
        return false;
    }

}

const tailwindConfig = () => {

    tailwind.config = {
        darkMode: 'class',
        theme: {
            extend: {
                fontFamily: {
                    sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
                }
            }
        }
    }
}

export { eventToggleMenuButtons, eventBlurElement, parseToNode, isExtension,tailwindConfig };