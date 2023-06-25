export class CacheManager {

    private static readonly managers: { [cache_name: string]: CacheManager } = {}
    private readonly subcaches: Set<string> = new Set<string>()

    public static getInstance(name: string) {
        if (!this.managers[name]) this.managers[name] = new CacheManager(name);
        return this.managers[name];
    }

    public addSubCache(query: string, parameters: object) {
        const key = this.name + this.hash(query + JSON.stringify(parameters));
        this.subcaches.add(key);
        return key;
    }

    public getSubCaches(): string[] {
        return Array.from(this.subcaches)
    }

    public clearSubCaches(): void {
        this.subcaches.clear()
    }

    private constructor(
        private readonly name
    ) {
    }

    private hash(str: string) {
        let hash = 0, chr;
        if (str.length === 0) return hash;
        for (let i = 0, length = str.length; i < length; i++) {
            chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

}