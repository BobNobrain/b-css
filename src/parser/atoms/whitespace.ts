import { ParsingContext } from '../types';
import { SyntaxParseError } from '../ParseError';

const WHITESPACE_CHARS = ' \t';
const WHITESPACE_AND_NEWLINE_CHARS = ' \t\r\n';

interface WhitespaceRuleOptions {
    required: boolean;
    allowMultiline: boolean;
}

export const OPTIONAL: WhitespaceRuleOptions = { required: false, allowMultiline: true };
export const REQUIRED: WhitespaceRuleOptions = { required: true, allowMultiline: true };
export const OPTIONAL_IN_LINE: WhitespaceRuleOptions = { required: false, allowMultiline: false };
export const REQUIRED_IN_LINE: WhitespaceRuleOptions = { required: true, allowMultiline: false };

/**
 * Reads any whitespace
 * @param ctx Parsing context
 * @param required If should read at least one whitespace
 * @returns true if at least one char was consumed
 */
export default function whitespace(
    ctx: ParsingContext,
    { required, allowMultiline }: WhitespaceRuleOptions = OPTIONAL,
): boolean {
    let { caret } = ctx;
    const n = ctx.source.length;
    const allowedChars = allowMultiline ? WHITESPACE_AND_NEWLINE_CHARS : WHITESPACE_CHARS;

    while (caret < n) {
        const next = ctx.source[caret];
        if (allowedChars.includes(next)) {
            ++caret;
        } else {
            break;
        }
    }

    const consumed = caret - ctx.caret;

    if (required && !consumed) {
        throw new SyntaxParseError(ctx, 'some whitespace');
    }

    ctx.increment(consumed);
    return consumed > 0;
}
