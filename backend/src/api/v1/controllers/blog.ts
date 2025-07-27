import type { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { blogProvider } from "../providers/blog";
import { getCurrentUser } from "../providers/auth";
import type { BlogPostCreationDTO, BlogPostUpdateDTO } from "../dto/blog";
import createHttpError from "http-errors";
import { 
  canCreatePost, 
  canEditPost, 
  canDeletePost, 
  canManageCategories, 
  canManageTags,
  optionalAuth,
  validatePostAccess
} from "../middleware/blog";

export const router = Router();

// Blog Post Controllers
export async function createBlogPost(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getCurrentUser(req);
    const data: BlogPostCreationDTO = {
      ...req.body,
      authorId: user.id,
    };

    const post = await blogProvider.createBlogPost(data);
    res.status(StatusCodes.CREATED).json({
      message: "Blog post created successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
}

export async function getBlogPost(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const post = await blogProvider.getBlogPostById(id);

    if (!post) {
      return next(createHttpError(StatusCodes.NOT_FOUND, "Blog post not found"));
    }

    res.status(StatusCodes.OK).json({
      message: "Blog post retrieved successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllBlogPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filters = {
      categoryId: req.query.categoryId as string,
      authorId: req.query.authorId as string,
      isPublished: req.query.isPublished ? req.query.isPublished === 'true' : undefined,
      isFeatured: req.query.isFeatured ? req.query.isFeatured === 'true' : undefined,
      search: req.query.search as string,
      tagId: req.query.tagId as string,
    };

    const result = await blogProvider.getAllBlogPosts(page, limit, filters);
    res.status(StatusCodes.OK).json({
      message: "Blog posts retrieved successfully",
      data: result.posts,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateBlogPost(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const data: BlogPostUpdateDTO = req.body;

    const post = await blogProvider.updateBlogPost(id, data);

    if (!post) {
      return next(createHttpError(StatusCodes.NOT_FOUND, "Blog post not found"));
    }

    res.status(StatusCodes.OK).json({
      message: "Blog post updated successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteBlogPost(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const success = await blogProvider.deleteBlogPost(id);

    if (!success) {
      return next(createHttpError(StatusCodes.NOT_FOUND, "Blog post not found"));
    }

    res.status(StatusCodes.OK).json({
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

// Category Controllers
export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getCurrentUser(req);
    const { name } = req.body;

    if (!name) {
      return next(createHttpError(StatusCodes.BAD_REQUEST, "Category name is required"));
    }

    const category = await blogProvider.createCategory({
      name,
      authorId: user.id,
    });

    res.status(StatusCodes.CREATED).json({
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await blogProvider.getAllCategories();
    res.status(StatusCodes.OK).json({
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const category = await blogProvider.getCategoryById(id);

    if (!category) {
      return next(createHttpError(StatusCodes.NOT_FOUND, "Category not found"));
    }

    res.status(StatusCodes.OK).json({
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return next(createHttpError(StatusCodes.BAD_REQUEST, "Category name is required"));
    }

    const category = await blogProvider.updateCategory(id, { name });

    if (!category) {
      return next(createHttpError(StatusCodes.NOT_FOUND, "Category not found"));
    }

    res.status(StatusCodes.OK).json({
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const success = await blogProvider.deleteCategory(id);

    if (!success) {
      return next(createHttpError(StatusCodes.NOT_FOUND, "Category not found"));
    }

    res.status(StatusCodes.OK).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

// Tag Controllers
export async function createTag(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.body;

    if (!name) {
      return next(createHttpError(StatusCodes.BAD_REQUEST, "Tag name is required"));
    }

    const tag = await blogProvider.createTag(name);
    res.status(StatusCodes.CREATED).json({
      message: "Tag created successfully",
      data: tag,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllTags(req: Request, res: Response, next: NextFunction) {
  try {
    const tags = await blogProvider.getAllTags();
    res.status(StatusCodes.OK).json({
      message: "Tags retrieved successfully",
      data: tags,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTag(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const tag = await blogProvider.getTagById(id);

    if (!tag) {
      return next(createHttpError(StatusCodes.NOT_FOUND, "Tag not found"));
    }

    res.status(StatusCodes.OK).json({
      message: "Tag retrieved successfully",
      data: tag,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTag(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return next(createHttpError(StatusCodes.BAD_REQUEST, "Tag name is required"));
    }

    const tag = await blogProvider.updateTag(id, name);

    if (!tag) {
      return next(createHttpError(StatusCodes.NOT_FOUND, "Tag not found"));
    }

    res.status(StatusCodes.OK).json({
      message: "Tag updated successfully",
      data: tag,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTag(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const success = await blogProvider.deleteTag(id);

    if (!success) {
      return next(createHttpError(StatusCodes.NOT_FOUND, "Tag not found"));
    }

    res.status(StatusCodes.OK).json({
      message: "Tag deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getPostsByTag(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await blogProvider.getPostsByTag(id, page, limit);
    res.status(StatusCodes.OK).json({
      message: "Posts by tag retrieved successfully",
      data: result.posts,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

// Blog Post Routes
router.post("/posts", canCreatePost, createBlogPost);
router.get("/posts", optionalAuth, getAllBlogPosts);
router.get("/posts/:id", optionalAuth, getBlogPost);
router.put("/posts/:id", canEditPost, updateBlogPost);
router.delete("/posts/:id", canDeletePost, deleteBlogPost);

// Category Routes
router.post("/categories", canManageCategories, createCategory);
router.get("/categories", getAllCategories);
router.get("/categories/:id", getCategory);
router.put("/categories/:id", canManageCategories, updateCategory);
router.delete("/categories/:id", canManageCategories, deleteCategory);

// Tag Routes
router.post("/tags", canManageTags, createTag);
router.get("/tags", getAllTags);
router.get("/tags/:id", getTag);
router.put("/tags/:id", canManageTags, updateTag);
router.delete("/tags/:id", canManageTags, deleteTag);
router.get("/tags/:id/posts", optionalAuth, getPostsByTag);