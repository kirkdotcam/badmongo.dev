export class TaskQueue {
  constructor(){
    this.queue = []
    this.length = 0
  }

  addTask(task){
    //TODO: make sure task is of the Task data type
    this.queue.push(task)
    this.length++
  }

  takeTask(){
    this.length--
    return this.queue.shift()
  }
}
