import uuidV4 from 'uuid/v4';
 
const Mutation = {
    createUser(parent, args, { db }, info) {
        const isEmailExists = db.users.some(user => user.email === args.data.email);
        if (isEmailExists) {
            throw new Error('Email Already Exists.');
        }
        const user = {
            id: uuidV4(),
            ...args.data
        }
        db.users.push(user);
        return user;
    },
    deleteUser(parent, args, { db }, info) {
        const userIndex = db.users.findIndex(user => user.id === args.id);
        console.log("userIndex", userIndex)
        if (userIndex < 0) {
            throw new Error('User Not Found');
        }
        const deletedUser = db.users.splice(userIndex, 1);
        db.posts = db.posts.filter(post => {
            const isMatched = post.author === args.id;
            if (isMatched) {
                db.comments = db.comments.filter(comment => comment.post === post.id);
            }
            return !isMatched;
        });
        db.comments = db.comments.filter(comment => comment.author !== args.id);
        return deletedUser[0];
    },
    createPost(parent, args, { db }, info) {
        const isUserExists = db.users.some(user => user.id === args.data.author);
        if (!isUserExists) {
            throw new Error('User Does not exist');
        }
        const post = {
            id: uuidV4(),
            ...args.data
        }
        db.posts.push(post);
        return post;
    },
    deletePost(parent, args, { db }, info) {
        const postIndex = db.posts.findIndex(post => post.id === args.id);
        if (postIndex < 0) {
            throw new Error('Post Not Found');
        }
        const deletedPost = db.posts.splice(postIndex, 1);
        db.comments = db.comments.filter(comment => comment.post !== args.id);
        return deletedPost[0];
    },
    createComment(parent, args, { db }, info) {
        const isUserExists = db.users.some(user => user.id === args.data.author);
        if (!isUserExists) {
            throw new Error('User Does not exist');
        }
        const isPostExists = db.posts.some(post => post.id === args.data.post && post.isPublished);
        if (!isPostExists) {
            throw new Error('Post Does not exist');
        }
        const comment = {
            id: uuidV4(),
            ...args.data
        }
        db.comments.push(comment);
        return comment;
    },
    deleteComment(parent, args, { db }, info) {
        const commentIndex = db.comments.findIndex(comment => comment.id === args.id);
        if (commentIndex < 0) {
            throw new Error('Comment Not Found');
        }
        const deletedComment = db.comments.splice(commentIndex, 1);
        return deletedComment[0];
    }
}
export {Mutation as default}