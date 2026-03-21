import React from 'react';
import { MdRestaurant } from 'react-icons/md';

export const FoodMenuTenant = () => {
  const menuData = [
    { day: 'Monday', breakfast: 'Poha', lunch: 'Dal Rice', dinner: 'Chapati Sabzi' },
    { day: 'Tuesday', breakfast: 'Idli', lunch: 'Chole Bhature', dinner: 'Rice Dal' },
    { day: 'Wednesday', breakfast: 'Paratha', lunch: 'Rajma Rice', dinner: 'Roti Paneer' },
    { day: 'Thursday', breakfast: 'Upma', lunch: 'Aloo Gobi', dinner: 'Khichdi' },
    { day: 'Friday', breakfast: 'Sandwich', lunch: 'Paneer Butter Masala', dinner: 'Biryani' },
    { day: 'Saturday', breakfast: 'Dosa', lunch: 'chana masala', dinner: 'bhindi masala' },
    { day: 'Sunday', breakfast: 'Pancakes', lunch: 'Pizza', dinner: 'Pasta' }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Weekly Food Menu
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuData.map((item, index) => (
          <div key={index} className="bg-white shadow-md p-6 rounded-lg border">
            <div className="flex items-center mb-4">
              <MdRestaurant className="text-orange-500 text-2xl mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">{item.day}</h2>
            </div>
            <div className="space-y-2">
              <p><span className="font-medium text-gray-600">Breakfast:</span> {item.breakfast}</p>
              <p><span className="font-medium text-gray-600">Lunch:</span> {item.lunch}</p>
              <p><span className="font-medium text-gray-600">Dinner:</span> {item.dinner}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
