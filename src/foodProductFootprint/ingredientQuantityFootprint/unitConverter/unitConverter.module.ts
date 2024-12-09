import { Module } from '@nestjs/common';
import { UnitConverterService } from './unitConverter.service';

@Module({
    providers: [UnitConverterService],
    exports: [UnitConverterService],
})
export class UnitConverterModule { }