const graphql = require("graphql")
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean, NoSchemaIntrospectionCustomRule, GraphQLError } = graphql
const { PrismaClient } = require("@prisma/client")
const { PubSub } = require("graphql-subscriptions");
const { book, author } = new PrismaClient()
const pubsub = new PubSub();
const AUTHOR_ADDED = "AUTHOR_ADDED"

const BookType = new GraphQLObjectType({
    name: "Book",
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        genre: {
            type: GraphQLString
        },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                console.log("Book parent", parent)
                return author.findUnique({
                    where: {
                        id: parent.authorId
                    }
                })
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                console.log("Author parent", parent)
                return book.find({
                    where: {
                        authorId: parent.id
                    }
                })
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {

        book: {
            type: BookType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                //code to get data for db
                return book.findUnique({
                    where: {
                        id: args.id
                    }
                })
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                //code to get data for db
                return author.findUnique({
                    where: {
                        id: args.id
                    }
                })
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args, request) {
                // return books
                console.log("books")
                console.log(JSON.stringify(request.headers));
                return book.findMany({
                })
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                // return authors
                return author.findMany({
                })
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            async resolve(parent, args) {

                console.log(typeof args.age)
                if (args.age <= 0 || args.age > 100) {
                    console.log('inside error')
                    throw new GraphQLError(
                        `Validation: Should be between 1 to 100,  ${args.age} is not allowed`,
                    )
                }
                let newAuthor = await author.create({
                    data: {
                        name: args.name,
                        age: args.age,
                    }
                })
                console.log("new Author added", newAuthor)
                pubsub.publish(AUTHOR_ADDED, newAuthor)
                return newAuthor
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: GraphQLString, defaultValue: "Drama" },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                let newAuthor = book.create({
                    data: {
                        name: args.name,
                        genre: args.genre,
                        authorId: parseInt(args.authorId)
                    }
                })
                return newAuthor
            }
        },
        deleteBook: {
            type: GraphQLString,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                let newAuthor = book.delete({
                    where: {
                        id: parseInt(args.id)
                    }
                })
                return "Deleted book for id " + args.id
            }
        },
        deleteAuthor: {
            type: GraphQLString,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                let newAuthor = author.delete({
                    where: {
                        id: parseInt(args.id)
                    }
                })
                return "Deleted author for id " + args.id
            }
        },
        updateBook: {
            type: BookType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                genre: { type: GraphQLString },
            },
            resolve(parent, args) {
                let updatedBook = book.update({
                    where: {
                        id: parseInt(args.id)
                    },
                    data: {
                        name: args.name,
                        genre: args.genre
                    }
                })
                return updatedBook
            }
        }

    }
})

const Subscription = new GraphQLObjectType({
    name: "Subscription",
    fields: {
        authorAdded: {
            type: AuthorType,
            subscribe(parent, args) {
                console.log("inside Subscription model")
                return pubsub.asyncIterator(AUTHOR_ADDED)
            },
            resolve: (payload) => {
                return payload;
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
    subscription: Subscription
})