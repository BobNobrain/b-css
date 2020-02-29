import { ParsingContext } from './types';


function cutNeighbourhood(ctx: ParsingContext, size = 10): string {
    const neighbourhood = ctx.source.substring(ctx.caret - size, ctx.caret + size + 1);

    if (ctx.caret + size >= ctx.source.length) {
        return JSON.stringify(neighbourhood) + '<EOF>';
    }

    return JSON.stringify(neighbourhood);
}

export default class ParseError extends Error {
    private ctx: ParsingContext;
    private expected: string;
    private got: string | undefined;

    constructor(ctx: ParsingContext, expected: string, got?: string) {
        super('ParseError');
        this.ctx = ctx;
        this.expected = expected;
        this.got = got;
    }

    finalize() {
        this.message = [
            `Expected ${this.expected}, but got ${this.got || this.ctx.source[this.ctx.caret] || 'EOF'}`,
            `    at ${this.ctx.filename}:${this.ctx.line}:${this.ctx.col}`,
            `    near "${cutNeighbourhood(this.ctx)}"`,
        ].join('\n');
    }
}
