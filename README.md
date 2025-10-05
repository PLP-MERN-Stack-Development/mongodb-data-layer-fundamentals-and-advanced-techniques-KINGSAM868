 plp_bookstore — MongoDB Assignment

## Objective
Populate the `plp_bookstore` database and demonstrate CRUD, advanced queries, aggregation pipelines, and indexing with explain outputs.

## Files included
- `insert_books.js` — Node script that inserts sample book documents (drops collection if it exists).
- `queries.js` — Node script that runs CRUD queries, advanced queries, aggregations, creates indexes, and prints explain() results.
- `compass_sample.png` — Screenshot of MongoDB Compass / Atlas showing `plp_bookstore.books`.
- `.gitignore` — excludes node_modules.

## Requirements
- Node.js (v14+ recommended)
- npm
- MongoDB (local) OR a MongoDB Atlas free cluster

## Setup & Run (Local MongoDB)
1. Install dependencies:
   ```bash
   npm install
   npm i mongodb
Start local MongoDB server (if using community edition).

Run the insert script:

bash
Copy code
node insert_books.js
Run the queries script:

bash
Copy code
node queries.js
Setup & Run (Atlas)
Create a free Atlas cluster and a DB user; update IP access as needed.

Replace uri in both insert_books.js and queries.js with your Atlas connection string.

In terminal:

bash
Copy code
npm install
node insert_books.js
node queries.js
What to expect
insert_books.js inserts the sample documents into plp_bookstore.books. It will drop the collection and re-insert if it finds existing documents.

queries.js:

Runs requested CRUD operations (find, update, delete).

Runs advanced queries with projection, sorting, and pagination.

Runs aggregation pipelines: average price by genre, author with most books, decade grouping.

Creates indexes: title and a compound author + published_year.

Prints explain('executionStats') output for a sample query before and after index creation.

Notes & Troubleshooting
If the autograder expects mongosh scripts instead of Node.js, please swap to the provided mongosh versions or run scripts inside mongosh as: mongosh then load('insert_books.js').

If you re-run the insert script, it drops the collection to avoid duplicates.

Save your screenshot as compass_sample.png in the repo root before committing. plp_bookstore — MongoDB Assignment

## Objective
Populate the `plp_bookstore` database and demonstrate CRUD, advanced queries, aggregation pipelines, and indexing with explain outputs.

## Files included
- `insert_books.js` — Node script that inserts sample book documents (drops collection if it exists).
- `queries.js` — Node script that runs CRUD queries, advanced queries, aggregations, creates indexes, and prints explain() results.
- `compass_sample.png` — Screenshot of MongoDB Compass / Atlas showing `plp_bookstore.books`.
- `.gitignore` — excludes node_modules.

## Requirements
- Node.js (v14+ recommended)
- npm
- MongoDB (local) OR a MongoDB Atlas free cluster

## Setup & Run (Local MongoDB)
1. Install dependencies:
   ```bash
   npm install
   npm i mongodb
Start local MongoDB server (if using community edition).

Run the insert script:

bash
Copy code
node insert_books.js
Run the queries script:

bash
Copy code
node queries.js
Setup & Run (Atlas)
Create a free Atlas cluster and a DB user; update IP access as needed.

Replace uri in both insert_books.js and queries.js with your Atlas connection string.

In terminal:

bash
Copy code
npm install
node insert_books.js
node queries.js
What to expect
insert_books.js inserts the sample documents into plp_bookstore.books. It will drop the collection and re-insert if it finds existing documents.

queries.js:

Runs requested CRUD operations (find, update, delete).

Runs advanced queries with projection, sorting, and pagination.

Runs aggregation pipelines: average price by genre, author with most books, decade grouping.

Creates indexes: title and a compound author + published_year.

Prints explain('executionStats') output for a sample query before and after index creation.

Notes & Troubleshooting
If the autograder expects mongosh scripts instead of Node.js, please swap to the provided mongosh versions or run scripts inside mongosh as: mongosh then load('insert_books.js').

If you re-run the insert script, it drops the collection to avoid duplicates.

Save your screenshot as compass_sample.png in the repo root before committing.