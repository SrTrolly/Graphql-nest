import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ListItem } from '../../list-item/entities/list-item.entity';

@Entity({ name: "List" })
@ObjectType()
export class List {

  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;


  @ManyToOne(() => User, (user) => user.list, { nullable: false, lazy: true })
  @Index("userId-list-index")
  @Field(() => User)
  user: User;

  @OneToMany(() => ListItem, (listItem) => listItem.list, { lazy: true })
  // @Field(() => [ListItem])
  listItem: ListItem[];

}
