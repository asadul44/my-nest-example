import { Inject, Module } from '@nestjs/common';
import {
  GraphQLRequestModule,
  GraphQLClientInject,
} from '@golevelup/nestjs-graphql-request';
import { ConfigService } from '@nestjs/config';
import { GraphQLClient } from 'graphql-request';
import { getSdk } from './sdk';

const SDK = 'SDK';

export type GqlSdk = ReturnType<typeof getSdk>;

export const InjectSdk = () => Inject(SDK);

@Module({
  imports: [
    GraphQLRequestModule.forRootAsync(GraphQLRequestModule, {
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // const endpoint = configService.get<string>(
        //   'http://localhost:8080/v1/graphql',
        // );
        // const secret = configService.get<string>(
        //   'FD92hRPHYH7tw7RpCbl93TokRibBnDJOqI6smi5okVkWE7teUNzeh3OfoE9MI2cy',
        // );
        const endpoint = 'http://localhost:8080/v1/graphql';
        // console.log(endpoint, secret);
        return {
          endpoint,
          options: {
            headers: {
              'content-type': 'application/json',
              'x-hasura-admin-secret':
                'FD92hRPHYH7tw7RpCbl93TokRibBnDJOqI6smi5okVkWE7teUNzeh3OfoE9MI2cy',
            },
          },
        };
      },
    }),
  ],
  providers: [
    {
      provide: SDK,
      inject: [GraphQLClientInject],
      useFactory: (client: GraphQLClient) => getSdk(client),
    },
  ],
  exports: [SDK],
})
export class SdkModule {}
