import getUserId from "../utils/getUserId";

const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
    };

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query,
          },
        ],
      };
    }

    return prisma.query.users(opArgs, info);
  },
  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.query.user({
      where: {
        id: userId,
      },
    });
  },
  beers(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.query.beers();
  },
  pizzas(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.query.pizzas();
  },
  locations(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.query.locations();
  },
};

export { Query as default };
