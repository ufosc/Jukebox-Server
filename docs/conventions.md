# Project Conventions

## Objects, Entities, DTOs

1. Data Transfer Objects (DTOs) dictate shape of data on server ingres/egress (api requests, responses, kafka events, websockets, etc). DTOs determine **inter-service** data contracts.
2. Entities dictate shape of data within the server, between controllers, services, etc. Entities determine **intra-service** data contracts.
3. Use `snake_case` for fields of data objects that are stored inside a database, or passed into/out of the API. This keeps consistency with patterns used across other technologies like Django, Postgres, etc.
