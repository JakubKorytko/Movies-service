var sqlite = require("better-sqlite3")('./data.db');
var SqlString = require('sqlstring');

class Database {

    create = async () => {
        this.db = sqlite;
        await this.db.prepare(
            "CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, data TEXT NOT NULL);"
        ).run();
        await this.db.prepare(
            "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT NOT NULL, role TEXT NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL);"
        ).run();
        await this.db.prepare(
            "CREATE TABLE IF NOT EXISTS movies (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title TEXT NOT NULL, released DATE NOT NULL, genre TEXT NOT NULL, director TEXT NOT NULL, created DATE NOT NULL, creatorID INT NOT NULL);"
        ).run();
    }

    connection = async () => {
        if (this.db == undefined || this.db == null) {
            await this.create();
        }
    }

    query = async (q, n=0) => {
        await this.connection();
        if (n==1) return await this.db.prepare(q).all();
        return await this.db.prepare(q).run();
    }

    insert = async (table, data) => {
        var sql = SqlString.format(`INSERT OR IGNORE INTO ${table} (??) VALUES (?);`, [Object.keys(data).map((x=>x.toLowerCase())), Object.values(data)])
        return await this.query(sql)
    }

    getData = async (table) => {
        return await this.query(`SELECT * FROM ${table}`, 1)
    }
    
}

module.exports = Database;