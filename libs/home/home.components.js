import { parseToNode } from './../utils/generic.methods.js';


const createDirectoryHTML = (directory) => {
    return `
    <div class="folder" data-path="${directory?._id ?? ''}">
        <i class="fas fa-folder"></i>
        <p class="text-overflow" >${directory?.name ?? ''}</p>
    </div>
    `;
}

const createImagenHTML = (directory) => {

    let randomNum = Math.random(1,100);

    return `
    <div class="imagen-folder" data-path="${directory?._id ?? ''}"  url-file="${directory?.dataFile?.fileUrl??''}">
        <a href="${directory?.dataFile?.fileUrl??''}">
            <img
                class="img-amp"
                data-src="${directory?.dataFile?.fileUrl??''}"
                src="./images/loading-image.svg?r=${randomNum}"
                error-src="./images/loading-image.svg"
                loading="lazy"
                style="width: 36px;"
            />
        </a>
        <p class="text-overflow" >${directory?.name ?? ''}</p>
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

const createMenuFolder = (pathID,urlFile) => {

    const menuHTML = `
    <div id="context-menu" class="context-menu">
        <ul>
            <li id="delete-folder" data-path="${pathID}">Borrar <i class="fa-solid fa-delete-left"></i></li>
            <li id="download-folder" url-file="${urlFile}">Descargar <i class="fa-solid fa-download"></i></li>
        </ul>
    </div>
    `;
    
    return parseToNode(menuHTML);
};

const elementAddFile = () =>
{
    const menuHTML = '<i class="fa-regular fa-file" style="color: #e6f3ff;font-size: 100px;"></i>';    
    return parseToNode(menuHTML);
}

const getImgPreview = (src) =>
{
    let randomNum = Math.random(1,100);
    const menuHTML = `
        <div class="content-img-preview">
            <i id="close-form" class="fa-solid fa-xmark" style="position: absolute;top: 10px;right: 10px;"></i>
            <img
                class="img-amp"
                data-src="${src}"
                src="./images/loading-image.svg?r=${randomNum}"
                error-src="./images/loading-image.svg"
                loading="lazy"
                style="width: 100%;max-width: 300px;border-radius: 15px;padding: 0; margin: 0;"
            />
        </div>
        `;    
    return parseToNode(menuHTML);
}

const otherFileHTML = (directory) => {
    return `
    <div class="other-file" data-path="${directory?._id ?? ''}" url-file="${directory?.dataFile?.fileUrl??''}">
        <i class="fa-solid fa-file"></i>
        <p class="text-overflow" >${directory?.name ?? ''}</p>
    </div>
    `;
}
    

export { createDirectoryHTML, migaHTML,createFormFolder,createMenuFolder, elementAddFile, createImagenHTML, getImgPreview, otherFileHTML };