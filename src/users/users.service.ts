import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from "bcrypt"
import { InjectRepository } from '@nestjs/typeorm';
import { SingupInput } from 'src/auth/dto/inputs/signup.input';
import { Repository } from 'typeorm';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';


@Injectable()
export class UsersService {

  private logger: Logger = new Logger("UsersService");

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

  ) { }


  async create(singupInput: SingupInput): Promise<User> {
    try {

      const newUser = this.usersRepository.create({
        ...singupInput,
        password: bcrypt.hashSync(singupInput.password, 10)
      });

      // newUser.password = bcrypt.hashSync(newUser.password, 1); // esta es una manera de hacerlo

      const userDB = await this.usersRepository.save(newUser);

      return userDB;

    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(): Promise<User[]> {
    const usuarios = await this.usersRepository.find()
    return usuarios;
  }

  async findOneByEmail(email: string): Promise<User> {

    try {
      return await this.usersRepository.findOneByOrFail({ email: email })
    } catch (error) {
      throw new NotFoundException(`${email} not found`);
      // this.handleDBErrors({
      //   code: "error-001",
      //   detail: `${email} not found`
      // });
    }


  }

  async findOneById(userId: string): Promise<User> {

    try {
      return await this.usersRepository.findOneByOrFail({ id: userId })
    } catch (error) {
      throw new NotFoundException(`${userId} not found`);
    }
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  async block(id: string): Promise<User> {
    throw new Error(`remove  method not implemented`)
  }

  private handleDBErrors(error: any): never {
    if (error.code === "23505") {
      throw new BadRequestException(error.detail.replace("Key", ""));
    }

    if (error.code === "error-001") {
      throw new BadRequestException(error.detail.replace("Key", ""));
    }

    this.logger.error(error);

    throw new InternalServerErrorException("Please check server logs");
  }
}
