import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {



  constructor(private readonly seedService: SeedService) { }


  @Mutation(() => Boolean, { name: "Seed", description: "Ejecuta la construccion de la base de datos" })
  async executeSeed(): Promise<boolean> {
    return this.seedService.executeSeed();
  }

}