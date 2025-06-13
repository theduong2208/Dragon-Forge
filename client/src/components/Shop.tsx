import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import type { Item } from '../types/item';
import * as shopService from '../services/shopService';
import progressTracker from '../services/progressTracker';

const Shop: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await shopService.getItems();
      setItems(response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Could not load shop items');
      setLoading(false);
    }
  };

  const handlePurchase = async (item: Item) => {
    try {
      await shopService.purchaseItem(item._id);
      toast.success('Purchase successful!');
      
      // Cập nhật tiến độ nhiệm vụ
      await progressTracker.trackSpendCoins(item.price);
      
      // Cập nhật UI nếu cần
      // ...
    } catch (error) {
      console.error('Error purchasing item:', error);
      toast.error('Purchase failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Shop</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-md p-4">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img src="/src/assets/Coin button.png" alt="coin" className="w-6 h-6 mr-1" />
                <span className="text-yellow-600 font-semibold">{item.price}</span>
              </div>
              <button
                onClick={() => handlePurchase(item)}
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop; 