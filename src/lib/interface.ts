export type PistonRequest = {
    "language": string,
    "version": string,
    "files": { content: string }[],
    "stdin"?: string,
    "args"?: string[],
    "compile_timeout"?: number,
    "run_timeout"?: number,
    "compile_memory_limit"?: number,
    "run_memory_limit"?: number
}