import { parseToNode } from './../utils/generic.methods.js';


const createDirectoryHTML = (directory) => {
    return `
    <div class="folder text-center cursor-pointer mb-1" data-path="${directory?._id ?? ''}">
        <i class="fas fa-folder text-4xl text-blue-500 mb-1" title="${directory?.name ?? ''}"></i>
        <p class="overflow-hidden whitespace-nowrap text-ellipsis w-[92px] md:w-32 lg:w-48 mt-[5px] mb-0 text-[0.85rem] text-left" title="${directory?.name ?? ''}" >${directory?.name ?? ''}</p>
    </div>
    `;
}

const createImagenHTML = (directory) => {

    let randomNum = Math.random(1,100);

    return `
    <div class="imagen-folder flex flex-col justify-center items-center" data-path="${directory?._id ?? ''}"  url-file="${directory?.dataFile?.fileUrl??''}">
        <a href="${directory?.dataFile?.fileUrl??''}" class="max-w-md max-h-80">
            <img
                class="img-amp w-15 block cursor-pointer !h-8.5 mb-1"
                data-src="${directory?.dataFile?.fileUrl??''}"
                src="./images/loading-image.svg?r=${randomNum}"
                error-src="./images/loading-image.svg"
                loading="lazy"
                title="${directory?.name ?? ''}"
            />
        </a>
        <p class="overflow-hidden whitespace-nowrap text-ellipsis w-[92px] md:w-32 lg:w-48 mt-[5px] mb-0 text-[0.85rem] text-left" title="${directory?.name ?? ''}">${directory?.name ?? ''}</p>
    </div>
    `;
}



const migaHTML = (directory) => {
    return `
        <li data-path-li="${directory?._id ?? ''}" class="inline text-sm after:content-['>'] after:mx-1 after:text-blue-500 last:after:content-[''] last:text-gray-700 last:pointer-events-none overflow-hidden whitespace-nowrap text-ellipsis max-w-[100px] md:w-32 lg:w-48 text-[0.85rem] text-left">
            <a href="#" data-path="${directory?._id ?? ''}" title="${directory?.name ?? ''}">${directory?.name ?? ''}</a>
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
        <form id="createFolderForm" autocomplete="off">
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
    const menuHTML = '<i class="fa-regular fa-file text-4xl text-blue-500" style="color: #e6f3ff;font-size: 100px;"></i>';    
    return parseToNode(menuHTML);
}

const getImgPreview = (src) =>
{
    let randomNum = Math.random(1,100);
    const menuHTML = `
        <div class="bg-[#cccccc6e] p-[15px] m-0 rounded-[20px] border border-[#ccc] relative">
            <i id="close-form" class="fa-solid fa-xmark" style="position: absolute;top: 10px;right: 10px;"></i>
            <img
                class="img-amp w-full rounded-2xl p-0 m-0 max-h-[90vh] min-h-[50vh]"
                data-src="${src}"
                src="./images/loading-image.svg?r=${randomNum}"
                error-src="./images/loading-image.svg"
                loading="lazy"
            />
        </div>
        `;    
    return parseToNode(menuHTML);
}

const otherFileHTML = (directory) => {
    return `
    <div class="other-file text-center" data-path="${directory?._id ?? ''}" url-file="${directory?.dataFile?.fileUrl??''}">
        <i class="fa-solid fa-file text-4xl text-blue-500 text-center mb-1" title="${directory?.name ?? ''}"></i>
        <p class="overflow-hidden whitespace-nowrap text-ellipsis w-[92px] md:w-32 lg:w-48" title="${directory?.name ?? ''}">${directory?.name ?? ''}</p>
    </div>
    `;
}
    

export { createDirectoryHTML, migaHTML,createFormFolder,createMenuFolder, elementAddFile, createImagenHTML, getImgPreview, otherFileHTML };