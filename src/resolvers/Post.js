const Post = {
    author(parent, args, { db }, info) {
        return db.users.find((u) => {
            return u.id == parent.author;
        });
    },
    comments(parent, args, { db }, info) {
        return db.comments.filter((comment) => {
            return comment.post == parent.id;
        });
    }
}
export { Post as default }