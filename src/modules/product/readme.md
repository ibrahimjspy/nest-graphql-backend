# Product Module

This module contains REST apis for products listings, details and get product by shop


## Documentation

[Saleor Documentation](https://docs.saleor.io/docs/3.x/developer/products)

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
