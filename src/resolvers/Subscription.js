const Subscription = {
    comment: {
        subscribe(parent, { postId }, { db, pubsub }, info) {
            const post = db.posts.find(post => post.id === postId && post.isPublished);
            if (!post) {
                throw new Error('Post Not Found');
            }
            return pubsub.asyncIterator(`comment ${postId}`);
        }
    },
    post: {
        subscribe(parent, { postId }, { db, pubsub }, info) {
            return pubsub.asyncIterator('post');
        }
    }
};

export { Subscription as default }