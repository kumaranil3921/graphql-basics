import { GraphQLServer } from 'graphql-yoga';
import uuidV4 from 'uuid/v4';
import { arch } from 'os';


// Scalar types: String, Int, Float, Boolean, ID

// type definitions (Schema)
const posts = [
    {
        id: '11',
        title: "GraphQL",
        body: "Learning GrapQL",
        isPublished: false,
        author: "12"
    },
    {
        id: '12',
        title: "Node.JS",
        body: "Learning Node.JS",
        isPublished: false,
        author: "12"
    },
    {
        id: '13',
        title: "MySQL",
        body: "Learning MySQL",
        isPublished: true,
        author: "12"
    },
    {
        id: '14',
        title: "AWS",
        body: "Learning AWS",
        isPublished: false,
        author: "12"
    },
    {
        id: '15',
        title: "Node.JS2",
        body: "Learning Node.JS",
        isPublished: false,
        author: "13"
    },
]
const users = [
    {
        id: '12',
        name: "Anil",
        email: "kumaranil@gmail.com",
        dateOfBirth: null
    },
    {
        id: '13',
        name: "Akash",
        email: "akash@gmail.com",
        dateOfBirth: null
    },
    {
        id: '14',
        name: "Zubin",
        email: "zubin@gmail.com",
        dateOfBirth: null
    },
    {
        id: '15',
        name: "Bagga",
        email: "kumaranil@gmail.com",
        dateOfBirth: null
    }
];
const comments = [
    {
        id: 1,
        text: "Hi how r u?",
        author: '12',
        post: '11'
    },
    {
        id: 2,
        text: "nice posts",
        author: '12',
        post: '11'
    },
    {
        id: 3,
        text: "very good",
        author: '14',
        post: '12'
    },
    {
        id: 4,
        text: "very bad",
        author: '12',
        post: '12'
    },
    {
        id: 5,
        text: "post some articles on node.js",
        author: '13',
        post: '11'
    }
]
const typeDefs = `
    type Query {
        hello : String!
        location: String!
        title : String!,
        price : Float!,
        releaseYear: Int
        rating : Float
        inStock: Boolean!
        me: User!
        post: Post!
        posts(query:String): [Post!]!
        searchPost(title: String): [Post]!
        grades: [Int!]!
        sum(numbers:[Float!]!): Float!
        users(query:String):[User!]!,
        comments:[Comment!]!
    }
    type Mutation {
        createUser(data: createUserReqParams) : User!
        createPost(data: createPostReqParams) : Post!
        createComment(data: createCommentReqParams) : Comment!
    }
    input createUserReqParams {
        name: String!, 
        email: String!, 
        dateOfBirth: String
    }
    input createPostReqParams {
        title: String!, 
        body: String!, 
        author: ID!, 
        isPublished: Boolean!
    }
    input createCommentReqParams {
        text: String!, 
        post: ID!,
        author: ID!
    }
    type User {
        id: ID!
        name : String!
        email : String!
        dateOfBirth : String
        posts : [Post!]! 
        comments: [Comment!]!
    }
    type Post {
        id: ID!
        title : String!
        body : String!
        author: User!
        isPublished: Boolean!
        comments : [Comment!]!
    }
    type Comment {
        id : ID!
        text : String!
        author : User!
        post : Post!
    }
`;

//  resolvers
const resolvers = {
    Query: {
        sum(parent, args, ctx, info) {

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
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts;
            }
            return posts.filter((p) => {
                return p.title.toLowerCase().includes(args.query.toLowerCase());
            })

        },
        searchPost(parent, args, ctx, info) {
            if (args.title) {
                const postTitles = Object.keys(posts);
                const searchedPosts = []
                postTitles.forEach(title => {
                    if (title.toLowerCase().includes(args.title)) {
                        searchedPosts.push(posts[title]);
                    }
                });
                return searchedPosts;
            }
            return Object.values(posts);

        },
        grades() {
            return [10, 2, 30]
        },
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users;
            }
            return users.filter((u) => {
                return u.name.toLowerCase().includes(args.query.toLowerCase());
            })
        },
        comments() {
            return comments;
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const isEmailExists = users.some(user => user.email === args.data.email);
            if (isEmailExists) {
                throw new Error('Email Already Exists.');
            }
            const user = {
                id: uuidV4(),
                ...args.data
            }
            users.push(user);
            return user;
        },
        createPost(parent, args, ctx, info) {
            const isUserExists = users.some(user => user.id === args.data.author);
            if (!isUserExists) {
                throw new Error('User Does not exist');
            }
            const post = {
                id: uuidV4(),
                ...args.data
            }
            posts.push(post);
            return post;
        },
        createComment(parent, args, ctx, info) {
            const isUserExists = users.some(user => user.id === args.data.author);
            if (!isUserExists) {
                throw new Error('User Does not exist');
            }
            const isPostExists = posts.some(post => post.id === args.data.post && post.isPublished);
            if (!isPostExists) {
                throw new Error('Post Does not exist');
            }
            const comment = {
                id: uuidV4(),
                ...args.data
            }
            comments.push(comment);
            return comment;
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((u) => {
                return u.id == parent.author;
            });
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.post == parent.id;
            });
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author == parent.id;
            });
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.author == parent.id;
            });
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            console.log()
            return users.find((u) => {
                return u.id == parent.author;
            });
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => {
                return post.id == parent.post;
            });
        }
    }
};
const server = new GraphQLServer({
    typeDefs,
    resolvers
});
server.start(() => {
    console.log('Server started');
});