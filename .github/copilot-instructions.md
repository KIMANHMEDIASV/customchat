# Copilot Instructions for CustomChat

## Project Overview

This repository contains a web chat application built with Azure OpenAI. The project enables users to interact with AI through a web-based chat interface.

## Development Guidelines

### General Principles

- Write clean, maintainable, and well-documented code
- Follow modern web development best practices
- Ensure security best practices, especially when handling API keys and user data
- Prioritize user experience and accessibility

### Code Style

- Use consistent indentation (prefer 2 spaces for web files)
- Write descriptive variable and function names
- Add comments for complex logic
- Keep functions small and focused on a single responsibility

### Azure OpenAI Integration

- Always handle API keys securely (use environment variables, never commit credentials)
- Implement proper error handling for API calls
- Add appropriate timeouts and retry logic for external API calls
- Validate and sanitize user inputs before sending to the API
- Handle API rate limits gracefully

### Testing

- Write tests for critical functionality
- Test error scenarios and edge cases
- Ensure API integrations are properly mocked in tests

### Security Considerations

- Never expose API keys or secrets in client-side code
- Implement proper input validation and sanitization
- Use HTTPS for all external communications
- Follow OWASP best practices for web applications
- Implement proper CORS policies

### Documentation

- Keep README.md up to date with setup instructions
- Document environment variables and configuration options
- Add inline comments for complex business logic
- Include examples in documentation where helpful

## Build and Deploy

- Ensure all dependencies are properly listed in package configuration
- Test builds locally before committing
- Follow semantic versioning for releases
