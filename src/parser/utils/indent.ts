import { ParsingContext } from '../types';
import { IndentationParseError } from '../ParseError';

export function assertIndentationGT(ctx: ParsingContext, minimal: number): void {
    if (ctx.indent <= minimal) {
        throw new IndentationParseError(ctx, `> ${minimal}`);
    }
}

export function assertIndentationGE(ctx: ParsingContext, minimal: number): void {
    if (ctx.indent < minimal) {
        throw new IndentationParseError(ctx, `>= ${minimal}`);
    }
}
