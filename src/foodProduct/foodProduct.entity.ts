import { BaseEntity, Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Ingredient } from "../ingredient/ingredient.entity";

@Entity("food_products")
@Index(["name"], { unique: true })
export class FoodProduct extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
    })
    name: string;

    @ManyToMany(type => Ingredient, {
        cascade: ["update"],
        nullable: false,
    })
    @JoinTable()
    ingredients: Ingredient[];

    sanitize() {
        if (this.name === "") {
            throw new Error("Name cannot be empty");
        }
        // if (!this.ingredients || this.ingredients.length === 0) {
        //     throw new Error("Ingredients cannot be empty");
        // }
        if (this.ingredients)
            this.ingredients.forEach(ingredient => {
                ingredient.sanitize();
            });

    }

    constructor(props: {
        name: string;
        ingredients: Ingredient[];
    }) {
        super();

        this.name = props?.name;
        this.ingredients = props?.ingredients;
        this.sanitize(); // Removed validation from constructor
    }
}