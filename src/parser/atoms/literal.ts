import { ParsingContext } from '../types';
import { SyntaxParseError } from '../ParseError';

export default function literal<L extends string>(ctx: ParsingContext, content: L): L {
    const part = ctx.source.substr(ctx.caret, content.length);

    if (part !== content) {
        throw new SyntaxParseError(ctx, JSON.stringify(content), part);
    }

    ctx.increment(content.length);
    return content;
}
