import type { Product } from '../types/product'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({
  product
}: ProductCardProps) {
  return (
    <div>
      <img
        src={product.image_url ?? ''}
        alt={product.name}
      />

      <h2>{product.name}</h2>

      <p>
        {product.brand} · {product.category}
      </p>

      <p>
        RAM: {product.ram ?? 'N/A'}GB
      </p>

      <p>
        Storage: {product.storage ?? 'N/A'}GB
      </p>

      <p>
        CPU: {product.cpu ?? 'N/A'}
      </p>

      <p>
        GPU: {product.gpu ?? 'N/A'}
      </p>

      <strong>
        ${product.price}
      </strong>
    </div>
  )
}