const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const port = 3000;
const fs = require('fs');
var json2csv = require('json2csv').parse;

var fields = ['first_name', 'last_name', 'username', 'city', 'zip'];
var opts = { fields };
var newLine = '\r\n';

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
});
app.post('/', (req, res) => {
    fs.stat('file.csv', function (err, stat) {
        if (err == null) {
            console.log('File exists');
            var csv = json2csv(req.body, { header: false }) + newLine;
            fs.appendFile('file.csv', csv, function (err) {
                if (err) throw err;
                console.log('The "data to append" was appended to file!');
            });
        } else {
            console.log('New file, just writing headers');
            const csv = json2csv(req.body, opts) + newLine;
            fs.writeFile('file.csv', csv, function (err) {
                if (err) throw err;
                console.log('file saved');
            })
        }
    });
    res.render('index');
})

app.listen(port, () => {
    console.log(`http://localhost:3000`)
})
