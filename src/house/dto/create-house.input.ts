import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateHouseInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  house_name: number;
}
