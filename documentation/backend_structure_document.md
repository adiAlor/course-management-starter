# Backend Structure Document for Course Management System

This document explains how the backend of your Course Management System is set up. It uses simple language and clear descriptions so anyone—even without a deep technical background—can understand how everything fits together.

## 1. Backend Architecture

Overall, the backend follows a modular, layered design that keeps different concerns separate and makes it easy to maintain, scale, and optimize performance.

 • **Framework**: We use **Express.js**, a lightweight server framework for Node.js, to handle incoming requests and route them to the right pieces of code.  
 • **Design Pattern**: The code is organized in an **MVC (Model-View-Controller)** or **layered** structure:  
    – **Controllers** handle incoming API calls and decide what needs to happen.  
    – **Services** contain business logic (for example, validating data or checking permissions).  
    – **Repositories** (or Data Access Layer) talk directly to the database, running queries or updates.  
 • **Scalability**: Because each part is isolated, we can run multiple copies of the backend behind a load balancer. Adding more servers lets us handle more users.  
 • **Maintainability**: By separating responsibilities, we can update one part (say, database queries) without touching others (such as request handling).  
 • **Performance**: Middleware handles common tasks (like parsing JSON or checking authentication) once per request, reducing duplicate code. We also use connection pooling for database access to speed up queries.

## 2. Database Management

We store and manage all application data in a MySQL relational database.

 • **Type**: **SQL**  
 • **System**: **MySQL**  
 • **ORM**: **Prisma** (helps us write database queries in JavaScript/TypeScript without raw SQL)  

How it works:

 • Data is organized into tables with clear relationships (for example, each course belongs to one instructor, each student can enroll in many cohorts).  
 • Prisma keeps track of the schema and helps apply changes (migrations) when we need to update table structures.  
 • We use connection pooling so the backend reuses database connections instead of opening and closing them for every request.

## 3. Database Schema

Below is a human-readable overview of the main tables and their key fields, followed by the actual SQL definitions.

### Human-Readable Schema

1. **User**  
   • id (unique)  
   • name  
   • email (unique)  
   • passwordHash  
   • role (Admin, Instructor, Student, Leadership)  
   • createdAt, updatedAt  

2. **Course**  
   • id (unique)  
   • title  
   • description  
   • instructorId (links to a User)  
   • createdAt, updatedAt  

3. **Cohort**  
   • id (unique)  
   • courseId (links to a Course)  
   • startDate, endDate  
   • createdAt, updatedAt  

4. **Enrollment**  
   • id (unique)  
   • cohortId (links to a Cohort)  
   • studentId (links to a User)  
   • enrolledAt  

5. **Assignment**  
   • id (unique)  
   • title  
   • description  
   • dueDate  
   • courseId (links to a Course)  
   • createdAt, updatedAt  

6. **Submission**  
   • id (unique)  
   • assignmentId (links to an Assignment)  
   • studentId (links to a User)  
   • fileUrl  
   • submittedAt  
   • grade  

### SQL Schema (MySQL)

```sql
CREATE TABLE User (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  passwordHash VARCHAR(255) NOT NULL,
  role ENUM('Admin','Instructor','Student','Leadership') NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Course (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  instructorId INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (instructorId) REFERENCES User(id)
);

CREATE TABLE Cohort (
  id INT AUTO_INCREMENT PRIMARY KEY,
  courseId INT NOT NULL,
  startDate DATE,
  endDate DATE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (courseId) REFERENCES Course(id)
);

CREATE TABLE Enrollment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cohortId INT NOT NULL,
  studentId INT NOT NULL,
  enrolledAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cohortId) REFERENCES Cohort(id),
  FOREIGN KEY (studentId) REFERENCES User(id)
);

CREATE TABLE Assignment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  dueDate DATETIME,
  courseId INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (courseId) REFERENCES Course(id)
);

CREATE TABLE Submission (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assignmentId INT NOT NULL,
  studentId INT NOT NULL,
  fileUrl VARCHAR(255),
  submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  grade VARCHAR(10),
  FOREIGN KEY (assignmentId) REFERENCES Assignment(id),
  FOREIGN KEY (studentId) REFERENCES User(id)
);
```

## 4. API Design and Endpoints

We expose a set of RESTful endpoints so the frontend can perform all actions it needs.

• **Authentication**  
  – POST `/api/auth/signup` : Create a new user account.  
  – POST `/api/auth/login` : Verify credentials and return a JWT token.  
  – GET `/api/auth/me` : Return current user details based on the token.  
  – POST `/api/auth/logout` : Invalidate the token or clear the session.

