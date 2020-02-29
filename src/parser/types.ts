export type IndentCharacter = ' ' | '\t' | '';

export interface CodeLocation {
    readonly col: number;
    readonly line: number;
}

export type ParserBackup = Readonly<{
    caret: number;
    col: number;
    line: number;
    indent: number;
    indentChar: IndentCharacter;
}>;

export type ParsingContext = Readonly<{
    source: string;
    filename: string;

    increment(length: number): void;
    backup(): ParserBackup;
    restore(backup: ParserBackup): void;

    saveLocation(): CodeLocation;
}> & ParserBackup;

export type Parser<T, Args extends unknown[]> = (ctx: ParsingContext, ...args: Args) => T;

export interface AstNode {
    start: CodeLocation;
    end: CodeLocation;
}
