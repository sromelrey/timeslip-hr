#!/bin/bash

# NestJS Module Scaffolding Script
# Usage: ./scripts/create-module.sh <module-name>
# Example: ./scripts/create-module.sh employee

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if module name is provided
if [ -z "$1" ]; then
  echo -e "${RED}Error: Module name is required${NC}"
  echo "Usage: ./scripts/create-module.sh <module-name>"
  echo "Example: ./scripts/create-module.sh employee"
  exit 1
fi

MODULE_NAME=$1
MODULE_NAME_LOWER=$(echo "$MODULE_NAME" | tr '[:upper:]' '[:lower:]')
MODULE_NAME_PASCAL=$(echo "$MODULE_NAME" | sed -r 's/(^|-)([a-z])/\U\2/g')
MODULE_NAME_CAMEL=$(echo "$MODULE_NAME_PASCAL" | sed 's/^./\L&/')
MODULE_DIR="src/modules/${MODULE_NAME_LOWER}"

echo -e "${YELLOW}Creating module: ${MODULE_NAME_PASCAL}${NC}"

# Check if module already exists
if [ -d "$MODULE_DIR" ]; then
  echo -e "${RED}Error: Module '${MODULE_NAME_LOWER}' already exists at ${MODULE_DIR}${NC}"
  exit 1
fi

# Create module directory structure
echo -e "${GREEN}Creating directory structure...${NC}"
mkdir -p "${MODULE_DIR}/dtos"

# Create module file
cat > "${MODULE_DIR}/${MODULE_NAME_LOWER}.module.ts" << EOF
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${MODULE_NAME_PASCAL} } from '@/entities/${MODULE_NAME_LOWER}.entity';
import { ${MODULE_NAME_PASCAL}Controller } from './${MODULE_NAME_LOWER}.controller';
import { ${MODULE_NAME_PASCAL}Service } from './${MODULE_NAME_LOWER}.service';

@Module({
  imports: [TypeOrmModule.forFeature([${MODULE_NAME_PASCAL}])],
  controllers: [${MODULE_NAME_PASCAL}Controller],
  providers: [${MODULE_NAME_PASCAL}Service],
  exports: [${MODULE_NAME_PASCAL}Service],
})
export class ${MODULE_NAME_PASCAL}Module {}
EOF

# Create controller file
cat > "${MODULE_DIR}/${MODULE_NAME_LOWER}.controller.ts" << EOF
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ${MODULE_NAME_PASCAL}Service } from './${MODULE_NAME_LOWER}.service';
import { Create${MODULE_NAME_PASCAL}Dto, Update${MODULE_NAME_PASCAL}Dto } from './dtos';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';

@ApiTags('${MODULE_NAME_PASCAL}s')
@Controller('${MODULE_NAME_LOWER}s')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ${MODULE_NAME_PASCAL}Controller {
  constructor(private readonly ${MODULE_NAME_CAMEL}Service: ${MODULE_NAME_PASCAL}Service) {}

  @Get()
  @ApiOperation({ summary: 'Get all ${MODULE_NAME_LOWER}s' })
  findAll() {
    return this.${MODULE_NAME_CAMEL}Service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ${MODULE_NAME_LOWER} by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.${MODULE_NAME_CAMEL}Service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new ${MODULE_NAME_LOWER}' })
  create(@Body() dto: Create${MODULE_NAME_PASCAL}Dto) {
    return this.${MODULE_NAME_CAMEL}Service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ${MODULE_NAME_LOWER}' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Update${MODULE_NAME_PASCAL}Dto) {
    return this.${MODULE_NAME_CAMEL}Service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ${MODULE_NAME_LOWER}' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.${MODULE_NAME_CAMEL}Service.remove(id);
  }
}
EOF

# Create service file
cat > "${MODULE_DIR}/${MODULE_NAME_LOWER}.service.ts" << EOF
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${MODULE_NAME_PASCAL} } from '@/entities/${MODULE_NAME_LOWER}.entity';
import { Create${MODULE_NAME_PASCAL}Dto, Update${MODULE_NAME_PASCAL}Dto } from './dtos';

@Injectable()
export class ${MODULE_NAME_PASCAL}Service {
  constructor(
    @InjectRepository(${MODULE_NAME_PASCAL})
    private readonly ${MODULE_NAME_CAMEL}Repo: Repository<${MODULE_NAME_PASCAL}>,
  ) {}

  async findAll(): Promise<${MODULE_NAME_PASCAL}[]> {
    return this.${MODULE_NAME_CAMEL}Repo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<${MODULE_NAME_PASCAL}> {
    const ${MODULE_NAME_CAMEL} = await this.${MODULE_NAME_CAMEL}Repo.findOne({ where: { id } });
    if (!${MODULE_NAME_CAMEL}) {
      throw new NotFoundException(\`${MODULE_NAME_PASCAL} with ID \${id} not found\`);
    }
    return ${MODULE_NAME_CAMEL};
  }

  async create(dto: Create${MODULE_NAME_PASCAL}Dto): Promise<${MODULE_NAME_PASCAL}> {
    const ${MODULE_NAME_CAMEL} = this.${MODULE_NAME_CAMEL}Repo.create(dto);
    return this.${MODULE_NAME_CAMEL}Repo.save(${MODULE_NAME_CAMEL});
  }

  async update(id: number, dto: Update${MODULE_NAME_PASCAL}Dto): Promise<${MODULE_NAME_PASCAL}> {
    const ${MODULE_NAME_CAMEL} = await this.findOne(id);
    Object.assign(${MODULE_NAME_CAMEL}, dto);
    return this.${MODULE_NAME_CAMEL}Repo.save(${MODULE_NAME_CAMEL});
  }

  async remove(id: number): Promise<void> {
    const ${MODULE_NAME_CAMEL} = await this.findOne(id);
    await this.${MODULE_NAME_CAMEL}Repo.softRemove(${MODULE_NAME_CAMEL});
  }
}
EOF

# Create DTOs
cat > "${MODULE_DIR}/dtos/create-${MODULE_NAME_LOWER}.dto.ts" << EOF
import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Create${MODULE_NAME_PASCAL}Dto {
  @ApiProperty({ example: 'Sample Name' })
  @IsString()
  @MaxLength(255)
  name: string;

  // Add your properties here
}
EOF

cat > "${MODULE_DIR}/dtos/update-${MODULE_NAME_LOWER}.dto.ts" << EOF
import { PartialType } from '@nestjs/swagger';
import { Create${MODULE_NAME_PASCAL}Dto } from './create-${MODULE_NAME_LOWER}.dto';

export class Update${MODULE_NAME_PASCAL}Dto extends PartialType(Create${MODULE_NAME_PASCAL}Dto) {}
EOF

cat > "${MODULE_DIR}/dtos/index.ts" << EOF
export * from './create-${MODULE_NAME_LOWER}.dto';
export * from './update-${MODULE_NAME_LOWER}.dto';
EOF

echo -e "${GREEN}✓ Module structure created successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Create the entity file: src/entities/${MODULE_NAME_LOWER}.entity.ts"
echo "2. Add the module to app.module.ts imports:"
echo "   import { ${MODULE_NAME_PASCAL}Module } from './modules/${MODULE_NAME_LOWER}/${MODULE_NAME_LOWER}.module';"
echo "3. Update the DTOs in: ${MODULE_DIR}/dtos/create-${MODULE_NAME_LOWER}.dto.ts"
echo "4. Customize the service and controller as needed"
echo ""
echo -e "${GREEN}Module created at: ${MODULE_DIR}${NC}"
