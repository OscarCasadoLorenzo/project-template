import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('cleanDatabase cannot be run in production');
    }

    // Add truncate queries for all your tables here
    const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');

    return Promise.all(
      models.map((modelKey) => this[modelKey as string].deleteMany())
    );
  }
}
