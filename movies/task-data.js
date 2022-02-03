const Users = require("./users");

const users = [
    {
      id: 123,
      role: "basic",
      name: "Basic Thomas",
      username: "basic-thomas",
      password: "sR-_pcoow-27-6PAwCD8",
    },
    {
      id: 434,
      role: "premium",
      name: "Premium Jim",
      username: "premium-jim",
      password: "GBLtTyq3E_UNjFnpo9m6",
    },
  ];

Users.add(users[0].name, users[0].role, users[0].username, users[0].password, users[0].id);
Users.add(users[1].name, users[1].role, users[1].username, users[1].password, users[1].id);