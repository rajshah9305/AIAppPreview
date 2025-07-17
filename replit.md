# RAJAI - AI-Powered Code Generation Platform

## Overview

RAJAI is a sophisticated web application designed to transform user prompts into five distinct, high-quality frontend code variations. The platform leverages AI-powered code generation to create unique HTML/CSS/JS components with different stylistic approaches, providing developers and designers with creative alternatives for their projects.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and component-based development
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom design system using dark theme and orange accents
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible interfaces
- **Animations**: Framer Motion for smooth micro-interactions and transitions
- **State Management**: TanStack Query for server state management and local React state for UI state

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful endpoints with WebSocket support for real-time updates
- **Development Setup**: Vite for fast development builds and hot module replacement

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Structured tables for users, projects, and API keys with JSON fields for code variations
- **Migrations**: Drizzle Kit for database schema management and migrations
- **Development**: In-memory storage implementation for rapid prototyping

### Authentication and Authorization
- **Strategy**: JWT-based authentication with session management
- **User Management**: Email/password authentication with user profiles
- **API Security**: Secure API key storage for external service integration (Cerebras AI)
- **Session Storage**: Connect-pg-simple for PostgreSQL session storage

## Key Components

### Core UI Components
1. **Sidebar**: Primary input interface for prompts, API key management, and chat refinement
2. **MainContent**: Multi-panel layout displaying generated code variations in responsive grid
3. **PreviewCard**: Individual variation display with live preview in sandboxed iframes
4. **CodeEditor**: Code viewing, editing, and export functionality
5. **ParticleBackground**: Animated background for enhanced visual appeal

### Real-time Features
- **WebSocket Integration**: Live progress updates during code generation
- **Generation Progress**: Real-time status tracking for each of the 5 variations
- **Chat Interface**: AI-powered refinement chat for iterating on generated code

### Security Features
- **Code Sandboxing**: All generated code runs in secure iframes with proper sandbox attributes
- **XSS Prevention**: Content Security Policy and sanitization for user-generated content
- **API Key Protection**: Encrypted storage of user API keys for external services

## Data Flow

### Code Generation Workflow
1. **User Input**: User enters prompt and provides Cerebras API key via sidebar
2. **Parallel Generation**: System makes 5 simultaneous API calls to Cerebras AI model
3. **Real-time Updates**: WebSocket broadcasts progress updates for each variation
4. **Preview Rendering**: Generated HTML/CSS/JS rendered in sandboxed iframes
5. **Export Options**: Users can download as ZIP or publish to GitHub Gist

### AI Integration
- **Soul of RAJAI**: Immutable system prompt ensuring creative, unique variations
- **Model**: Integration with Cerebras llama-4-scout-17b-16e-instruct model
- **Refinement**: Context-aware chat system for iterating on specific variations

### User Experience Flow
1. **Onboarding**: Immediate, intuitive interface focusing on single input area
2. **API Key Setup**: Secure local storage of Cerebras API credentials
3. **Generation**: Visual feedback with progress indicators and animations
4. **Interaction**: Side-by-side comparison, diff tools, and refinement chat
5. **Export**: One-click download and sharing capabilities

## External Dependencies

### AI Services
- **Cerebras AI**: Primary code generation service using advanced language model
- **API Integration**: Custom wrapper for Cerebras API with error handling and retries

### UI Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Lucide Icons**: Consistent icon system throughout the application
- **Framer Motion**: Animation library for smooth transitions and micro-interactions

### Development Tools
- **Drizzle**: Type-safe ORM with PostgreSQL dialect support
- **Vite**: Fast build tool with TypeScript support and development server
- **ESBuild**: Production bundling for server-side code

### Database & Storage
- **PostgreSQL**: Production database with JSONB support for flexible schema
- **Neon Database**: Serverless PostgreSQL for cloud deployment
- **Local Storage**: Browser-based storage for API keys and user preferences

## Deployment Strategy

### Build Process
- **Client Build**: Vite builds React application with TypeScript compilation
- **Server Build**: ESBuild bundles Node.js server with external package resolution
- **Static Assets**: Built client served from server with proper caching headers

### Environment Configuration
- **Development**: Hot reload with Vite dev server and TypeScript watching
- **Production**: Optimized builds with minification and tree-shaking
- **Database**: Environment-based connection strings with migration support

### Hosting Requirements
- **Node.js**: Server runtime with Express.js application
- **PostgreSQL**: Database with connection pooling and SSL support
- **WebSocket**: Real-time communication support for generation updates
- **Static Serving**: Efficient delivery of client-side assets

### Security Considerations
- **Environment Variables**: Secure configuration management for API keys and database credentials
- **CORS**: Proper cross-origin resource sharing configuration
- **Content Security**: CSP headers and iframe sandboxing for generated code execution