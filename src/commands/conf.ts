import {Command, flags} from '@oclif/command'
import * as Conf from 'conf'
import * as os from 'node:os'

export default class ConfCommand extends Command {
  static args = [
    {description: 'key of the config', name: 'key'},
    {description: 'value of the config', name: 'value'}
  ]

  static description = 'manage configuration'

  static flags = {
    delete: flags.boolean({char: 'd', description: 'delete?'}),
    help: flags.help({char: 'h'}),
    key: flags.string({char: 'k', description: 'key of the config'}),
    value: flags.string({char: 'v', description: 'value of the config'})
  }

  async run() {
    const {args, flags} = this.parse(ConfCommand)

    const config = new Conf({ projectName: this.config.name })

    const key = args.key || flags.key
    let value = args.value || flags.value

    if (key) {
      if (flags.delete) {
        config.delete(key)
      } else if (value) {
        config.set(key, value)
      } else {
        value = config.get(key)
        if (value !== null && value !== undefined) {
          this.print(value)
        }
      }
    } else {
      for (const c of config) {
        this.print(c[0] + os.EOL)
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private print(value: any) {
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }

    process.stdout.write(value)
  }
}
