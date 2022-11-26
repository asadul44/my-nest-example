import { Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';
import { GqlSdk, InjectSdk } from '../sdk/sdk.module';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

gql`
  mutation createUser($input: user_insert_input!) {
    insert_user_one(object: $input) {
      id
    }
  }

  query findUserByEmail($email: String!) {
    user(where: { email: { _eq: $email } }) {
      id
      password
    }
  }
`;

export interface LoginUserArgs {
  email: string;
  password: string;
}

export interface RegisterUserArgs {
  email: string;
  displayName?: string;
  password: string;
}

export interface LoginOrRegisterUserOutput {
  token?: string;
  error?: string;
}

export type HasuraJwtClaims<
  // eslint-disable-next-line @typescript-eslint/ban-types
  CustomClaims extends Record<string, string | string[]> = {},
> = {
  'https://hasura.io/jwt/claims': {
    'x-hasura-default-role': string;
    'x-hasura-allowed-roles': string[];
  } & CustomClaims;
};

export type UserJwtClaims = HasuraJwtClaims<{ 'x-hasura-user-id': string }>;

@Injectable()
export class AuthService {
  constructor(
    @InjectSdk() private readonly sdk: GqlSdk,
    private readonly jwtService: JwtService,
  ) {}

  public async login(args: LoginUserArgs): Promise<any> {
    const { email, password } = args;
    const { user } = await this.sdk.findUserByEmail({
      email,
    });
    const foundUser = user?.[0];
    if (!foundUser) {
      return {
        error: `Could not find user for email ${email}`,
      };
    }
    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatch) {
      return {
        error: 'Email and password do not match',
      };
    }
    const token = await this.signHasuraToken(foundUser.id);
    return {
      token,
    };
  }
  public async registerUser(
    args: RegisterUserArgs,
  ): Promise<LoginOrRegisterUserOutput> {
    const {
      email,
      password,
      displayName = 'Apparently, this user prefers to keep an air of mystery about them',
    } = args;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    try {
      const { insert_user_one } = await this.sdk.createUser({
        input: {
          email,
          password: hashedPassword,
          display_name: displayName,
        },
      });
      console.log(insert_user_one, 'user');
      const { id } = insert_user_one;

      const token = await this.signHasuraToken(id);
      console.log(token, 'token');
      return {
        token,
      };
    } catch (e) {
      console.log(e?.message, 'e?.message');
      const error = (e?.message as string)?.includes(
        'unique constraint "users_email_key"',
      )
        ? 'That email address is already registered'
        : 'Something unexpected happened. Please try again later';
      return {
        error,
      };
    }
  }

  private signHasuraToken(userId: number) {
    console.log(userId, 'fgdfdfdrer');
    const payload: UserJwtClaims = {
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': ['user', 'admin'],
        'x-hasura-default-role': 'admin',
        'x-hasura-user-id': String(userId),
      },
    };
    console.log(payload, 'ewee');
    return this.jwtService.signAsync(payload);
  }
}
