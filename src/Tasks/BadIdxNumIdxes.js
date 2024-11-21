import Task from "../Task.js"
import { createRandomIndexDoc, generateDataset } from "../utils.js"
import { MongoClient } from "mongodb"

export default class BadIdxNumIdxes extends Task {
  constructor({ targetDatabase }) {
    super({ targetDatabase })
    console.log(this.targetDatabase.uri)
    this.client = new MongoClient(this.targetDatabase.uri)
  }
  async setup(
  ) {
    await this.client.connect()
    this.testDb = this.client.db("test")
    this.usersCollection = await this.testDb.collection("users")
    this.tasksCollection = this.testDb.collection("task")

    await this.tasksCollection.drop()
    await this.tasksCollection.insertOne({
      "task": "Chief developer complaint is that inserts and updates are running slowly on the users collection"
    })

    await this.usersCollection.drop()

    for (let i = 0; i < 25; i++) {
      this.usersCollection.createIndex(createRandomIndexDoc(["name", "gender", "sex", "occupation", "accountTotal", "ethAccounts"]), 3)
    }


  }
  async run() {

    let dataset = generateDataset({
      numDocs: 10000,
      numBatches: 10,
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

      let opChoice = opChoices[Math.floor(Math.random() * opChoices.length)]

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
              filter: { accountTotal: { $lt: 10_000 } }
            }
          }
          break;
      }

      bulkWrites.push(operationDoc)
    }

    await this.usersCollection.bulkWrite(bulkWrites, { ordered: false })
  }

  async cleanup() { }
  async execute() {
    await this.setup()
    await this.run()
    await this.cleanup()
  }
}
