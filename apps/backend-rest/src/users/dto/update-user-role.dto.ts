import { UserRole } from "@prisma/client";
import { IsEnum } from "class-validator";

export class UpdateUserRoleDto {
  @IsEnum(UserRole, {
    message: "Role must be one of: PLAYER, MASTER, ADMIN",
  })
  role: UserRole;
}
