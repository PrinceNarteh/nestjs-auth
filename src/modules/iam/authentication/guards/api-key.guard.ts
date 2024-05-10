import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { ApiKey } from 'users/api-keys/entities/api-key.entity';
import { ApiKeysService } from '../api-keys.service';
import { REQUEST_USER_KEY } from 'iam/iam.constant';
import { ActiveUserData } from 'iam/interfaces/active-user-data.interface';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeysRepository: Repository<ApiKey>,
    private readonly apiKeysService: ApiKeysService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractKeyFromHeaders(request);
    if (!apiKey) {
      throw new UnauthorizedException();
    }
    const apiEntityId = this.extractKeyFromHeaders(request);
    try {
      const apiEntity = await this.apiKeysRepository.findOne({
        where: { uuid: apiEntityId },
        relations: { user: true },
      });
      await this.apiKeysService.validate(apiKey, apiEntity.key);
      request[REQUEST_USER_KEY] = {
        sub: apiEntity.user.id,
        email: apiEntity.user.email,
        role: apiEntity.user.role,
        permissions: apiEntity.user.permissions,
      } as ActiveUserData;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractKeyFromHeaders(request: Request): string | undefined {
    const [type, key] = request.headers.authorization?.split(' ') ?? [];
    return type === 'ApiKey' ? key : undefined;
  }
}
