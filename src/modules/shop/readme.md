# Shop Module

This module contains REST apis for all shop related transactions, such as shop create, update and delete.

## Modules

Shop Module
- Used to maintain marketplace shop against a retailer or storefront

Retailer Module
- Used to update handle retailer payments, transactions and shop 


Product Store Module
- Used to handle push to store and dropshipping apis

## Documentation

[Retailer Documentation](https://team-os.atlassian.net/wiki/spaces/SHAR/pages/1839857665/Retailer)

[Shop Service Documentation](https://team-os.atlassian.net/wiki/spaces/SHAR/pages/1802174486/Shop+Service+Contracts)

[Retailer Documentation](https://team-os.atlassian.net/wiki/spaces/SHAR/pages/1839857665/Retailer)

[Shop Service Design](https://team-os.atlassian.net/wiki/spaces/SHAR/pages/1802174486/Shop+Service+Contracts)

[Product store Design](https://team-os.atlassian.net/wiki/spaces/SHAR/pages/1858633766/Product+Store+Service)


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
