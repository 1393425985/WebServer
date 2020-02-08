declare namespace CacheDataType {
    export interface Model {
        _id: any;
        type: 'config';
        creator: any;
        data: {
            project: {
                packageCode: 'yarn' | 'npm';
                svnDays: number;
                patchPath: string;
                list: {
                    name: string;
                    type: 'npm' | 'folder';
                    path: string;
                    port: string;
                    scripts: {
                        npm: string[];
                        cmd: string[];
                    };
                }[];
            };
        };
    }
}
