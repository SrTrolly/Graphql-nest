import { ArgsType, Field, registerEnumType } from "@nestjs/graphql";
import { IsArray } from "class-validator";
import { ValidRoles } from "src/enum/valid-roles.enum";

@ArgsType()
export class ValidRolesArgs {

    @Field(() => [ValidRoles], { nullable: true })
    @IsArray()
    roles: ValidRoles[] = [];

}

registerEnumType(ValidRoles, { name: "ValidRoles", description: "Estos son los roles permitidos de la enum" })