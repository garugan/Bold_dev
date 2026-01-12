import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'

const app = express()
app.use(cors())
app.use(express.json())

// MySQL接続設定
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'bold_user',
  password: 'bold_pass',
  database: 'bold_dev',
  waitForConnections: true,
  connectionLimit: 10,
})

// ユーザー一覧取得
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id DESC')
    res.json(rows)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// ユーザー詳細取得
app.get('/api/users/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(rows[0])
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// ユーザー登録
app.post('/api/users', async (req, res) => {
  const { name, email, password } = req.body
  try {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    )
    const [rows] = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = ?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (error) {
    console.error('Error creating user:', error)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' })
    }
    res.status(500).json({ error: 'Failed to create user' })
  }
})

// ユーザー更新
app.put('/api/users/:id', async (req, res) => {
  const { name, email } = req.body
  try {
    await pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, req.params.id])
    const [rows] = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(rows[0])
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ error: 'Failed to update user' })
  }
})

// ユーザー削除
app.delete('/api/users/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({ message: 'User deleted' })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

// 顧客一覧取得
app.get('/api/customers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customers ORDER BY id DESC')
    res.json(rows)
  } catch (error) {
    console.error('Error fetching customers:', error)
    res.status(500).json({ error: 'Failed to fetch customers' })
  }
})

// 顧客詳細取得
app.get('/api/customers/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customers WHERE id = ?', [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' })
    }
    res.json(rows[0])
  } catch (error) {
    console.error('Error fetching customer:', error)
    res.status(500).json({ error: 'Failed to fetch customer' })
  }
})

// 顧客登録
app.post('/api/customers', async (req, res) => {
  const { name, address, phone, email } = req.body
  try {
    const [result] = await pool.query(
      'INSERT INTO customers (name, address, phone, email) VALUES (?, ?, ?, ?)',
      [name, address, phone, email]
    )
    const [rows] = await pool.query('SELECT * FROM customers WHERE id = ?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (error) {
    console.error('Error creating customer:', error)
    res.status(500).json({ error: 'Failed to create customer' })
  }
})

// 顧客更新
app.put('/api/customers/:id', async (req, res) => {
  const { name, address, phone, email } = req.body
  try {
    await pool.query(
      'UPDATE customers SET name = ?, address = ?, phone = ?, email = ? WHERE id = ?',
      [name, address, phone, email, req.params.id]
    )
    const [rows] = await pool.query('SELECT * FROM customers WHERE id = ?', [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' })
    }
    res.json(rows[0])
  } catch (error) {
    console.error('Error updating customer:', error)
    res.status(500).json({ error: 'Failed to update customer' })
  }
})

// 顧客削除
app.delete('/api/customers/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM customers WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Customer not found' })
    }
    res.json({ message: 'Customer deleted' })
  } catch (error) {
    console.error('Error deleting customer:', error)
    res.status(500).json({ error: 'Failed to delete customer' })
  }
})

// ========== 商品API ==========

// 商品一覧取得
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC')
    res.json(rows)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// 商品詳細取得
app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json(rows[0])
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// 商品登録
app.post('/api/products', async (req, res) => {
  const { code, name, category, price, stock, description } = req.body
  try {
    const [result] = await pool.query(
      'INSERT INTO products (code, name, category, price, stock, description) VALUES (?, ?, ?, ?, ?, ?)',
      [code, name, category, price, stock || 0, description || '']
    )
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (error) {
    console.error('Error creating product:', error)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: '商品コードが既に存在します' })
    }
    res.status(500).json({ error: 'Failed to create product' })
  }
})

// 商品更新
app.put('/api/products/:id', async (req, res) => {
  const { code, name, category, price, stock, description } = req.body
  try {
    await pool.query(
      'UPDATE products SET code = ?, name = ?, category = ?, price = ?, stock = ?, description = ? WHERE id = ?',
      [code, name, category, price, stock, description, req.params.id]
    )
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json(rows[0])
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({ error: 'Failed to update product' })
  }
})

