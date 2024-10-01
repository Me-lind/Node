import { assert } from "chai";
import {directoryToTree} from './traversingDirectoryTree.js';

export function runTest(rootDir, depth, expected) {
    const actual = directoryToTree(rootDir, depth);
    assert.deepEqual(actual, expected, `Test failed for rootDir: ${rootDir} and depth: ${depth}`);
}
