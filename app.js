const express = require("express")
const { graphqlHTTP } = require("express-graphql")
const schema = require("./schema/schema")
const app = express()

function someFunctionToGetRootValue(request, response, graphQLParams) {
    // we can check here for user login 
    console.log("someFunctionToGetRootValue", graphQLParams)
}


function customValidateFn(request, response, graphQLParams) {
    console.log("customValidateFn", graphQLParams)
}

app.use(express.json())
app.use('/graphql', graphqlHTTP(async (request, response, graphQLParams) => ({
    schema: schema,
    rootValue: await someFunctionToGetRootValue(request, response, graphQLParams),
    graphiql: true,
    customValidateFn: customValidateFn(request, response, graphQLParams),
    customFormatErrorFn: (error) => ({
        message: error.message,
        locations: error.locations,
        stack: error.stack ? error.stack.split('\n') : [],
        path: error.path,
        jeevan: "ghule"
    })
})))



// app.use('/api/post', require('./routes/post'))

app.get("/", (req, res) => {
    res.send("graphQl working")
})

app.listen(4000, () => {
    console.log("listen on 4000")
})