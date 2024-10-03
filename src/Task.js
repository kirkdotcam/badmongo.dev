import {randomUUID} from "node:crypto"

export default class Task {
  constructor({targetDatabase}){
    this.id = randomUUID()
    this.targetDatabase = targetDatabase
  }

  setup(){}

  run(){}

  cleanup(){}

  execute(){
    throw Error(`Task ${this.id} failed. All tasks must have an execute`)
  }

  errorHandle(){}
}
