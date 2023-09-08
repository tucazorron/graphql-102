const express = require("express");
const expressGraphQL = require("express-graphql").graphqlHTTP;
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");
const app = express();
const port = 5000;

const blocks102 = [
	{ id: 1, name: "porto novo", letter: "A"},
	{ id: 2, name: "parthenon", letter: "B"},
	{ id: 3, name: "rio madeira", letter: "C"},
	{ id: 4, name: "royal garden", letter: "D"},
	{ id: 5, name: "caravelas", letter: "E"},
	{ id: 6, name: "porto vitoria", letter: "F"},
	{ id: 7, name: "porto alegre", letter: "G"},
	{ id: 8, name: "le triumph", letter: "H"},
	{ id: 9, name: "sao francisco", letter: "I"},
	{ id: 10, name: "fenix", letter: "J"},
	{ id: 11, name: "fellini", letter: "K"},
	{ id: 12, name: "costabella", letter: "L"},
];

const friends102 = [
  { id: 1, name: "tuca", block: "H" },
  { id: 2, name: "pz", block: "H" },
  { id: 3, name: "gb", block: "H" },
  { id: 4, name: "mateus", block: "H" },
  { id: 5, name: "vitinho", block: "H" },
  { id: 6, name: "luiz mito", block: "H" },
  { id: 7, name: "vitao", block: "H" },
  { id: 8, name: "pagano", block: "H" },
  { id: 9, name: "john john", block: "J" },
  { id: 10, name: "fillipo", block: "H" },
  { id: 11, name: "goias", block: "J" },
  { id: 12, name: "augusto", block: "I" },
  { id: 13, name: "michel", block: "H" },
  { id: 14, name: "santista", block: "E" },
  { id: 15, name: "leo arantes", block: "H" },
  { id: 16, name: "leozinho", block: "H" },
];

const BlockType = new GraphQLObjectType({
  name: "Block",
  description: "blocks 102",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    letter: { type: new GraphQLNonNull(GraphQLString) },
		friends: {
			type: new GraphQLList(FriendType),
			resolve: (block) => {
				return friends102.filter((friend) => friend.block === block.letter);
			}
		}
  }),
});

const FriendType = new GraphQLObjectType({
  name: "Friend",
  description: "friends 102",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    block: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "root query",
  fields: () => ({
    blocks: {
      type: new GraphQLList(BlockType),
      description: "all blocks",
      resolve: () => blocks102,
    },
    block: {
      type: BlockType,
      description: "single block",
      args: {
        letter: { type: GraphQLString },
      },
      resolve: (_parent, args) =>
        blocks102.find((block) => block.letter === args.letter),
    },
    friends: {
      type: new GraphQLList(FriendType),
      description: "all friends",
      resolve: () => friends102,
    },
		friendsByBlock: {
			type: new GraphQLList(FriendType),
			description: "all friends by block",
			args: {
				block: { type: GraphQLString },
			},
			resolve: (_parent, args) =>
				friends102.filter((friend) => friend.block === args.block),
		},
    friend: {
      type: FriendType,
      description: "single friend",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (_parent, args) =>
        friends102.find((friend) => friend.id === args.id),
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
	name: "Mutation",
	description: "root mutation",
	fields: () => ({
		addFriend: {
			type: FriendType,
			description: "add a friend",
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				block: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: (_parent, args) => {
				const friend = {
					id: friends102.length + 1,
					name: args.name,
					block: args.block,
				};
				friends102.push(friend);
				return friend;
			},
		},
		addBlock: {
			type: BlockType,
			description: "add a block",
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				letter: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: (_parent, args) => {
				const block = {
					id: blocks102.length + 1,
					name: args.name,
					letter: args.letter,
				};
				blocks102.push(block);
				return block;
			},
		},
	}),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
	mutation: RootMutationType,
});

app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true,
  })
);
app.listen(port);
