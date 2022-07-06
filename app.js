const express = require("express")
const { graphqlHTTP } = require("express-graphql")
const schema = require("./schema/schema")
const app = express()

app.use(express.json())
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))
// app.use('/api/post', require('./routes/post'))

app.get("/", (req, res) => {
    res.send("graphQl working")
})

app.listen(4000, () => {
    console.log("listen on 4000")
})