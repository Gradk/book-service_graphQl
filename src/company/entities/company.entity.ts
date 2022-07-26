import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { AdminEntity } from 'src/admin/entities/admin.entity';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';

@ObjectType()
@Entity('companies')
export class CompanyEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_company: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  upatedAt: Date;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  city: string;

  @Field()
  @Column()
  adress: string;

  @Field()
  @Column()
  avatar: string;

  @ManyToOne(() => AdminEntity, (company) => company.id_admin)
  owner_id: AdminEntity;
}
