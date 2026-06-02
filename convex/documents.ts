import { v } from "convex/values";
import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Resolve the authenticated user's id, throwing if the request is unauthenticated.
const requireUserId = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not Authenticated.");
  }
  return identity.subject;
};

// Resolve a document the caller owns, throwing if it is missing or owned by
// someone else.
const requireOwnedDocument = async (
  ctx: MutationCtx,
  id: Id<"documents">
): Promise<{ userId: string; document: Doc<"documents"> }> => {
  const userId = await requireUserId(ctx);
  const document = await ctx.db.get(id);
  if (!document) {
    throw new Error("Document not found");
  }
  if (document.userId !== userId) {
    throw new Error("Unauthorized");
  }
  return { userId, document };
};

// Walk the descendants of a document, visiting each node before ("pre") or after
// ("post") its own descendants.
const forEachDescendant = async (
  ctx: MutationCtx,
  userId: string,
  documentId: Id<"documents">,
  visit: (id: Id<"documents">) => Promise<unknown>,
  order: "pre" | "post"
) => {
  const children = await ctx.db
    .query("documents")
    .withIndex("by_user_parent", (q) =>
      q.eq("userId", userId).eq("parentDocument", documentId)
    )
    .collect();

  for (const child of children) {
    if (order === "pre") {
      await visit(child._id);
      await forEachDescendant(ctx, userId, child._id, visit, order);
    } else {
      await forEachDescendant(ctx, userId, child._id, visit, order);
      await visit(child._id);
    }
  }
};

// archive functionality
export const archive = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const { userId } = await requireOwnedDocument(ctx, args.id);

    const document = await ctx.db.patch(args.id, { isArchived: true });

    forEachDescendant(
      ctx,
      userId,
      args.id,
      (id) => ctx.db.patch(id, { isArchived: true }),
      "pre"
    );

    return document;
  },
});

// Fetch sidebar documents
export const getSidebar = query({
  args: { parentDocument: v.optional(v.id("documents")) },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q
          .eq("userId", userId)
          .eq("parentDocument", args.parentDocument)
          .eq("isArchived", false)
      )
      .collect();

    return documents;
  },
});

// Create a new document
export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });

    return document;
  },
});

// fetch archived items.
export const getTrash = query({
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();
    return documents;
  },
});

export const restore = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const { userId } = await requireOwnedDocument(ctx, args.id);

    await ctx.db.patch(args.id, { isArchived: false });
    await forEachDescendant(
      ctx,
      userId,
      args.id,
      (id) => ctx.db.patch(id, { isArchived: false }),
      "pre"
    );

    return await ctx.db.get(args.id);
  },
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const { userId } = await requireOwnedDocument(ctx, args.id);

    await forEachDescendant(
      ctx,
      userId,
      args.id,
      (id) => ctx.db.delete(id),
      "post"
    );
    await ctx.db.delete(args.id);

    return { success: true };
  },
});

export const getSearch = query({
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

export const getById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const document = await ctx.db.get(args.documentId);

    if (!document) {
      return null; // Document doesn't exist
    }

    // Allow access if document is published (public)
    if (document.isPublished) {
      return document;
    }

    // For non-published documents, require authentication
    if (!identity) {
      return null; // Not authenticated - return null instead of throwing
    }

    const userId = identity.subject;

    // Check if user owns the document or has access
    if (document.userId !== userId) {
      return null; // Unauthorized - return null instead of throwing
    }

    return document;
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireOwnedDocument(ctx, args.id);

    // Patch only the defined fields directly
    await ctx.db.patch(args.id, {
      ...(args.title !== undefined && { title: args.title }),
      ...(args.content !== undefined && { content: args.content }),
      ...(args.coverImage !== undefined && { coverImage: args.coverImage }),
      ...(args.icon !== undefined && { icon: args.icon }),
      ...(args.isPublished !== undefined && { isPublished: args.isPublished }),
    });

    return await ctx.db.get(args.id);
  },
});

export const removeIcon = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    await requireOwnedDocument(ctx, args.id);

    await ctx.db.patch(args.id, { icon: undefined });
    return await ctx.db.get(args.id);
  },
});

export const removeCoverImage = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    await requireOwnedDocument(ctx, args.id);

    await ctx.db.patch(args.id, { coverImage: undefined });
    return await ctx.db.get(args.id);
  },
});
