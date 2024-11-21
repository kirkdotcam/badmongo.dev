
/**
 * get all the targets from the json file, make targetDatabase objects of each
 * dry-run: ping connections
 * randomly generate a bunch of tasks for all of those targets
 * assign all to task queue
 * begin execution
 */

import targetData from "./targets.json" with {type: "json"}
import { TaskQueue } from "./src/TaskQueue.js"
import { TargetDatabase } from "./src/TargetDatabase.js"
import BadIdxNumIdxes from "./src/Tasks/BadIdxNumIdxes.js"
import BadLookup from "./src/Tasks/BadLookup.js"

let taskQueue = new TaskQueue()

let targetDataArray = targetData.map((target) => new TargetDatabase(target))
let newTask = new BadLookup({ targetDatabase: targetDataArray[0] })
newTask.execute()
