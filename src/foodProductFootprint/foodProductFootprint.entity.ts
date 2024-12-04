import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FoodProduct } from "../foodProduct/foodProduct.entity";


@Entity("food_product_foot_prints")
export class FoodProductFootprint extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => FoodProduct, { eager: true })
    @JoinColumn()
    foodProduct: FoodProduct;

    @Column({
        type: "float",
        nullable: false,
    })
    score: number;

    sanitize() {

        if (this.score === 0) {
            throw new Error("Score cannot be 0");
        }
    }

    constructor(props: {
        foodProduct: FoodProduct;
        score: number;
    }) {
        super();

        this.foodProduct = props?.foodProduct;
        this.score = props?.score;
        this.sanitize();
    }
}