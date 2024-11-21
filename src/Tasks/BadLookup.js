import Task from "../Task.js"
import { MongoClient } from "mongodb"
import { generateDataset } from "../utils.js"

export default class BadLookup extends Task {
  constructor({ targetDatabase, collection }) {
    super({ targetDatabase })
    this.client = new MongoClient(this.targetDatabase.uri)
  }

  async setup() {

    const dataset = generateDataset({
      numDocs: 10_000,
      numBatches: 5,
      typeOfData: "foodPairing",
      additionalParams: {
        pairsWithDegree: 6
      }
    })

    await this.client.connect()
    this.testDb = this.client.db("test")
    this.pairingCollection = this.testDb.collection("foodPairing")
    // this.testDb.dropDatabase()

    for (let batch of dataset) {
      await this.pairingCollection.insertMany(batch)
    }

    this.tasksCollection = this.testDb.collection("task")

    await this.tasksCollection.drop()
    await this.tasksCollection.insertOne({
      "task": "Chief developer complaint is that their aggregation is running slowly"
    })

  }

  async run() {
    this.pairingCollection.aggregate([{
      $lookup: {
        from: "foodPairing",
        foreignField: "item",
        localField: "pairsWith",
        as: "pairedDocs"
      },
    }, {
      $out: "foodPairingMerged"
    }])
  }

  async cleanup() { }
  async execute() {
    await this.setup()
    await this.run()
    await this.cleanup()
  }
}
