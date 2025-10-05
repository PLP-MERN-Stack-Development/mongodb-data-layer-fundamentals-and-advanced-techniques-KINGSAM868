// queries.js
// Run with: node queries.js
// Requires: npm install mongodb

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // <-- replace with Atlas connection string if needed
const dbName = 'plp_bookstore';
const collName = 'books';

async function logExplainMinimal(name, explainObj) {
  // Defensive printing: explain shapes vary
  const exec = explainObj.executionStats || explainObj;
  const time = exec.executionTimeMillis ?? exec.executionTimeMillisEstimate ?? 'n/a';
  const docs = exec.totalDocsExamined ?? exec.docsExamined ?? 'n/a';
  const keys = exec.totalKeysExamined ?? exec.keysExamined ?? 'n/a';
  console.log(`\n[${name}] executionTimeMillis: ${time}, totalDocsExamined: ${docs}, totalKeysExamined: ${keys}`);
}

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const col = db.collection(collName);

    // -------------------------
    // Helpful: remove non-_id indexes for a clean 'before' explain
    try {
      await col.dropIndexes();
      console.log('Dropped non-_id indexes (baseline).');
    } catch (e) {
      console.log('No non-_id indexes to drop or drop failed:', e.message);
    }

    // -------------------------
    // Explain BEFORE creating indexes (for title query)
    const sampleQuery = { title: '1984' };
    const explainBefore = await col.find(sampleQuery).explain('executionStats');
    await logExplainMinimal('BEFORE INDEX', explainBefore);

    // -------------------------
    // Basic CRUD operations

    // 1) Find all books in a specific genre
    const genre = 'Fiction';
    console.log(`\nFind books in genre: ${genre}`);
    console.log(await col.find({ genre }).toArray());

    // 2) Find books published after a certain year
    const year = 1950;
    console.log(`\nFind books published after ${year}`);
    console.log(await col.find({ published_year: { $gt: year } }).toArray());

    // 3) Find books by a specific author
    const author = 'George Orwell';
    console.log(`\nFind books by author: ${author}`);
    console.log(await col.find({ author }).toArray());

    // 4) Update the price of a specific book
    const titleToUpdate = 'The Hobbit';
    const newPrice = 17.99;
    const upd = await col.updateOne({ title: titleToUpdate }, { $set: { price: newPrice } });
    console.log(`\nUpdate price of "${titleToUpdate}" -> matched ${upd.matchedCount}, modified ${upd.modifiedCount}`);

    // 5) Delete a book by its title
    const titleToDelete = 'Moby Dick';
    const del = await col.deleteOne({ title: titleToDelete });
    console.log(`\nDelete "${titleToDelete}" -> deletedCount: ${del.deletedCount}`);

    // -------------------------
    // Advanced queries

    // 6) Books that are in stock and published after 2010 (projection)
    console.log('\nBooks in stock and published after 2010 (projection: title,author,price)');
    console.log(await col.find({ in_stock: true, published_year: { $gt: 2010 } }, { projection: { title: 1, author: 1, price: 1, _id: 0 } }).toArray());

    // 7 & 8) Sorting by price asc/desc
    console.log('\nBooks sorted by price ascending (title, price)');
    console.log(await col.find({}, { projection: { title: 1, price: 1, _id: 0 } }).sort({ price: 1 }).toArray());

    console.log('\nBooks sorted by price descending (title, price)');
    console.log(await col.find({}, { projection: { title: 1, price: 1, _id: 0 } }).sort({ price: -1 }).toArray());

    // 9) Pagination - 5 books per page
    const perPage = 5;
    async function page(p) {
      const skip = (p - 1) * perPage;
      return col.find({}, { projection: { title: 1, price: 1, _id: 0 } }).sort({ price: 1 }).skip(skip).limit(perPage).toArray();
    }
    console.log('\nPage 1 (first 5 books by price asc):');
    console.log(await page(1));
    console.log('\nPage 2 (next 5 books by price asc):');
    console.log(await page(2));

    // -------------------------
    // Aggregation pipelines

    // 10) Average price of books by genre
    console.log('\nAggregation: average price by genre');
    console.log(await col.aggregate([
      { $group: { _id: '$genre', avgPrice: { $avg: '$price' }, count: { $sum: 1 } } },
      { $sort: { avgPrice: -1 } }
    ]).toArray());

    // 11) Author with the most books
    console.log('\nAggregation: author with the most books');
    console.log(await col.aggregate([
      { $group: { _id: '$author', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]).toArray());

    // 12) Group books by publication decade and count
    console.log('\nAggregation: count books by publication decade');
    console.log(await col.aggregate([
      { $addFields: { decade: { $multiply: [{ $floor: { $divide: ['$published_year', 10] } }, 10] } } },
      { $group: { _id: '$decade', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray());

    // -------------------------
    // Indexing

    console.log('\nCreate index on title');
    const idx1 = await col.createIndex({ title: 1 });
    console.log('Created index:', idx1);

    console.log('\nCreate compound index on author and published_year');
    const idx2 = await col.createIndex({ author: 1, published_year: -1 });
    console.log('Created index:', idx2);

    // -------------------------
    // Explain AFTER indexing (same sample query)
    const explainAfter = await col.find(sampleQuery).explain('executionStats');
    await logExplainMinimal('AFTER INDEX', explainAfter);

    // Print some human-friendly compare notes
    console.log('\nCompare BEFORE vs AFTER: look at executionTimeMillis, totalDocsExamined, and totalKeysExamined above.');
    console.log('Expect BEFORE to show COLLSCAN (collection scan) and AFTER to show IXSCAN (index scan) or fewer docs examined.');

  } catch (err) {
    console.error('Error in queries.js:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

run().catch(console.error);
