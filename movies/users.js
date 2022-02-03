var Database = require("./database");
var db = new Database();
const table = "users"

class Users {
    static async add(name, role, username, password, id=null) {
        var data = {
            name: name,
            role: role,
            username: username,
            password: password,
            id: id
        }
        return await db.insert(table, data)
    }
}

module.exports = Users;