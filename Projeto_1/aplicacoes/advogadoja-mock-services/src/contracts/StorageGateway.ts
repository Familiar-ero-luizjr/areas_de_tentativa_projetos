export interface StorageGateway { upload(path: string, content: Blob | string): Promise<{ path:string; url:string }>; remove(path:string): Promise<boolean>; }
