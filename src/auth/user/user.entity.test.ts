import { GreenlyDataSource, dataSource } from "../../../config/dataSource";
import { User } from './user.entity';

beforeAll(async () => {
    await dataSource.initialize();
});
afterAll(async () => {
    await dataSource.destroy();
});
beforeEach(async () => {
    await GreenlyDataSource.cleanDatabase();
});

describe('User Entity', () => {
    it('should create a user with valid username and password', () => {
        const user = new User({ username: 'testuser', password: 'testpassword' });
        expect(user.username).toBe('testuser');
        expect(user.password).toBe('testpassword');
    });

    it('should throw an error if username is empty', () => {
        expect(() => new User({ username: '', password: 'testpassword' })).toThrow('Username cannot be empty');
    });

    it('should throw an error if password is empty', () => {
        expect(() => new User({ username: 'testuser', password: '' })).toThrow('Password cannot be empty');
    });
});