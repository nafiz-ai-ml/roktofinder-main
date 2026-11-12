import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";

// পুরনো /search লিংক এখন /directory-তে চলে যায় (SEO ও শেয়ার করা লিংক অক্ষত থাকে)
const searchSchema = z.object({
  bg: z.string().optional(),
  area: z.string().optional(),
  availableOnly: z.boolean().optional(),
  mode: z.enum(["area", "nearby"]).optional(),
  radius: z.number().optional(),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/directory",
      search: search as Record<string, unknown>,
      replace: true,
    });
  },
});
