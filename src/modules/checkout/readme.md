
# Checkout Module

This module contains REST apis implementation for both b2b and b2c checkout 


## Modules

- Cart
- Payment
- Shipping
- Checkout


## Documentation

[Confluence Documentation](https://team-os.atlassian.net/wiki/spaces/SHAR/pages/1811611692/Checkout)

[Saleor Documentation](https://docs.saleor.io/docs/3.x/developer/checkout)

[Cart flow](https://team-os.atlassian.net/wiki/spaces/SHAR/pages/1888059393/B2B+Checkout+middleware+flow)

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

Saleor Service : 
- saleor services are there for extra abstraction and handling logic which is required to perfom checkout actions in saleor, for example adding lines from bundles to checkout 
- Some of these service methods might take data from other services such as marketplace and then transform it according to their requirements.

Marketplace Service : 
- marketplace services are just like saleor services there for abstraction and handling logic specific to scope of sharove marketplace (multi-vendor, bundle etc)

Response Service : 
- this service is used to combine response from multiple services such as marketplace and saleor and providing ui a readable and well fromated response
- this service uses rollback service incase it sees a response which is not desired.

Rollback Service : 
- this service is used to rollback if any failures happen in one of service methods

OsOrder Service :
- this service used to directly place order on orangeshine using V3 orangeshine APIs
- We can create shipping address on orangeshine against given user id
- Using this service we can get orangeshine bundles against given oranshine product ids