# Backend Setup for Task Management Application

This README provides detailed instructions for setting up the backend for the Task Management Application. Follow these steps to get MySQL and Directus running, and configure the project dependencies.

## Prerequisites

- Ensure you have [MySQL Server](https://dev.mysql.com/downloads/mysql/) installed on your machine.
- Docker and Docker Compose are required to run Directus using Docker. Install Docker from [Docker's website](https://www.docker.com/products/docker-desktop).

## Step 1: Download and Install MySQL Server

1. **Download MySQL Server:**
   - Go to the [MySQL Downloads page](https://dev.mysql.com/downloads/mysql/).
   - Choose the appropriate version for your operating system and download it.

2. **Install MySQL Server:**
   - Follow the installation instructions provided for your operating system.
   - After installation, start the MySQL Server and configure it with a secure password.

3. **Create a Database:**
   - Open your MySQL command line client or MySQL Workbench.
   - Create a new database for your application:
     ```sql
     CREATE DATABASE task_management_db;
     ```

## Step 2: Run Directus Using Docker Compose

1. **Create a Docker Compose File:**
   - In the root of your project directory, create a `docker-compose.yml` file with the following content:
     ```yaml
     version: "3.8"

     services:
       mysql:
         image: mysql:8.0
         container_name: mysql
         environment:
           MYSQL_ROOT_PASSWORD: root
           MYSQL_DATABASE: task_management_db
         ports:
           - "3306:3306"
         volumes:
           - mysql-data:/var/lib/mysql

       directus:
         image: directus/directus:11.0.0
         container_name: directus
         ports:
           - "8055:8055"
         volumes:
           - ./uploads:/directus/uploads
           - ./extensions:/directus/extensions
         environment:
           SECRET: "taskmanagementapplication"
           ADMIN_EMAIL: "admin@example.com"
           ADMIN_PASSWORD: "adminpassword"
           DB_CLIENT: "mysql"
           DB_HOST: "mysql"
           DB_PORT: "3306"
           DB_USER: "root"
           DB_PASSWORD: "root"  # Ensure this matches MYSQL_ROOT_PASSWORD in MySQL
           DB_DATABASE: "task_management_db"
           WEBSOCKETS_ENABLED: "true"

     volumes:
       mysql-data:
     ```

   - Replace `admin@example.com` and `adminpassword` with your desired Directus admin email and password.

2. **Start the Docker Containers:**
   - Open a terminal, navigate to the directory containing `docker-compose.yml`, and run:
     ```bash
     docker-compose up -d
     ```
   - This command will start both the MySQL and Directus containers in the background.

3. **Access Directus:**
   - Open your browser and go to `http://localhost:8055` to access the Directus admin panel.

4. **Initialize Directus:**
   - Follow the on-screen instructions to set up Directus for the first time. You will be prompted to create an admin user.

## Step 3: Clone the Project Repository and Install Dependencies

1. **Clone the Repository:**
   - Clone the backend project repository from GitHub:
     ```bash
     git clone https://github.com/yourusername/your-repo.git
     ```

2. **Navigate to the Project Directory:**
   - Move into the cloned project directory:
     ```bash
     cd your-repo
     ```

3. **Install Project Dependencies:**
   - Install the required dependencies using npm:
     ```bash
     npm install
     ```

## API Documentation for Directus & MYsql Communication

This documentation describes the API endpoints used for user registration, authentication, task creation, retrieval, and deletion in a system connected with Directus for database management.

### Base URL
All endpoints are prefixed with the base URL: http://localhost:your_desired_port


### Endpoints

#### 1. Create New User
- **Endpoint**: `/newuser`
- **Method**: `POST`
- **Description**: Registers a new user in the system.
- **Request Body**:
  ```json
  {
      "username": "string",
      "email": "string",
      "password": "string"
  }
Response:
201 Created: User successfully registered.
400 Bad Request: Validation errors or missing fields.
```

#### 2. User Login
**Endpoint**: /login
**Method**: POST
**Description**: Authenticates an existing user.
**Request Body**: 
```json
{
    "email": "string",
    "password": "string"
}

Response:
200 OK: User successfully authenticated.
401 Unauthorized: Invalid email or password.
```
### 3. Create Task
**Endpoint**: /task
**Method**: POST
**Description**: Creates a new task in the database.
**Request Body**:
```json
{
    "title": "string",
    "description": "string",
    "dueDate": "YYYY-MM-DD"
}

Response:
201 Created: Task successfully created.
400 Bad Request: Validation errors or missing fields.
```
### 4. Get Tasks
**Endpoint**: /gettask
**Method**: GET
**Description**: Retrieves all tasks from the database.
**Request body**:
```json
{
"created_by": string
}

Response:
200 OK: Successfully retrieved tasks.
204 No Content: No tasks found.
```

### 5. Delete Task
**Endpoint**: /deleteTask
**Method**: DELETE
**Description**: Deletes a task from the database using the task ID.
**Request Body**:
```json
Copy code
{
    "taskId": "string"
}
Response:
200 OK: Task successfully deleted.
404 Not Found: Task with the given ID not found.
```

### Notes
```note
Ensure the API is secured with appropriate authentication and authorization mechanisms.
Validate all inputs to prevent SQL injection and other security vulnerabilities.
Use HTTPS to encrypt data in transit.
```
```error
Error Codes
400 Bad Request: Invalid input or missing required fields.
401 Unauthorized: Authentication failed.
404 Not Found: Resource not found.
500 Internal Server Error: Server encountered an error.
```


## Step 4: Configure Environment Variables

1. **Create a `.env` File:**
   - In the root of the backend project directory, create a `.env` file with the following content:
     ```env
     DIRECTUS_API_URL=http://localhost:8055
     DIRECTUS_ACCESS_TOKEN=your_directus_access_token
     DIRECTUS_ROLE_ID=your_directus_role_id
     ```

2. **Obtain the Directus Token and Role ID:**
   - Log in to the Directus admin panel and generate an API token.
   - Find the Role ID from the Directus admin panel and replace `your_directus_role_id` with the appropriate value.

## Final Steps

- Ensure that both MySQL and Directus are running.
- Your backend application should now be configured and ready to use.

