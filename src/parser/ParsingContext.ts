import {
    ParsingContext as IParsingContext,
    ParserBackup,
    IndentCharacter,
    CodeLocation,
} from './types';


const SPACE = ' ';
const TAB = '\t';
const CR = '\r';
const LF = '\n';

export default class ParsingContext implements IParsingContext {
    readonly source: string;
    readonly filename: string;

    /** Index of next char in source that still was not processed */
    caret: number;
    /** Column number in current line */
    col: number;
    /** Line number */
    line: number;
    /** Indent level */
    indent: number;
    /** Char used for indentation */
    indentChar: IndentCharacter;

    constructor(source: string, filename = '(unknown)') {
        this.caret = 0;
        this.col = 1;
        this.line = 1;
        this.indent = 0;
        this.indentChar = '';

        this.source = source;
        this.filename = filename;
    }

    increment(length: number): void {
        const end = Math.min(this.source.length, this.caret + length);
        let previousWasCR = this.source[this.caret - 1] === CR;

        while (this.caret < end) {
            const next = this.source[this.caret];
            let newLine = false;

            switch (next) {
                case SPACE:
                case TAB:
                    if (this.indentChar === '') {
                        this.indentChar = next;
                        ++this.indent;
                    } else if (this.indentChar === next) {
                        ++this.indent;
                    }
                    break;

                case LF:
                    newLine = !previousWasCR;
                    break;

                case CR:
                    newLine = true;
                    break;
            }

            previousWasCR = next === CR;

            if (newLine) {
                ++this.line;
                this.col = 0;
                this.indent = 0;
            }

            ++this.caret;
            ++this.col;
        }
    }

    backup(): ParserBackup {
        return {
            caret: this.caret,
            col: this.col,
            line: this.line,
            indent: this.indent,
            indentChar: this.indentChar,
        };
    }
    restore(backup: ParserBackup): void {
        Object.assign(this, backup);
    }

    saveLocation(): CodeLocation {
        return {
            line: this.line,
            col: this.col,
        };
    }
}
