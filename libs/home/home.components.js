const createDirectoryHTML = (directory) => {
    return `
    <div class="folder" data-path="${directory?._id ?? ''}">
        <i class="fas fa-folder"></i>
        <p>${directory?.name ?? ''}</p>
    </div>
    `;
}

const migaHTML = (directory) => {
    return `
        <li data-path-li="${directory?._id ?? ''}">
            <a href="#" data-path="${directory?._id ?? ''}">${directory?.name ?? ''}</a>
        </li>
    `;
}

const createHeader = (title) => {
    
    return `
    <div class="form-header">
        <h3 class="form-title">${title}</h3>
        <i id="close-form"  class="fa-solid fa-xmark"></i>
    </div>`;
};

const createInput = (placeholder,id, type = "text") => {
    return `<input  id="${id}"class="form-input" placeholder="${placeholder}" aria-label="${placeholder}" type="${type}" required>`;
};

const createButton = (label, id, className = "btn-submit", type = "submit") => {
    return `<button id="${id}" class="${className}" type="${type}">${label}</button>`;
};

const createFormFolder = () => {
    return `
    <div class="form-container">
        <form id="createFolderForm">
        ${createHeader("Create Folder")}
        ${createInput("Name",'nameFolder')}
        ${createButton("Create",'submit')}
        <form>
    </div>
    `;
};

const createMenuFolder = (pathID) => {
    const menuHTML = `
    <div id="context-menu" class="context-menu">
        <ul>
            <li id="delete-folder" data-path="${pathID}">Borrar <i class="fa-solid fa-delete-left"></i></li>
        </ul>
    </div>
    `;

    const template = document.createRange().createContextualFragment(menuHTML);

    return template.firstElementChild;
};

export { createDirectoryHTML, migaHTML,createFormFolder,createMenuFolder };