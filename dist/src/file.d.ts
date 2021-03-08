export declare function copy(srcPath: string, dstPath: string): void;
export declare function deleteDir(dirPath: string): void;
export declare function deleteFile(filePath: string): void;
export declare function exists(filePath: string): boolean;
export declare function getDirList(dirPath: string): string[];
export declare function isDir(dirPath: string): boolean;
export declare function isFile(dirPath: string): boolean;
export declare function isSubDirOf(dir: string, parent: string): boolean;
export declare function makeDir(dirPath: string): void;
export declare function read(filePath: string): string;
export declare function write(filePath: string, data: string): void;
