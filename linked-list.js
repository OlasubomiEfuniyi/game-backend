class Node {
    constructor(data, next) {
        this.data = data;
        this.next = next;
    }

    get data() {
        return this.data;
    }

    get next() {
        return this.next;
    }

    setNext(next) {
        this.next = next;
    }

    setData(data) {
        this.data = data;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    get size() {
        return this.size;
    }

    //Add a node to the back of the linked list
    addToBack(data) {
        if(this.head === null) {
            this.head = new Node(data, null);
        } else {
            let current = this.head;

            while(current.next != null) {
                current = current.next;
            }

            current.next = new Node(data, null);
        }

        this.size++;
    }

    //Add a node to the front of the linked list
    addToFront(data) {
        if(this.head === null) {
            this.head = new Node(data, null);
        } else {
            let oldHead = this.head;

            this.head = new Node(data, oldHead);
        }

        this.size++;
    }

    //Remove a node from the front of the linked list and return its data
    removeFromFront() {
        if(this.head == null) {
            return null;
        } else {
            let retValue = this.head.data;
            this.head = this.head.next;

            this.size--;

            return retValue;
        }
    }

    //Remove a node from the back of the linked list and return its data
    removeFromBack() {
        if(this.head == null) {
            return null;
        } else {
            let current = this.head;
            let previous = null;

            while(current.next !== null) {
                previous = current;
                current = current.next;
            }

            if(previous === null) { //We are removing the head
                let retValue = this.head.data;
                this.head = null;

                this.size--;
                return retValue;
            } else {
                let retValue = current.data;
                previous.setNext(null);

                this.size--;
                return retValue;
            }
        }
    }
}

exports.LinkedList =  LinkedList;
