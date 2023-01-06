import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  name: string;
}
