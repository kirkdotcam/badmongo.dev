
/**
 * get all the targets from the json file, make targetDatabase objects of each
 * dry-run: ping connections
 * randomly generate a bunch of tasks for all of those targets
 * assign all to task queue
 * begin execution
 */

import targets from "./targets.json" with {type: "json"}
import { TaskQueue } from "./src/TaskQueue.js"
import { TargetDatabase } from "./src/TargetDatabase.js"
import BadIdxNumIdxes from "./src/Tasks/BadIdxNumIdxes.js"
import BadLookup from "./src/Tasks/BadLookup.js"
import TaskHandlers from "./src/TaskHandlers.js"
import cluster from "node:cluster"
import process from "node:process"
import os from "node:os"


let taskQueue = new TaskQueue()

let targetDatabaseArray = targets.map((target) => new TargetDatabase(target))

taskQueue.addTask(
    new BadLookup({ targetDatabase: targetDatabaseArray[0] })
)

if (cluster.isPrimary) {
    console.log(`primary: ${process.pid}`)

    for (let i = 0; i < targetDatabaseArray.length; i++) {
        const worker = cluster.fork()

        worker.on("message", (msg) => {
            if (msg === "requestTask") {
                if (taskQueue.length < 1) {
                    worker.send({ task: null })
                }

                console.log("sending worker task")
                const task = taskQueue.takeTask()
                worker.send(task)

            }

        })
    }


    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    })

} else {
    console.log(`starting ${process.pid}`)

    process.on("message", async (task) => {
        if (task.id) {
            console.log(`worker ${process.pid} recieved task ${task.id}`)

            let taskToExecute = await new TaskHandlers[task.taskType](task)

            await taskToExecute.execute()
        } else {
            console.log(`worker ${process.pid} did not recieve tasks`)
            process.exit()
        }
    })

    process.send('requestTask')
}