// 商品削除
app.delete('/api/products/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json({ message: 'Product deleted' })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

// ========== 伝票API ==========

// 伝票一覧取得
app.get('/api/slips', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, c.name as customer_name,
        (SELECT COUNT(*) FROM slip_items WHERE slip_id = s.id) as item_count,
        (SELECT SUM(quantity * price) FROM slip_items WHERE slip_id = s.id) as total
      FROM slips s
      LEFT JOIN customers c ON s.customer_id = c.id
      ORDER BY s.id DESC
    `)
    res.json(rows)
  } catch (error) {
    console.error('Error fetching slips:', error)
    res.status(500).json({ error: 'Failed to fetch slips' })
  }
})

// 伝票詳細取得
app.get('/api/slips/:id', async (req, res) => {
  try {
    const [slips] = await pool.query(`
      SELECT s.*, c.name as customer_name, c.address as customer_address, c.phone as customer_phone
      FROM slips s
      LEFT JOIN customers c ON s.customer_id = c.id
      WHERE s.id = ?
    `, [req.params.id])
    if (slips.length === 0) {
      return res.status(404).json({ error: 'Slip not found' })
    }
    const [items] = await pool.query(`
      SELECT si.*, p.code as product_code, p.name as product_name
      FROM slip_items si
      LEFT JOIN products p ON si.product_id = p.id
      WHERE si.slip_id = ?
    `, [req.params.id])
    res.json({ ...slips[0], items })
  } catch (error) {
    console.error('Error fetching slip:', error)
    res.status(500).json({ error: 'Failed to fetch slip' })
  }
})

// 伝票登録
app.post('/api/slips', async (req, res) => {
  const { slip_number, customer_id, status, delivery_date, notes, items } = req.body
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    const [result] = await conn.query(
      'INSERT INTO slips (slip_number, customer_id, status, delivery_date, notes) VALUES (?, ?, ?, ?, ?)',
      [slip_number, customer_id, status || '準備中', delivery_date, notes || '']
    )
    const slipId = result.insertId
    if (items && items.length > 0) {
      for (const item of items) {
        await conn.query(
          'INSERT INTO slip_items (slip_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [slipId, item.product_id, item.quantity, item.price]
        )
      }
    }
    await conn.commit()
    const [slips] = await pool.query('SELECT * FROM slips WHERE id = ?', [slipId])
    res.status(201).json(slips[0])
  } catch (error) {
    await conn.rollback()
    console.error('Error creating slip:', error)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: '伝票番号が既に存在します' })
    }
    res.status(500).json({ error: 'Failed to create slip' })
  } finally {
    conn.release()
  }
})

// 伝票更新
app.put('/api/slips/:id', async (req, res) => {
  const { customer_id, status, delivery_date, notes, items } = req.body
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    await conn.query(
      'UPDATE slips SET customer_id = ?, status = ?, delivery_date = ?, notes = ? WHERE id = ?',
      [customer_id, status, delivery_date, notes, req.params.id]
    )
    await conn.query('DELETE FROM slip_items WHERE slip_id = ?', [req.params.id])
    if (items && items.length > 0) {
      for (const item of items) {
        await conn.query(
          'INSERT INTO slip_items (slip_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [req.params.id, item.product_id, item.quantity, item.price]
        )
      }
    }
    await conn.commit()
    const [slips] = await pool.query('SELECT * FROM slips WHERE id = ?', [req.params.id])
    if (slips.length === 0) {
      return res.status(404).json({ error: 'Slip not found' })
    }
    res.json(slips[0])
  } catch (error) {
    await conn.rollback()
    console.error('Error updating slip:', error)
    res.status(500).json({ error: 'Failed to update slip' })
  } finally {
    conn.release()
  }
})

// 伝票削除
app.delete('/api/slips/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM slips WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Slip not found' })
    }
    res.json({ message: 'Slip deleted' })
  } catch (error) {
    console.error('Error deleting slip:', error)
    res.status(500).json({ error: 'Failed to delete slip' })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
