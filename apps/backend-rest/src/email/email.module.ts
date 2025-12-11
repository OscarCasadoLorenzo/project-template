import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EmailController } from "./email.controller";
import { EmailService } from "./email.service";

/**
 * Email module for sending transactional emails
 * Provides configurable email sending capabilities
 */
@Module({
  imports: [ConfigModule],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
