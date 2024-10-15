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

const createInput = (placeholder, type = "text") => {
    return `<input class="form-input" placeholder="${placeholder}" aria-label="${placeholder}" type="${type}" required>`;
};

const createButton = (label, className = "btn-submit", type = "submit") => {
    return `<button class="${className}" type="${type}">${label}</button>`;
};

const createFormFolder = () => {
    return `
    <div class="form-container">
        ${createHeader("Create Folder")}
        ${createInput("Name")}
        ${createButton("Create")}
    </div>
    `;
};


export { createDirectoryHTML, migaHTML,createFormFolder };