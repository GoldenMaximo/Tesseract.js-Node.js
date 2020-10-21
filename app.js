require('dotenv').config();

const express = require('express');
const upload = require('express-fileupload');
const to = require('await-to-js').default;
const { createWorker } = require('tesseract.js');
const path = require('path');

const app = express();

app.use(upload());

const router = express.Router();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/images', express.static(path.join(__dirname, 'images')));

router.get('/', (req, res) => {
    res.render('home', {
        text: null
    });
});

router.post('/', async (req, res) => {
    const file = req.files.file;
    const fileName = file.name;
    let err;

    [err] = await to(file.mv(`./images/${fileName}`));

    const worker = createWorker({
        logger: m => console.log(m)
    });

    await worker.load();
    await worker.loadLanguage('eng+por');
    await worker.initialize('eng');
    await worker.initialize('por');
    [err, dataObj] = await to(worker.recognize(`./images/${fileName}`));
    await worker.terminate();

    res.render('home', {
        text: `${err ? err : dataObj.data.text}`,
        imgPath: `./images/${fileName}`
    });
});

app.use(router);

app.listen(process.env.PORT || 3000);
