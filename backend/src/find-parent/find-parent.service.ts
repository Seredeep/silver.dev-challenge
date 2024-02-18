import { Injectable } from '@nestjs/common';

export class File {
    children: File[];
    name: string;

    constructor(name) {
        this.children = [];
        this.name = name;
    }

    addChild(file) {
        this.children.push(file);
    }
}

export type parseInputResult = {
    root: File;
    p: File;
    q: File;
};

@Injectable()
export class FindParentService {
    /**
     * Finds the path from the root to the target file using a depth-first search
     */
    findPath(root: File, target: File): string[] | undefined {
        for (const file of root.children) {
            if (file.name === target.name) {
                return [root.name, file.name];
            }
            const path = this.findPath(file, target);
            if (path) {
                return [root.name, ...path];
            }
        }
    }

    /**
     * Finds the lowest common ancestor of two files
     *
     * Conceptual approach, actual implementation should use worker threads or some other form of parallelism
     *
     * Also, duplicated path names are not handled
     */
    findParent(root: File, p: File, q: File): string | undefined {
        const pathToP = this.findPath(root, p);
        const pathToQ = this.findPath(root, q);
        if (!pathToP || !pathToQ) {
            return undefined;
        }
        let i = 0;
        while (pathToP[i] === pathToQ[i]) {
            i++;
        }
        return pathToP[i - 1];
    }

    /**
     * Parse string input and return a File object
     */
    parseInput(root: string, p: string, q: string): parseInputResult {
        const result: Partial<parseInputResult> = {};

        const rootFile = new File('root');
        const files = root.split('/');

        for (const file of files) {
            const f = new File(file);
            rootFile.addChild(f);
            if (file === p) result.p = f;
            if (file === q) result.q = f;
        }

        if (!result.p || !result.q) {
            return undefined;
        }

        return result as parseInputResult;
    }
}
