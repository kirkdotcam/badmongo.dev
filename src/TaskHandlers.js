import BadLookup from "./Tasks/BadLookup.js"
import BadIdxNumIdxes from "./Tasks/BadIdxNumIdxes.js"
import BadGrouping from "./Tasks/BadGrouping.js"


const taskHandlers = {
  "BADLOOKUP": BadLookup,
  "BADGROUPING": BadGrouping,
  "BADIDXNUMIDXES": BadIdxNumIdxes,
}

export default taskHandlers