• **User Management (Admin only)**  
  – GET `/api/users` : List all users.  
  – GET `/api/users/:id` : Get details of one user.  
  – PUT `/api/users/:id` : Update user data (change role, name, etc.).  
  – DELETE `/api/users/:id` : Remove a user account.

• **Course Management (Admin & Instructor)**  
  – GET `/api/courses` : List all courses.  
  – POST `/api/courses` : Create a new course.  
  – GET `/api/courses/:id` : Get course details.  
  – PUT `/api/courses/:id` : Update a course.  
  – DELETE `/api/courses/:id` : Delete a course.

• **Cohort & Enrollment (Instructor)**  
  – POST `/api/cohorts` : Create a cohort for a course.  
  – GET `/api/cohorts/:id` : Get cohort details.  
  – POST `/api/enrollments` : Enroll a student in a cohort.  
  – GET `/api/enrollments` : List enrollments.

• **Assignments & Submissions (Instructor & Student)**  
  – POST `/api/assignments` : Create a new assignment.  
  – GET `/api/assignments/:id` : Fetch assignment details.  
  – POST `/api/submissions` : Student submits work.  
  – GET `/api/submissions` : Instructor fetches submitted work.

Each endpoint checks the user’s **role** (Admin, Instructor, Student, Leadership) before allowing the action.

## 5. Hosting Solutions

We host the backend on a cloud provider to ensure high availability and easy scaling.

• **Compute**: AWS Elastic Beanstalk or Amazon ECS (Docker containers) running our Node.js service.  
• **Database**: Amazon RDS for MySQL, providing automated backups, multi-AZ failover, and easy scaling.  
• **Static Assets & File Storage**: AWS S3 buckets for assignment uploads, with appropriate access controls.  

Benefits:

 • **Reliability**: Managed services with built-in failover.  
 • **Scalability**: Auto-scaling of containers or instances based on request load.  
 • **Cost-Effectiveness**: Pay only for the resources you use, and scale down in quiet periods.

## 6. Infrastructure Components

These extra pieces help the system run smoothly and deliver content quickly.

• **Load Balancer**: AWS Application Load Balancer (ALB) distributes incoming API calls across multiple backend instances.  
• **Caching**: Redis (via AWS ElastiCache) caches frequent queries (for example, course listings or dashboard stats) to reduce database load.  
• **CDN**: Amazon CloudFront delivers static files (images, front-end assets) from edge locations close to users, speeding up page load times.  
• **Containerization**: Docker images define the environment for local development (via Docker Compose) and production deployments (via ECS or Kubernetes).

## 7. Security Measures

We follow best practices to protect user data and comply with regulations.

• **Authentication**: JSON Web Tokens (JWT) issued on login, sent in an HttpOnly cookie or `Authorization` header.  
• **Authorization**: Role-based access control guards each endpoint, ensuring only permitted users can perform actions.  
• **Data Encryption**:  
  – **In transit**: TLS/HTTPS for all API calls.  
  – **At rest**: MySQL encrypted storage and S3 encryption for files.  
• **Password Security**: Hashing with **bcrypt** before saving to the database.  
• **HTTP Hardening**: Using Helmet middleware to set safe HTTP headers (e.g., Content Security Policy, HSTS).  
• **Rate Limiting**: Throttle requests per IP or token to prevent abuse or brute-force attacks.

## 8. Monitoring and Maintenance

Keeping the backend healthy and up to date is essential.

• **Logging**: Winston logger sends application logs to AWS CloudWatch or an ELK (Elasticsearch, Logstash, Kibana) stack.  
• **Metrics**: Prometheus collects performance data (CPU, memory, response times), with Grafana dashboards for visualization.  
• **Error Tracking**: Sentry captures unhandled exceptions and notifies the team immediately.  
• **Alerts**: CloudWatch alarms or PagerDuty integrations alert us if error rates spike or servers go down.  
• **CI/CD**: GitHub Actions pipeline runs tests, builds Docker images, and deploys updates automatically when code is merged into the main branch.  
• **Database Migrations**: Prisma Migrate applies schema changes in a controlled way, with versioned migration files.

## 9. Conclusion and Overall Backend Summary

This backend structure is designed to:  
 • Serve users reliably with clear separation between request handling, business logic, and data access.  
 • Grow seamlessly by adding more server instances or upgrading database tiers.  
 • Keep user data safe through encryption, role checks, and thorough logging.  
 • Provide a solid foundation that aligns with your project goals—empowering Admins, Instructors, Students, and Leadership to work effectively.  

Unique strengths of this setup include the modular codebase, industry-standard cloud services, and a focus on security and observability. With this clear architecture in place, your Course Management System is ready to support real-world usage and easy future enhancements.