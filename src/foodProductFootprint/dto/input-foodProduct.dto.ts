export interface FoodProductInputDto {
    name: string;
    ingredients: {
        name: string;
        quantity: number;
        unit: string;
    }[];
}