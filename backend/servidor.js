const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: 'cerato.mps.interno',
    user: 'FabioGarbato',
    password: 'BPt3bpMRzivTo3tamwC9',
    database: 'migracaoSql',
    port: 5432,
    ssl: false 
  });

app.get('/dados', async (req, res) => {
    try {
      const result = await pool.query('SELECT form, classe, sombra, objetobanco FROM Mapa WHERE sombra IS NOT NULL ORDER BY form ASC');
      const rows = result.rows;
      res.json(rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });  

app.get('/dadosDataModule', async (req, res) => {
    try {
        const result = await pool.query('SELECT form, classe, relatorio, objetobanco FROM Mapa WHERE Sombra ISNULL ORDER BY form ASC');
        const rows = result.rows;
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});  

app.get('/dadosRelatorio', async (req, res) => {
  try {
      const result = await pool.query('SELECT form, classe, sombra, relatorio, objetobanco FROM Mapa ORDER BY form ASC');
      const rows = result.rows;
      res.json(rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
