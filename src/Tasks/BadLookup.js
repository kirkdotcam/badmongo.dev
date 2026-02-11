import Task from "../Task.js"
import { MongoClient } from "mongodb"
import { generateDataset } from "../utils.js"

export default class BadLookup extends Task {
  constructor({ targetDatabase, collection }) {
    super({ targetDatabase })
    this.dbURI = this.targetDatabase.uri
    this.taskType = "BADLOOKUP"
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

    this.client = await new MongoClient(this.dbURI).connect()

    this.testDb = this.client.db("test")
    this.pairingCollection = this.testDb.collection("foodPairing")
    this.pairingMergedCollection = this.testDb.collection("foodPairingMerged")
    this.pairingCollection.drop()
    this.pairingMergedCollection.drop()


    for (let batch of dataset) {
      await this.pairingCollection.insertMany(batch)
    }

    await this.pairingCollection.aggregate([
      { $set: { a: { $range: [0, 60] } } },
      { $unwind: "$a" },
      { $project: { a: 0, _id: 0 } },
      { $out: "foodPairing" }
    ]).toArray()

    this.tasksCollection = this.testDb.collection("task")

    await this.tasksCollection.drop()
    await this.tasksCollection.insertOne({
      "task": "Chief developer complaint is that their aggregation is running slowly"
    })

  }

  async run() {
    console.log("starting BadLookup run")
    await this.pairingCollection.aggregate([{
      $lookup: {
        from: "foodPairing",
        foreignField: "item",
        localField: "pairsWith",
        as: "pairedDocs"
      },
    }, {
      $out: "foodPairingMerged"
    }]).toArray()

    console.log("finishing BadLookup run")
  }

  async cleanup() {

  }
  async execute() {
    await this.setup()
    await this.run()
    await this.cleanup()
    return
  }
}
