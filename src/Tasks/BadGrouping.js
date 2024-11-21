import {Task} from "../Task.js"
import {generateDataset, randomSortDirection} from "../utils.js"
import {MongoClient } from "mongodb"

export default class BadGrouping extends Task {
  constructor({ targetDatabase, collection }) {
    super(targetDatabase)
    this.client = new MongoClient(this.targetDatabase.uri)
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

    await this.client.connect()
    this.testDb = await this.client.db("test")
    this.usersCollection = await testDb.collection("users")
    
    await this.testDb.drop()

    for (let batch of dataset) {
      await this.usersCollection.insertMany(batch)
    }

    await this.usersCollection.createIndex({ name: 1, gender: 1 })
    await this.usersCollection.createIndex({ occupation: 1, ethAccounts: 1 })
    await this.usersCollection.createIndex({ currentAddress: 1 })
  }

  async run() {
    await this.usersCollection.aggregate([
      { $unwind: "historicalAddresses" },
      { $unwind: "ethAccounts" },
      {
        $group: {
          "_id": "$historicalAddresses.city",
          "customersEverInCity": {
            $sum: 1
          },
          "countCurrentlyInCity": {
            $sum: {
              $cond: {
                if: {
                  $eq: [
                    "$historicalAddresses.city",
                    "$currentAddress.city"
                  ]
                },
                then: 1,
                else: 0
              }
            }
          },
          "wallets": {
            $addToSet: "$ethAccounts"
          },


        }
      }
    ])
  }

  cleanup() { }

  execute() {
    this.setup()
    this.run()
    this.cleanup()
  }
}
