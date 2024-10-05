const express = require('express');
const app = express();
const conn = require('./config/db');
const formData = require('express-form-data');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

app.use(cors());

app.use(express.json());
app.use(formData.parse());

app.get('/web-data', function (req, res) {
    const sql = "SELECT * FROM `web_data`";
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.post('/web-data', function (req, res) {
    const params = req.body;

    if (!params.name || !params.value || !params.url || !params.domain) {
        return res.status(400).json({
            error: 'Semua parameter (name, value, url, domain) harus diisi'
        });
    }

    const sql = "INSERT INTO web_data (name, value, url, domain) VALUES (?, ?, ?, ?)";
    const reqPost = [params.name, params.value, params.url, params.domain];

    conn.query(sql, reqPost, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err.sqlMessage
            });
        } else {
            res.status(200).json({
                "status": true,
                "message": 'Data berhasil disimpan'
            });
        }
    });
});

app.get('/web-data/:id', function (req, res) {
    const id = req.params.id;
    const sql = "SELECT * FROM `web_data` WHERE id = ?";
    conn.query(sql, id, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.put('/web-data/:id', function (req, res) {
    const id = req.params.id;
    const params = req.body;

    if (!params.name || !params.value || !params.url || !params.domain) {
        return res.status(400).json({
            error: 'Semua parameter (name, value, url, domain) harus diisi'
        });
    }

    const sql = "UPDATE web_data SET name = ?, value = ?, url = ?, domain = ? WHERE id = ?";
    const reqPost = [params.name, params.value, params.url, params.domain, id];

    conn.query(sql, reqPost, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err.sqlMessage
            });
        } else {
            res.status(200).json({
                "status": true,
                "message": 'Data berhasil disimpan'
            });
        }
    });
});

app.delete('/web-data/:id', function (req, res) {
    const id = req.params.id;

    const sql = "DELETE FROM web_data WHERE id = ?";
    const reqPost = [id];

    conn.query(sql, reqPost, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err.sqlMessage
            });
        } else {
            res.status(200).json({
                "status": true,
                "message": 'Data berhasil dihapus'
            });
        }
    });
});

// Konfigurasi HTTPS
const options = {
    key: fs.readFileSync('privatekey.pem'),
    cert: fs.readFileSync('certificate.pem')
};

https.createServer(options, app).listen(3000, () => {
    console.log('https://localhost:3000');
});