const getCapitalice = (string) => {
    let palabras = string.split(' ');
    let result = palabras.map((palabra) => {
        return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
    });
    return result.join(' ');
};


const getInitials = (string) => {
    const words = string.trim().split(' ');
    const initials = words.slice(0, 2).map(word => word.charAt(0).toUpperCase());
    return initials.join('');
};


export { getCapitalice,getInitials };