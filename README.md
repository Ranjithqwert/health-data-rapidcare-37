
# RapidCare Health Systems

## Overview

RapidCare Health Systems is a comprehensive healthcare management system that facilitates interaction between users (patients), doctors, hospitals, and system administrators. The application provides tailored interfaces for each user type and manages various healthcare-related data including user health records, doctor consultations, hospital admissions, and more.

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Spring Boot
- **Database**: MongoDB
- **State Management**: React Context
- **API Communication**: Fetch API
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui

## Project Structure

The project is organized as follows:

- `src/components`: Reusable UI components
  - `common`: Components shared across different user types
  - `login`: Components related to authentication
  - `layouts`: Layout components like authenticated layout
- `src/models`: TypeScript interfaces for data models
- `src/services`: API and authentication services
- `src/pages`: Pages for different user types and functionalities
- `src/utils`: Utility functions

## Getting Started

### Prerequisites

- Node.js v22.14.0 or later
- NPM v10.9.2 or later
- MongoDB installed and running
- Spring Boot setup (see backend instructions)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

## Database Configuration

The database configuration is centralized in `src/services/database.config.ts`. You can modify this file to change database connection details.

```typescript
// Example configuration
export const databaseConfig: DatabaseConfig = {
  name: 'HCR', // Health Care RapidCare database name
  host: 'localhost',
  port: 27017,
  username: 'rapidcare_user',
  password: 'rapidcare_password',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: 'admin',
  }
};
```

## Backend Setup (Spring Boot)

For the backend, you'll need to set up a Spring Boot application that connects to MongoDB and provides the necessary APIs. Here's a basic structure:

1. Create a new Spring Boot project with dependencies:
   - Spring Web
   - Spring Data MongoDB
   - Spring Security
   - Spring Boot DevTools

2. Configure MongoDB connection in `application.properties`:
```properties
spring.data.mongodb.database=HCR
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.username=rapidcare_user
spring.data.mongodb.password=rapidcare_password
spring.data.mongodb.authentication-database=admin
```

3. Create models, repositories, services, and controllers for:
   - Admin
   - Doctor
   - Hospital
   - User
   - OTP
   - Consultation
   - Admission

4. Implement APIs for authentication, CRUD operations, and specific business logic like OTP generation, BMI calculation, etc.

## Features

### Admin Portal
- Dashboard with analytics and insights
- User management (create, view, edit, delete)
- Doctor management
- Hospital management

### Doctor Portal
- Personal profile management
- Consultation management
- User details lookup (with OTP verification)
- Password management

### Hospital Portal
- Hospital profile management
- Admission management
- User details lookup (with OTP verification)
- Password management

### User Portal
- Personal health record management
- View consultation history
- View admission history
- Password management

## License

This project is licensed under the MIT License.
