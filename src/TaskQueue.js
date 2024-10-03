export class TaskQueue {
  constructor(){
    this.queue = []
  }

  addTask(task){
    this.queue.push(task)
  }

  takeTask(){
    return this.queue.shift()
  }
}
