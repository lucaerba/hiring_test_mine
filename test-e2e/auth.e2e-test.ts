import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { dataSource, GreenlyDataSource } from "../config/dataSource";
import { AppModule } from "../src/app.module";
import { User } from "../src/auth/user/user.entity";

let token: string;
const loginUser = {
    username: 'test',
    password: 'test'
};

beforeAll(async () => {
    await dataSource.initialize();

});

afterAll(async () => {
    await dataSource.destroy();
});

describe("AuthController", () => {
    let app: INestApplication;

    beforeEach(async () => {
        GreenlyDataSource.cleanDatabase();
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

    });

    it('Login user', async () => {
        await dataSource.getRepository(User).save({
            username: 'test',
            password: 'test'
        });
        return request(app.getHttpServer())
            .post('/login')
            .set('Accept', 'application/json')
            .send(loginUser)
            .expect(201)
            .expect(({ body }) => {
                expect(body.token).toBeDefined();
                expect(body.expiresIn).toBeDefined();
                token = body.token;
            })
    });

    it('Should be authenticated after login', async () => {
        await dataSource.getRepository(User).save({
            username: 'test',
            password: 'test'
        });

        return request(app.getHttpServer())
            .get('/profile')
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
    })

});