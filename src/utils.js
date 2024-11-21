import { faker } from "@faker-js/faker"

/**
 * Generates a dataset of specified type and size.
 *
 * @param {Object} params - The parameters for generating the dataset.
 * @param {number} params.numDocs - The total number of documents to generate.
 * @param {number} params.numBatches - The number of batches to split the data into.
 * @param {string} params.typeOfData - The type of data to generate ('person', 'recipe', 'foodPairing').
 * @param {Object} params.additionalParams - Additional parameters to pass to the generation methods.
 * @returns {Array<Array<Object>>} An array containing batches of generated data.
 */
function generateDataset({
  numDocs,
  numBatches,
  typeOfData,
  additionalParams
}) {

  let batchSize = numDocs / numBatches

  let allData = []

  let generateMethod

  switch (typeOfData) {
    case "person":
      generateMethod = createPerson
      break
    case "recipe":
      generateMethod = createRecipe
      break
    case "foodPairing":
      generateMethod = createPairsWith
      break
    default:
      generateMethod = createPerson
  }

  for (let batch of [...Array(numBatches)]) {
    let generatedData = [...Array(batchSize)].map(() => generateMethod(additionalParams))

    allData.push(generatedData)
  }

  return allData
}

/**
 * Creates a random address object.
 *
 * @returns {Object} An object representing a random address.
 */
function createAddress() {
  return {
    address: faker.location.streetAddress(),
    location: [
      faker.location.latitude(),
      faker.location.longitude()
    ],
    city: faker.location.city(),
    state: faker.location.state(),
    zip: faker.location.zipCode(),
  }
}

/**
 * Creates a random person object.
 *
 * @param {number} [numWallets=4] - The number of Ethereum wallets to generate for the person.
 * @param {number} [numAddresses=1] - The number of historical addresses to generate for the person.
 * @returns {Object} An object representing a random person.
 */
function createPerson({ numWallets = 4, numAddresses }) {
  let newPerson = {
    name: faker.person.fullName(),
    gender: faker.person.gender(),
    sex: faker.person.sex(),
    occupation: faker.person.jobTitle(),
    bio: faker.person.bio(),
    ethAccounts: [...Array(numWallets)].map(() => faker.finance.ethereumAddress()),
    accountTotal: faker.number.float({ multiple: 0.25, max: 800, min: 10 })
  }

  if (numAddresses > 1) {
    newPerson.historicalAddresses = [...Array(numAddresses)].map(() => createAddress())
    newPerson.currentAddress = newPerson.historicalAddresses[0]
  } else {
    newPerson.currentAddress = createAddress()
  }
  return newPerson
}


/**
 * Creates a random recipe object.
 *
 * @param {number} [numVerbs=4] - The number of description verbs to generate for the recipe.
 * @returns {Object} An object representing a random recipe.
 */
function createRecipe({ numVerbs = 4 }) {
  return {
    item: faker.food.dish(),
    cuisine: faker.food.ethnicCategory(),
    description: faker.food.description(),
    descriptionVerbs: [...Array(numVerbs)].map(() => faker.food.adjective()),
    garnishOrSpin: [...Array(5)].map(() => faker.food.ingredient())

  }

}

/**
 * Creates a random pairing object.
 *
 * @param {number} [pairsWithDegree=1] - The number of ingredients to pair with.
 * @returns {Object} An object representing a random ingredient pairing.
 */
function createPairsWith({ pairsWithDegree = 1 }) {
  return {
    item: faker.food.ingredient(),
    pairsWith: [...Array(pairsWithDegree)].map(() => faker.food.ingredient())
  }
}

function randomSortDirection() {
  return Math.random() < 0.5 ? -1 : 1
}

function createRandomIndexDoc(fieldsArray, numIdxFields) {
  if (fieldsArray?.length < 1 || fieldsArray === undefined) {
    throw "no array for fields in create RandomIndexDoc"
  }

  if (!numIdxFields || typeof numIdxFields !== "number") {
    numIdxFields = Math.floor(Math.random() * fieldsArray.length + 1)
  }

  //when done, create index doc based from values
  //
  let fieldSet = new Set()

  while (fieldSet.size < numIdxFields) {
    let selectedField = fieldsArray[Math.floor(Math.random() * fieldsArray.length)]
    fieldSet.add(selectedField)
  }

  let newIndexDoc = {}

  for (let field of fieldSet) {
    newIndexDoc[field] = randomSortDirection()
  }

  return newIndexDoc
}

export {
  generateDataset,
  createAddress,
  createPairsWith,
  createPerson,
  createRecipe,
  randomSortDirection,
  createRandomIndexDoc
}

