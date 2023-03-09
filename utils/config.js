const fs = require('fs');
const util = require('util');
const dedent = require('dedent-js');
const prompt = require('prompt-sync')({sigint: true});
const exec = util.promisify(require("node:child_process").exec);

const env_file = '.env';
const playground_dir = 'playground/';

console.log(`${'='.repeat(5)} Running Project Configuration ${'='.repeat(5)}\n`);


const main = () => {
    
    return new Promise(async (resolve) => {
        console.log(`Checking prereqs${'.'.repeat(5)}\n`);
        const { stdout, stderr } = await exec("node -v");

        if (stderr) {
            console.log("\tError with Node.js:");
            console.log(`\tOutput: ${error.message}`);
            // return;
        } else {
            console.log(`\tNode Version: \t\t${stdout}`);
        }
        resolve();

    }).then(async () => {
        const { stdout, stderr } = await exec("docker version --format '{{.Server.Version}}'");

        if (stderr) {
            console.log("\tError with Docker:");
            console.log(`\tOutput: ${stderr}`); 
            // return;
        } else {
            console.log(`\tDocker Version: \t${stdout}`);
        }

    }).then(async () => {
        console.log(`\nChecking for .env file${'.'.repeat(5)}\n`);
        const exists = fs.existsSync(env_file);
        if (!exists) {
            console.log("File .env needs to be configured");
        
            const port = prompt('PORT: (3000) ', '3000');
            const host = prompt('HOST: (127.0.0.1) ', '127.0.0.1');
            const db_user = prompt('DB_USER: (postgres) ', 'postgres');
            const db_host = prompt('DB_HOST: (db) ', 'db');
            const db_name = prompt('DB_NAME: (db_name) ', 'db_name');
            const db_password = prompt('DB_PASSWORD: (password) ', 'password');
            const db_port = prompt('DB_PORT: (5432) ', '5432');
        
            let lines = {
                "# Node": "",
                PORT: port,
                HOST: host,
                "# Database": "",
                DB_USER: db_user,
                DB_HOST: db_host,
                DB_NAME: db_name,
                DB_PASSWORD: db_password,
                DB_PORT: db_port
            }

            fs.writeFileSync(env_file, "# Environment Variables\n");
            for (let key in lines) {
                if(lines[key] != "") {
                    fs.appendFileSync(env_file,`${key}=${lines[key]}\n`);
                } else {
                    fs.appendFileSync(env_file,`\n${key}\n`);
                }
            }
        
        } else {
            console.log('\tFile .env exists');
        }
    }).then(() => {
        console.log(`\nChecking for playground directory${'.'.repeat(5)}\n`);
        try {
            if (!fs.existsSync(playground_dir)) {
                console.log("\tCreating playground directory\n")
                fs.mkdirSync(playground_dir);
                const data = fs.readFileSync('utils/node-start.txt', 'utf8');

                fs.writeFileSync(playground_dir + 'server.js', data);
            } else {
                console.log("\tPlayground directory exists\n")
            }

            // console.log(data);
        } catch (err) {
            console.log("\tError when creating playground in config.js: ");
            console.log(err);
        }
        
    }) 
    
};

module.exports = main();
