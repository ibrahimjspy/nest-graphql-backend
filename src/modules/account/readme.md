
# Account Module

This module contains REST apis implementation for user based transactions such as get user, update and delete etc.

## Modules

- Address
- User

## external services

Saleor : 
- Used to update user information such as addresses, information, permissions, profile

AuthO : 
- Used to update user information such as information, permissions, profile
- we use authO management api for admin level tasks such as user profile updates, user listings, token generation.

OrangeShine : 
- Used to maintain and update retailer profile in orangeshine which is legacy system of sharove

## Documentation

[AuthO management Api](https://auth0.com/docs/api/management/v2)

[Saleor user](https://docs.saleor.io/docs/3.x/developer/users)


## File structure
Controllers : 
- Used as top level classes to decide api requirements, routes, types and which service to call
- controllers depend directly upon service methods for providing data

Services : 
- Used to handle business logic such as calling transformers, graphql handlers, buiding response
- Can be integrated into other services as well as controllers to allow data access
- Directly depend upon graphql handlers and external services

Handlers : 
- Methods used to decide which query is suitable for given requirements decided by service and calls graphql endpoint to fetch that data
