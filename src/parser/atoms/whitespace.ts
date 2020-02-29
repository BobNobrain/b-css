import { ParsingContext } from '../types';
import ParseError from '../ParseError';

const WHITESPACE_CHARS = ' \t\r\n';

/**
 * Reads any whitespace
 * @param ctx Parsing context
 * @param required If should read at least one whitespace
 * @returns true if at least one char was consumed
 */
export default function whitespace(ctx: ParsingContext, required: boolean): boolean {
    let { caret } = ctx;
    const n = ctx.source.length;

    while (caret < n) {
        const next = ctx.source[caret];
        if (WHITESPACE_CHARS.includes(next)) {
            ++caret;
        } else {
            break;
        }
    }

    const consumed = caret - ctx.caret;

    if (required && !consumed) {
        throw new ParseError(ctx, 'some whitespace');
    }

    ctx.increment(consumed);
    return consumed > 0;
}
