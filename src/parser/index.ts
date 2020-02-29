import ParsingContext from './ParsingContext';
import whitespace from './atoms/whitespace';
import commentsOrWhitespace from './tbem/comments';

export default function parse(source: string) {
    const ctx = new ParsingContext(source);
    whitespace(ctx, false);
    return commentsOrWhitespace(ctx, false);
}
