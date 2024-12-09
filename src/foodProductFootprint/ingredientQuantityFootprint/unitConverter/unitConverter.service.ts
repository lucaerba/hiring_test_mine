import { Injectable } from '@nestjs/common';

@Injectable()
export class UnitConverterService {
    private conversionRates: { [key: string]: number } = {
        kg: 1,
        g: 0.001,
        l: 1,
        ml: 0.001,
        oz: 0.0283495,
        lb: 0.453592,
        floz: 0.0295735,
    };

    convert(value: number, fromUnit: string, toUnit: string): number {
        const fromRate = this.conversionRates[fromUnit];
        const toRate = this.conversionRates[toUnit];

        if (fromRate === undefined || toRate === undefined) {
            throw new Error(`Conversion from ${fromUnit} to ${toUnit} is not supported`);
        }

        return (value * fromRate) / toRate;
    }
}