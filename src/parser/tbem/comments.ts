import { ParsingContext, AstNode } from '../types';
import whitespace from '../atoms/whitespace';
import ParseError from '../ParseError';

export interface CommentNode extends AstNode {
    multiline: boolean;
    content: string;
}

const SINGLE_COMMENT_START = '//';
const MULTILINE_COMMENT_START = '/*';
const MULTILINE_COMMENT_END = '*/';

function readComment(ctx: ParsingContext): CommentNode {
    const startLoc = ctx.saveLocation();
    ctx.increment(SINGLE_COMMENT_START.length);
    const start = ctx.caret;
    let { caret } = ctx;
    let commentEndLength = 0;
    const n = ctx.source.length;

    while (caret < n) {
        const current = ctx.source[caret];
        ++caret;

        if (current === '\n') {
            commentEndLength = 1;
            break;
        }

        if (current === '\r') {
            const next = ctx.source[caret];
            commentEndLength = 1;
            if (next === '\n') {
                ++caret;
                commentEndLength = 2;
            }
            break;
        }
    }

    ctx.increment(caret - start);

    return {
        start: startLoc,
        end: ctx.saveLocation(),
        multiline: false,
        content: ctx.source.substring(start, caret - commentEndLength),
    };
}

function readMultilineComment(ctx: ParsingContext): CommentNode {
    const startLoc = ctx.saveLocation();
    ctx.increment(MULTILINE_COMMENT_START.length);
    const start = ctx.caret;
    let { caret } = ctx;
    const n = ctx.source.length;

    while (caret < n) {
        const next2 = ctx.source.substr(caret, 2);

        if (next2 === MULTILINE_COMMENT_END) {
            caret += 2;
            break;
        }

        ++caret;
    }

    ctx.increment(caret - start);

    return {
        start: startLoc,
        end: ctx.saveLocation(),
        multiline: true,
        content: ctx.source.substring(start, ctx.caret - MULTILINE_COMMENT_END.length),
    };
}

export default function commentsOrWhitespace(ctx: ParsingContext, required: boolean): CommentNode[] {
    const n = ctx.source.length;
    const result: CommentNode[] = [];

    while (ctx.caret < n) {
        const next2 = ctx.source.substr(ctx.caret, 2);

        switch (next2) {
            case SINGLE_COMMENT_START:
                result.push(readComment(ctx));
                break;

            case MULTILINE_COMMENT_START:
                result.push(readMultilineComment(ctx));
                break;

            default:
                if (required && !result.length) {
                    throw new ParseError(ctx, 'whitespace or comments');
                }
                return result;
        }

        whitespace(ctx, false);
    }

    if (required && !result.length) {
        throw new ParseError(ctx, 'whitespace or comments');
    }
    return result;
}
