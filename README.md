Old start script
"start": "nodemon index.js --delay 3.0 --ignore test"

Update docker files:
docker-compose up --build --force-recreate

Run docker with input (use for running tests)
docker exec -it api sh

setup docker, node, postgres, typescript: https://dev.to/chandrapantachhetri/docker-postgres-node-typescript-setup-47db
another getting started article: https://www.docker.com/blog/getting-started-with-docker-using-node-jspart-i/
docker best practices with node: https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/

start with mocha: https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-mocha
Test node api: https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai




Beginner Resources:
Start node server: https://levelup.gitconnected.com/set-up-and-run-a-simple-node-server-project-38b403a3dc09
environment variables: https://itnext.io/how-to-use-environment-variables-in-node-js-cb2ef0e9574a

Scripts before edits:
"test": "npm run build && mocha --reporter spec",
"start": "node ./dist/index.js",
"dev": "nodemon -L -e ts --exec \"npm run build && npm start\"",
"build": "tsc",
"config": "node config.js",
"docker-test": "docker-compose run --rm api sh -c \"npm test\"",
"playground": "nodemon playground/index.js"


PORT=3000
HOST=127.0.0.1

DB_USER='postgres'
DB_HOST='db'
DB_NAME='db_name'
DB_PASSWORD='password'
DB_PORT=5432