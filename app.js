const express = require('express');
const upload = require('express-fileupload');
const to = require('await-to-js').default;

const app = express();

app.use(upload());

const router = express.Router();

app.set('view engine', 'ejs');
app.set('views', 'views');

router.get('/', (req, res) => {
    res.render('home', {
        text: null
    });
});

router.post('/', async (req, res) => {
    const file = req.files.file;
    const fileName = file.name;

    const [err, result] = await to(file.mv(`./images/${fileName}`));

    res.render('home', {
        text: `${err ? err : 'ayo bruv check this out'}`
    });
});

app.use(router);

app.listen('3000');
