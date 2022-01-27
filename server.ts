import { handler } from "./handler.ts";
import { serve } from "https://deno.land/std@0.122.0/http/mod.ts";

await serve(handler);
