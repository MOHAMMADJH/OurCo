# Project Structure

## Overview
This document outlines the organization of our React TypeScript project, explaining the purpose and contents of each directory.

## Directory Structure

### `/src`
Root source directory containing all application code.

### `/src/components`
Reusable UI components organized by feature/domain:

- `/common` - Shared components used across multiple features
- `/layout` - Layout components (headers, footers, navigation)
- `/features` - Feature-specific components organized by domain
  - `/auth` - Authentication related components
  - `/dashboard` - Dashboard specific components
  - `/projects` - Project management components
  - `/blog` - Blog related components
  - `/services` - Service showcase components

### `/src/pages`
Page components that represent routes in the application:
- Organized by feature/domain
- Each page component should be relatively thin, primarily composing components

### `/src/hooks`
Custom React hooks:
- Shared business logic
- Feature-specific hooks organized by domain

### `/src/lib`
Utility functions and configuration:
- API clients
- Helper functions
- Constants

### `/src/types`
TypeScript type definitions:
- Shared interfaces
- Type declarations
- API response types

### `/src/styles`
Global styles and theme configuration:
- Global CSS
- Theme variables
- Tailwind configuration

### `/src/stories`
Storybook stories for components:
- Organized to mirror the component structure
- Documentation and testing

## Best Practices

1. **Component Organization**
   - Keep components focused and single-responsibility
   - Use feature-based organization for domain-specific components
   - Share common components across features

2. **State Management**
   - Use React hooks for local state
   - Implement context for shared state when needed
   - Keep state close to where it's used

3. **Type Safety**
   - Define clear interfaces for props
   - Use shared type definitions
   - Leverage TypeScript's type system

4. **Code Style**
   - Follow consistent naming conventions
   - Use meaningful directory names
   - Keep related files together

5. **Testing**
   - Write stories for component documentation
   - Implement unit tests for utilities
   - Add integration tests for features

## Migration Plan

1. Create new directory structure
2. Move components to appropriate locations
3. Update imports and paths
4. Verify functionality
5. Clean up unused files
6. Update documentation

This structure promotes:
- Clear separation of concerns
- Easy navigation and maintenance
- Scalability for new features
- Consistent organization patterns
- Reusable component architecture