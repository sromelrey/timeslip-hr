# Backend Development Standards

This document outlines the technical standards, architecture, and coding conventions for the TimeSlip-HR backend application.

## Core Tech Stack

- **Framework**: [NestJS 11.0](https://nestjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [TypeORM 0.3](https://typeorm.io/)
- **Authentication**: [Passport.js](https://www.passportjs.org/) (JWT & Local strategies)
- **Security**: [Argon2](https://github.com/ranisalt/node-argon2) for password hashing, [Helmet](https://helmetjs.github.io/) for security headers.
- **Documentation**: [Swagger (OpenAPI)](https://swagger.io/)

## Project Structure

The project follows a modular NestJS architecture:

```text
backend/
├── src/
│   ├── modules/            # Domain-driven modules
│   │   ├── auth/           # Authentication & Authorization
│   │   ├── employee/       # Employee management
│   │   └── ...             # Other feature modules
│   ├── entities/           # TypeORM database entities
│   ├── types/              # Centralized TypeScript types, interfaces, and enums
│   ├── database/           # Seeds and schema management
│   ├── guards/             # Authentication & Role guards
│   ├── middlewares/        # Express middlewares (cors, helmet)
│   ├── main.ts             # Application entry point
│   └── app.module.ts       # Root module
├── httpyac/                # REST API test files
└── scripts/                # Utility scripts
```

## Coding Conventions

### Naming Conventions
- **Directories & Files**: Use `dash-case` (e.g., `employee.service.ts`, `create-employee.dto.ts`).
- **Classes**: Use `PascalCase` (e.g., `EmployeeService`, `EmployeeEntity`).
- **Interfaces & Types**: Use `PascalCase`.
- **Functions & Variables**: Use `camelCase`.

### Module Structure
Each feature module follows a standardized structure for consistency and maintainability:

```text
module-name/
├── *.module.ts          # Module definition and dependency injection
├── *.controller.ts      # API endpoints and request handling
├── providers/           # Services, strategies, and business logic
│   ├── *.service.ts     # Domain-specific business logic
│   └── *.strategy.ts    # Passport strategies (for auth module)
└── dtos/                # Data Transfer Objects for validation
```

#### Providers Directory
**Purpose**: Centralized location for all injectable services and strategies within a module.

**What goes in `providers/`**:
- **Services** (`*.service.ts`): Business logic, data manipulation, repository interactions
- **Strategies** (`*.strategy.ts`): Passport authentication strategies (JWT, Local, etc.)
- **Specialized Services**: PDF generators, export services, calculation engines

**Examples**:
- `auth/providers/` → `auth.service.ts`, `jwt.strategy.ts`, `local.strategy.ts`
- `payroll/providers/` → `payroll.service.ts`, `payslip.service.ts`, `pay-period.service.ts`, `deduction.service.ts`, `payslip-pdf.service.ts`, `payslip-export.service.ts`
- `employee/providers/` → `employee.service.ts`, `employee-compensation.service.ts`

**Benefits**:
- Clear separation between controllers (routing) and business logic
- Easier to locate and organize related services
- Promotes single responsibility principle
- Simplifies module imports and provider registration

### Centralized Types (src/types)
All shared TypeScript definitions must be located in the `src/types` directory:
- `enums.ts`: All domain-level enums (e.g., `UserRole`, `TimesheetStatus`).
- `*.types.ts`: Domain-specific interfaces and types (e.g., `auth.types.ts`).

**Constraint**: Do not define enums or interfaces within entity or service files if they are intended to be shared or used in TypeORM decorators.

## Database Patterns (TypeORM)

- **Common Entity**: Use `CommonEntity` (from `entities/common.entity.ts`) as a base for all entities to include standard fields like `id`, `createdAt`, `updatedAt`, and `deletedAt`.
- **Enums**: Always import enums from `@/types/enums` for use in `@Column({ type: 'enum', enum: ... })`.
- **Soft Deletes**: Use TypeORM's `@DeleteDateColumn()` for soft-deletion support.
- **Relations**: Define relations (OneToMany, ManyToOne) explicitly in entity files.

## API & Validation

### Request Validation
- All incoming requests must be validated using `class-validator` and `class-transformer` via the global `ValidationPipe`.
- Use DTOs for all POST/PATCH/PUT endpoints.
- Enable `whitelist: true` and `forbidNonWhitelisted: true` in `main.ts`.

### Documentation (Swagger)
- Use NestJS Swagger decorators (`@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiProperty`) to document all endpoints.
- Secure endpoints using `@ApiBearerAuth('JWT-auth')`.

## Security & Auth

- **Guards**: 
  - Use `JwtAuthGuard` for protected routes.
  - Use `RolesGuard` for RBAC (Role-Based Access Control).
- **Password Hashing**: Always use `argon2` for hashing passwords before storing them in the database.
- **Environment Variables**: Use `@nestjs/config` for managing sensitive data and configurations.

## Best Practices

1.  **Dependency Injection**: Use constructor-based DI; avoid `new` for services/repositories.
2.  **Error Handling**: Use built-in NestJS exceptions (e.g., `NotFoundException`, `BadRequestException`).
3.  **DTOs**: Never return entities directly from controllers; use DTOs or serialization.
4.  **Lean Controllers**: Controllers should only handle routing and validation; all business logic belongs in services.
5.  **Type Safety**: Avoid `any`. Leverage TypeScript's type system for all data structures.

## Testing Standards

We use **Jest** (default in NestJS) for all backend testing logic.

### Core Principles
- **Fast Feedback**: Unit tests should run instantly.
- **Mock External Dependencies**: Services connecting to databases or external APIs should be mocked in unit tests.
- **E2E Reliability**: E2E tests should use real database connections (test containers or test DB) to ensure SQL correctness.

### 1. Unit Testing
- **Scope**: Services, Pipes, Guards, and Utilities.
- **Mocking**: Use `jest.spyOn` or standard custom providers for repository mocking.

**Naming Convention**: `*.spec.ts` located alongside the source file.

**Example (Service Test):**
```typescript
// modules/time-event/providers/time-event.service.spec.ts
describe('TimeEventService', () => {
  let service: TimeEventService;
  let repo: Repository<TimeEvent>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TimeEventService,
        { provide: getRepositoryToken(TimeEvent), useValue: mockRepo }
      ],
    }).compile();

    service = module.get(TimeEventService);
  });

  it('should create event successfully', async () => {
    const result = await service.create(mockDto);
    expect(result).toBeDefined();
  });
});
```

### 2. Integration Testing
- **Scope**: Controllers + Services working together.
- **Mocking**: Mock only the database layer or specific external services.

### 3. End-to-End (E2E) Testing
- **Scope**: Full request lifecycle from Middleware → Guard → Controller → Service → Database.
- **Location**: `test/` directory at the project root.
- **Naming**: `*.e2e-spec.ts`.

**Example (E2E Test):**
```typescript
// test/auth.e2e-spec.ts
it('/auth/login (POST)', () => {
  return request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: 'admin@example.com', password: 'password' })
    .expect(201)
    .expect(res => {
      expect(res.body.accessToken).toBeDefined();
    });
});
```

### 4. Code Coverage
- **Business Logic**: 100% coverage on critical services (Payroll, TimeEvent state machine).
- **Controllers**: Ensure decorators and basic validation paths are covered.
