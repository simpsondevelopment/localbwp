import bcrypt from "bcryptjs";
import getUserId from "../utils/getUserId";
import generateToken from "../utils/generateToken";
import hashPassword from "../utils/hashPassword";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const password = await hashPassword(args.data.password);
    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password,
      },
    });

    return {
      user,
      token: generateToken(user.id),
    };
  },
  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email,
      },
    });

    if (!user) {
      throw new Error("Unable to login");
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password);

    if (!isMatch) {
      throw new Error("Unable to login");
    }

    return {
      user,
      token: generateToken(user.id),
    };
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.deleteUser(
      {
        where: {
          id: userId,
        },
      },
      info
    );
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    if (typeof args.data.password === "string") {
      args.data.password = await hashPassword(args.data.password);
    }

    return prisma.mutation.updateUser(
      {
        where: {
          id: userId,
        },
        data: args.data,
      },
      info
    );
  },
  createBeer(parent, args, { prisma }, info) {
    return prisma.mutation.createBeer({
      data: {
        ...args.data,
      },
    });
  },
  createWing(parent, args, { prisma }, info) {
    return prisma.mutation.createWing({
      data: {
        ...args.data,
      },
    });
  },
  createPizza(parent, args, { prisma }, info) {
    return prisma.mutation.createPizza({
      data: {
        ...args.data,
      },
    });
  },
  createLocation(parent, args, { prisma }, info) {
    return prisma.mutation.createLocation({
      data: {
        ...args.data,
      },
    });
  },
  createReview(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    console.log(userId);

    return prisma.mutation.createReview(
      {
        data: {
          price: args.data.price,
          rating: args.data.rating,
          comments: args.data.comments,
          name: {
            connect: {
              id: userId,
            },
          },
          pizza: {
            connect: {
              pizzaId: args.data.pizzaId,
            },
          },
        },
      },
      info
    );
  },
  async addPizzaFavourite(parent, args, { prisma, request }, info) {
    const userId = await getUserId(request);
    const pizza = await prisma.query.pizzas({ where: { id: args.pizzaId } });

    return prisma.mutation.updateUser({
      where: {
        id: userId,
      },

      data: {
        pizzaFavourites: {
          connect: {
            id: args.data.pizzaId,
          },
        },
      },
    });
  },
  async removePizzaFavourite(parent, args, { prisma, request }, info) {
    const userId = await getUserId(request);
    const pizza = await prisma.query.pizzas({ where: { id: args.pizzaId } });

    return prisma.mutation.updateUser({
      where: {
        id: userId,
      },

      data: {
        pizzaFavourites: {
          disconnect: {
            id: args.data.pizzaId,
          },
        },
      },
    });
  },
  async addBeerFavourite(parent, args, { prisma, request }, info) {
    const userId = await getUserId(request);
    const beer = await prisma.query.beer({ where: { id: args.data.beerId } });
    console.log(beer);
    console.log(args);

    return prisma.mutation.updateUser({
      where: {
        id: userId,
      },

      data: {
        beerFavourites: {
          connect: {
            id: args.data.beerId,
          },
        },
      },
    });
  },

  async removeBeerFavourite(parent, args, { prisma, request }, info) {
    const userId = await getUserId(request);
    const beer = await prisma.query.beer({ where: { id: args.data.beerId } });

    return prisma.mutation.updateUser({
      where: {
        id: userId,
      },

      data: {
        beerFavourites: {
          disconnect: {
            id: args.data.beerId,
          },
        },
      },
    });
  },
  async addWingFavourite(parent, args, { prisma, request }, info) {
    const userId = await getUserId(request);

    return prisma.mutation.updateUser({
      where: {
        id: userId,
      },

      data: {
        wingFavourites: {
          connect: {
            id: args.data.wingId,
          },
        },
      },
    });
  },
  async removeWingFavourite(parent, args, { prisma, request }, info) {
    const userId = await getUserId(request);

    return prisma.mutation.updateUser({
      where: {
        id: userId,
      },

      data: {
        wingFavourites: {
          disconnect: {
            id: args.data.wingId,
          },
        },
      },
    });
  },
};

export { Mutation as default };
