import { ParsingContext, Parser } from '../types';
import { ParseError } from '../ParseError';


type OptionalResult<T>
    = { success: true; value: T }
    | { success: false; error: ParseError }
    ;

export default function optional<T, Args extends unknown[]>(
    ctx: ParsingContext,
    parser: Parser<T, Args>,
    ...args: Args
): OptionalResult<T> {
    const backup = ctx.backup();

    try {
        const value = parser(ctx, ...args);
        return { success: true, value };
    } catch (error) {
        if (error instanceof ParseError) {
            ctx.restore(backup);
            return { success: false, error };
        }

        // other errors shall be rethrown
        throw error;
    }
}

export function withFallback<T, Args extends unknown[]>(
    ctx: ParsingContext,
    fallback: T,
    p: Parser<T, Args>,
    ...args: Args
): T {
    const result = optional(ctx, p, ...args);
    return result.success ? result.value : fallback;
}
