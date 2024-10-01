import fs from 'fs';
import path from 'path';

export function directoryToTree(rootDir, depth) {
    // Base case: If depth is 0, return only the root directory info
    if (depth < 0) {
        return null;
    }

    // Get the root directory stats
    const stats = fs.statSync(rootDir);

    // Create the root object with necessary properties
    const root = {
        name: path.basename(rootDir),
        path: path.relative(process.cwd(), rootDir),
        type: stats.isDirectory() ? 'dir' : 'file',
        size: stats.size
    };

    // If it's a directory and depth is not zero, populate children
    if (stats.isDirectory() && depth > 0) {
        root.children = fs.readdirSync(rootDir).map(child => {
            // For each child, call directoryToTree recursively, decreasing depth
            const childPath = path.join(rootDir, child);
            return directoryToTree(childPath, depth - 1);
        });
    }

    return root;
}
