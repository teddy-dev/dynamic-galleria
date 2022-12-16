module.exports = {
    appName: "Gallery",

    // What is the default theme for Galleria
    // https://galleriajs.github.io/themes/
    defaultTheme: "classic",

    // You can disable user's ability to use ?theme= to overwrite defaults.
    allowUserThemeSelection: true,

    // How the system decides what to pass as images.
    imageRegex: /\.(png|jpe?g|webp|gif|bmp)$/,

    // If you add a custom theme, define it here.\
    validThemes: [
        'miniml',
        'folio',
        'fullscreen',
        'classic',
        'twelve',
        'azur'
    ]
};