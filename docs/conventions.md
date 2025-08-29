# Project Conventions

## Objects, Entities, DTOs

1. Data Transfer Objects (DTOs) dictate shape of data on server ingres/egress (api requests, responses, kafka events, websockets, etc). DTOs determine **inter-service** data contracts.
2. Entities dictate shape of data within the server, between controllers, services, etc. Entities determine **intra-service** data contracts.
3. DTOs are the source of truth for data contracts.
4. Use `snake_case` for fields of data objects that are stored inside a database, or passed into/out of the API. This keeps consistency with patterns used across other technologies like Django, Postgres, etc.
5. DTOs for create/update functionality will exist in the same file as the base DTO object.
   1. The base DTO represents an object returned in a GET request
   2. The Create DTO represents the fields needed to create the object
   3. THe Update DTO represents the fields used to update an object

## Services

1. Inner services can access outer ones, but outer ones cannot access inner. For example, QueueService can access JukeboxService, but JukeboxService cannot access QueueService.
