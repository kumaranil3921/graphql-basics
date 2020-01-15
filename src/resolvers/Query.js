const Query = {
    sum(parent, args, { db }, info) {

        if (args.numbers && args.numbers.length) {
            return args.numbers.reduce((accumulator, currentValue) => accumulator + currentValue);
        }
        return 0;
    },
    hello() {
        return 'Hi! Welcome to the world of GraphQL';
    },
    location() {
        return 'My Current location is chandigarh';
    },
    title() {
        return 'Product Title';
    },
    price() {
        return 90.13;
    },
    releaseYear() {
        return 2019;
    },
    rating() {
        return null;
    },
    inStock() {
        return true;
    },
    me() {
        return {
            id: '123',
            name: "Anil",
            email: "kumaranil@gmail.com",
            dateOfBirth: null
        };
    },
    post() {
        return {
            id: '11',
            title: "GraphQL",
            body: "Learning GrapQL",
            isPublished: false,
            author: "Anil"
        };
    },
    posts(parent, args, { db }, info) {
        if (!args.query) {
            return db.posts;
        }
        return db.posts.filter((p) => {
            return p.title.toLowerCase().includes(args.query.toLowerCase());
        })

    },
    searchPost(parent, args, { db }, info) {
        if (args.title) {
            const postTitles = Object.keys(db.posts);
            const searchedPosts = []
            postTitles.forEach(title => {
                if (title.toLowerCase().includes(args.title)) {
                    searchedPosts.push(db.posts[title]);
                }
            });
            return searchedPosts;
        }
        return Object.values(db.posts);

    },
    grades() {
        return [10, 2, 30]
    },
    users(parent, args, { db }, info) {
        if (!args.query) {
            return db.users;
        }
        return db.users.filter((u) => {
            return u.name.toLowerCase().includes(args.query.toLowerCase());
        })
    },
    comments(parent, args, { db }, info) {
        return db.comments;
    }
}

export { Query as default }