# About this project

This is simple movies microservice made with: 

- Node.js
- Docker 
- Better-Sqlite3
- Express.js
- JEST

# Prerequisites

You need to have 

- `docker`
- `docker-compose` 
- `node.js`

installed on your computer to run the service

# Run locally

1. Clone this repository
1. There are some default settings in .env file (root dir)

    ```
    JWT_SECRET=iWpN8pRnxRVRivbz26VPvfH9OhJ3dufUMjz4WFCkRt2KT6Hp1ecPY0G384mnlXyp4lhF //secret for jwt tokens
    API_KEY=acc16300 //api key for omdb service
    MOVIES_PORT=3001 //port used by movies service
    AUTH_PORT=3001 //port used by auth service
    ```

    You can change them if you want, but remember that API_KEY has to be valid api key generated by OMBD service

1. Run from root dir

    ```
    docker-compose up -d
    ```

1. To stop the authorization service run

    ```
    docker-compose down
    ```

# This app contains 2 services

## Auth service

Service with 1 endpoint:

1. `POST /auth`
    1. Based on passed username and password generates JWT Token

## Movies service

Provides two endpoints:

1. `POST /movies`
   1. Allows creating a movie object based on movie title passed in the request body
   2. Based on the title additional movie details is fetched from
      https://omdbapi.com/ and saved to the database. Data fetched from OMDB:
   ```SQL
     Title: string
     Released: date
     Genre: string
     Director: string
   ```
   3. Only authorized users can create a movie.
   4. `Basic` users are restricted to create 5 movies per month (calendar
      month). `Premium` users have no limits.
1. `GET /movies`
   1. Fetch a list of all movies created by an authorized user.

# How to use

Send valid data to auth service `POST /auth` endpoint to get authorization token.

With authorization token you can fetch created movies with movies service `GET /movies` endpoint and create new movie with `POST /movies`

# Users

Both services defines two user accounts to use

1. `Basic` user

```js
 username: 'basic-thomas'
 password: 'sR-_pcoow-27-6PAwCD8'
```

1. `Premium` user

```js
username: 'premium-jim'
password: 'GBLtTyq3E_UNjFnpo9m6'
```


# API requests

To get/add movies or generate authorization token user call the movies service using for example `curl`. Syntax of curl requests:

## Movies service

### POST Request

```bash
curl -H "Content-Type: application/json" -H "Authorization: Bearer ${JWT Token from auth service}" -X POST http://localhost:${APP_PORT}/movies -d "{\"title\": \"${Movie title to add}\"}"
```

### Example POST Request

```bash
curl -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywibmFtZSI6IkJhc2ljIFRob21hcyIsInJvbGUiOiJiYXNpYyIsImlhdCI6MTY0MzgwNDg1NCwiZXhwIjoxNjQzODA2NjU0LCJpc3MiOiJodHRwczovL3d3dy5uZXRndXJ1LmNvbS8iLCJzdWIiOiIxMjMifQ.-Q-KA7lDE5KSSEjF1VMXWZxYNmNqW8iTfGO9dN5zW7Q" -X POST http://localhost:3001/movies -d "{\"title\": \"spiderman\"}"
```

### GET Request

```bash
curl -H "Content-Type: application/json" -H "Authorization: Bearer ${JWT Token from auth service} -X GET http://localhost:${MOVIES_PORT}/movies
```

### Example GET Request

```bash
curl -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywibmFtZSI6IkJhc2ljIFRob21hcyIsInJvbGUiOiJiYXNpYyIsImlhdCI6MTY0MzgwNDg1NCwiZXhwIjoxNjQzODA2NjU0LCJpc3MiOiJodHRwczovL3d3dy5uZXRndXJ1LmNvbS8iLCJzdWIiOiIxMjMifQ.-Q-KA7lDE5KSSEjF1VMXWZxYNmNqW8iTfGO9dN5zW7Q" -X GET http://localhost:3001/movies
```

## Auth service

### POST Request

```bash
curl -H "Content-Type: application/json" -X POST http://localhost:${AUTH_PORT}/auth -d "{\"username\": \"${USERNAME}\",\"password\": \"${PASSWORD}\"}"
```

### Example POST Request

```bash
curl -H "Content-Type: application/json" -X POST http://localhost:3000/auth -d "{\"username\": \"basic-thomas\",\"password\": \"sR-_pcoow-27-6PAwCD8\"}"
```
