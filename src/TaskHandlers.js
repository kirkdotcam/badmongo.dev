import BadLookup from "./Tasks/BadLookup.js"
import BadIdxNumIdxes from "./Tasks/BadIdxNumIdxes.js"
import BadGrouping from "./Tasks/BadGrouping.js"
import PureCollScan from "./Tasks/PureCollScan.js"


const taskHandlers = {
  "BADLOOKUP": BadLookup,
  "BADGROUPING": BadGrouping,
  "BADIDXNUMIDXES": BadIdxNumIdxes,
  "PURECOLLSCAN": PureCollScan
}


export default taskHandlers
