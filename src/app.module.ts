import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeorm } from "../config/dataSource";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./auth/user/users.module";
import { CarbonEmissionFactorsModule } from "./carbonEmissionFactor/carbonEmissionFactors.module";
import { FoodProductsModule } from "./foodProduct/foodProducts.module";
import { FoodProductFootprintsModule } from "./foodProductFootprint/foodProductFootprints.module";
import { IngredientQuantityFootprintsModule } from "./foodProductFootprint/ingredientQuantityFootprint/ingredientQuantityFootprints.module";
import { IngredientsModule } from "./ingredient/ingredients.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.getOrThrow("typeorm"),
    }),
    CarbonEmissionFactorsModule,
    IngredientsModule,
    FoodProductsModule,
    FoodProductFootprintsModule,
    IngredientQuantityFootprintsModule,
    AuthModule,
    UsersModule
  ],
})
export class AppModule { }
