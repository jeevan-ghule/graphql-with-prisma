For prisma setup
1. Install dependency 
    npm install

2. Check prisma CLI is working 
    npx prisma
    or install new package
    prisma CLI : (Dev dependency)
    npm i  prisma -D  

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
  addAuthor(name: "jeevan", age: 31) {
    name
    age
    id
  }
} 

create Book
mutation {
  addBook(name: "Name of the Wind", genre: "Fantasy", authorId: "1") {
    name
    genre
  }
}

delete author
mutation {
     deleteAuthor(id: "1")
}

delete book
mutation {
     deleteBook(id: "1")
}

update book
mutation {
  updateBook(id: "1", name: "Jeevan books", genre: "ddd") {
    name
    genre
    author {
      name
    }
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


refer:
1. rootValue vs context 
  https://stackoverflow.com/questions/54303171/graphql-what-is-rootvalue-specification-that-is-passed-to-execute