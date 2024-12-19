const fs = require('fs');
const csv = require('csv-parser');

const inputFile = 'products.csv';  // The path to your CSV file
const outputFile = 'products_bulk.json';  // Output file where we’ll store the formatted JSON data
const indexName = 'products';  // Your Elasticsearch index name

const writeStream = fs.createWriteStream(outputFile);

// Parse CSV and convert it to Elasticsearch bulk API format
fs.createReadStream(inputFile)
  .pipe(csv())
  .on('data', (row) => {
    const id = row.id;  // Assuming 'id' is the unique identifier in your CSV, modify it if necessary
    writeStream.write(
      JSON.stringify({ index: { _index: indexName, _id: id } }) + '\n'
    );
    writeStream.write(JSON.stringify(row) + '\n');
  })
  .on('end', () => {
    console.log(`Bulk JSON file created: ${outputFile}`);
    writeStream.end();
  });
