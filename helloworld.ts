import { serve } from "https://deno.land/std@0.155.0/http/server.ts";
import { test } from "./hi.ts";

serve((req: Request) => new Response(test));