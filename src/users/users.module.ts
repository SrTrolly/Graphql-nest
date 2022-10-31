import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ItemsModule } from '../items/items.module';
import { ItemsService } from '../items/items.service';
import { ListsModule } from '../lists/lists.module';


@Module({
  providers: [
    UsersResolver,
    UsersService,
    ItemsService
  ],
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => ItemsModule),
    ListsModule
  ],
  exports: [
    TypeOrmModule,
    UsersService,
  ]
})
export class UsersModule { }
