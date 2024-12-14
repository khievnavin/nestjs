import { Test } from "@nestjs/testing"
import * as pactum from "pactum"
import { AppModule } from "../src/app.module"
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import { AuthDto } from "src/auth/dto";

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    // await app.listen(3000);
    pactum.request.setBaseUrl('http://localhost:3000')

    prisma = app.get(PrismaService);
    await prisma.cleasDb();
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'khievnavin@gmail.com',
      password: '1234'
    }

    describe('Signup', () => {
      it('should throw if email is pwd', () => {
        return pactum
              .spec()
              .post('/auth/signup')
              .withBody({password: dto.password})
              .expectStatus(400)
      })
      it('should throw if email is nobody', () => {
        return pactum
                .spec()
                .post('/auth/signup')
                .expectStatus(400)
      })
      it('should sign up', () => {
        return pactum
                .spec()
                .post('/auth/signup')
                .withBody(dto)
                .expectStatus(201)
      })
    });
    describe('Signin', () => {
      it('should sign in if no pwd & email', () => {
        return pactum
                .spec()
                .post('/auth/signin')
                .withBody({password: dto.password})
                .expectStatus(400)
      })
      it('should sign in if no body', () => {
        return pactum
                .spec()
                .post('/auth/signin')
                .expectStatus(400)
      })
      it('should sign in', () => {
        return pactum
                .spec()
                .post('/auth/signin')
                .withBody(dto)
                .expectStatus(200)
                .stores('userAt', 'access_token')
      })
    });
  });
  describe('User', () => {
    describe('Get me', () => { 
      it('should get current user',()=>{
        return pactum
                .spec()
                .post('/user/me')
                .expectStatus(200)
      })
    });
    describe('Edit User', () => { });
  });
  describe('Bookmarks', () => {
    describe('Create bookmarks', () => { });
    describe('Get bookmark', () => { });
    describe('Get bookmark by id ', () => { });
    describe('Edit bookmark', () => { });
    describe('Delete bookmark', () => { });

  });

})