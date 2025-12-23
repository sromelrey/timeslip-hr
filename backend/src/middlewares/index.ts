import helmet from 'helmet';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function applyMiddlewares(app: INestApplication) {
  const configService = app.get(ConfigService);
  
  // Security headers
  app.use(helmet());
  
  // CORS for frontend
  app.enableCors({
    origin: configService.getOrThrow<string>('FRONTEND_URL'),
    credentials: true,
  });
}
