# Contribution Guidelines

## Core Principles

- All changes must maintain backward compatibility with existing protocols
- Build upon existing functionality rather than replacing it
- Follow established coding standards and patterns

## Code Standards

1. **Authentication**

   - Maintain existing auth routes structure
   - Keep current passport strategy implementations

## Breaking Changes

- Breaking changes are not allowed without team discussion
- Must provide migration path if changes affect existing APIs
- Document all newly created services in new file so that other tools can use the api/service, Write the description of the new service in temp/[service-name].md

## Testing

- Add tests for new functionality
- Verify existing tests pass
- Ensure backward compatibility

Remember: Enhance, don't break.

## Features

- **Customer Authentication**

  - Secure login with JWT token generation.
  - New customer registration with email verification.
  - Password reset functionality via email.

- **Market Management**

  - Registering new markets with necessary details.
  - Secure login and token management for market administrators.

- **Product Management**

  - Adding, updating, and deleting products.
  - Searching for products based on various criteria.

- **Order Processing**

  - Creating and managing new orders.

- **Transaction Handling**

  - Secure payment processing and transaction history management.
