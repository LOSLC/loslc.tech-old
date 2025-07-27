import { drizzle } from "drizzle-orm/postgres-js";
import * as users from "@/core/db/schema/user";
import * as auth from "@/core/db/schema/auth";
import * as security from "@/core/db/schema/security";
import * as blogPost from "@/core/db/schema/blogPost";
import * as blogPostComment from "@/core/db/schema/comment";
import * as blogPostTag from "@/core/db/schema/blogPostTag";
import * as postLike from "@/core/db/schema/postLike";
import * as blogAnalytics from "@/core/db/schema/blogAnalytics";

export const db = drizzle(process.env.DATABASE_URL as string, {
  schema: {
    ...users,
    ...auth,
    ...security,
    ...blogPost,
    ...blogPostComment,
    ...blogPostTag,
    ...postLike,
    ...blogAnalytics,
  },
});
