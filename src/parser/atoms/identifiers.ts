import { ParsingContext } from '../types';
import { SyntaxParseError } from '../ParseError';


const CODE_A_LOWER = 'a'.charCodeAt(0);
const CODE_Z_LOWER = 'z'.charCodeAt(0);
const CODE_A_UPPER = 'A'.charCodeAt(0);
const CODE_Z_UPPER = 'Z'.charCodeAt(0);
const UNDERSCORE = '_';
const HYPHEN = '-';

const EXPECTATIONS = {
    false: {
        false: 'an alphabetical identifier',
        true: 'a kebab-cased identifier',
    },
    true: {
        false: 'a snake-cased identifier',
        true: 'an identifier',
    },
};

type StringifiedBoolean = 'true' | 'false';


export default function identifier(ctx: ParsingContext, allowSnake = false, allowKebab = false): string {
    const n = ctx.source.length;
    let { caret } = ctx;

    while (caret < n) {
        const next = ctx.source[caret];

        if (allowSnake && next === UNDERSCORE
            || allowKebab && next === HYPHEN) {
            ++caret;
            continue;
        }

        const code = next.charCodeAt(0);
        if (CODE_A_LOWER <= code && code <= CODE_Z_LOWER
            || CODE_A_UPPER <= code && code <= CODE_Z_UPPER) {
            ++caret;
            continue;
        }

        break;
    }

    const consumed = caret - ctx.caret;

    if (!consumed) {
        throw new ParseError(
            ctx,
            EXPECTATIONS[String(allowSnake) as StringifiedBoolean][String(allowKebab) as StringifiedBoolean],
        );
    }

    const result = ctx.source.substring(ctx.caret, caret);
    ctx.increment(consumed);
    return result;
}
