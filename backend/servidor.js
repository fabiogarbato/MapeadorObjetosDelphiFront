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

/*---------------------------------------*/
/*                 SOMBRA                */
/*---------------------------------------*/

app.get('/dados', async (req, res) => {
    try {
      const result = await pool.query('SELECT id, form, classe, sombra, objetobanco, migrado FROM Mapa WHERE sombra IS NOT NULL ORDER BY form ASC');
      const rows = result.rows;
      res.json(rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });  

app.patch('/dados/:id', async (req, res) => {
    const { id } = req.params;
    const { migrado } = req.body;
    try {
        const result = await pool.query(
            'UPDATE mapa SET migrado = $1 WHERE id = $2 RETURNING *',
            [migrado, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Registro não encontrado');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
  });
  
/*---------------------------------------*/
/*              DataModule               */
/*---------------------------------------*/

app.get('/dadosDataModule', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, form, classe, relatorio, objetobanco, migrado FROM Mapa WHERE Sombra ISNULL ORDER BY form ASC');
        const rows = result.rows;
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});  

app.patch('/dadosDataModule/:id', async (req, res) => {
  const { id } = req.params;
  const { migrado } = req.body;
  try {
      const result = await pool.query(
          'UPDATE mapa SET migrado = $1 WHERE id = $2 RETURNING *',
          [migrado, id]
      );
      if (result.rows.length === 0) {
          return res.status(404).send('Registro não encontrado');
      }
      res.json(result.rows[0]);
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

/*---------------------------------------*/
/*              Cronograma               */
/*---------------------------------------*/

app.post('/eventosProjeto', async (req, res) => {
  const { data, evento } = req.body;
  try {
      const result = await pool.query(
          'INSERT INTO eventos_projeto (data, evento) VALUES ($1, $2) RETURNING *',
          [data, evento]
      );
      res.json(result.rows[0]);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

app.put('/eventosProjeto/:id', async (req, res) => {
  const { id } = req.params;
  const { data, evento } = req.body;
  try {
      const result = await pool.query(
          'UPDATE eventos_projeto SET data = $1, evento = $2 WHERE id = $3 RETURNING *',
          [data, evento, id]
      );
      res.json(result.rows[0]);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

app.get('/eventosProjeto', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM eventos_projeto ORDER BY data ASC');
      res.json(result.rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

app.delete('/eventosProjeto/:id', async (req, res) => {
  const { id } = req.params;
  try {
      await pool.query('DELETE FROM eventos_projeto WHERE id = $1', [id]);
      res.status(204).send();
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

/*---------------------------------------*/
/*              Login                    */
/*---------------------------------------*/

app.post('/login', async (req, res) => {
    const { usuario, senha } = req.body;
  
    try {
        const usuarioResult = await pool.query(
            "SELECT * FROM Usuarios WHERE usuario = $1",
            [usuario]
        );
  
        if (usuarioResult.rows.length === 0) {
            return res.status(401).json({ message: "Usuário inválido!" });
        }
  
        const loginResult = await pool.query(
            "SELECT * FROM Usuarios WHERE usuario = $1 AND senha = crypt($2, senha)",
            [usuario, senha]
        );
  
        if (loginResult.rows.length > 0) {
            res.json({ message: "Usuário autenticado com sucesso!", usuario: loginResult.rows[0] });
        } else {
            res.status(401).json({ message: "Senha inválida!" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Erro ao autenticar o usuário" });
    }
  });

/*---------------------------------------*/
/*              Relatório                */
/*---------------------------------------*/

app.get('/telas', async (req, res) => {
  try {
    const telasMigradas = await pool.query('SELECT Count(*) FROM Mapa WHERE migrado = True');
    const telasNaoMigradas = await pool.query('SELECT Count(*) FROM Mapa WHERE migrado = False');

    res.json({
      telasMigradas: telasMigradas.rows[0].count,
      telasNaoMigradas: telasNaoMigradas.rows[0].count
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
