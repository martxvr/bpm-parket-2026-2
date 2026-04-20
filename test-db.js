const { Client } = require('pg');

const run = async () => {
    const uri = "postgresql://postgres.tgnxthcgpjlndzvtpgjh:h90NIByxRJo9mn0P@aws-1-eu-central-1.pooler.supabase.com:5432/postgres";
    const client = new Client({ connectionString: uri });

    try {
        await client.connect();
        const res = await client.query('SELECT NOW()');
        console.log("Connection successful! Time:", res.rows[0]);
    } catch (err) {
        console.error("Connection failed:", err.message);
    } finally {
        await client.end();
    }
};

run();
