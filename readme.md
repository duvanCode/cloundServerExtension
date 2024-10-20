# Clound Server

El proyecto Clound Server, es una extensión de chorme que complementa una app con el objetivo de compartir archivos de manera rapida y sencilla en cualquier pc o móvil, en cualquier momento y lugar solo con un sencillo logueo podrás tener tus archivos en cualquier lugar.

Está escrito en JS vanilla, presenta una interesante propuesta de arquitectura para front-end en JS vanilla.

## Características

- **Registro y logueo**: Permite loguearse o registrarse de manera sencilla mediante un logueo tradicional, oauth 2.0 o logueo por QR.
- **Subir archivos**: Cargar archivos de manera sencilla y rápida.
- **Portapapeles en la nube**: Permite un copiado sencillo entre dispositivos.


## Instalación

1. Clona el repositorio:
    ```bash
    git clone https://github.com/duvanCode/cloundServerExtension.git
    ```

2. Abre tu navegador Chrome y navegador a `chrome://extensions`.

3. Habilita la opción de desarrollador en la parte superior derecha.

4. Selecciona la opción de "Cargar descomprimida" y selecciona la carpeta donde sé bajo el proyecto.

## Estructura del Proyecto

```plaintext
cloundServerExtension/
├── css/
├── images/
├── libs/
├── index.html
├── login.html
├── manifest.json
└── README.md
