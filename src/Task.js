import { randomUUID } from "node:crypto"

export default class Task {
  constructor({ targetDatabase }) {
    this.id = randomUUID()
    this.targetDatabase = targetDatabase
  }

  async setup() { }

  async run() { }

  async cleanup() { }

  async execute() {
    // throw Error(`Task ${this.id} failed. All tasks must have an execute`)
    console.log(`setting up task`)
    await setup()
    console.log(`running task`)
    await run()
    console.log(`cleaning up task`)
    await cleanup()

  }

  errorHandle() { }
}
