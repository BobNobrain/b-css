import { ParsingContext } from './types';


function cutNeighbourhood(ctx: ParsingContext, size = 10): string {
    const neighbourhood = ctx.source.substring(ctx.caret - size, ctx.caret + size + 1);

    if (ctx.caret + size >= ctx.source.length) {
        return JSON.stringify(neighbourhood) + '<EOF>';
    }

    return JSON.stringify(neighbourhood);
}

export class ParseError extends Error {
    protected ctx: ParsingContext;

    constructor(ctx: ParsingContext) {
        super('ParseError');
        this.ctx = ctx;
    }

    formatMessage(msg: string): string {
        return [
            msg,
            `    at ${this.ctx.filename}:${this.ctx.line}:${this.ctx.col}`,
            `    near "${cutNeighbourhood(this.ctx)}"`,
        ].join('\n');
    }

    // eslint-disable-next-line class-methods-use-this
    finalize() {
        throw new TypeError('ParseError cannot be finalized');
    }
}

export class SyntaxParseError extends ParseError {
    private expected: string;
    private got: string | undefined;

    constructor(ctx: ParsingContext, expected: string, got?: string) {
        super(ctx);
        this.expected = expected;
        this.got = got;
    }

    finalize() {
        this.message = this.formatMessage(
            `Expected ${this.expected}, but got ${this.got || this.ctx.source[this.ctx.caret] || 'EOF'}`,
        );
    }
}

export class IndentationParseError extends ParseError {
    private expectedIndent: string | number;

    constructor(ctx: ParsingContext, expectedIndent: string | number) {
        super(ctx);
        this.expectedIndent = expectedIndent;
    }

    finalize() {
        const expected = typeof this.expectedIndent === 'number'
            ? `of ${this.expectedIndent}`
            : this.expectedIndent;

        this.message = this.formatMessage(
            `Expected indent ${expected}, but encountered ${this.ctx.indent}`,
        );
    }
}
