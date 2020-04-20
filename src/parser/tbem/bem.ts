import { ParsingContext } from '../types';
import literal from '../atoms/literal';
import whitespace, { OPTIONAL_IN_LINE, OPTIONAL } from '../atoms/whitespace';
import identifier from '../atoms/identifiers';
import { assertIndentationGE } from '../utils/indent';
import many from '../combinators/many';
import { AstNodeWithComments } from './comments';


export enum ValueType { STRING = 'string', BOOLEAN = 'boolean', UNSET = 'unset' }
export type Value
    = { type: ValueType.STRING; value: string }
    | { type: ValueType.BOOLEAN; value: boolean }
    | { type: ValueType.UNSET }
    ;

interface Modifier {
    name: string;
    options: {
        type: ValueType;
        value:
    }[];
}

interface GenericBlockHeader extends AstNodeWithComments {
    name: string;
}

// keyword todoList(mod1: type, mod2: type) [attr1, attr2=value]
function genericBlockHeader(
    ctx: ParsingContext,
    keyword: string,
): GenericBlockHeader {
    const indentLevel = ctx.indent;

    literal(ctx, keyword);
    whitespace(ctx, OPTIONAL_IN_LINE);

    const blockName = identifier(ctx, false, false);
    whitespace(ctx, OPTIONAL_IN_LINE);

    // TODO: make optional
    literal(ctx, '(');
    whitespace(ctx, OPTIONAL);
    assertIndentationGE(ctx, indentLevel);
    const mods = many(ctx, { parser: modifierDeclaration, separatedBy: comma });
    literal(ctx, ')');
    whitespace(ctx, OPTIONAL_IN_LINE);

    literal(ctx, '[');
    whitespace(ctx, OPTIONAL);
    assertIndentationGE(ctx, indentLevel);
    const attrs = many(ctx, { parser: blockAttribute, separatedBy: comma });

    return {
        name: blockName,
    };
}
