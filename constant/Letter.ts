export default class Letter {
    constructor(public value: string, public state: string = 'none') { }
  
    isEmpty(): Boolean {
      return this.value.length == 0
    }
  }