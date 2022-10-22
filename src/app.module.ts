
import { ApolloDriver } from '@nestjs/apollo/dist/drivers';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { join } from 'path';
import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [

    ConfigModule.forRoot(),

    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [JwtService],
      useFactory: async (jwtService: JwtService) => ({
        playground: false,
        autoSchemaFile: join(process.cwd(), "src/schema.gql"),
        plugins: [
          ApolloServerPluginLandingPageLocalDefault
        ],
        context({ req }) {
          // const token = req.headers?.authorization?.replace("Bearer ", "");
          // if (!token) throw Error("Token needed");
          // 
          // const payload = jwtService.decode(token);
          // if (!payload) throw Error("Token not valid");
        }
      })
    }),

    // configuraicon basica para el grapql
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   playground: false,
    //   autoSchemaFile: join(process.cwd(), "src/schema.gql"),
    //   plugins: [
    //     ApolloServerPluginLandingPageLocalDefault
    //   ]
    // }),

    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true
    }),


    ItemsModule,

    UsersModule,

    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
