# Architectural Foundations

---

# Requirement Gathering

---

## Functional vs Non-Functional

### Functional Requirements
1. *User Registration and Authentication*: The system must allow new users to register and existing users to log in securely. This includes verifying email addresses and providing password recovery options.
2. *Assignment Management*: Users need to be assigned to various categories such as semesters, filières, internships, and more. Professors should be able to create and manage these categories.
3. *Role Management*: Different roles (user, student, professor and admin) should have different levels of access and permissions. Professors should have administrative capabilities, while users have access to their assignments and related information.

### Non-Functional Requirements
1. *Performance*: The application should be able to handle 1000 concurrent users without degradation in performance.
2. *Scalability*: The system architecture should allow for easy addition of new features and expansion of capacity without requiring major redesign.
3. *Security*: User data must be protected through secure authentication methods, encrypted data storage, and regular security audits.
4. *Reliability*: The system should ensure a high availability with an uptime of 99.9%, incorporating failover mechanisms and regular backups.
5. *Usability*: The user interface should be intuitive, easy to navigate, and accessible to users with different levels of technical expertise.

## Define User Stories
### User
1. **As a user**, I want to register and log in so that I can access my assignments.

### Student
2. **As a student**, I want to view my current assignments and their statuses.

### Professor
3. **As a professor**, I want to assign users to different categories (semesters, filières, internships).
4. **As a professor**, I want to manage categories and their associated users.

### Admin
5. **As an admin**, I want to oversee the entire system and ensure smooth operation.

## Set Priority
1. *User Registration and Authentication* - High: Essential for accessing the system.
2. *Taxonomy Assignment* - High: Core functionality for organizing users.
3. *Role Management* - Medium: Important for maintaining proper access control.

# System Architecture

---

## Define System Components
1. *Frontend*: Built with Next.js to provide a dynamic and responsive user interface. It will interact with the backend through RESTful APIs, ensuring smooth communication and data exchange.
2. *Backend*: Developed using Node.js with Express, handling business logic, and serving API requests. It will interact with two databases, MongoDB and Redis, to manage data storage and caching effectively.
3. *Database*: MongoDB will be used for storing user data and assignments due to its flexible schema and scalability, which allows for easy adaptation as the application evolves. Redis will be used for caching frequently accessed data to improve performance and reduce load on the primary database.
4. *Authentication*: Implement JWT-based authentication for secure and stateless user sessions. Additionally, OAuth is used to enable users to authenticate using Google and GitHub, providing a convenient and secure way to log in through these popular services.

## Choose Architecture Style
1. *Microservices*: The application is structured into four main services: frontend, backend, MongoDB, and Redis. Each service is independently deployable and manages a specific piece of functionality. This architecture style enhances scalability and maintainability.
2. *Monorepo*: By organizing the application as a monorepo, we streamline development, ensure code consistency, and simplify dependency management across the services, all while having the code base under one repository.

## Consider Scalability, Maintainability
1. *Scalability*: Integrate Vercel with our monorepo and microservice architecture to enhance scalability. Utilize Vercel's serverless functions and global CDN for efficient handling of dynamic and static content. Implement load balancers to distribute traffic and auto-scaling groups to adjust capacity based on demand. Employ database sharding to manage large datasets, ensuring low latency and high availability.
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
1. *MongoDB*: MongoDB is chosen for its flexible document model, which is ideal for handling the diverse and complex data structures of users and assignments. It supports dynamic schemas, allowing the data model to evolve as the application grows. MongoDB offers high availability through replica sets and horizontal scalability with sharding, making it suitable for applications requiring high availability and partition tolerance. Its ability to store and retrieve large volumes of data efficiently helps us manage the growing user base and their associated data seamlessly.

2. *Redis*: Redis is utilized for caching frequently accessed data to enhance the performance of read operations. As an in-memory data store, Redis provides extremely fast data access times, which significantly reduces the latency for retrieving data. Its persistence features ensure that data is not lost in case of a failure, and its scalability allows it to handle large volumes of data and high-throughput operations. By caching user session data and other frequently requested information, Redis helps reduce the load on MongoDB and improves the overall responsiveness of the application.

