
let currentPath = '/';

function updateBreadcrumb(path) {
    const breadcrumb = document.querySelector('.breadcrumb ol');
    breadcrumb.innerHTML = '<li><a href="#" data-path="/">Inicio</a></li>';

    if (path !== '/') {
        const folders = path.split('/').filter(Boolean);
        let currentPath = '';
        folders.forEach((folder, index) => {
            currentPath += '/' + folder;
            breadcrumb.innerHTML += `
                <li>
                    <a href="#" data-path="${currentPath}" ${index === folders.length - 1 ? 'aria-current="page"' : ''}>
                        ${folder}
                    </a>
                </li>
            `;
        });
    }

    document.querySelectorAll('.breadcrumb a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo(this.getAttribute('data-path'));
        });
    });
}

function navigateTo(path) {
    currentPath = path;
    updateBreadcrumb(path);
    console.log('Navegando a:', path);
    // Aquí puedes implementar la lógica para cargar el contenido de la carpeta
}

document.querySelector('.search-bar input').addEventListener('input', function(e) {
    console.log('Buscando:', e.target.value);
    // Implementar funcionalidad de búsqueda aquí
});

document.querySelectorAll('.folder').forEach(folder => {
    folder.addEventListener('click', function() {
        const path = this.getAttribute('data-path');
        navigateTo(path);
    });
});

document.querySelector('.add-button').addEventListener('click', function() {
    console.log('Botón de añadir clickeado');
    // Implementar funcionalidad de añadir aquí
});

// Inicializar la miga de pan
updateBreadcrumb(currentPath);
