require('dotenv').config();
const express = require('express');
const kandang = require('./routes/kandangCRUD.js');
const port = process.env.PORT;
const expressLayout = require(`express-ejs-layouts`)
const db = require('./database/db');
const app = express();
app.use(expressLayout);
app.use(express.json());
app.use('/kandang-crud', kandang);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.render('index', {
        layout: 'layouts/main-layout'
    });
});

app.get('/hewan', (req, res) => {
    res.render('hewan', {
        layout: 'layouts/main-layout'
    });
    
});

app.get('/kandang', (req, res) => {
    db.query('SELECT * FROM kandang', (err, todos) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.render('kandang', {
            layout: 'layouts/main-layout',
            todos: todos
        });
    });
});

app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});