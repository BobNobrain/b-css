import { ParsingContext, Parser } from '../types';
import optional from './optional';
import { SyntaxParseError } from '../ParseError';


type OptionalIfEmptyArray<K extends string, A extends unknown[]> = A extends []
    ? { [key in K]?: A }
    : { [key in K]: A }
    ;

type OptionalGroup<Grp extends object>
    = Grp
    | { [key in keyof Grp]?: undefined }
    ;

interface ManyCombinatorTuning {
    minCount?: number;
    maxCount?: number;
}

// One must provide `what` prop that should be a parser,
// and if the parser requires some additional arguments, an `args` prop must be provided.
// Also one can provide `separator` prop with a parser, and if it is given and it requires
// additional arguments, then `separatorArgs` must also be provided
type ManyCombinatorOptions<T, ParserArgs extends unknown[], S, SeparatorArgs extends unknown[]>
    = ManyCombinatorTuning
    & { parser: Parser<T, ParserArgs> }
    & OptionalIfEmptyArray<'args', ParserArgs>
    & OptionalGroup<{
        separatedBy: Parser<S, SeparatorArgs>;
        allowSeparatorDangle?: boolean;
    } & OptionalIfEmptyArray<'separatorArgs', SeparatorArgs>>
    ;

export default function many<T, ParserArgs extends unknown[], S, SeparatorArgs extends unknown[]>(
    ctx: ParsingContext,
    options: ManyCombinatorOptions<T, ParserArgs, S, SeparatorArgs>,
): T[] {
    const { maxCount = Infinity } = options;
    const results: T[] = [];

    while (results.length <= maxCount) {
        const next = optional(ctx, options.parser, ...((options.args || []) as unknown as ParserArgs));

        if (!next.success) {
            if (results.length > 0 && !options.allowSeparatorDangle) {
                throw new SyntaxParseError(ctx, 'next', 'dangling separator');
            }
            break;
        }

        results.push(next.value);

        if (options.separatedBy) {
            const sep = optional(
                ctx, options.separatedBy,
                ...((options.separatorArgs || []) as unknown as SeparatorArgs),
            );

            if (!sep.success) {
                break;
            }
        }
    }

    const { minCount = 0 } = options;
    if (results.length < minCount) {
        throw new SyntaxParseError(ctx, `at least ${minCount} repetitions`);
    }

    return results;
}


declare const p1: (ctx: ParsingContext) => string;
declare const p2: (ctx: ParsingContext, x: 0 | 1) => string;
declare const ctx: ParsingContext;

many(ctx, { parser: p1 });
