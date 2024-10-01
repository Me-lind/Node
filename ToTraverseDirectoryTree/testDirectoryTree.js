import { config } from "chai";
import { runTest } from "./runtest.js";

// Set chai configuration options
config.truncateThreshold = 0;
import util from 'util';

util.inspect.defaultOptions.depth = null;

describe("Example Test Cases", () => {
    it("should work on a simple example", () => {
        const expected = {
            path: "dummy_dir\\a_dir",
            name: "a_dir",
            type: "dir",
            size: 0,
            children: [
                {
                    path: "dummy_dir\\a_dir\\test_file1.md",
                    name: "test_file1.md",
                    type: "file",
                    size: 0
                }
            ]
        };
        return runTest("dummy_dir/a_dir", 5, expected);
    });

    it("should work on a more complex example", () => {
        const expected = {
            path: "dummy_dir",
            name: "dummy_dir",
            type: "dir",
            size: 0,
            children: [
                {
                    path: "dummy_dir\\a_dir",
                    name: "a_dir",
                    type: "dir",
                    size: 0,
                    children: [
                        {
                            path: "dummy_dir\\a_dir\\test_file1.md",
                            name: "test_file1.md",
                            type: "file",
                            size: 0
                        }
                    ]
                },
                {
                    path: "dummy_dir\\b_dir",
                    name: "b_dir",
                    type: "dir",
                    size: 0,
                    children: [
                        {
                            path: "dummy_dir\\b_dir\\test_file2.md",
                            name: "test_file2.md",
                            type: "file",
                            size: 0
                        }
                    ]
                },
                {
                    path: "dummy_dir\\test_file0.md",
                    name: "test_file0.md",
                    type: "file",
                    size: 0
                }
            ]
        };
        return runTest("dummy_dir", 5, expected);
    });

    it("should work on a more complex example with depth limiting", () => {
        const expected = {
            path: "dummy_dir",
            name: "dummy_dir",
            type: "dir",
            size: 0,
            children: [
                {
                    path: "dummy_dir\\a_dir",
                    name: "a_dir",
                    type: "dir",
                    size: 0,
                    children: [
                        {
                            "name": "test_file1.md",
                            "path": "dummy_dir\\a_dir\\test_file1.md",
                            "size": 0,
                            "type": "file"
                        }
                    ]
                },
                {
                    path: "dummy_dir\\b_dir",
                    name: "b_dir",
                    type: "dir",
                    size: 0,
                    children: [
                        {
                            "name": "test_file2.md",
                            "path": "dummy_dir\\b_dir\\test_file2.md",
                            "size": 0,
                            "type": "file"
                        }
                    ]
                },
                {
                    path: "dummy_dir\\test_file0.md",
                    name: "test_file0.md",
                    type: "file",
                    size: 0
                }
            ]
        };
        return runTest("dummy_dir", 2, expected);
    });
});
