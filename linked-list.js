class Node {
    constructor(data, next) {
        this._data = data;
        this._next = next;
    }

    //Underscores are used to create backing states. Otherwise, a stack overflow will occur.
    //The basic idea is that we want the name of the field as we store it to be slightly different from the 
    //name through which it is accessed or set.
    get data() {
        return this._data;
    }

    get next() {
        return this._next;
    }

    set next(next) {
        this._next = next;
    }

    set data(data) {
        this._data = data;
    }
}

class LinkedList {
    constructor() {
        this._head = null;
        this._size = 0;
    }

    get size() {
        return this._size;
    }

    set size(s) {
        this._size = s;
    }

    //Add a node to the back of the linked list
    addToBack(data) {
        if(this._head === null) {
            this._head = new Node(data, null);
        } else {
            let current = this._head;

            while(current.next != null) {
                current = current.next;
            }

            current.next = new Node(data, null);
        }

        this._size++;
    }

    //Add a node to the front of the linked list
    addToFront(data) {
        if(this._head === null) {
            this._head = new Node(data, null);
        } else {
            let oldHead = this._head;

            this._head = new Node(data, oldHead);
        }

        this.size++;
    }

    //Remove a node from the front of the linked list and return its data
    removeFromFront() {
        if(this._head == null) {
            return null;
        } else {
            let retValue = this._head.data;
            this._head = this._head.next;

            this._size--;

            return retValue;
        }
    }

    //Remove a node from the back of the linked list and return its data
    removeFromBack() {
        if(this._head == null) {
            return null;
        } else {
            let current = this._head;
            let previous = null;

            while(current.next !== null) {
                previous = current;
                current = current.next;
            }

            if(previous === null) { //We are removing the head
                let retValue = this._head.data;
                this._head = null;

                this._size--;
                return retValue;
            } else {
                let retValue = current.data;
                previous.next = null;

                this._size--;
                return retValue;
            }
        }
    }
}

exports.LinkedList =  LinkedList;
