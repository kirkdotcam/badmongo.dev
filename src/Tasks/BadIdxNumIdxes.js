import { Task } from "../Task.js"
import { createRandomIndexDoc, generateDataset } from "../utils.js"
import { MongoClient } from "mongodb"

export default class BadIdxNumIdxes extends Task {
  constructor({ targetDatabase }) {
    super({ targetDatabase })
    this.client = new MongoClient(this.targetDatabse.uri)
  }
  async setup(
  ) {
    await this.client.connect()
    this.testDb = this.client.db("test")
    this.usersCollection = await testDb.collection("users")
    this.taskCollection = await testDb.collection("task")

    await this.taskCollection.dropCollection()
    await this.taskCollection.insertOne({
      "task": "Chief developer complaint is that inserts and updates are running slowly on the users collection"
    })

    await this.usersCollection.dropCollection()

    for (let i = 0; i < 25; i++) {
      db.usersCollection.createIndex(createRandomIndexDoc())
    }


  }
  async run() {

    let dataset = generateDataset({
      numDocs: 1_000_000,
      numBatches: 100,
      typeOfData: "person",
      additionalParams: {
        numWallets: 5,
        numAddress: 10
      }
    })

    for (let batch of dataset) {
      await this.usersCollection.insertMany(batch)
    }

    let bulkWrites = []

    let opChoices = ["updateMany", "updateOne", "deleteOne"]
    for (let x = 0; x < 200; x++) {
      let operationDoc = {}

      let opChoice = opChoices[Math.floor(Math.random() * opChoices.length + 1)]

      switch (opChoice) {
        case "updateMany":
          operationDoc = {
            updateMany: {
              filter: {
                accountTotal: { $lt: 300 }
              },
              update: {
                $inc: { accountTotal: 20 }
              }
            }
          }
          break;
        case "updateOne":
          operationDoc = {
            updateOne: {
              filter: {
                accountTotal: { $lt: 300 }
              },
              update: {
                $mul: { accountTotal: 20 }
              }
            }
          }
          break;
        case "deleteOne":
          operationDoc = {
            deleteOne: {
              filter: { $lt: 10_000 }
            }
          }
          break;
      }

      bulkWrites.push(operationDoc)
    }

    await this.usersCollection.bulkWrite(bulkWrites, { ordered: false })
  }

}
