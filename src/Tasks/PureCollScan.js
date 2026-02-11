import Task from "../Task.js"
import { MongoClient } from "mongodb"
import { generateDataset } from "../utils.js"

export default class PureCollScan extends Task {

  constructor({ targetDatabase }) {
    super({ targetDatabase })
    this.dbURI = this.targetDatabase.uri
    this.taskType = "PURECOLLSCAN"
  }

  async setup() {
    let dataset = generateDataset({
      numDocs: 1_000_000,
      numBatches: 1000,
      typeOfData: "person",
      additionalParams: {
        numWallets: 5,
        numAddress: 10
      }
    })


    this.client = await new MongoClient(this.dbURI).connect()
    this.testDb = this.client.db("test")
    this.usersCollection = await testDb.collection("users")

    await this.testDb.drop()

    for (let batch of dataset) {
      await this.usersCollection.insertMany(batch)
    }
  }
  async run() {

    for (let x = 0; x < 10_000; x++) {
      this.usersCollection.find({ occupation: "Hacker" })
      this.usersCollection.find({ accountTotal: { $gt: 300 } })
      this.usersCollection.find({ occupation: "Fireman", sex: "F" })
    }
  }
  async cleanup() { }
  async execute() {
    await this.setup()
    await this.run()
    await this.cleanup()
  }

}
