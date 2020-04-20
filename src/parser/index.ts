import ParsingContext from './ParsingContext';
import whitespace, { OPTIONAL } from './atoms/whitespace';
import commentsOrWhitespace from './tbem/comments';

export default function parse(source: string) {
    const ctx = new ParsingContext(source);
    whitespace(ctx, OPTIONAL);
    return commentsOrWhitespace(ctx, false);
}
