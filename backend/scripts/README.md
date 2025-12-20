# Module Generation Script

This script helps you quickly scaffold new NestJS modules with a consistent structure.

## Usage

```bash
./scripts/create-module.sh <module-name>
```

## Example

```bash
# Create an 'employee' module
./scripts/create-module.sh employee
```

## What Gets Created

The script generates the following structure:

```
src/modules/<module-name>/
├── dtos/
│   ├── create-<module-name>.dto.ts
│   ├── update-<module-name>.dto.ts
│   └── index.ts
├── <module-name>.controller.ts
├── <module-name>.service.ts
└── <module-name>.module.ts
```

## Generated Files Include

- **Module File**: Registers the controller, service, and TypeORM entity
- **Controller**: REST API endpoints with Swagger documentation
- **Service**: Business logic with CRUD operations
- **DTOs**: Data Transfer Objects for create/update operations

## After Running the Script

Complete these steps:

1. **Create Entity**: Create the entity file at `src/entities/<module-name>.entity.ts`

2. **Import Module**: Add to `app.module.ts`:
   ```typescript
   import { YourModule } from './modules/your-module/your-module.module';
   
   @Module({
     imports: [
       // ... other imports
       YourModule,
     ],
   })
   ```

3. **Customize DTOs**: Edit the DTOs to match your entity properties

4. **Adjust Service**: Customize business logic as needed

## Features

- ✅ JWT Authentication guard pre-configured
- ✅ Swagger/OpenAPI documentation
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Soft delete support
- ✅ TypeORM integration
- ✅ Proper error handling
- ✅ Validation decorators
