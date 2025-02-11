    import pg from 'pg';
    const { Pool } = pg;

    const pool = new Pool({
        user: 'postgres', 
        host: 'localhost',
        database: 'cinescope',
        password: '12345678', 
        password: '0260902003',
        port: 5432,
    });


export default pool;