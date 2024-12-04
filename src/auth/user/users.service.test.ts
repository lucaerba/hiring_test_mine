import { GreenlyDataSource, dataSource } from "../../../config/dataSource";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

let usersService: UsersService;

beforeAll(async () => {
    await dataSource.initialize();
    usersService = new UsersService(
        dataSource.getRepository(User)
    );
});

beforeEach(async () => {
    await GreenlyDataSource.cleanDatabase();
});

afterAll(async () => {
    await dataSource.destroy();
});

describe("UsersService", () => {
    it("should create a new user", async () => {
        const username = "testuser";
        const password = "hashedpassword";
        const user = await usersService.create(username, password);
        expect(user).not.toBeNull();
        expect(user.username).toBe(username);
        expect(user.password).toBe(password);
    });

    it("should find a user by username", async () => {
        const username = "testuser";
        const password = "hashedpassword";
        await usersService.create(username, password);
        const user = await usersService.findOneByName(username);
        expect(user).not.toBeNull();
        expect(user?.username).toBe(username);
    });

    it("should return null if user does not exist", async () => {
        const user = await usersService.findOneByName("nonexistentuser");
        expect(user).toBeNull();
    });

    it("should handle errors during user creation", async () => {
        const username = "";
        const password = "hashedpassword";
        await expect(usersService.create(username, password))
            .rejects.toThrow();
    });

    it("should not create a user with an existing username", async () => {
        const username = "testuser";
        const password = "hashedpassword";
        await usersService.create(username, password);
        await expect(usersService.create(username, password))
            .rejects.toThrow();
    });
});