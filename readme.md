For prisma setup
1. Install prisma CLI : (Dev dependency)
   npm i  prisma -D  

2. Check prisma CLI is working 
    npx prisma

3. Initialize prisma project
   npx prisma init
   It will create the prisma folder in root level  containing schema.prisma file 
   We will create the db model in schema.prisma file to interact with db
   Also create the .env file for application entrainment 
   DATABASE_URL 

4. Go to VS code extension and add prisma extension for .prisma file

5. Write your db table schema into prisma/schema.prisma file

6. To migrate db 

   npx prisma migrate dev --name init

   It will create migrations folder with sql .files

7. To view database 
   npx prisma studio  

GraphQL   

8. To play out graphql query 
   http://localhost:4000/graphql


9. To add data : Mutation  
create Author
mutation {
  addAuthor(name: "jeevan", age: 30) {
    name
    age
  }
} 

create Book
mutation {
  addBook(name: "Name of the Wind", genre: "Fantasy", authorId: "1") {
    name
    genre
  }
}

10. To fetch query 

a. Get all books

{
  books {
    name
    id
  }
}
books with author data 

{
  books {
    name
    id
    author {
      name
      age
    }
  }
}

b. Get all authors

{
  authors {
    name
    age
    id
  }
}

author with all books
{
  authors {
    name
    age
    books {
      id
      name
    }
  }
}
