import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';
import { ItemsService } from '../items/items.service';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { List } from 'src/lists/entities/list.entity';
import { ListsService } from '../lists/lists.service';
import { ListItemService } from 'src/list-item/list-item.service';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(

        private readonly configService: ConfigService,

        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(ListItem)
        private readonly listItemRepository: Repository<ListItem>,

        @InjectRepository(List)
        private readonly listsRepository: Repository<List>,

        private readonly userService: UsersService,

        private readonly itemService: ItemsService,

        private readonly listService: ListsService,

        private readonly listItemsService: ListItemService
    ) {
        this.isProd = this.configService.get("STATE") === "prod";
    }


    async executeSeed(): Promise<boolean> {

        if (this.isProd) throw new UnauthorizedException("We cannot run SEED on Prod");

        await this.deleteDatabase();

        const user = await this.loadUsers();

        await this.loadItems(user);

        const list = await this.loadLists(user);

        const items = await this.itemService.findAll(user, { limit: 15, offset: 0 }, {});
        await this.loadListItems(list, items);


        return true

    }

    private async deleteDatabase() {

        //borrar ListItems

        await this.listItemRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();


        //borra list

        await this.listsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();


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

    private async loadLists(user: User): Promise<List> {

        const lists = [];

        for (const list of SEED_LISTS) {
            lists.push(await this.listService.create(list, user))
        }

        return lists[0]
    }

    private async loadListItems(list: List, items: Item[]) {
        for (const item of items) {
            this.listItemsService.create({
                quantity: Math.round(Math.random() * 10),
                completed: Math.round(Math.random() * 1) === 0 ? false : true,
                listId: list.id,
                itemId: item.id
            });
        }
    }


}
