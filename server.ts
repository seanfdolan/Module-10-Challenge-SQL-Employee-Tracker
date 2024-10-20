import express, { Application } from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb} from './src/db/connections.ts';

await connectToDb();

const PORT = process.env.PORT || 3001;
const app: Application = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// const deletedRow = 2;

app.post('/employees', (req, res) => {
    const sqlRole = "INSERT INTO role (role.title) VALUES ($1) RETURNING id";
    const params = [req.body.role_id];
    pool.query(sqlRole, params, (err: Error, result: QueryResult) => {
        if (err) {
            console.log(err);
        } else {
            res.status(201).send(`Role added with ID: ${result.rows[0].id}`);
        }
    });

    const sql = "INSERT INTO employees (employees.first_name, employees.last_name, employees.role_id, employees.manager_id) VALUES ($1, $2, $3, $4) RETURNING id";
    pool.query(sql, params, (err: Error, result: QueryResult) => {
        if (err) {
            console.log(err);
        } else {
            res.status(201).send(`Employee added with ID: ${result.rows[0].id}`);
        }
    });
});

app.get('/employees', (_req, res) => {
    const sql = 'SELECT role.title FROM department AS role'; 
    pool.query(sql, (err: Error, result: QueryResult) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        const { rows } = result;
        res.json(rows);
    });
});

app.delete('/departments/:id', (req, res) => {
    const sql = 'DELETE FROM department WHERE id = $1';
    const params = [req.params.id];
    pool.query(sql, params, (err: Error, result: QueryResult) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json(result);
    });
});

app.delete('/roles/:id', (req, res) => {
    const sql = 'DELETE FROM role WHERE id = $1';
    const params = [req.params.id];
    pool.query(sql, params, (err: Error, result: QueryResult) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json(result);
    });
});

app.delete('/employees/:id', (req, res) => {
    const sql = 'DELETE FROM employees WHERE id = $1';
    const params = [req.params.id];
    pool.query(sql, params, (err: Error, result: QueryResult) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json(result);
    });
});
app.get('/employees/:id', (_req, res) => {
    const sql = 'SELECT employees.last_name AS employee FROM department.name';
    pool.query(sql, (err: Error, result: QueryResult) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        const { rows } = result;
        res.json({
            data: rows,
        });
    });
});
app.put('/departments/:id', (req, res) => {
    const sql = 'UPDATE department SET name = $1 WHERE id = $2';
    const params = [req.body.name, req.params.id];
    pool.query(sql, params, (err: Error, result: QueryResult) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json(result);
    });
});
app.put('/managers/:id', (req, res) => {
    const sql = 'UPDATE managers SET name = $1 WHERE id = $2';
    const params = [req.body.name, req.params.id];
    pool.query(sql, params, (err: Error, result: QueryResult) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json(result);
    });
});

app.put('/managers/:id', (req, res) => {
    const sql = 'UPDATE managers SET name = $1 WHERE id = $2';
    const params = [req.body.name, req.params.id];
    pool.query(sql, params, (err: Error, result: QueryResult) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json(result);
    });
});

pool.query('DELETE FROM employees WHERE id = $1', (err: Error, result: QueryResult) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`${result.rowCount} row(s) deleted!`);
  }
});

pool.query('SELECT * FROM employees', (err: Error, result: QueryResult) => {
    if (err) {
        console.log(err);
    } else {
        console.log(result.rows);
    }
});

app.use((_req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});