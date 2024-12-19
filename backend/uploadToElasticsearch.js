const fs = require('fs');
const { Client } = require('@elastic/elasticsearch');

const client = new Client({ node: 'http://localhost:9200' });
const bulkData = fs.readFileSync('products_bulk.json', 'utf8');

async function bulkUpload() {
  try {
    const response = await client.bulk({
      refresh: true,
      body: bulkData.split('\n').filter(line => line.trim() !== ''),
    });
    console.log('Bulk upload completed:', response);
  } catch (error) {
    console.error('Error during bulk upload:', error);
  }
}

bulkUpload();
