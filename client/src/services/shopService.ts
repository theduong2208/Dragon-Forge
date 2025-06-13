import type { Item } from '../types/item';
import config from '../config';

// Lấy danh sách items
export const getItems = async (): Promise<Item[]> => {
  const response = await fetch(`${config.API_URL}/shop/items`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch items');
  }

  return response.json();
};

// Mua item
export const purchaseItem = async (itemId: string): Promise<void> => {
  const response = await fetch(`${config.API_URL}/shop/purchase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ itemId })
  });

  if (!response.ok) {
    throw new Error('Failed to purchase item');
  }
}; 