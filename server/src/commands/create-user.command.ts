import { Command, CommandRunner, Option } from 'nest-commander';
import { UserService } from 'src/services/user.service';

interface CreateUserCommandOptions {
  username: string;
  password: string;
}

@Command({ name: 'user:create' })
export class CreateUserCommand extends CommandRunner {
  constructor(private readonly userService: UserService) {
    super();
  }

  async run(
    passedParam: string[],
    options: CreateUserCommandOptions,
  ): Promise<void> {
    const user = await this.userService.createUser(options as any);

    console.log(`User ${user.username} has been created.`);
  }

  @Option({
    flags: '-u, --username [string]',
    required: true,
  })
  parseUsername(value: string) {
    return value;
  }

  @Option({
    flags: '-p, --password [string]',
    required: true,
  })
  parsePassword(value: string): string {
    return value;
  }
}
