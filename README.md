# FileVault

FileVault is a monorepo, web application designed to securely manage and store files using Azure Blob Storage. It provides functionalities for uploading, listing, and deleting files stored in the cloud.

## Features

- **Upload Files**: Easily upload files with associated metadata (name and key) to Azure Blob Storage.
- **List Files**: View a list of all uploaded files with their metadata.
- **Delete Files**: Remove files from Azure Blob Storage while updating the file list.

## Technologies Used

- **Node.js**: Backend server environment.
- **Express.js**: Web framework for Node.js used to handle HTTP requests.
- **Azure Storage Blob SDK**: SDK for interacting with Azure Blob Storage.
- **React**: Frontend library for building user interfaces.
- **Multer**: Middleware for handling multipart/form-data, used for file uploads.
- **dotenv**: Module for loading environment variables from a `.env` file.
- **cors**: Middleware for enabling CORS (Cross-Origin Resource Sharing) in Express.

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js (recommended version)
- npm or yarn
- Azure Storage Account (for using Azure Blob Storage)

## Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/filevault.git
   cd filevault
    ```
2. **Install dependencies**

    ```bash
    npm install   # or `yarn install`
    ```
3. **Set up environment variables**

    .env is needed in ths `server` folder and `client` folder:

    ```
    # /server
    PORT=4000  # Port number for the server
    AZURE_STORAGE_ACCOUNT_NAME=<your-azure-storage-account-name>
    AZURE_STORAGE_ACCOUNT_KEY=<your-azure-storage-account-key>
    AZURE_CONTAINER_NAME=<your-container-name>

    # /client
    # The base url should be changed when deployed. For now, it's hardcoded as localhost
    # REACT_APP_API_BASE_URL=https://your-production-api-url
    PORT=3000
    REACT_APP_API_PORT=4000
    ```
4. **Start the server**

    The app is launched via concurrently in the root `package.json`

    In the root, run the following command to launch the server and client (the app):

    ```bash
    npm run start
    ```

## Starting with Docker

- There are 3 docker images:
  - Server - NodeJS/TS API
  - Client - ReactTS client
  - Jenkins - for running Jenkins pipeline locally/on CI

Build the containers with the following command from the root folder:
```bash
# enter command in the root folder
docker-compose up --build
```

To access Jenkins, you would need to follow some setup. See their official docs [ [linux](https://www.jenkins.io/doc/book/installing/linux/) | [mac](https://www.jenkins.io/doc/book/installing/macos/) ].

## Azure Container Registry Notes

### CI

The CI workflow runs all the checks and tests on PR to ensure stable code is pushed to deployments (or ACR in this case, for now).

### CD

The CD workflow pushes the stable, tested images to `filevault` container registry

>Note about creating Azure Service Principal and Azure Credentials:
- create a service principal with this command:
```bash
az ad sp create-for-rbac \
    --name "github-actions-push" \
    --role contributor \
    --scopes /subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/YOUR_RESOURCE_GROUP \
    --sdk-auth
```
- `--name "github-actions-push"`: Specifies the name of the service principal.
- `--role contributor`: Assigns a role to the service principal. The contributor role is a built-in role in Azure that allows full access to manage all Azure resources but does not allow you to grant access to others.
- `--scopes /subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/YOUR_RESOURCE_GROUP`: The scope defines the level of access and the specific resources that the service principal can manage.
- `--sdk-auth`: This flag outputs the credentials in a JSON format suitable for use with Azure SDKs and tools like GitHub Actions. For development purposes only - don't share the output!
