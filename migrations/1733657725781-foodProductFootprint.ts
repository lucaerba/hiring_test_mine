import { MigrationInterface, QueryRunner } from "typeorm";

export class FoodProductFootprint1733657725781 implements MigrationInterface {
    name = 'FoodProductFootprint1733657725781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ingredient_quantity_foot_prints" ("id" SERIAL NOT NULL, "score" double precision NOT NULL, "ingredientQuantityId" integer, CONSTRAINT "REL_6d7194a6c79dd57fbc549c8c82" UNIQUE ("ingredientQuantityId"), CONSTRAINT "PK_0646d2d810beca6a9cb4c9146bf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "food_products" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_3aca8796e89325904061ed18b12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2f4d514f7e5374ce4b3091c036" ON "food_products" ("name") `);
        await queryRunner.query(`CREATE TABLE "ingredient_quantities" ("id" SERIAL NOT NULL, "quantity" double precision NOT NULL, "unit" character varying NOT NULL, "ingredientId" integer, CONSTRAINT "PK_097d772fb7ad7af49be9f91cca9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ingredients" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_9240185c8a5507251c9f15e0649" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a955029b22ff66ae9fef2e161f" ON "ingredients" ("name") `);
        await queryRunner.query(`CREATE TABLE "food_product_foot_prints" ("id" SERIAL NOT NULL, "score" double precision NOT NULL, "foodProductId" integer, CONSTRAINT "REL_a9cac28610719c5a297be8a5ad" UNIQUE ("foodProductId"), CONSTRAINT "PK_802e762d3b0cfa1aa9c95a322d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "food_products_ingredient_quantities_ingredient_quantities" ("foodProductsId" integer NOT NULL, "ingredientQuantitiesId" integer NOT NULL, CONSTRAINT "PK_2224fe7c454327d0868a7eb4bef" PRIMARY KEY ("foodProductsId", "ingredientQuantitiesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d3566e4c28578270b39a3e58ae" ON "food_products_ingredient_quantities_ingredient_quantities" ("foodProductsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b02f56dc730a2f973e4bd3ddd2" ON "food_products_ingredient_quantities_ingredient_quantities" ("ingredientQuantitiesId") `);
        await queryRunner.query(`ALTER TABLE "ingredient_quantity_foot_prints" ADD CONSTRAINT "FK_6d7194a6c79dd57fbc549c8c82c" FOREIGN KEY ("ingredientQuantityId") REFERENCES "ingredient_quantities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ingredient_quantities" ADD CONSTRAINT "FK_2d4aed49ba52e09216689e6ade3" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "food_product_foot_prints" ADD CONSTRAINT "FK_a9cac28610719c5a297be8a5ada" FOREIGN KEY ("foodProductId") REFERENCES "food_products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "food_products_ingredient_quantities_ingredient_quantities" ADD CONSTRAINT "FK_d3566e4c28578270b39a3e58aea" FOREIGN KEY ("foodProductsId") REFERENCES "food_products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "food_products_ingredient_quantities_ingredient_quantities" ADD CONSTRAINT "FK_b02f56dc730a2f973e4bd3ddd24" FOREIGN KEY ("ingredientQuantitiesId") REFERENCES "ingredient_quantities"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "food_products_ingredient_quantities_ingredient_quantities" DROP CONSTRAINT "FK_b02f56dc730a2f973e4bd3ddd24"`);
        await queryRunner.query(`ALTER TABLE "food_products_ingredient_quantities_ingredient_quantities" DROP CONSTRAINT "FK_d3566e4c28578270b39a3e58aea"`);
        await queryRunner.query(`ALTER TABLE "food_product_foot_prints" DROP CONSTRAINT "FK_a9cac28610719c5a297be8a5ada"`);
        await queryRunner.query(`ALTER TABLE "ingredient_quantities" DROP CONSTRAINT "FK_2d4aed49ba52e09216689e6ade3"`);
        await queryRunner.query(`ALTER TABLE "ingredient_quantity_foot_prints" DROP CONSTRAINT "FK_6d7194a6c79dd57fbc549c8c82c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b02f56dc730a2f973e4bd3ddd2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d3566e4c28578270b39a3e58ae"`);
        await queryRunner.query(`DROP TABLE "food_products_ingredient_quantities_ingredient_quantities"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "food_product_foot_prints"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a955029b22ff66ae9fef2e161f"`);
        await queryRunner.query(`DROP TABLE "ingredients"`);
        await queryRunner.query(`DROP TABLE "ingredient_quantities"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2f4d514f7e5374ce4b3091c036"`);
        await queryRunner.query(`DROP TABLE "food_products"`);
        await queryRunner.query(`DROP TABLE "ingredient_quantity_foot_prints"`);
    }

}
