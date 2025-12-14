import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    // Global config module
    ConfigModule.forRoot({ isGlobal: true }),
    
    // Database configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.getOrThrow<string>('DATABASE_URL'),
        entities: [__dirname + '/entities/*.entity{.ts,.js}'], // Load all entity files
        synchronize: true, // Auto-create tables in development (set to false in production)
        ssl: false,
      }),
    }),
    
    // Feature modules
    AuthModule,
    ProductModule,
  ],
})
export class AppModule {}
