import { Router } from 'express'
import {
  getAllProducts,
  searchProducts
} from '../services/productService.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const products = await getAllProducts()

    res.json(products)
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error
        ? error.message
        : 'Unknown error'
    })
  }
})

router.get('/search', async (req, res) => {
  try {
    const filters = {
      category: req.query.category as string | undefined,

      max_price: req.query.max_price
        ? Number(req.query.max_price)
        : undefined,

      min_ram: req.query.min_ram
        ? Number(req.query.min_ram)
        : undefined,

      brand: req.query.brand as string | undefined
    }

    const products = await searchProducts(filters)

    res.json(products)
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error
        ? error.message
        : 'Unknown error'
    })
  }
})

export default router