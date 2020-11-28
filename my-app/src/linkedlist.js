const { findAllByLabelText } = require("@testing-library/react")

class LinkedList {
  constructor() {
    this.head = null
  }

  append(node) {
    if (!this.head) {
      this.head = new Node(null)
    } else {
      if (!this.head.next) {
        this.head.next = new Node(null)
      } else {
        while (this.head.next) {
          let last = this.head.next
          if (last.next) {
            last = last.next
          }
          last.next = new Node(null)
        }
      }
    }
  }

  get(index) {}
}

class Node {
  constructor(node) {
    this.next = node
  }
}
