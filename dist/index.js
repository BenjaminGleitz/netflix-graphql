import { ApolloServer } from '@apollo/server'; // preserve-line
import { startStandaloneServer } from '@apollo/server/standalone'; // preserve-line
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    // ... you will write your Prisma Client queries here
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//TYPE DEFS
const typeDefs = `#graphql

type Category  {
    id: Int!
    name: String!
    movies: [Movie!]!
    series: [Serie!]!
}

type Director  {
    id: Int!
    name: String!
    movies: [Movie!]!
    series: [Serie!]!
}

type Actor  {
    id: Int!
    name: String!
    movies: [Movie!]!
    series: [Serie!]!
}

type Movie  {
    id: Int!
    name: String!
    description: String!
    releaseDate: String!
    rating: Int!
    poster: String!
    categoryId: Int!
    category: Category!
    directorId: Int!
    director: Director!
    actors: [Actor!]!
}

type Serie  {
    id: Int!
    name: String!
    description: String!
    releaseDate: String!
    rating: Int!
    poster: String!
    categoryId: Int!
    category: Category!
    directorId: Int!
    director: Director!
    actors: [Actor!]!
}

type Query {
    movies: [Movie!]!
    series: [Serie!]!
    categories: [Category!]!
    directors: [Director!]!
    actors: [Actor!]!
    moviesById(id: Int!): Movie
    seriesById(id: Int!): Serie
    categoriesById(id: Int!): Category
    directorsById(id: Int!): Director
    actorsById(id: Int!): Actor
}

input CreateMovieInput {
    categoryId: Int!
    directorId: Int!
    name: String!
    description: String!
    releaseDate: String!
    rating: Int!
    poster: String!
}

input CreateCategoryInput {
    name: String!
}

input CreateDirectorInput {
    name: String!
}

input CreateActorInput {
    name: String!
}

type Mutation {
    createMovie(input: CreateMovieInput!): Movie!
    createCategory(input: CreateCategoryInput!): Category!
    createDirector(input: CreateDirectorInput!): Director!
    createActor(input: CreateActorInput!): Actor!
}
`;
const resolvers = {
    Query: {
        movies: () => prisma.movie.findMany(),
        series: () => prisma.serie.findMany(),
        categories: () => prisma.category.findMany(),
        directors: () => prisma.director.findMany(),
        actors: () => prisma.actor.findMany(),
        moviesById: (_parent, args, _context) => prisma.movie.findUnique({
            where: { id: args.id },
        }),
    },
    Movie: {
        category: (parent) => prisma.category.findUnique({
            where: { id: parent.categoryId },
        }),
        director: (parent) => prisma.director.findUnique({
            where: { id: parent.directorId },
        }),
        actors: (parent) => prisma.actor.findMany({
            where: { movies: { some: { id: parent.id } } },
        }),
    },
    Serie: {
        category: (parent) => prisma.category.findUnique({
            where: { id: parent.categoryId },
        }),
        director: (parent) => prisma.director.findUnique({
            where: { id: parent.directorId },
        }),
        actors: (parent) => prisma.actor.findMany({
            where: { series: { some: { id: parent.id } } },
        }),
    },
    Category: {
        movies: (parent) => prisma.movie.findMany({
            where: { categoryId: parent.id },
        }),
        series: (parent) => prisma.serie.findMany({
            where: { categoryId: parent.id },
        }),
    },
    Director: {
        movies: (parent) => prisma.movie.findMany({
            where: { directorId: parent.id },
        }),
        series: (parent) => prisma.serie.findMany({
            where: { directorId: parent.id },
        }),
    },
    //MUTATIONS
    Mutation: {
        createActor: (_, { input }) => {
            return prisma.actor.create({
                data: {
                    name: input.name,
                },
            });
        },
        createCategory: (_, { input }) => {
            return prisma.category.create({
                data: {
                    name: input.name,
                },
            });
        },
        createDirector: (_, { input }) => {
            return prisma.director.create({
                data: {
                    name: input.name,
                },
            });
        },
    },
};
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 4001 },
});
console.log(`🚀  Server ready at: ${url}`);
