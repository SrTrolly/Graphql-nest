import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { User } from '../users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';



@Injectable()
export class ItemsService {


  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>
  ) { }

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {

    const newItem = this.itemRepository.create({
      ...createItemInput,
      user
    });

    const itemDB = await this.itemRepository.save(newItem);

    return itemDB;
  }

  async findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<Item[]> {

    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.itemRepository.createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, { userId: user.id });

    if (search) {
      queryBuilder.andWhere("LOWER(name) Like :name", { name: `%${search.toLowerCase()}%` })
    }


    return queryBuilder.getMany();
    // const itemsUser = await this.itemRepository.find({
    //   take: limit,
    //   skip: offset,
    //   where: {
    //     user: {
    //       id: user.id
    //     },
    //     name: Like(`%${search}%`)
    //   }
    // })

    // const itemsUser = await this.itemRepository.findBy({
    //   user: {
    //     id: user.id
    //   }
    // })
    // return itemsUser;
  }

  async findOne(id: string, user: User): Promise<Item> {


    const item = await this.itemRepository.findOneBy({
      id,
      user: {
        id: user.id
      }
    });

    console.log({ item });

    if (!item) throw new NotFoundException(`Item with id: ${id} not found`);

    return item;

  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User): Promise<Item> {

    await this.findOne(id, user);

    const item = await this.itemRepository.preload(updateItemInput);

    if (!item) throw new NotFoundException(`Item with id ${id} not found`);

    const itemUpdate = this.itemRepository.save(item);

    return itemUpdate;

  }

  async remove(id: string, user: User): Promise<Item> {

    const item = await this.findOne(id, user);

    console.log({ item });

    await this.itemRepository.remove(item);

    return { id, ...item };
  }


  async itemCountByUser(user: User): Promise<number> {
    return this.itemRepository.count({
      where: {
        user: {
          id: user.id
        }
      }
    })
  }

}
