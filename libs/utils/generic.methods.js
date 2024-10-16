const eventToggleMenuButtons = (config) => {

    let containerID = config?.containerID;
    let childrenContainerID = config?.childrenContainerID;

    let blur = config?.blur??true;
    let click = config?.click??true;

    let container = document.querySelector(containerID);
    let containerChildren = document.querySelector(childrenContainerID);

    if(blur)
    {
        container.setAttribute('tabindex', '0');
        container.addEventListener('blur', () => {
            setTimeout(() => {
                containerChildren.classList.add('d-none');
            }, 150);
        });
    }
    

    if(click)
    {
        container.addEventListener('click', (event) => {
            containerChildren.classList.toggle('d-none');
        });    
    }
    

};


const eventBlurElement = (config) =>
{
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

export { eventToggleMenuButtons, eventBlurElement };