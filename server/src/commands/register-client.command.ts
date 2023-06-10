import { Command, CommandRunner, Option } from 'nest-commander';
import { ClientService } from 'src/services/client.service';

interface RegisterClientCommandOptions {
  type: string;
  redirectUrls: Array<string>;
}

@Command({ name: 'client:register' })
export class RegisterClientCommand extends CommandRunner {
  constructor(private readonly clientService: ClientService) {
    super();
  }

  async run(
    passedParam: string[],
    options: RegisterClientCommandOptions,
  ): Promise<void> {
    const { client, secret } = await this.clientService.registerClient(
      options as any,
    );

    console.dir({
      clientId: client.id,
      clientSecret: secret,
    });
  }

  @Option({
    flags: '-t, --type [type]',
    description: 'Client type',
    required: true,
  })
  parseType(option: string) {
    return option;
  }

  @Option({
    flags: '-r, --redirect-urls [string]',
    description: 'Client redirect urls',
    required: true,
  })
  parseCallbackUrls(val: string): Array<string> {
    return val.split(',');
  }
}
