# Dynamic Galleria
Easy Gallery Setup in [Node.js](https://nodejs.org/en/) using [Galleria.js](https://galleriajs.github.io/) and [Express.js](https://expressjs.com/).

**Installing**
- `npm install`
- `pm2 start ecosystem.config.js` (or preferred process manager)

**Adding Galleries**
- Create a new folder in `/public/galleries`. The folder names will be the url they are accessed from.
- Drop your images for the gallery into the new folder.
- (optional) create a `.name` file in the gallery folder and the app will set that as the gallery page's title.  
- (optional) create a `.theme` file in the gallery folder and that will overwrite the `defaultTheme`.
