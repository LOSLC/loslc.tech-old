import { z } from 'zod';

export const PostCreationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500, 'Title must be at most 500 characters long'),
  content: z.string().min(1, 'Content is required').max(1000, 'Content must be at most 1000 characters long'),
  tags: z.array(z.string()).optional(),
  authorId: z.string().min(1, 'Author ID is required'),
});

// post assignment
// post update
// post deletion
