declare namespace ClouldFileType {
    export interface Model {
        name: string;
        parentId: string;
        isFolder: boolean;
        path: string;
        createdAt: Date;
        updateAt: Date;
        creatorId: string;
        size: number;
    }
}
