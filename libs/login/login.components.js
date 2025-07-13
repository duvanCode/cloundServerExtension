const createElementLoading = () => {
    let pelicula = document.createElement('DIV');
    pelicula.style.position = 'absolute';
    pelicula.style.height = '100%';
    pelicula.style.width = '100%';
    pelicula.style.background = 'rgb(255 255 255 / 17%)';
    pelicula.style.top = '0';
    pelicula.style['backdrop-filter'] = 'blur(1.5px)';
    pelicula.style['display'] = 'flex';
    pelicula.style['justify-content'] = 'center';
    pelicula.style['align-items'] = 'center';
    pelicula.style['flex-direction'] = 'column';
    pelicula.id = 'peliculaCargando';

    return pelicula;
} 

const createElementImgLoading = () => {
    let elementLoadig = document.createElement('img');
    elementLoadig.src = 'images/loading.svg';
    elementLoadig.classList.add('spinner');
    return elementLoadig;
}


export { createElementLoading, createElementImgLoading };