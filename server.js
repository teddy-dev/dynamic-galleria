const express = require('express')
const app = express();
const sprightly = require('sprightly');
const fs = require('fs-extra');
const zipdir = require('zip-dir');
const port = process.env.PORT || 3000;
const config = require("./config");

app.engine('spy', sprightly);
app.set('views', './views');
app.set('view engine', 'spy');
app.use(express.static('public'));
app.locals.appName = config.appName;

app.get('/', (req, res) => {
    res.render("index.spy");
});

app.get('/404', (req, res) => {
    res.render("404.spy");
});

app.get('/:gallery/download', (req, res) => {
    if (!fs.existsSync(`./public/galleries/${req.params.gallery}`)) return res.redirect('/404');

    // Build the .zip file but only accept images (exclude .name and .theme)
    // we're only saving to buffer then sending away.
    zipdir(`./public/galleries/${req.params.gallery}`, {
        filter: (path) => config.imageRegex.test(path)
    }, function (err, buffer) {
        res.writeHead(200, {
            'Content-Disposition': `attachment; filename="${req.params.gallery}.zip"`,
            'Content-Type': 'application/zip'
        });
        return res.end(buffer);
    });
});

app.get('/:gallery', (req, res) => {
    fs.readdir(`./public/galleries/${req.params.gallery}`, (err, images) => {
        if (err || !images) return res.redirect("/404");

        // Build the dataSource value passed into Galleria.js
        // Filter only accepted images then map into accepted object array
        // https://galleriajs.github.io/docs/options/dataSource.html
        const dataSource = images.filter(image => {
            return image.match(config.imageRegex);
        }).map(image => {
            return {
                image: `/galleries/${req.params.gallery}/${image}`
            };
        });

        let themeName = config.defaultTheme;

        // .name and .theme can exist in the folder of any gallery
        // .name will overwrite the <title></title>
        // and .theme will overwrite the Galleria theme
        const hasNameFile = fs.existsSync(`./public/galleries/${req.params.gallery}/.name`);
        const hasThemeFile = fs.existsSync(`./public/galleries/${req.params.gallery}/.theme`);
        const name = (hasNameFile ? fs.readFileSync(`./public/galleries/${req.params.gallery}/.name`, 'utf-8') : req.params.gallery);

        // If allowed, the user can specify ?theme=name.
        if (req.query.theme && config.allowUserThemeSelection) themeName = req.query.name;
        else if (hasThemeFile) themeName = fs.readFileSync(`./public/galleries/${req.params.gallery}/.name`, 'utf-8');

        // Simple validation of theme
        themeName = (config.validThemes.indexOf(themeName) == -1 ? config.defaultTheme : themeName);

        return res.render("gallery.spy", {
            name: name,
            theme: themeName,
            data: JSON.stringify(dataSource),
            dir: req.params.gallery
        });
    });
});

app.get('*', function (req, res) {
    res.redirect("/404");
});

app.listen(port, () => {
    return console.log(`${config.appName} is running on ${port}!`);
});