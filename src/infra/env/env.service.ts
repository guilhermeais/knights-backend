import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from './env';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<Env, true>) {}

  get<T extends keyof Env>(key: T) {
    console.log('🔐 Getting env variable:', key);
    const value = this.configService.get(key, { infer: true });
    console.log('🔐 Value:', value);
    return value;
  }
}
