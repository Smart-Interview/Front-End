# Smart Interview (Interview Question Generator) - Front-End Overview

## Introduction

The front-end of the **Smart Interview** platform is built using **Next.js**, providing a responsive and dynamic user interface for companies, recruiters, and candidates to interact with. It handles authentication and session management using **NextAuth**, offering a secure login mechanism for different types of users, such as candidates and recruiters.

---

## Key Features

1. **Next.js Application**:
   - A modern React-based framework optimized for performance and SEO.
   - Supports server-side rendering (SSR) and static site generation (SSG) for fast page loads and improved user experience.

2. **NextAuth Integration**:
   - Manages authentication using OAuth-based login.
   - Enables role-based access control (RBAC) by assigning roles to users (e.g., **Candidate**, **Recruiter**) during registration and managing access across the platform.

3. **User Roles and Permissions**:
   - Users can choose their role (e.g., **Candidate** or **Recruiter**) during the registration process.
   - Based on roles, different access controls are implemented in the UI to ensure secure access to platform features.

4. **Dynamic Navigation**:
   - The navigation menu adapts dynamically based on the authenticated user's role (candidate, recruiter, etc.).
   - Candidates can apply for jobs and take tests, while recruiters can manage job offers and track candidate applications.

---

## Technologies Used

- **Next.js**: React framework for building server-rendered and statically generated web apps.
- **NextAuth**: Authentication library to manage OAuth-based login.
- **Tailwind CSS**: For styling and UI component design, ensuring responsive and modern visuals.
- **Axios**: To communicate with the back-end services (via API Gateway) for retrieving and sending data.

---

## Front-End Flow

1. **User Registration and Login**:
   - **NextAuth** handles the user login and registration process.
   - During registration, users select their role, which is stored in their session and used to control access to different features.

2. **Role-Based Access Control**:
   - After login, the user’s role is stored in the session. This role is used to manage access to different areas of the platform.
   - UI elements are conditionally rendered based on the user’s role (e.g., a candidate can see job offers, while a recruiter can see job applications).

3. **Protected Routes**:
   - **NextAuth** provides middleware that protects certain routes based on user authentication status.
   - Specific pages (e.g., applying for a job or managing tests) are accessible only by authorized users, and unauthorized access redirects users to the login page.

4. **Integration with API Gateway**:
   - All data is fetched from the back-end services via the **API Gateway**.
   - API requests are authenticated using session tokens managed by **NextAuth** to secure the endpoints.

---

## Key Pages and Components

### 1. **Login Page**

- **NextAuth** manages the login flow, redirecting users to the login screen.
- After successful authentication, users are redirected back to the main dashboard based on their role.

### 2. **Dashboard**

- The dashboard is dynamically rendered based on the user’s role.
  - **Candidates**: View job offers and manage their applications.
  - **Recruiters**: Manage job offers, track candidate applications, and view test results.

### 3. **Job Offers Page**

- Lists available job offers for candidates.
- Candidates can click on a job offer to view details and apply by uploading their CV.

### 4. **Applications Page**

- **Candidates**: View the status of their applications, such as "UNDER REVIEW", "ACCEPTED", or "REFUSED".
- **Recruiters**: Track applications for specific job offers and view detailed reports of candidates' test performances.

### 5. **Test Management Page**

- **Recruiters** can manage and view tests for candidate assessments.
- Candidates can take tests that are generated based on the job offer requirements.