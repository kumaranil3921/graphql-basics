const Comment = {
    author(parent, args, { db }, info) {
        console.log()
        return db.users.find((u) => {
            return u.id == parent.author;
        });
    },
    post(parent, args, { db }, info) {
        return db.posts.find((post) => {
            return post.id == parent.post;
        });
    }
}
export { Comment as default }