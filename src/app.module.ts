import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { HasuraModule } from '@golevelup/nestjs-hasura';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { HouseModule } from './house/house.module';
import { GraphQLModule } from '@nestjs/graphql';
import { UserService } from './user/user.service';
import { SdkModule } from './sdk/sdk.module';
import * as path from 'path';
@Module({
  imports: [
    AuthModule,
    PaymentModule,
    HouseModule,
    SdkModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HasuraModule.forRoot(HasuraModule, {
      webhookConfig: {
        /**
         * The value of the secret Header. The Hasura module will ensure that incoming webhook payloads contain this
         * value in order to validate that it is a trusted request
         */
        secretFactory: 'super_secret',
        /** The name of the Header that Hasura will send along with all event payloads */
        secretHeader: 'nestjs-event-webhook',
      },
      managedMetaDataConfig: {
        metadataVersion: 'v3',
        dirPath: path.join(process.cwd(), 'metadata'),
        secretHeaderEnvName: 'NESTJS_EVENT_WEBHOOK_SHARED_SECRET',
        nestEndpointEnvName: 'NESTJS_EVENT_WEBHOOK_ENDPOINT',
        defaultEventRetryConfig: {
          intervalInSeconds: 15,
          numRetries: 3,
          timeoutInSeconds: 100,
          toleranceSeconds: 21600,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
