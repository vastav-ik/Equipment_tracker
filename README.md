# Equipment Tracker

A full-stack web application designed to track, manage, and validate equipment. This dashboard allows users to manage equipment records, monitor cleaning status, and filter data efficiently, ensuring compliance and operational readiness.

## Tech Stack

- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL  
- **HTTP Client:** Axios  

## Features Implemented

- **CRUD Operations:** Create, Read, Update, and Delete equipment records  
- **Search & Filtering:** Real-time search by name and filtering by Equipment Type (e.g., Vessel, Mixer) or Status (e.g., Active, Under Maintenance)  
- **Sorting:** Sort equipment lists by Name or Last Cleaned date (Ascending/Descending)  
- **Mobile-First Design:** Fully responsive UI built with Tailwind CSS, featuring card layouts for mobile and swipeable tables  
- **Validation:** Form validation to ensure required fields (Name, Date) are populated  

## Setup Instructions

### 1. Prerequisites

- Node.js installed (v14+ recommended)  
- PostgreSQL installed and running  

### 2. Database Setup

1. Open your terminal or pgAdmin  
2. Create a new database named `equipment` (or your preferred name)  
3. Run the following SQL script:

```sql
CREATE TABLE equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('Machine', 'Vessel', 'Tank', 'Mixer')),
    status VARCHAR(50) CHECK (status IN ('Active', 'Inactive', 'Under Maintenance')),
    last_cleaned DATE NOT NULL
);
```
## Server Configuration

Navigate to the server folder:

```bash

cd server
```


Create a `.env` file in the server directory and add your PostgreSQL credentials:

```env
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=equipment
```


Install dependencies and start the server:

```bash
npm install
npm run dev
  ```


The server will run on:
http://localhost:5000


## Client Configuration

Open a new terminal (keep the server running) and navigate to the client folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```


Start the React application:

```bash
npm start
```


The application will open at:

http://localhost:3000

## Assumptions

- **Database:** PostgreSQL is running locally on port 5432 with sufficient privileges  
- **Data Types:** `last_cleaned` is stored as a standard `DATE`  
- **Concurrency:** The application currently supports single-user interactions; real-time multi-user updates are a future enhancement  

## Future Improvements

- **Authentication:** Add user login/signup to restrict access to authorized personnel  
- **Audit Logs:** Track who changed equipment status and when for compliance  
- **Image Upload:** Allow users to upload photos of equipment during inspections  

