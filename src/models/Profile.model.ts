import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AppDataSource } from "../config/db.config";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  name: string;
}
