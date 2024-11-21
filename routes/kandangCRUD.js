const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Mengimpor koneksi database

// Endpoint untuk mendapatkan semua Kandang
router.get('/', (req, res) => {
    db.query('SELECT * FROM kandang', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(results);
    });
});

// Endpoint untuk mendapatkan Kandang berdasarkan ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM kandang WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Kandang tidak ditemukan');
        res.json(results[0]);
    });
});

// Endpoint untuk menambahkan Kandang baru
router.post('/', (req, res) => {
    const { nama, lokasi, kapasitas } = req.body;

    if (!nama || !lokasi || !kapasitas) {
        return res.status(400).send('Semua kolom (nama, lokasi, kapasitas) harus diisi.');
    }

    const query = 'INSERT INTO kandang (nama, lokasi, kapasitas) VALUES (?, ?, ?)';
    const values = [nama.trim(), lokasi.trim(), kapasitas];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Internal Server Error');
        }

        const newKandang = {
            id: results.insertId,
            nama: nama.trim(),
            lokasi: lokasi.trim(),
            kapasitas: kapasitas
        };

        res.status(201).json(newKandang);
    });
});


// Endpoint untuk memperbarui Kandang
router.put('/:id', (req, res) => {
    const { nama, lokasi, kapasitas } = req.body;

    db.query('UPDATE kandang SET nama = ?, lokasi = ?, kapasitas = ? WHERE id = ?', [nama, lokasi, kapasitas, req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Kandang tidak ditemukan');
        res.json({ id: req.params.id, nama, lokasi, kapasitas });
    });
});

// Endpoint untuk menghapus Kandang
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM kandang WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Kandang tidak ditemukan');
        res.status(204).send();
    });
});

module.exports = router;