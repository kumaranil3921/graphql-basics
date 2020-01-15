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
    updateUser(parent, args, { db }, info) {
        const { id, data } = args;
        const user = db.users.find(user => user.id === id);
        if (!user) {
            throw new Error('User Not Found');
        }
        const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const isValidEmail = regExp.test(String(data.email).toLowerCase());
        if (!isValidEmail) {
            throw new Error('Invalid Email ID');
        }
        const isEmailExists = db.users.some(user => user.email === data.email);
        if (isEmailExists) {
            throw new Error('Email Already Exists.');
        }
        user.email = data.email;
        typeof data.name === 'string' ? user.name = data.name : '';
        typeof data.dateOfBirth === 'string' ? user.dateOfBirth = data.dateOfBirth : '';
        return user;
    },
    deleteUser(parent, args, { db }, info) {
        const userIndex = db.users.findIndex(user => user.id === args.id);
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
    createPost(parent, args, { db, pubsub }, info) {
        const isUserExists = db.users.some(user => user.id === args.data.author);
        if (!isUserExists) {
            throw new Error('User Does not exist');
        }
        const post = {
            id: uuidV4(),
            ...args.data
        }
        db.posts.push(post);
        if (post.isPublished)
            pubsub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            });
        return post;
    },
    updatePost(parent, args, { db, pubsub }, info) {
        const { id, data } = args;
        const post = db.posts.find(post => post.id === id);
        if (!post) {
            throw new Error('Post Not Found');
        }
        const originalPost = { ...post };
        data.title && typeof data.title === 'string' ? post.title = data.title : '';
        data.body && typeof data.body === 'string' ? post.body = data.body : '';
        if (typeof data.isPublished === 'boolean') {
            post.isPublished = data.isPublished;
            if (originalPost.isPublished && !post.isPublished) {
                // deleted
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                });
            } else if (!originalPost.isPublished && post.isPublished) {
                // created
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                });
            }
        } else if (post.isPublished) {
            // updated
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            });
        }

        return post;
    },
    deletePost(parent, args, { db, pubsub }, info) {
        const postIndex = db.posts.findIndex(post => post.id === args.id);
        if (postIndex < 0) {
            throw new Error('Post Not Found');
        }
        const [deletedPost] = db.posts.splice(postIndex, 1);
        db.comments = db.comments.filter(comment => comment.post !== args.id);
        if (deletedPost.isPublished) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: deletedPost
                }
            });
        }
        return deletedPost;
    },
    createComment(parent, args, { db, pubsub }, info) {
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
        };
        db.comments.push(comment);
        console.log("comment  ", comment);
        pubsub.publish(`comment ${args.data.post}`, { comment: { data: comment, mutation: 'CREATED' } });
        return comment;
    },
    updateComment(parent, args, { db, pubsub }, info) {
        const { id, data } = args;
        const comment = db.comments.find(comment => comment.id === id);
        if (!comment) {
            throw new Error('Comment Not Found');
        }
        data.text && typeof data.text === 'string' ? comment.text = data.text : '';
        pubsub.publish(`comment ${comment.post}`, { comment: { data: comment, mutation: 'UPDATED' } });
        return comment;
    },
    deleteComment(parent, args, { db, pubsub }, info) {
        const commentIndex = db.comments.findIndex(comment => comment.id === args.id);
        if (commentIndex < 0) {
            throw new Error('Comment Not Found');
        }
        const [deletedComment] = db.comments.splice(commentIndex, 1);
        pubsub.publish(`comment ${deletedComment.post}`, { comment: { data: deletedComment, mutation: 'DELETED' } });
        return deletedComment;
    }
}
export { Mutation as default }