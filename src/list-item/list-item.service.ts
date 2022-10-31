import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { ListItem } from './entities/list-item.entity';
import { Repository } from 'typeorm';
import { List } from '../lists/entities/list.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';


@Injectable()
export class ListItemService {

  constructor(
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>
  ) { }


  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {

    const { itemId, listId, ...rest } = createListItemInput
    const newListItem = this.listItemRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId }
    });

    return await this.listItemRepository.save(newListItem);

  }

  async findAll(list: List, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listItemRepository.createQueryBuilder()
      .take(limit)
      .offset(offset)
      .where(`"listId" = :listId`, { listId: list.id });

    // if (search) {
    //   queryBuilder.andWhere("")
    // }

    return queryBuilder.getMany();

  }

  async findOne(id: string): Promise<ListItem> {
    const itemList = await this.listItemRepository.findOneBy({ id });

    if (!itemList) throw new NotFoundException(`List item with id ${id} not found`);
    return itemList;
  }

  async update(id: string, updateListItemInput: UpdateListItemInput): Promise<ListItem> {

    const { itemId, listId, ...rest } = updateListItemInput;

    const queryBuilder = this.listItemRepository.createQueryBuilder()
      .update()
      .set(rest)
      .where("id=:id", { id });

    if (listId) queryBuilder.set({ list: { id: listId } });
    if (itemId) queryBuilder.set({ item: { id: itemId } });

    await queryBuilder.execute();

    return this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }

  async listCountByList(list: List): Promise<number> {
    return this.listItemRepository.count({
      where: {
        list: {
          id: list.id
        }
      }
    })
  }
}
