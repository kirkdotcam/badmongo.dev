import {Task} from "../Task.js"
import {createRandomIndexDoc, generateDataset, randomSortDirection} from "../utils.js"
import {MongoClient} from "mongodb"

export default class BadIdxNumIdxes extends Task{
  constructor({targetDatabase}){
    super({targetDatabase})
    this.client = new MongoClient(this.targetDatabse.uri)
  }
  async setup(
  ){
    await this.client.connect()
    this.testDb = await this.client.db("test")
    this.usersCollection = await testDb.collection("users")

    await this.usersCollection.dropCollection()

    
  let dataset1 = generateDataset({
      numDocs: 10_000,
      numBatches: 10,
      typeOfData: "person",
      additionalParams: {
        numWallets: 5,
        numAddress: 10
      }
    })
   
  for (let i = 0; i < 25; i++) {
    db.usersCollection.createIndex(createRandomIndexDoc())
    }
  }
  async run(){}
  async cleanup(){}
  async execute(){}

  }
