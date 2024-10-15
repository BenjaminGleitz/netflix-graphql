import { ApolloServer } from '@apollo/server'; // preserve-line
import { startStandaloneServer } from '@apollo/server/standalone'; // preserve-line
import { PrismaClient } from '@prisma/client'
import DataLoader from 'dataloader';

const prisma = new PrismaClient()

async function main() {
    // ... you will write your Prisma Client queries here
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

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
    actorIds: [Int!]!
}

input CreateSerieInput {
    categoryId: Int!
    directorId: Int!
    name: String!
    description: String!
    releaseDate: String!
    rating: Int!
    poster: String!
    actorIds: [Int!]!
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
    createSeries(input: CreateSerieInput!): Serie!
    deleteMovie(id: Int!): Movie!
    deleteCategory(id: Int!): Category!
    deleteDirector(id: Int!): Director!
    deleteActor(id: Int!): Actor!
    deleteSerie(id: Int!): Serie!
}
`;

//DATA LOADERS

const categoryById = new DataLoader(async (ids: number[]) => {
    const categories = await prisma.category.findMany({
        where: {
            id: {
                in: ids,
            },
        },
    });
    return ids.map((id) => categories.find((category) => category.id === id));
});

const categoryByMovieId = new DataLoader(async (movieIds: number[]) => {
    const categories = await prisma.category.findMany({
        where: {
            movies: {
                some: {
                    id: {
                        in: movieIds,
                    },
                },
            },
        },
        include: {
            movies: true, // Include the movies relation
        },
    });
    return movieIds.map((movieId) =>
        categories.find((category) =>
            category.movies.some((movie) => movie.id === movieId)
        )
    );
});

const categoryBySerieId = new DataLoader(async (serieIds: number[]) => {
    const categories = await prisma.category.findMany({
        where: {
            series: {
                some: {
                    id: {
                        in: serieIds,
                    },
                },
            },
        },
        include: {
            series: true, // Include the series relation
        },
    });
    return serieIds.map((serieId) =>
        categories.find((category) =>
            category.series.some((serie) => serie.id === serieId)
        )
    );
});

const directorById = new DataLoader(async (ids: number[]) => {
    const directors = await prisma.director.findMany({
        where: {
            id: {
                in: ids,
            },
        },
    });
    return ids.map((id) => directors.find((director) => director.id === id));
});

const directorByMovieId = new DataLoader(async (movieIds: number[]) => {
    const directors = await prisma.director.findMany({
        where: {
            movies: {
                some: {
                    id: {
                        in: movieIds,
                    },
                },
            },
        },
        include: {
            movies: true, // Include the movies relation
        },
    });
    return movieIds.map((movieId) =>
        directors.find((director) =>
            director.movies.some((movie) => movie.id === movieId)
        )
    );
});

const directorBySerieId = new DataLoader(async (serieIds: number[]) => {
    const directors = await prisma.director.findMany({
        where: {
            series: {
                some: {
                    id: {
                        in: serieIds,
                    },
                },
            },
        },
        include: {
            series: true, // Include the series relation
        },
    });
    return serieIds.map((serieId) =>
        directors.find((director) =>
            director.series.some((serie) => serie.id === serieId)
        )
    );
});

const actorById = new DataLoader(async (ids: number[]) => {
    const actors = await prisma.actor.findMany({
        where: {
            id: {
                in: ids,
            },
        },
    });
    return ids.map((id) => actors.find((actor) => actor.id === id));
});

const actorsByMovieId = new DataLoader(async (movieIds: number[]) => {
    const actors = await prisma.actor.findMany({
        where: {
            movies: {
                some: {
                    id: {
                        in: movieIds,
                    },
                },
            },
        },
        include: {
            movies: true, // Include the movies relation
        },
    });
    return movieIds.map((movieId) =>
        actors.filter((actor) =>
            actor.movies.some((movie) => movie.id === movieId)
        )
    );
});

const actorsBySerieId = new DataLoader(async (serieIds: number[]) => {
    const actors = await prisma.actor.findMany({
        where: {
            series: {
                some: {
                    id: {
                        in: serieIds,
                    },
                },
            },
        },
        include: {
            series: true, // Include the series relation
        },
    });
    return serieIds.map((serieId) =>
        actors.filter((actor) =>
            actor.series.some((serie) => serie.id === serieId)
        )
    );
});

const serieById = new DataLoader(async (ids: number[]) => {
    const series = await prisma.serie.findMany({
        where: {
            id: {
                in: ids,
            },
        },
    });
    return ids.map((id) => series.find((serie) => serie.id === id));
});

const seriesByDirectorId = new DataLoader(async (directorIds: number[]) => {
    const series = await prisma.serie.findMany({
        where: {
            directorId: {
                in: directorIds,
            },
        },
    });
    return directorIds.map((directorId) =>
        series.filter((serie) => serie.directorId === directorId)
    );
});

const seriesByCategoryId = new DataLoader(async (categoryIds: number[]) => {
    const series = await prisma.serie.findMany({
        where: {
            categoryId: {
                in: categoryIds,
            },
        },
    });
    return categoryIds.map((categoryId) =>
        series.filter((serie) => serie.categoryId === categoryId)
    );
});

const moviesByDirectorId = new DataLoader(async (directorIds: number[]) => {
    const movies = await prisma.movie.findMany({
        where: {
            directorId: {
                in: directorIds,
            },
        },
    });
    return directorIds.map((directorId) =>
        movies.filter((movie) => movie.directorId === directorId)
    );
});

const movieById = new DataLoader(async (ids: number[]) => {
    const movies = await prisma.movie.findMany({
        where: {
            id: {
                in: ids,
            },
        },
    });
    return ids.map((id) => movies.find((movie) => movie.id === id));
});

const moviesByCategoryId = new DataLoader(async (categoryIds: number[]) => {
    const movies = await prisma.movie.findMany({
        where: {
            categoryId: {
                in: categoryIds,
            },
        },
    });
    return categoryIds.map((categoryId) =>
        movies.filter((movie) => movie.categoryId === categoryId)
    );
});

//RESOLVERS

const resolvers = {
    Query: {
        movies: () => prisma.movie.findMany(),
        series: () => prisma.serie.findMany(),
        categories: () => prisma.category.findMany(),
        directors: () => prisma.director.findMany(),
        actors: () => prisma.actor.findMany(),
        categoriesById: (_, { id }) => categoryById.load(id),
        directorsById: (_, { id }) => directorById.load(id),
        actorsById: (_, { id }) => actorById.load(id),
        moviesById: (_, { id }) => movieById.load(id),
        seriesById: (_, { id }) => serieById.load(id),
    },

    Movie: {
        category: (parent) => categoryByMovieId.load(parent.id),
        director: (parent) => directorByMovieId.load(parent.id),
        actors: (parent) => actorsByMovieId.load(parent.id),
    },

    Serie: {
        category: (parent) => categoryBySerieId.load(parent.id),
        director: (parent) => directorBySerieId.load(parent.id),
        actors: (parent) => actorsBySerieId.load(parent.id),
    },

    Category: {
        movies: (parent) => moviesByCategoryId.load(parent.id),
        series: (parent) => seriesByCategoryId.load(parent.id),
    },

    Director: {
        movies: (parent) => moviesByDirectorId.load(parent.id),
        series: (parent) => seriesByDirectorId.load(parent.id),
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
        createMovie: async (_, { input }) => {
            const movie = await prisma.movie.create({
                data: {
                    categoryId: input.categoryId,
                    directorId: input.directorId,
                    name: input.name,
                    description: input.description,
                    releaseDate: input.releaseDate,
                    rating: input.rating,
                    poster: input.poster,
                    actors: {
                        connect: input.actorIds.map(id => ({ id })),
                    },
                },
            });
            return movie;
        },
        createSeries: async (_, { input }) => {
            const serie = await prisma.serie.create({
                data: {
                    categoryId: input.categoryId,
                    directorId: input.directorId,
                    name: input.name,
                    description: input.description,
                    releaseDate: input.releaseDate,
                    rating: input.rating,
                    poster: input.poster,
                    actors: {
                        connect: input.actorIds.map(id => ({ id })),
                    },
                },
            });
            return serie;
        },
        deleteActor: (_, { id }) => {
            return prisma.actor.delete({
                where: {
                    id,
                },
            });
        },
        deleteCategory: (_, { id }) => {
            return prisma.category.delete({
                where: {
                    id,
                },
            });
        },
        deleteDirector: (_, { id }) => {
            return prisma.director.delete({
                where: {
                    id,
                },
            });
        },
        deleteMovie: (_, { id }) => {
            return prisma.movie.delete({
                where: {
                    id,
                },
            });
        },
        deleteSerie: (_, { id }) => {
            return prisma.serie.delete({
                where: {
                    id,
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