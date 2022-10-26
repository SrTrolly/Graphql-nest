import { forwardRef, Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';


@Module({
  providers: [
    ItemsResolver,
    ItemsService,
    UsersService
  ],
  imports: [
    TypeOrmModule.forFeature([Item]),
    forwardRef(() => UsersModule),
  ],
  exports: [
    ItemsModule,
    TypeOrmModule
  ]
})
export class ItemsModule { }
