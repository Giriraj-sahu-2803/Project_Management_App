const graphql = require("graphql");
const { projects, clients } = require("../sampleData");
const _ = require("lodash");

//Mongoose Models
const Clients = require("../models/clients");
const Projects = require("../models/project");

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLNumber,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLEnumType,
} = graphql;

const Client = new GraphQLObjectType({
  name: "client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

const Project = new GraphQLObjectType({
  name: "project",
  fields: () => ({
    id: { type: GraphQLID },
    clientId: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: {
      type: new GraphQLEnumType({
        name: "ProjectStatus",
        defaultValue: "Not Started",
        values: {
          new: { value: "Not Started" },
          progress: { value: "In Progress" },
          completed: { value: "Completed" },
        },
      }),
    },
    client: {
      type: Client,
      async resolve(parents, args) {
        console.log(parents.clientId);
        const result = await Clients.findById(parents.clientId);
        console.log(result);
        return { ...result._doc, id: result._id };
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "query",
  fields: () => ({
    client: {
      type: Client,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        const list = await Clients.find({ _id: args.id });
        return { ...list._doc, id: list._id };
      },
    },
    clients: {
      type: new GraphQLList(Client),
      async resolve() {
        const list = await Clients.find({});
        const returningList = list.map((result) => {
          return { ...result, id: result._id };
        });
        return returningList;
      },
    },
    projects: {
      type: new GraphQLList(Project),
      async resolve() {
        const list = await Projects.find({});
        const returningList = list.map((result) => {
          return { ...result, id: result._id };
        });
        return returningList;
      },
    },
    project: {
      type: Project,
      args: { id: { type: GraphQLID } },
      async resolve(parents, args) {
        const result = await Projects.find({ id: args.id });
        return { ...result, id: result._id };
      },
    },
  }),
});

const RootMutation = new GraphQLObjectType({
  name: "mutation",
  fields: () => ({
    addClient: {
      type: Client,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parents, args) {
        const addedClient = new Clients({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });
        const result = await addedClient.save();
        return { ...result._doc, id: result._id };
      },
    },
    deleteClient: {
      type: Client,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      async resolve(parents, args) {
        const deletedClient = Clients.findByIdAndDelete(args.id);
        return { ...deletedClient._doc, id: deletedClient._id };
      },
    },
    addProject: {
      type: Project,
      args: {
        clientId: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
      },
      async resolve(parents, args) {
        const addedProject = await Projects({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });
        const result = await addedProject.save();
        return { ...result._doc, id: result._id };
      },
    },
    deleteProject: {
      type: Project,
      args: { id: { type: GraphQLID } },
      async resolve(parents, args) {
        const deletedProject = Projects.findByIdAndDelete(args.id);
        return { ...deletedProject._doc, id: deletedProject._id };
      },
    },
    updateProject: {
      type: Project,
      args: {
        id: { type: GraphQLID },
        clientId: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatusUpdate",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
  
          }),
        },
      },
      async resolve(parents,args){

      }
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

module.exports = schema;
