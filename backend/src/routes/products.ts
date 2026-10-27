import { Router } from 'express'
import {
  getAllProducts,
  searchProducts,
  getProductById
} from '../services/productService.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const products = await getAllProducts()
    res.json(products)
  } catch (error) {
    res.status(500).json({
      error: 'Unable to fetch products'
    })
  }
})

router.get('/search', async (req, res) => {
  try {
    const rawMaxPrice = req.query.max_price
    const rawMinRam = req.query.min_ram

    const filters = {
      category: typeof req.query.category === 'string' ? req.query.category : undefined,
      max_price: rawMaxPrice !== undefined && !isNaN(Number(rawMaxPrice))
        ? Number(rawMaxPrice)
        : undefined,
      min_ram: rawMinRam !== undefined && !isNaN(Number(rawMinRam))
        ? Number(rawMinRam)
        : undefined,
      brand: typeof req.query.brand === 'string' ? req.query.brand : undefined
    }

    const products = await searchProducts(filters)
    res.json(products)
  } catch (error) {
    res.status(500).json({
      error: 'Unable to search products'
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'Valid product id is required' })
      return
    }

    const product = await getProductById(id)
    if (!product) {
      res.status(404).json({ error: 'Product not found' })
      return
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({
      error: 'Unable to retrieve product details'
    })
  }
})

export default router