'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth';
import { useProductManagement, useProductForm } from '@/hooks/products';

interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string;
  price: number;
  stock: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { products, isLoading, createProduct, deleteWithConfirmation } =
    useProductManagement();
  const { showForm, formData, handleChange, resetForm, toggleForm, getFormattedData } =
    useProductForm();

  const handleLogout = async () => {
    await logout();
    router.push('/sign-in');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProduct(getFormattedData());
    resetForm();
  };

  const handleDelete = async (id: number) => {
    await deleteWithConfirmation(id);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            <div className='flex items-center'>
              <h1 className='text-xl font-bold'>Products (JWT)</h1>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='text-gray-700'>Welcome, {user?.name}</span>
              <span className='text-xs bg-green-100 text-green-800 px-2 py-1 rounded'>
                JWT Auth
              </span>
              <button
                onClick={handleLogout}
                className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm'
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-semibold text-gray-900'>All Products</h2>
            <button
              onClick={toggleForm}
              className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium'
            >
              {showForm ? 'Cancel' : 'Add Product'}
            </button>
          </div>

          {showForm && (
            <div className='bg-white p-6 rounded-lg shadow mb-6'>
              <h3 className='text-lg font-medium mb-4'>New Product</h3>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Name
                    </label>
                    <input
                      type='text'
                      name='name'
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      SKU
                    </label>
                    <input
                      type='text'
                      name='sku'
                      required
                      value={formData.sku}
                      onChange={handleChange}
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                    />
                  </div>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Description
                  </label>
                  <textarea
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                    rows={3}
                  />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Price
                    </label>
                    <input
                      type='number'
                      name='price'
                      step='0.01'
                      required
                      value={formData.price}
                      onChange={handleChange}
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Stock
                    </label>
                    <input
                      type='number'
                      name='stock'
                      required
                      value={formData.stock}
                      onChange={handleChange}
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                    />
                  </div>
                </div>
                <button
                  type='submit'
                  className='w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md'
                >
                  Create Product
                </button>
              </form>
            </div>
          )}

          {isLoading ? (
            <div className='text-center py-12'>Loading...</div>
          ) : (
            <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Name
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      SKU
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Price
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Stock
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {(products as Product[]).map((product) => (
                    <tr key={product.id}>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm font-medium text-gray-900'>
                          {product.name}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {product.description?.substring(0, 50)}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {product.sku}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        ${product.price}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {product.stock}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm'>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className='text-red-600 hover:text-red-900'
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className='text-center py-12 text-gray-500'>
                  No products found. Add your first product!
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
