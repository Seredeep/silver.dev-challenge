const HEAD_KEY = Symbol('head');
const TAIL_KEY = Symbol('tail');

class ListNode {
    key: number | symbol;
    value: number;
    prev: ListNode | null = null;
    next: ListNode | null = null;

    constructor(key: number | symbol, value: number) {
        this.key = key;
        this.value = value;
    }
}

export class LRUCache {
    capacity: number;
    cache: Map<number | symbol, ListNode>;
    head: ListNode;
    tail: ListNode;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map();
        this.head = new ListNode(HEAD_KEY, 0); // Dummy head with symbol key
        this.tail = new ListNode(TAIL_KEY, 0); // Dummy tail with symbol key
        this.head.next = this.tail;
        this.tail.prev = this.head;
        this.cache.set(HEAD_KEY, this.head);
        this.cache.set(TAIL_KEY, this.tail);
    }

    get(key: number): number {
        if (this.cache.has(key)) {
            const node = this.cache.get(key)!;
            this.moveToFront(node);
            return node.value;
        }
        return -1;
    }

    put(key: number, value: number): void {
        if (this.cache.has(key)) {
            const node = this.cache.get(key)!;
            node.value = value;
            this.moveToFront(node);
        } else {
            const newNode = new ListNode(key, value);
            this.cache.set(key, newNode);
            this.addToFront(newNode);
            if (this.cache.size > this.capacity + 2) { // +2 for dummy head and tail
                this.removeLRU();
            }
        }
    }

    private moveToFront(node: ListNode): void {
        this.removeNode(node);
        this.addToFront(node);
    }

    private addToFront(node: ListNode): void {
        this.head.next!.prev = node;
        node.prev = this.head;
        node.next = this.head.next;
        this.head.next = node;
    }

    private removeNode(node: ListNode): void {
        node.prev!.next = node.next;
        node.next!.prev = node.prev;
    }

    private removeLRU(): void {
        const lru = this.tail.prev!;
        this.removeNode(lru);
        this.cache.delete(lru.key as number); // Cast to number since we know LRU node will not be a dummy
    }
}
