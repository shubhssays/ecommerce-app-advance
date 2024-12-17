# E-Commerce Microservices Project

This project is an e-commerce system composed of multiple microservices such as Eureka Service Discovery, NATS Server, Elasticsearch, Logstash, Kibana (ELK Stack), and various business logic services (e.g., Product Service, Inventory Service, Checkout Service).

## Project Structure

```plaintext
.
├── eureka-service-discovery/  # Eureka Service Discovery source code
├── product-service/           # Product Service source code
├── product-details-service/   # Product Details Service source code
├── inventory-service/         # Inventory Service source code
├── cart-service/              # Cart Service source code
├── checkout-service/          # Checkout Service source code
├── notification-service/      # Notification Service source code
├── api-gateway/               # API Gateway source code
├── logstash/                  # Logstash configuration
└── docker-compose.yml         # Docker Compose configuration file


## Run the project
$ docker compose up --build


## Note
1. Postman collection has been added.
2. Assumptions: It is expected that all API calls are authenticated and validated using JWT.


## Eureka Server - http://localhost:8761/
## Elasticsearch - http://localhost:9200/
## Kibana - http://localhost:5601/app/home#/
## BaseURL - http://localhost:5555



Identified Microservices for the E-Commerce System
This e-commerce system is built as a collection of microservices to ensure scalability, maintainability, and fault isolation. Each microservice has a specific role, operating independently yet collaboratively within the system. Below is a detailed breakdown of the identified microservices, their responsibilities, and the rationale behind their inclusion.

1. Eureka Service Discovery
Responsibility:
Acts as the central registry for service discovery. All services register themselves with Eureka, enabling seamless communication and load balancing without hardcoding service endpoints.

Reason:
In a microservices architecture, dynamic service discovery is critical to adapt to scaling, failures, and containerized environments. Eureka simplifies locating services in this distributed system.

2. NATS Server
Responsibility:
Facilitates lightweight, high-performance messaging for asynchronous communication between services.

Reason:
NATS provides a reliable event-driven communication mechanism, ensuring decoupling between microservices, enabling scalability, and supporting pub/sub patterns essential for real-time events like inventory updates or notifications.

3. Elasticsearch (Part of ELK Stack)
Responsibility:
Serves as a search and analytics engine to index and query data such as product listings and user activities.

Reason:
Quick and efficient searching is vital in e-commerce for enhancing the user experience. Elasticsearch supports full-text search, analytics, and scalability.

4. Logstash
Responsibility:
Processes and transforms logs from various services before shipping them to Elasticsearch.

Reason:
Centralized logging is essential for monitoring, debugging, and analytics. Logstash ensures structured and consistent log data across the system.

5. Kibana
Responsibility:
Visualizes data stored in Elasticsearch, providing dashboards and insights into system performance and user behavior.

Reason:
Real-time monitoring of application metrics and search trends is crucial for operational efficiency and business decision-making.

6. Product Service
Responsibility:
Manages the catalog of products, including CRUD operations for product data.

Reason:
The product catalog is a core component of any e-commerce system. This service isolates product-related functionality, allowing for independent scaling and updates.

7. Product Details Service
Responsibility:
Provides detailed information about individual products, such as specifications, reviews, and associated metadata.

Reason:
By separating product details, this service allows for specialized optimization, such as caching or focused performance improvements for detail-intensive requests.

8. Inventory Service
Responsibility:
Tracks stock levels, updates inventory after purchases, and integrates with product availability logic.

Reason:
Managing inventory is a distinct concern requiring real-time accuracy, especially in a dynamic e-commerce environment with frequent stock changes.

9. Cart Service
Responsibility:
Manages user shopping carts, allowing addition, removal, and updating of items.

Reason:
A dedicated cart service isolates the complexity of cart operations, ensuring that session management and cart persistence do not affect other services.

10. Checkout Service
Responsibility:
Handles the checkout process, integrating with inventory, pricing, and payment services.

Reason:
The checkout process is complex and resource-intensive, warranting isolation for better performance and maintainability.

11. Notification Service
Responsibility:
Sends real-time notifications to users about order confirmations, updates, and promotional alerts.

Reason:
A decoupled notification system ensures asynchronous communication, scalability, and support for multiple communication channels like email, SMS, and push notifications.

12. API Gateway
Responsibility:
Acts as the single entry point for external clients, routing requests to the appropriate microservices, performing request aggregation, and handling authentication.

Reason:
The API Gateway simplifies client interactions with microservices, provides a centralized point for authentication (e.g., JWT verification), and helps enforce security policies.

Cross-Service Features
JWT Authentication:
All API calls are authenticated using JWT, ensuring secure communication and protecting sensitive data.

Service Dependency and Communication:
Services are designed with minimal coupling. Dependencies like Eureka and NATS ensure that services can communicate reliably without tight coupling.

Health Checks:
Each service has health check endpoints to monitor availability and readiness for deployments.

Design Considerations
Scalability:
Each service can scale independently based on demand. For instance, the Product Service might require more replicas during a sale.

Fault Tolerance:
Failures in one service (e.g., Notification Service) do not affect the entire system. The architecture ensures graceful degradation.

Ease of Maintenance:
Microservices allow isolated updates and bug fixes, improving deployment velocity and reliability.

Event-Driven Architecture:
NATS enables asynchronous workflows, ensuring responsiveness and reduced downtime during heavy traffic.

This modular and well-defined microservices architecture is designed to support the complex demands of a modern e-commerce platform, ensuring high performance, scalability, and a seamless user experience.