const graphql = require("graphql");
const {projects,clients}= require('../sampleData')
const _ =require('lodash');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLNumber,
  GraphQLString,
  GraphQLID,
  GraphQLList
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
// id: '4',
// clientId: '4',
// name: 'Design Prototype',
// description:
//   'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu.',
// status: 'Done',
const Project= new GraphQLObjectType({
  name: "project",
  fields: () => ({
  id:{type:GraphQLID},
  clientId:{type:GraphQLID},
  name:{type:GraphQLString},
  description:{type:GraphQLString},
  status:{type:GraphQLString},
  client:{
    type:Client,
    resolve(parents,args){
      return _.find(clients,{id:parents.clientId})
    }
  }
  })
})

const RootQuery = new GraphQLObjectType({
  name: "query",
  fields: () => ({
    client:{
      type:Client,
      args:{id: { type: GraphQLID}},
      resolve(parent,args){
           return _.find(clients,{id:args.id})
      }
    },
    clients:{
        type:new GraphQLList(Client) ,
        resolve(){
          const returnValue=_.values(clients).map(x=>{return{...x}})
          console.log(returnValue);
            return returnValue;
        }
    },
    projects:{
      type:new GraphQLList(Project),
      resolve(){
        return _.values(projects).map(x=>{return {...x}})
      }
    },
    project:{
     type:Project,
     args:{id:{type:GraphQLID}},
     resolve(parents,args){
       return _.find(projects,{id:args.id})
     }
    }

  }),
});
// const RootMutation = new GraphQLObjectType({
//   name: "mutation",
//   fields: () => ({}),
// });

const schema = new GraphQLSchema({
  query: RootQuery,
 // mutation: RootMutation,
});

module.exports = schema;
