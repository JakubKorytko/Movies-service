const fetch = require("node-fetch");
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("Missing API_KEY env var. Set it and restart the server");
}

class OMDB {
    static async get(title) {
        var res = await fetch(`https://www.omdbapi.com/?apikey=${process.env.API_KEY}&t=${title}`);
        var json = await res.json();
        if (json.Response == "False") return false; 
        var scrapped = {
            Title: json.Title,
            Released: json.Released,
            Genre: json.Genre,
            Director: json.Director
        }
        return scrapped;
    }
}

module.exports = OMDB