## Define Retention Target
User data and taxonomy data are frequently accessed and considered hot data. To optimize performance, we use indexing on crucial fields such as userID, email, taxonomyID, and type. Additionally, we implement a caching layer using Redis to reduce the number of database fetches, ensuring quick retrieval of this important information and improving the efficiency of read operations.

# Domain Design

---

## Break Down System into Business Domains

### Users Management
The Users Management domain is responsible for all operations related to the various models in the system, including departments, locations, professors, resources, and students. This includes processes for creating, updating, and managing these entities. The system ensures that these models are properly maintained and their relationships are accurately represented. For instance, departments can be linked to locations, indicating where specific departments operate. Professors are associated with departments, reflecting their roles and responsibilities within the organization. Students can be linked to resources, such as course materials, and managed by professors within their departments. This interconnectedness ensures a coherent and comprehensive representation of the university's structure. This domain interacts with the authentication system to verify user credentials and maintain secure sessions, ensuring that only authorized users can manage these models.

### Taxonomy Management
The Taxonomy Management domain is a crucial component that handles the organization and assignment of users into various categories called taxonomies. Taxonomies represent different classifications such as semesters, branches, and internships. This domain abstracts the complexities of creating, updating, and managing these classifications. Professors can create new taxonomies, define their types and values, associate them with other parent taxonomies, which increase their level in the taxonomy tree, and assign users to them based on various criteria via the postulation models. The system maintains a record of all user assignments within each postulation, ensuring that users are correctly grouped and managed according to their respective categories.

The postulation models, including postulation, postulation type, and postulation type content, provide the framework for defining, managing, and organizing these assignments. 

The Taxonomy Management domain provides functionalities for viewing and updating assignments, allowing for flexible and dynamic user categorization. This domain ensures that the data integrity and relationships between users and taxonomies are maintained, facilitating easy retrieval and updates of assignment information.

---

## Encapsulate Functionality Within Modules

### Model Management Module
The Model Management Module encapsulates all functionalities related to the various entities within the system, ensuring a clear separation of concerns. It handles operations for departments, locations, professors, resources, and students, including creation, updating, and management of these entities. By consolidating these functionalities within a single module, the system can efficiently manage data and ensure that security protocols are strictly followed. The module interacts with the database to store and retrieve entity information and communicates with other modules via well-defined interfaces to maintain loose coupling. Through careful modulation, this module ensures robust management of each entity, pushing functionalities to their extreme while minimizing errors.

### Taxonomy Module
The Taxonomy Module is dedicated to managing the various taxonomies within the system. It abstracts the complexities involved in creating and managing taxonomies such as semesters, branches, and internships. Professors can create new taxonomies, specify their types, and assign users to these categories. This module also supports the integration of postulation models, including postulation, postulation type, and postulation type content, to define and manage assignments dynamically. It provides capabilities to view and update existing taxonomies and their assignments. By encapsulating these functions within a single module, the system ensures that taxonomy management is handled efficiently and consistently. The Taxonomy Module interacts with the Model Management Module to fetch entity details and maintains the relationships between users and their assigned taxonomies, ensuring data integrity and easy access to assignment information. Through strategic modulation, this module enhances flexibility and functionality, pushing capabilities to their limits without leaving room for errors.
---

## Minimize Dependencies Among Domains

### Loose Coupling
To maintain loose coupling, each module is designed to interact with others through well-defined APIs or service interfaces. This approach ensures that changes within one module do not directly impact others, allowing for independent development, deployment, and scaling. By decoupling modules, we enhance the system's resilience and flexibility, making it easier to implement updates and new features without disrupting the entire application.

### Service Contracts
Clear service contracts define the interactions between modules. These contracts specify the input and output formats for service calls, ensuring consistent, predictable, and reliable communication between different parts of the system. Well-documented service contracts enable teams to work independently while maintaining a cohesive and integrated system, facilitating smooth collaboration and integration.

### API Gateway
An API Gateway is implemented to manage and route requests to the appropriate services. It acts as a single entry point for client requests, handling tasks such as authentication, request routing, load balancing, and rate limiting. This architecture enhances security by centralizing and standardizing access control, and it simplifies client interactions with backend services by providing a unified interface. The API Gateway also improves performance and reliability by distributing requests efficiently and managing traffic effectively.

---