import postgres from "postgres";

const sql = postgres("postgres://postgres:postgres@db:5432/db");

export default sql;
