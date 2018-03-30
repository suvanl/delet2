declare const Discord: any;
declare const promisify: any;
declare const readdir: any;
declare const Enmap: any;
declare const EnmapLevel: any;
declare const klaw: any;
declare const path: any;
declare class Delet extends Discord.Client {
    constructor(options: any);
    permlevel(message: any): number;
    loadCommand(commandPath: any, commandName: any): string | false;
    unloadCommand(commandPath: any, commandName: any): Promise<string | false>;
    getSettings(id: any): {};
    writeSettings(id: any, newSettings: any): void;
}
declare const client: any;
declare const init: () => Promise<void>;
