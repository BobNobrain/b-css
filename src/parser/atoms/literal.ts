import { ParsingContext } from '../types';
import ParseError from '../ParseError';

export default function literal<L extends string>(ctx: ParsingContext, content: L): L {
    const part = ctx.source.substr(ctx.caret, content.length);

    if (part !== content) {
        throw new ParseError(ctx, JSON.stringify(content), part);
    }

    ctx.increment(content.length);
    return content;
}
