import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';


@Injectable()
export class ItemsService {


  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>
  ) { }

  async create(createItemInput: CreateItemInput): Promise<Item> {

    const newItem = this.itemRepository.create(createItemInput);

    const itemDB = await this.itemRepository.save(newItem);

    return itemDB;
  }

  async findAll(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ id: id });

    if (!item) throw new NotFoundException(`Item with id: ${id} not found`);

    return item;

  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {

    const item = await this.itemRepository.preload(updateItemInput);

    if (!item) throw new NotFoundException(`Item with id ${id} not found`);

    const itemUpdate = this.itemRepository.save(item);

    return itemUpdate;

  }

  async remove(id: string): Promise<Item> {

    const item = await this.findOne(id);

    await this.itemRepository.remove(item);

    return { id, ...item };
  }
}
