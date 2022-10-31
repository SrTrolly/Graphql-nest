import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';


@Injectable()
export class ListsService {


  constructor(
    @InjectRepository(List)
    private readonly ListsRepository: Repository<List>
  ) {

  }

  async create(createListInput: CreateListInput, user: User): Promise<List> {

    const newList = this.ListsRepository.create({ ...createListInput, user });

    return await this.ListsRepository.save(newList);

  }

  async findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<List[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.ListsRepository.createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" =:userId`, { userId: user.id });

    if (search) {
      queryBuilder.andWhere("LOWER(name) Like :name", { name: `%${search.toLowerCase()}%` })
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.ListsRepository.findOneBy({
      id,
      user: {
        id: user.id
      }
    });

    if (!list) throw new NotFoundException(`List with id: ${id} not found`);

    return list;
  }

  async update(id: string, updateListInput: UpdateListInput, user: User): Promise<List> {
    await this.findOne(id, user);

    const list = await this.ListsRepository.preload({ ...updateListInput, user });

    if (!list) throw new NotFoundException(`List with id: ${id} not found`);

    const listUpdate = this.ListsRepository.save(list);

    return listUpdate;
  }

  async remove(id: string, user: User): Promise<List> {

    const list = await this.findOne(id, user);

    await this.ListsRepository.remove(list);

    return { ...list, id };

  }

  async listsCountByUser(user: User): Promise<number> {

    return this.ListsRepository.count({
      where: {
        user: {
          id: user.id
        }
      }
    });

  }

}
