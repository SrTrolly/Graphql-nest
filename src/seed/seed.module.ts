import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { ItemsModule } from '../items/items.module';
import { ItemsService } from '../items/items.service';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [
    SeedResolver,
    SeedService,
    ItemsService,
    UsersService
  ],
  imports: [
    ConfigModule,
    UsersModule,
    ItemsModule
  ]
})
export class SeedModule { }
