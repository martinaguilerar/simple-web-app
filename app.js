const express = require("express");
const sql = require('mssql');
  
const app = express();

const config = {
    user: process.env["DB_USER"],
    password: process.env["DB_PASSWORD"],
    server: process.env["DB_SERVER"],
    port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
    database: process.env["DB_NAME"],
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}
  
app.listen(80, () => {
  console.log(`Server is up and running on 80 ...`);
});

app.get("/results", async (req, res) => {
    try {
      // Create a SQL Server connection pool
      const pool = await sql.connect(config);
  
      // Execute your SQL query
      const result = await pool.request().query(`SELECT TOP (20) [product_id]
            ,[product_name]
            ,[brand_id]
            ,[category_id]
            ,[model_year]
            ,[list_price]
        FROM [production].[products]`);
  
      // Send the result as JSON
      res.json(result.recordset);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  });