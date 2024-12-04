import { MigrationInterface, QueryRunner } from "typeorm";

export class FoodProduct1733262738501 implements MigrationInterface {
    name = 'FoodProduct1733262738501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "food_products" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_3aca8796e89325904061ed18b12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2f4d514f7e5374ce4b3091c036" ON "food_products" ("name") `);
        await queryRunner.query(`CREATE TABLE "ingredients" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "unit" character varying NOT NULL, "quantity" double precision NOT NULL, CONSTRAINT "PK_9240185c8a5507251c9f15e0649" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e0eee54941054c312ddb700d53" ON "ingredients" ("name", "unit", "quantity") `);
        await queryRunner.query(`CREATE TABLE "ingredient_foot_prints" ("id" SERIAL NOT NULL, "score" double precision NOT NULL, "ingredientId" integer, CONSTRAINT "REL_707507fac1488c38a52c480fc5" UNIQUE ("ingredientId"), CONSTRAINT "PK_429e84cdfc9b5e4b314b94de931" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "food_product_foot_prints" ("id" SERIAL NOT NULL, "score" double precision NOT NULL, "foodProductId" integer, CONSTRAINT "REL_a9cac28610719c5a297be8a5ad" UNIQUE ("foodProductId"), CONSTRAINT "PK_802e762d3b0cfa1aa9c95a322d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "food_products_ingredients_ingredients" ("foodProductsId" integer NOT NULL, "ingredientsId" integer NOT NULL, CONSTRAINT "PK_5c1a3a8f67600e686553917cdb7" PRIMARY KEY ("foodProductsId", "ingredientsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e3fc2952d043587fdbbf1ccb3e" ON "food_products_ingredients_ingredients" ("foodProductsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a581fccaf888a0c0889965278c" ON "food_products_ingredients_ingredients" ("ingredientsId") `);
        await queryRunner.query(`ALTER TABLE "ingredient_foot_prints" ADD CONSTRAINT "FK_707507fac1488c38a52c480fc51" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "food_product_foot_prints" ADD CONSTRAINT "FK_a9cac28610719c5a297be8a5ada" FOREIGN KEY ("foodProductId") REFERENCES "food_products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "food_products_ingredients_ingredients" ADD CONSTRAINT "FK_e3fc2952d043587fdbbf1ccb3e5" FOREIGN KEY ("foodProductsId") REFERENCES "food_products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "food_products_ingredients_ingredients" ADD CONSTRAINT "FK_a581fccaf888a0c0889965278c2" FOREIGN KEY ("ingredientsId") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "food_products_ingredients_ingredients" DROP CONSTRAINT "FK_a581fccaf888a0c0889965278c2"`);
        await queryRunner.query(`ALTER TABLE "food_products_ingredients_ingredients" DROP CONSTRAINT "FK_e3fc2952d043587fdbbf1ccb3e5"`);
        await queryRunner.query(`ALTER TABLE "food_product_foot_prints" DROP CONSTRAINT "FK_a9cac28610719c5a297be8a5ada"`);
        await queryRunner.query(`ALTER TABLE "ingredient_foot_prints" DROP CONSTRAINT "FK_707507fac1488c38a52c480fc51"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a581fccaf888a0c0889965278c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e3fc2952d043587fdbbf1ccb3e"`);
        await queryRunner.query(`DROP TABLE "food_products_ingredients_ingredients"`);
        await queryRunner.query(`DROP TABLE "food_product_foot_prints"`);
        await queryRunner.query(`DROP TABLE "ingredient_foot_prints"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e0eee54941054c312ddb700d53"`);
        await queryRunner.query(`DROP TABLE "ingredients"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2f4d514f7e5374ce4b3091c036"`);
        await queryRunner.query(`DROP TABLE "food_products"`);
    }

}
