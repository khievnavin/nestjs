/* eslint-disable prettier/prettier */
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from '../src/user/dto/edit-user.dto';
import { CreateBookmarkDto } from 'src/bookmark/dto';

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
      email: 'navin@gmail.com',
      password: '54321'
    }

    describe('Signup', () => {
      it('should throw if email is pwd', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: dto.password })
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
          .withBody({ email: dto.email, password: dto.password })
          .expectStatus(201)
      })
    });
    describe('Signin', () => {
      it('should sign in if no pwd & email', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({dto})
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
          .expectStatus(201)
          .stores('userAt', 'access_token')
      });
    });
  });
  
  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
      })
    });
    describe('Edit User', () => {
     it('should edit user', ()=>{
      const dto: EditUserDto = {
        firstName: 'navin',
        lastName: 'NaNa',
        email: 'navin@gmail.com.kh',
      }
      return pactum
            .spec()
            .patch('/users')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}'
            })
            .withBody({dto})
            .expectStatus(200)
            
     });
    });
  });

  describe('Bookmarks', () => {
    describe('Create bookmarks', () => { 
      const dto: CreateBookmarkDto ={
        title: 'First Bookmark',
        link: 'https://www.youtube.com/watch?v=EyVJGjbgUco'
      }
      it('should create bookmarks', () =>{
        return pactum
            .spec()
            .post('/bookmarks')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}'
            })
            .withBody({dto})
            .expectStatus(201)
            .stores('bookmarkId', 'id');
      })
    });

    describe('Get empty bookmark', () => {
      it('should get empty bookmark', () =>{
      return pactum
            .spec()
            .get('/bookmarks')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}'
            })
            .expectStatus(200)
            .expectBody([])
            .inspect();
     });
    });

    describe('Get bookmark by id ', () => { 
      it('should get bookmark', () =>{
        return pactum
              .spec()
              .get('/bookmarks')
              .withHeaders({
                Authorization: 'Bearer $S{userAt}'
              })
              .expectStatus(200)
       });
     });

    describe('Edit bookmark by id', () => { });

    describe('Delete bookmark by id', () => { });

  });

})