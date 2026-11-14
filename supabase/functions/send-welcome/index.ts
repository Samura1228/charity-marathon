// Entry point for the Supabase Edge Runtime. The logic is in welcome.ts,
// kept free of Deno APIs so it can be tested with plain Node.
import { handle } from './welcome.ts';

Deno.serve((req) => handle(req, Deno.env.toObject()));
