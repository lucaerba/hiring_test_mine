import { UnitConverterService } from './unitConverter.service';

describe('UnitConverterService', () => {
    let service: UnitConverterService;

    beforeEach(() => {
        service = new UnitConverterService();
    });

    it('should convert kg to g', () => {
        const result = service.convert(1, 'kg', 'g');
        expect(result).toBe(1000);
    });

    it('should convert g to kg', () => {
        const result = service.convert(1000, 'g', 'kg');
        expect(result).toBe(1);
    });

    it('should convert l to ml', () => {
        const result = service.convert(1, 'l', 'ml');
        expect(result).toBe(1000);
    });

    it('should convert ml to l', () => {
        const result = service.convert(1000, 'ml', 'l');
        expect(result).toBe(1);
    });

    it('should convert oz to g', () => {
        const result = service.convert(1, 'oz', 'g');
        expect(result).toBeCloseTo(28.3495);
    });

    it('should convert lb to kg', () => {
        const result = service.convert(1, 'lb', 'kg');
        expect(result).toBeCloseTo(0.453592);
    });

    it('should convert floz to ml', () => {
        const result = service.convert(1, 'floz', 'ml');
        expect(result).toBeCloseTo(29.5735);
    });

    it('should throw an error for unsupported units', () => {
        expect(() => service.convert(1, 'unsupported', 'kg')).toThrowError('Conversion from unsupported to kg is not supported');
        expect(() => service.convert(1, 'kg', 'unsupported')).toThrowError('Conversion from kg to unsupported is not supported');
    });
});