// export const listPosts = defineAbility(() => true); // Only authenticated users can list posts

// export const editPost = defineAbility((user: User, post: Post) => {
//   return user.id === post.authorId;
// });

export const seeDashboard = defineAbility(() => true);
