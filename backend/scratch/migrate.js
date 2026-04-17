const conn = require('../config/dbConnection');

async function migrate() {
  try {
    console.log('Starting migration...');
    
    const sql = `
      ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
      ALTER TABLE order_items ALTER COLUMN product_id DROP NOT NULL;
      ALTER TABLE order_items ADD CONSTRAINT order_items_product_id_fkey 
        FOREIGN KEY (product_id) REFERENCES products(id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE;
    `;
    
    await conn.query(sql);
    
    console.log('Migration successful: order_items updated.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
