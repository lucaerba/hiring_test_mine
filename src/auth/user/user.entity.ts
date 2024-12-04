import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column(
        {
            unique: true,
            nullable: false,
        }
    )
    username: string;

    @Column(
        {
            nullable: false,
        }
    )
    password: string;

    sanitize() {
        if (this.username === "") {
            throw new Error("Username cannot be empty");
        }
        if (this.password === "") {
            throw new Error("Password cannot be empty");
        }
    }
    constructor(props: { username: string; password: string }) {
        super();

        this.username = props?.username;
        this.password = props?.password;
        this.sanitize();
    }

}