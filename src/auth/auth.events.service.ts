import {
  HasuraInsertEvent,
  TrackedHasuraEventHandler,
} from '@golevelup/nestjs-hasura';
import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { User } from '../sdk/sdk';

@Injectable()
export class AuthEventsService {
  constructor(private readonly emailService: EmailService) {}

  @TrackedHasuraEventHandler({
    schema: 'public',
    tableName: 'user',
    triggerName: 'user-created',
    definition: {
      type: 'insert',
    },
  })
  userCreated(evt: HasuraInsertEvent<User>) {
    this.emailService.sendEmail(evt.event.data.new.email, 'Welcome!');
  }
}
