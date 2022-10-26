import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, Min } from 'class-validator';




@ArgsType()
export class PaginationArgs {

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @Min(0)
    @IsNumber()
    offset: number = 0;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @Min(1)
    @IsNumber()
    limit: number = 10;
}