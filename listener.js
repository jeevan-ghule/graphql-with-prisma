const { SubscriptionClient } = require('subscriptions-transport-ws');
const { ApolloClient, ApolloCache } = require('apollo-client');
const ws = require('ws');

const GRAPHQL_ENDPOINT = 'ws://localhost:4000/subscriptions';

const client = new SubscriptionClient(GRAPHQL_ENDPOINT, {
    reconnect: true,
}, ws);

client.onConnected(() => { console.log("onConnected") })

client.onConnecting(() => { console.log("onConnecting") })

client.onError((error) => { console.log("onError", error) })

const apolloClient = new ApolloClient({
    networkInterface: client,
});

// apolloClient.subscribe({
//     query: gql`
//       subscription authorAdded {
//         name
//         age
//       }`,
//     variables: {}
// }).subscribe({
//     next(data) {
//         // Notify your application with the new arrived data
//     }
// });