import { DefaultDeserializer } from "v8";

const posts = [{
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
];
const users = [{
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
    }];
const comments = [{
        id: "1",
        text: "Hi how r u?",
        author: '12',
        post: '11'
    },
    {
        id: "2",
        text: "nice posts",
        author: '12',
        post: '11'
    },
    {
        id: "3",
        text: "very good",
        author: '14',
        post: '12'
    },
    {
        id: "4",
        text: "very bad",
        author: '12',
        post: '12'
    },
    {
        id: "5",
        text: "post some articles on node.js",
        author: '13',
        post: '11'
    }];
const db = {
    users,
    posts,
    comments
};
export { db as default }