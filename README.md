# Microservices Blog

A Microservies based architecture using Nodejs to create an application where all services has its own database and they replicate data for high availability using event bus that I built using Express

The cluster uses an Ingress Nginx Object to route all data to its respective service

A Frontend using React has users and blogs and the backend services communicate using event-bus only (no direct communication happens between any service)
Comments service that handles user comments
Posts service that handle adding posts to the application
A moderation service that moderates comments before they are allowed to be viewed by users
A query service where the user can submit queries to get complex data about the posts

Technologies:
- Kubernetes
- Docker
- Redis
- Express
- Nodejs
- React
- MongoDB
