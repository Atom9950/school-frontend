# 🏫 School Management System

<div align="center">

![School Management System Banner]("C:\Users\User\OneDrive\Pictures\Screenshots\Screenshot 2026-02-14 125357.png")

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://school-frontend-flax-nine.vercel.app)
[![Frontend](https://img.shields.io/badge/Frontend-React-blue)](https://github.com/Atom9950/school-frontend)
[![Backend](https://img.shields.io/badge/Backend-Node.js-green)](https://github.com/Atom9950/school-backend)
[![License](https://img.shields.io/badge/license-MIT-purple)](LICENSE)

A comprehensive, enterprise-grade School Management System built with modern web technologies to streamline administrative operations, student management, and academic tracking.

[Live Demo](https://school-frontend-flax-nine.vercel.app) · [Backend Repo](https://github.com/Atom9950/school-backend) · [Report Bug](https://github.com/Atom9950/school-frontend/issues) · [Request Feature](https://github.com/Atom9950/school-frontend/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
  - [Department Management](#1-department-management)
  - [Subject Management](#2-subject-management)
  - [Class Management](#3-class-management)
  - [Teacher Management](#4-teacher-management)
  - [Student Management](#5-student-management)
  - [Attendance Management](#6-attendance-management)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Monitoring](#-monitoring)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

<div align="center">

![Overview Banner](./assets/images/overview-banner.png)

</div>

The School Management System is a robust, full-stack web application designed to digitize and automate the complex administrative processes within educational institutions. This system provides a centralized platform for managing departments, subjects, classes, teachers, students, and attendance tracking with an intuitive admin dashboard.

Built with scalability and performance in mind, the system leverages the PERN stack (PostgreSQL, Express, React, Node.js) combined with modern UI frameworks and security best practices to deliver a seamless user experience.

### Key Highlights

- **🎯 Role-Based Access Control**: Secure admin dashboard with granular permissions
- **📊 Real-Time Analytics**: Comprehensive dashboards with live data visualization
- **🔄 Scalable Architecture**: Microservices-ready backend with RESTful APIs
- **🎨 Modern UI/UX**: Responsive design with shadcn/ui and Tailwind CSS
- **🔒 Enterprise Security**: Powered by Arcjet for advanced security features
- **📈 Performance Monitoring**: Integrated Site24x7 for real-time application monitoring

---

## ✨ Features

### 1. 🏢 Department Management

<div align="center">

![Department Management Banner](./assets/images/department-banner.png)

</div>

The Department Management module serves as the organizational foundation of the school structure, allowing administrators to create, manage, and maintain academic departments.

#### Core Capabilities:

- **Department Creation & Organization**
  - Create new departments with customizable names and codes
  - Add detailed department descriptions and objectives
  - Set department heads and administrative contacts
  - Define department-specific policies and guidelines

- **Department Hierarchy Management**
  - Establish parent-child relationships between departments
  - Create sub-departments for specialized programs
  - Visualize department structure with interactive organizational charts
  - Manage inter-departmental relationships and collaborations

- **Resource Allocation**
  - Assign dedicated resources to departments (classrooms, labs, equipment)
  - Track department-specific budgets and expenditures
  - Monitor resource utilization and availability
  - Generate department-wise resource allocation reports

- **Department Analytics**
  - View total number of students per department
  - Track faculty-to-student ratios
  - Monitor department performance metrics
  - Generate comprehensive department reports
  - Analyze enrollment trends over academic years

- **Department Configuration**
  - Set department-specific academic calendars
  - Configure grading systems and evaluation criteria
  - Define department policies and procedures
  - Manage department contact information and locations

<div align="center">

![Department Dashboard Screenshot](./assets/screenshots/department-dashboard.png)

</div>

---

### 2. 📚 Subject Management

<div align="center">

![Subject Management Banner](./assets/images/subject-banner.png)

</div>

The Subject Management dashboard provides comprehensive tools for creating, organizing, and maintaining the academic curriculum across all departments.

#### Core Capabilities:

- **Subject Creation & Setup**
  - Create subjects with unique codes and names
  - Add detailed subject descriptions and learning objectives
  - Define subject prerequisites and co-requisites
  - Set credit hours and contact hours
  - Specify subject type (core, elective, lab, theory)

- **Curriculum Management**
  - Organize subjects by academic level (semester/year)
  - Create subject groups and specializations
  - Define subject dependencies and progression paths
  - Manage subject syllabi and course outlines
  - Upload and maintain study materials and resources

- **Subject-Department Mapping**
  - Associate subjects with specific departments
  - Allow cross-departmental subject offerings
  - Manage shared subjects across multiple departments
  - Track subject ownership and primary department

- **Academic Standards**
  - Define learning outcomes for each subject
  - Set evaluation criteria and assessment methods
  - Configure grading rubrics and weightage
  - Establish minimum passing criteria
  - Manage subject-specific academic policies

- **Subject Analytics**
  - Track subject enrollment statistics
  - Monitor pass rates and performance trends
  - Analyze subject difficulty levels
  - Generate subject-wise academic reports
  - View historical data and trends

- **Resource Planning**
  - Define required teaching resources for each subject
  - Specify lab requirements and equipment needs
  - Set classroom specifications
  - Manage digital resources and e-learning materials

<div align="center">

![Subject Dashboard Screenshot](./assets/screenshots/subject-dashboard.png)

</div>

---

### 3. 🎓 Class Management

<div align="center">

![Class Management Banner](./assets/images/class-banner.png)

</div>

The Class Management module handles the complex task of creating class sections and allocating them to departments based on subjects, ensuring optimal resource utilization.

#### Core Capabilities:

- **Class Section Creation**
  - Create multiple class sections for subjects
  - Define section names and codes (e.g., A, B, C)
  - Set maximum student capacity per section
  - Configure section timings and schedules
  - Assign classroom locations

- **Department-Subject-Class Allocation**
  - Link classes to specific departments
  - Associate subjects with class sections
  - Support multiple subjects per class section
  - Enable cross-departmental class enrollment
  - Manage combined classes and merged sections

- **Schedule Management**
  - Create and manage class timetables
  - Allocate time slots for each subject
  - Prevent scheduling conflicts
  - Support multiple shift operations (morning/afternoon/evening)
  - Generate automated timetable suggestions

- **Class Assignment Optimization**
  - Intelligent teacher-class allocation
  - Balanced student distribution across sections
  - Capacity-based section creation
  - Automatic section balancing
  - Conflict detection and resolution

- **Class Analytics**
  - Monitor class size and capacity utilization
  - Track attendance rates per class
  - Analyze class performance metrics
  - Generate class-wise reports
  - View student distribution statistics

- **Academic Year Management**
  - Create classes for specific academic years
  - Roll over classes to new academic sessions
  - Archive old class data
  - Manage academic calendar integration
  - Track class progression and history

- **Special Class Types**
  - Support for laboratory classes
  - Tutorial and practical sessions
  - Online/hybrid class configurations
  - Remedial and supplementary classes
  - Special activity classes

<div align="center">

![Class Dashboard Screenshot](./assets/screenshots/class-dashboard.png)

</div>

---

### 4. 👨‍🏫 Teacher Management

<div align="center">

![Teacher Management Banner](./assets/images/teacher-banner.png)

</div>

The Teacher Management dashboard provides comprehensive tools for managing faculty information, assignments, and professional development tracking.

#### Core Capabilities:

- **Teacher Profile Management**
  - Create detailed teacher profiles
  - Store personal information (name, contact, address)
  - Upload profile photographs
  - Manage emergency contacts
  - Track employment history and experience

- **Professional Information**
  - Record educational qualifications and degrees
  - Store professional certifications and licenses
  - Track specialized skills and expertise areas
  - Maintain professional development records
  - Document awards and recognitions

- **Department & Class Allocation**
  - Assign teachers to specific departments
  - Allocate teachers to classes and subjects
  - Support multiple class assignments per teacher
  - Enable cross-departmental teaching assignments
  - Manage substitute teacher arrangements

- **Teaching Load Management**
  - Track total teaching hours per week
  - Monitor workload distribution
  - Calculate teaching load as per norms
  - Prevent over-allocation of classes
  - Generate workload reports

- **Availability & Scheduling**
  - Set teacher availability windows
  - Manage leave and absence records
  - Track substitute teacher requirements
  - Configure preferred teaching slots
  - Handle schedule conflicts automatically

- **Performance & Evaluation**
  - Track student feedback and ratings
  - Monitor class performance metrics
  - Record peer reviews and evaluations
  - Track professional development participation
  - Generate performance reports

- **Subject Expertise**
  - Define subject specializations
  - Manage teaching certifications per subject
  - Track subject teaching history
  - Assign subjects based on expertise
  - Maintain subject-teacher mapping

- **Administrative Roles**
  - Assign administrative responsibilities
  - Track committee memberships
  - Manage mentorship assignments
  - Record extracurricular activity supervision
  - Track departmental duties

- **Communication Tools**
  - Store preferred communication methods
  - Maintain institutional email addresses
  - Track communication history
  - Send notifications and announcements
  - Generate mailing lists

<div align="center">

![Teacher Dashboard Screenshot](./assets/screenshots/teacher-dashboard.png)

</div>

---

### 5. 👨‍🎓 Student Management

<div align="center">

![Student Management Banner](./assets/images/student-banner.png)

</div>

The Student Management system is the heart of the application, offering extensive functionality for managing student lifecycles from admission to graduation.

#### Core Capabilities:

- **Student Registration & Admission**
  - Comprehensive student registration forms
  - Store personal details (name, DOB, gender, address)
  - Upload student photographs and documents
  - Capture parent/guardian information
  - Record emergency contacts
  - Assign unique student ID numbers
  - Track admission date and academic year

- **Academic Information Management**
  - Assign students to specific departments
  - Enroll students in class sections
  - Track current academic year/semester
  - Maintain enrollment status
  - Record academic program details
  - Track specialization choices

- **Student Transfer & Mobility**
  - **Inter-Department Transfers**
    - Transfer students between departments
    - Maintain transfer history and reasons
    - Update subject enrollments automatically
    - Preserve academic records across transfers
    - Generate transfer certificates
  
  - **Inter-Class Transfers**
    - Move students between sections
    - Balance class sizes through transfers
    - Track section change history
    - Update attendance records accordingly
  
  - **Inter-School Transfers**
    - Process transfer-in students
    - Manage transfer-out procedures
    - Generate transfer certificates and documents
    - Maintain academic record portability

- **Student Promotion & Progression**
  - **Year-End Promotion**
    - Promote students to next academic year
    - Bulk promotion for entire classes
    - Individual promotion based on performance
    - Handle detained/repeated students
    - Update academic records automatically
  
  - **Subject Promotion**
    - Promote to next semester/level
    - Track subject completion status
    - Manage conditional promotions
    - Record supplementary exam requirements
  
  - **Promotion Criteria Management**
    - Define promotion rules and criteria
    - Set minimum attendance requirements
    - Configure academic performance thresholds
    - Handle special promotion cases

- **Academic Records Management**
  - Store complete academic history
  - Track grades and marks per subject
  - Maintain examination records
  - Calculate GPA/CGPA automatically
  - Generate transcripts and mark sheets
  - Record academic achievements and awards

- **Student Status Tracking**
  - Active enrollment status
  - Leave of absence management
  - Dropout tracking and reasons
  - Graduated student records
  - Alumni database maintenance
  - Re-admission processing

- **Financial Information**
  - Track fee payment status
  - Record scholarship and financial aid
  - Manage fee waivers and concessions
  - Generate fee receipts and reports
  - Monitor outstanding dues

- **Document Management**
  - Store admission documents
  - Upload certificates and marksheets
  - Maintain medical records
  - Track identity documents
  - Manage photo gallery and activities

- **Student Analytics & Reporting**
  - Generate student progress reports
  - Track attendance patterns
  - Monitor academic performance trends
  - Create department-wise student statistics
  - Analyze dropout and retention rates
  - Generate custom student reports

- **Communication & Engagement**
  - Maintain student contact information
  - Send notifications and announcements
  - Track parent-teacher communication
  - Record disciplinary actions
  - Manage student feedback and grievances

<div align="center">

![Student Dashboard Screenshot](./assets/screenshots/student-dashboard.png)

</div>

---

### 6. 📊 Attendance Management

<div align="center">

![Attendance Management Banner](./assets/images/attendance-banner.png)

</div>

The Attendance Management system provides robust tools for tracking, monitoring, and analyzing student attendance with multiple views and reporting capabilities.

#### Core Capabilities:

- **Daily Attendance Recording**
  - Mark attendance by class/section
  - Subject-wise attendance tracking
  - Session-wise attendance (morning/afternoon)
  - Bulk attendance marking for entire class
  - Quick attendance entry with keyboard shortcuts
  - Support for late arrivals and early departures

- **Attendance Status Options**
  - Present (P) - Regular attendance
  - Absent (A) - Complete absence
  - Late (L) - Late arrival
  - Excused (E) - Authorized absence
  - Medical Leave (ML)
  - Special Leave (SL)
  - Half Day (HD)

- **Class-Based Attendance View**
  - View attendance by class section
  - Filter by date range
  - See attendance statistics per class
  - Monitor class attendance trends
  - Identify patterns in class absenteeism
  - Generate class attendance reports

- **Overall Attendance Dashboard**
  - Department-wide attendance overview
  - Real-time attendance statistics
  - Daily attendance summary
  - Monthly attendance aggregation
  - Semester/year-wise attendance trends
  - Comparative attendance analysis

- **Individual Student Attendance**
  - Complete attendance history per student
  - Subject-wise attendance breakdown
  - Attendance percentage calculation
  - Trend analysis and patterns
  - Low attendance alerts
  - Defaulter identification

- **Attendance Analytics & Reports**
  - **Statistical Reports**
    - Overall attendance percentage by department
    - Subject-wise attendance statistics
    - Class-wise attendance comparison
    - Monthly attendance trends
    - Yearly attendance patterns
  
  - **Defaulter Reports**
    - Students below minimum attendance threshold
    - Subject-wise defaulter lists
    - Repeated defaulters tracking
    - Attendance warning reports
  
  - **Custom Reports**
    - Date range-based reports
    - Department-specific reports
    - Teacher-wise attendance summary
    - Downloadable attendance sheets

- **Attendance Alerts & Notifications**
  - Automatic low attendance warnings
  - Parent notifications for absences
  - Teacher alerts for attendance issues
  - Threshold-based notifications
  - Customizable alert rules

- **Leave Management Integration**
  - Record leave applications
  - Track approved/rejected leaves
  - Update attendance based on leaves
  - Maintain leave balance records
  - Generate leave reports

- **Attendance Validation**
  - Prevent duplicate entries
  - Validate date ranges
  - Check for conflicts
  - Ensure data integrity
  - Audit trail for changes

- **Biometric Integration Ready**
  - Architecture supports biometric device integration
  - Automated attendance marking capability
  - Sync with attendance machines
  - Real-time attendance updates

- **Attendance Export & Backup**
  - Export to Excel/PDF formats
  - Download formatted attendance sheets
  - Bulk data export options
  - Automated backup scheduling
  - Historical data archival

<div align="center">

![Attendance Dashboard Screenshot](./assets/screenshots/attendance-dashboard.png)

</div>

---

## 🛠 Tech Stack

<div align="center">

![Tech Stack Banner](./assets/images/tech-stack-banner.png)

</div>

### Frontend Technologies

| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI Framework | Latest |
| **TypeScript** | Type Safety | Latest |
| **Vite** | Build Tool & Dev Server | Latest |
| **Refine Core** | Admin Panel Framework | Latest |
| **React Router** | Client-side Routing | Latest |
| **shadcn/ui** | UI Component Library | Latest |
| **Tailwind CSS** | Utility-first CSS Framework | Latest |
| **Tweak CN** | Additional UI Utilities | Latest |

### Backend Technologies

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Node.js** | Runtime Environment | Latest |
| **Express.js** | Web Application Framework | Latest |
| **TypeScript** | Type Safety | Latest |
| **PostgreSQL** | Relational Database | Latest |
| **Drizzle ORM** | Type-safe ORM | Latest |

### Security & Monitoring

| Technology | Purpose |
|-----------|---------|
| **Arcjet** | Advanced security features, rate limiting, bot protection |
| **Site24x7** | Application performance monitoring, uptime tracking |

### DevOps & Deployment

| Technology | Purpose |
|-----------|---------|
| **Docker** | Containerization |
| **Vercel** | Frontend Hosting |
| **GitHub Actions** | CI/CD Pipeline |

---

## 🏗 Architecture

<div align="center">

![Architecture Banner](./assets/images/architecture-banner.png)

</div>

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   React UI   │  │  shadcn/ui   │  │   Tailwind   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓ ↑
┌─────────────────────────────────────────────────────────┐
│                   Security Layer                         │
│              ┌─────────────────────┐                     │
│              │      Arcjet         │                     │
│              │  (Rate Limiting,    │                     │
│              │   Bot Protection)   │                     │
│              └─────────────────────┘                     │
└─────────────────────────────────────────────────────────┘
                          ↓ ↑
┌─────────────────────────────────────────────────────────┐
│                   API Gateway                            │
│                   (Express.js)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │   Auth   │  │  Routes  │  │   CORS   │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                          ↓ ↑
┌─────────────────────────────────────────────────────────┐
│                 Business Logic Layer                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐           │
│  │Controllers│  │  Services │  │Validators │           │
│  └───────────┘  └───────────┘  └───────────┘           │
└─────────────────────────────────────────────────────────┘
                          ↓ ↑
┌─────────────────────────────────────────────────────────┐
│                  Data Access Layer                       │
│              ┌─────────────────────┐                     │
│              │   Drizzle ORM       │                     │
│              └─────────────────────┘                     │
└─────────────────────────────────────────────────────────┘
                          ↓ ↑
┌─────────────────────────────────────────────────────────┐
│                  Database Layer                          │
│              ┌─────────────────────┐                     │
│              │   PostgreSQL        │                     │
│              └─────────────────────┘                     │
└─────────────────────────────────────────────────────────┘
                          ↓ ↑
┌─────────────────────────────────────────────────────────┐
│                  Monitoring Layer                        │
│              ┌─────────────────────┐                     │
│              │    Site24x7         │                     │
│              │  (Performance       │                     │
│              │   Monitoring)       │                     │
│              └─────────────────────┘                     │
└─────────────────────────────────────────────────────────┘
```

### Database Schema Overview

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│ Departments │──┐   │  Subjects   │──┐   │   Classes   │
└─────────────┘  │   └─────────────┘  │   └─────────────┘
                 │                     │           │
                 │                     │           │
                 ↓                     ↓           ↓
┌─────────────────────────────────────────────────────────┐
│              Department-Subject-Class Mapping            │
└─────────────────────────────────────────────────────────┘
                 ↓                     ↓           ↓
┌─────────────┐  │   ┌─────────────┐  │   ┌─────────────┐
│  Teachers   │──┘   │  Students   │──┘   │ Attendance  │
└─────────────┘      └─────────────┘      └─────────────┘
```

---

## 🚀 Getting Started

<div align="center">

![Getting Started Banner](./assets/images/getting-started-banner.png)

</div>

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** (v14.x or higher)
- **Git** for version control
- **Docker** (optional, for containerized deployment)

### System Requirements

- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Storage**: At least 2GB free disk space
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)

---

## 📦 Installation

### Frontend Setup

1. **Clone the frontend repository**
```bash
git clone https://github.com/Atom9950/school-frontend.git
cd school-frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Configure environment variables**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=School Management System
```

5. **Start development server**
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Backend Setup

1. **Clone the backend repository**
```bash
git clone https://github.com/Atom9950/school-backend.git
cd school-backend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Configure environment variables**
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/school_db

# Server Configuration
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your-secret-key-here
ARCJET_KEY=your-arcjet-api-key

# Monitoring
SITE24X7_API_KEY=your-site24x7-key
```

5. **Set up the database**
```bash
# Create database
createdb school_db

# Run migrations
npm run db:migrate
# or
yarn db:migrate

# Seed initial data (optional)
npm run db:seed
# or
yarn db:seed
```

6. **Start the server**
```bash
npm run dev
# or
yarn dev
```

The API will be available at `http://localhost:5000`

### Docker Setup (Alternative)

If you prefer using Docker:

```bash
# Clone both repositories
git clone https://github.com/Atom9950/school-frontend.git
git clone https://github.com/Atom9950/school-backend.git

# Create docker-compose.yml in project root
docker-compose up -d
```

---

## ⚙️ Configuration

### Frontend Configuration

**vite.config.ts**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

### Backend Configuration

**Database Configuration (drizzle.config.ts)**
```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### Security Configuration (Arcjet)

```typescript
import arcjet, { detectBot, shield } from '@arcjet/node';

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: 'LIVE' }),
    detectBot({
      mode: 'LIVE',
      allow: [],
    }),
  ],
});
```

---

## 💻 Usage

<div align="center">

![Usage Banner](./assets/images/usage-banner.png)

</div>

### Accessing the Admin Dashboard

1. Navigate to `https://school-frontend-flax-nine.vercel.app` (or your local URL)
2. Log in with admin credentials
3. Access different management modules from the sidebar

### Managing Departments

```
Dashboard → Departments → Create New Department
- Enter department name and code
- Add description
- Assign department head
- Save changes
```

### Creating Classes

```
Dashboard → Classes → Create New Class
- Select department
- Choose subject
- Specify section name
- Set capacity
- Assign teacher
- Configure schedule
```

### Adding Students

```
Dashboard → Students → Add New Student
- Fill student personal details
- Upload photograph and documents
- Assign to department
- Enroll in class section
- Submit registration
```

### Recording Attendance

```
Dashboard → Attendance → Mark Attendance
- Select class/section
- Choose date
- Mark status for each student
- Save attendance record
```

---

## 📚 API Documentation

<div align="center">

![API Documentation Banner](./assets/images/api-banner.png)

</div>

### Base URL
```
Production: https://your-api-domain.com/api
Development: http://localhost:5000/api
```

### Authentication Endpoints

```http
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
```

### Department Endpoints

```http
GET    /api/departments
POST   /api/departments
GET    /api/departments/:id
PUT    /api/departments/:id
DELETE /api/departments/:id
```

### Subject Endpoints

```http
GET    /api/subjects
POST   /api/subjects
GET    /api/subjects/:id
PUT    /api/subjects/:id
DELETE /api/subjects/:id
```

### Class Endpoints

```http
GET    /api/classes
POST   /api/classes
GET    /api/classes/:id
PUT    /api/classes/:id
DELETE /api/classes/:id
```

### Teacher Endpoints

```http
GET    /api/teachers
POST   /api/teachers
GET    /api/teachers/:id
PUT    /api/teachers/:id
DELETE /api/teachers/:id
POST   /api/teachers/:id/allocate
```

### Student Endpoints

```http
GET    /api/students
POST   /api/students
GET    /api/students/:id
PUT    /api/students/:id
DELETE /api/students/:id
POST   /api/students/:id/promote
POST   /api/students/:id/transfer
```

### Attendance Endpoints

```http
GET    /api/attendance
POST   /api/attendance
GET    /api/attendance/class/:classId
GET    /api/attendance/student/:studentId
GET    /api/attendance/reports
```

### Example Request

```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "departmentId": 1,
    "classId": 5
  }'
```

---

## 🔒 Security

<div align="center">

![Security Banner](./assets/images/security-banner.png)

</div>

### Security Features

1. **Arcjet Integration**
   - Rate limiting to prevent abuse
   - Bot detection and mitigation
   - DDoS protection
   - Request validation

2. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control (RBAC)
   - Secure password hashing
   - Session management

3. **Data Protection**
   - Input validation and sanitization
   - SQL injection prevention (via ORM)
   - XSS protection
   - CSRF tokens

4. **API Security**
   - CORS configuration
   - Request signing
   - API key authentication
   - Encrypted data transmission (HTTPS)

### Best Practices

- Keep dependencies updated
- Use environment variables for sensitive data
- Regular security audits
- Implement logging and monitoring
- Follow OWASP guidelines

---

## 📈 Monitoring

<div align="center">

![Monitoring Banner](./assets/images/monitoring-banner.png)

</div>

### Site24x7 Integration

The application is monitored using Site24x7 for:

- **Uptime Monitoring**: Track application availability
- **Performance Metrics**: Monitor response times and latency
- **Error Tracking**: Capture and alert on errors
- **Resource Usage**: Track CPU, memory, and disk usage
- **Custom Metrics**: Monitor business-specific KPIs

### Application Performance Monitoring (APM)

The backend includes APM configuration:

```json
{
  "apminsight": {
    "appName": "School Management System",
    "licenseKey": "YOUR_LICENSE_KEY",
    "port": 10000
  }
}
```

### Monitoring Dashboard

Access real-time metrics:
- Request/response times
- Database query performance
- API endpoint statistics
- Error rates and types
- User activity analytics

---

## 🤝 Contributing

<div align="center">

![Contributing Banner](./assets/images/contributing-banner.png)

</div>

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Coding Standards

- Follow TypeScript/JavaScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

### Code Review Process

- All PRs require at least one review
- Automated tests must pass
- Follow semantic versioning for releases

---

## 🙏 Acknowledgments

- Built with [Refine](https://refine.dev/) - React Framework for enterprise applications
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Secured by [Arcjet](https://arcjet.com/)
- Monitored by [Site24x7](https://www.site24x7.com/)

---

## 📞 Support

For support, email sdroy001@gmail.com or connect me on LinkdIn.

---

## 📊 Project Status

**Current Version**: 1.0.0  
**Status**: Active Development  
**Last Updated**: February 2026

---

<div align="center">

![Footer Banner](./assets/images/footer-banner.png)

**[⬆ Back to Top](#-school-management-system)**

Made with ❤️ by the School Management System Team

</div>
