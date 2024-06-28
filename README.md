# Architectural Foundations

---

# Requirement Gathering

---

## Functional vs Non-Functional

### Functional Requirements
1. *User Registration and Authentication*: The system must allow new users to register and existing users to log in securely. This includes verifying email addresses and providing password recovery options.
2. *Taxonomy Assignment*: Users need to be assigned to various taxonomies such as semesters, branches, internships, and more. Professors should be able to create and manage these taxonomies.
3. *Role Management*: Different roles (professor and user) should have different levels of access and permissions. Professors should have administrative capabilities, while users have access to their assignments and related information.

### Non-Functional Requirements
1. *Performance*: The application should be able to handle 1000 concurrent users without degradation in performance.
2. *Scalability*: The system architecture should allow for easy addition of new features and expansion of capacity without requiring major redesign.
3. *Security*: User data must be protected through secure authentication methods, encrypted data storage, and regular security audits.
4. *Reliability*: The system should ensure a high availability with an uptime of 99.9%, incorporating failover mechanisms and regular backups.
5. *Usability*: The user interface should be intuitive, easy to navigate, and accessible to users with different levels of technical expertise.

## Define User Stories
1. *As a user*, I want to register and log in so that I can access my assignments.
2. *As a professor*, I want to assign users to different taxonomies (semesters, branches, internships).
3. *As a user*, I want to view my current assignments and their statuses.
4. *As a professor*, I want to manage taxonomies and their associated users.

## Set Priority
1. *User Registration and Authentication* - High: Essential for accessing the system.
2. *Taxonomy Assignment* - High: Core functionality for organizing users.
3. *Role Management* - Medium: Important for maintaining proper access control.

# System Architecture

---

## Define System Components
1. *Frontend*: Built with React.js to provide a dynamic and responsive user interface. It will interact with the backend through RESTful APIs.
2. *Backend*: Developed using Node.js with Express, handling business logic, and serving API requests.
3. *Database*: MongoDB will be used for storing user data, taxonomy information, and assignments due to its flexible schema and scalability. Redis will be used for caching to improve performance.
4. *Authentication*: Implement JWT-based authentication for secure and stateless user sessions.

## Choose Architecture Style
1. *Microservices*: The application will be divided into small, independently deployable services, each responsible for a specific piece of functionality. This allows for better scalability and easier maintenance.
2. *RESTful API*: The communication between the frontend and backend will be done through RESTful APIs, ensuring a clear separation of concerns and enabling easy integration with other services.

## Consider Scalability, Maintainability
1. *Scalability*: Use load balancers to distribute traffic, auto-scaling groups to adjust capacity based on demand, and database sharding to manage large datasets.
2. *Maintainability*: Adhere to coding standards, implement comprehensive unit tests, maintain clear documentation, and use continuous integration/continuous deployment (CI/CD) pipelines to automate testing and deployment.

# Data Design

---

## Define Data Models and Schemas
1. *User Model*
   - *Attributes*: userID, name, email, password (hashed), role

2. *Taxonomy Model*
   - *Attributes*: taxonomyID, type (e.g., semester, branch, internship), value, parentID, level, state, responsibleID

3. *University Period Model*
   - *Attributes*: periodID, name, state, startDate, endDate

4. *Department Model*
   - *Attributes*: departmentID, departmentName, responsibleID

5. *Location Model*
   - *Attributes*: locationID, locationName, locationReference, departmentID

6. *Postulation Model*
   - *Attributes*: postulationID, resourcesID, userID, departmentID, state, type, content

7. *Postulation Type Model*
   - *Attributes*: postulationTypeID, taxonomiesID, periodID, departmentID, name, content

8. *Postulation Type Content Model*
   - *Attributes*: contentID, name, description, type, required, options

9. *Professor Model*
   - *Attributes*: professorID, userID, officeLocation, state

10. *Resource Model*
    - *Attributes*: resourceID, name, media, ownerID, type, state, attachments

11. *Student Model*
    - *Attributes*: studentID, userID, CNE, studentNumber, state

## Choose Proper Database
1. *MongoDB*: Chosen for its flexible document model, which can handle the diverse data structures of users, taxonomies, and assignments.
2. *Redis*: Utilized for caching frequently accessed data to enhance the performance of read operations.

## Define Retention Target
1. *User Data*: Retain indefinitely unless the user requests deletion, complying with data protection regulations.
2. *Taxonomy Data*: Retain for 5 years after completion to maintain historical records and support potential audits or reports.

# Domain Design

---

## Break Down System into Business Domains

### User Management
The User Management domain is responsible for all operations related to user accounts. This includes the processes for user registration, authentication, and profile management. Users can be professors or regular users, and this domain ensures that users are properly authenticated and authorized to access various features of the platform. Role management within this domain allows for assigning and managing different user roles, such as professors who have administrative capabilities and users who may be assigned to various taxonomies. The User Management domain interacts with the authentication system to verify user credentials and maintain secure sessions.

### Taxonomy Management
The Taxonomy Management domain is a crucial component that handles the organization and assignment of users into various categories called taxonomies. Taxonomies represent different classifications such as semesters, branches, and internships. This domain abstracts the complexities of creating, updating, and managing these classifications. Professors can create new taxonomies, define their types, and assign users to them based on various criteria. The system maintains a record of all user assignments within each taxonomy, ensuring that users are correctly grouped and managed according to their respective categories. The Taxonomy Management domain provides functionalities for viewing and updating assignments, allowing for flexible and dynamic user categorization. This domain ensures that the data integrity and relationships between users and taxonomies are maintained, facilitating easy retrieval and updates of assignment information.

---

## Encapsulate Functionality Within Modules

### User Module
The User Module encapsulates all functionalities related to user operations, ensuring a clear separation of concerns. It handles user registration, authentication, profile management, and role assignment. By managing these aspects within a single module, the system can efficiently handle user data and ensure that security protocols are strictly followed. The module interacts with the database to store and retrieve user information and communicates with other modules via well-defined interfaces to maintain loose coupling.

### Taxonomy Module
The Taxonomy Module is dedicated to managing the various taxonomies within the system. It abstracts the complexities involved in creating and managing taxonomies such as semesters, branches, and internships. The module allows professors to create new taxonomies, specify their types, and assign users to these categories. It also provides capabilities to view and update existing taxonomies and their assignments. By encapsulating these functions within a single module, the system ensures that taxonomy management is handled efficiently and consistently. The Taxonomy Module interacts with the User Module to fetch user details and maintains the relationships between users and their assigned taxonomies, ensuring data integrity and easy access to assignment information.

---

## Minimize Dependencies Among Domains

### Loose Coupling
To maintain loose coupling, each module is designed to interact with others through well-defined APIs or service interfaces. This approach ensures that changes within one module do not directly impact others, allowing for independent development and scaling.

### Service Contracts
Clear service contracts define the interactions between modules. These contracts specify the input and output formats for service calls, ensuring consistent and predictable communication between different parts of the system.

### API Gateway
An API Gateway is implemented to manage and route requests to the appropriate services. It acts as a single entry point for client requests, handling tasks such as authentication, request routing, and rate limiting. This architecture enhances security and simplifies client interactions with the backend services.

---