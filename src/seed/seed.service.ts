import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { ItemsService } from '../items/items.service';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(

        private readonly configService: ConfigService,

        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly userService: UsersService,

        private readonly itemService: ItemsService
    ) {
        this.isProd = this.configService.get("STATE") === "prod";
    }


    async executeSeed(): Promise<boolean> {

        if (this.isProd) throw new UnauthorizedException("We cannot run SEED on Prod");

        await this.deleteDatabase();

        const user = await this.loadUsers();

        await this.loadItems(user);

        console.log({ user });

        return true

    }

    private async deleteDatabase() {
        // borrar items 

        await this.itemRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

        //borrar users

        await this.userRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

    }

    private async loadUsers(): Promise<User> {

        const users: User[] = [];

        for (const user of SEED_USERS) {
            users.push(await this.userService.create(user))
        }
        return users[0];

    }

    private async loadItems(user: User): Promise<void> {

        const items: Promise<Item>[] = [];

        for (const item of SEED_ITEMS) {
            items.push(this.itemService.create(item, user))
        }

        await Promise.all(items);

    }



}
