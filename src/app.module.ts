import { Module } from '@nestjs/common';
import { HasuraModule } from '@golevelup/nestjs-hasura';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './payment/payment.module';
import { HouseModule } from './house/house.module';
import { GraphQLModule } from '@nestjs/graphql';
import { UserService } from './user/user.service';
import * as path from 'path';
@Module({
  imports: [
    PaymentModule,
    HouseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    // HasuraModule.forRoot(HasuraModule, {
    //   webhookConfig: {
    //     /**
    //      * The value of the secret Header. The Hasura module will ensure that incoming webhook payloads contain this
    //      * value in order to validate that it is a trusted request
    //      */
    //     secretFactory: 'secret',
    //     /** The name of the Header that Hasura will send along with all event payloads */
    //     secretHeader: 'secret-header',
    //   },
    //   managedMetaDataConfig: {
    //     metadataVersion: 'v3',
    //     dirPath: path.join(process.cwd(), 'hasura/metadata'),
    //     secretHeaderEnvName: 'DEV_JWT_SECRET',
    //     nestEndpointEnvName: 'NESTJS_BASE_URL',
    //     defaultEventRetryConfig: {
    //       intervalInSeconds: 15,
    //       numRetries: 3,
    //       timeoutInSeconds: 100,
    //       toleranceSeconds: 21600,
    //     },
    //   },
    // }),
  ],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
