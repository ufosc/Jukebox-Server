# Deploying Jukebox

## Tech Stack

| Tech           | Use                              |
| -------------- | -------------------------------- |
| Terraform      | Infrastructure as Code           |
| AWS            | Hosting                          |
| Docker-Compose | Keeping consistent version of TF |

### References

> Previous Project: <https://github.com/IkeHunter/Recipe-App-Api-DevOps>

## Contributing

In order to contribute, you don't need access to the main AWS account. Instead, you can replicate the production environment on you own aws account to test your terraform configuration.

If you want to be a part of the administrative group, and help maintain the actual production environment, an admin will need to create an IAM user for you to use.

Remember to always format and validate your terraform before pushing changes! The CI/CD jobs will immediately reject your changes if your terraform code is not formatted or validated. See commands below for more instructions.

### Commands

Start AWS Vault

```sh
aws-vault exec [username] --duration=12h
```

Run Terraform commands inside docker-compose (recommended, it keeps the version and environment consistent)

```sh
docker-compose -f deploy/docker-compose.yml run --rm terraform <command>
```

Notable commands include:

```sh
terraform init # initialize tf local environment
terraform fmt # auto format tf files
terraform validate # validate tf configuration
terraform workspace select <workspace> # selects remote workspace to work in
terraform plan # show what will be created/updated/deleted when applied
terraform apply # apply changes made to config
terraform destroy # delete all resources created by tf
```

Example full command:

```sh
docker-compose -f deploy/docker-compose.yml run --rm terraform init
```

## Default Setup

If you are a part of the administrative group, and have access to an IAM user, then getting started is *relatively* simple. The process looks like the following:

1. Set up AWS Vault
2. Activate AWS Vault
3. Initialize terraform

Let's go through it in more detail.

### AWS Vault

AWS Vault is a CLI tool that allows you to authenticate with AWS in the command line so you can work with their API securely. You configure an IAM user with the vault, then when you want to work with the AWS API you activate the vault for a certain amount of time. This tool will automatically inject your credentials into each request you make - allowing you access to all the resources your IAM policy allows.

Luckily, you will not be working with the AWS API directly. Instead Terraform will be making the calls on your behalf. How this works is the vault will store your credentials inside environment variables that Terraform can access, it will then use these credentials when making requests.

In order to **install AWS Vault** on your system, refer to the following url:

> <https://www.turbogeek.co.uk/aws-vault-to-aws-console/>

### CLI Setup

Once you have AWS Vault installed, use the following commands to add your IAM user:

```sh
aws-vault add [username of IAM user]
```

Open your account info:

```sh
vim ~/.aws/config # or use whatever text editor you want, like nano
```

Then add the following to the file:

```txt
region=us-east-1
```

Once it is configured, you need to activate it:

```sh
aws-vault exec [username] --duration=12h # replace 12 with the amount of hours you need it open for
```

You will need to run this command again when it expires.

## Manual Setup

*NOTE: You are solely responsible for charges made on your personal AWS account. Always destroy resources after your finished, and periodically check your account.*

If you are using your own AWS account, you will need to configure the environment manually.

### IAM User

*NOTE: This is using the `IAM` console, not the `IAM Identity Center` console. The latter is newer and is used for much of the same purposes. However, it has less documentation and is more difficult to set up.*

1. Go to IAM inside AWS
2. Create new IAM group called Administrators (or any name), and add the `AdministratorAccess` policy
3. After creating the group, create a new IAM user and assign it to the admin group. The name of the user can be anything.
4. After creation, click "Users" on the left menu to see a list of all users. Click on the user you just created.
5. Go to "Security credentials", then scroll to "Access keys"
6. Click `Create access key`, you can give it any description you want.
7. Copy the **Access key ID** and **Secret access key** to a secure location. After you do this, you can exit the confirmation window.

Now that your user is created, set up AWS Vault using the configuration specified in the [Default Setup](#default-setup) section above. You will need to have AWS Vault active to initialize terraform.

### DynamoDB

1. Go to AWS, search up DynamoDB, click `Create Table`
2. For the table name, enter:

    ```txt
    jukebox-backend-tf-state-lock
    ```

3. For the `Partition key`, enter:

    ```txt
    LockID
    ```

4. Click `Create Table`.
5. The table may take a couple of minutes to finish setting up.

### S3 Bucket

1. While in AWS, go to the S3 dashboard.
2. Click the button that says `Create bucket`
3. For the bucket name, you can choose any name you want. The name has to be globally unique, so you may want to choose something like `your-name-jukebox-backend`
4. You can keep everything else default.
5. Click `Create bucket`

### Initialize Terraform

Since you used a manual AWS config, you have to run an extended version of the `terraform init` command to change the name of the s3 bucket. As of the time I am writing this, Terraform doesn't allow variables in the `backend` block, so you will need to override the configuration.

The use of export below makes the setup a little easier to read, but is not essential.

Issue the following commands, and replace `your-bucket` in the `export` command with the name of your bucket.

```sh
export S3_BUCKET="your-bucket"

docker-compose -f deploy/docker-compose.yml run --rm terraform init \
    -backend-config="bucket=${S3_BUCKET}" \
    -backend-config="key=${S3_BUCKET}.tfstate"
```
