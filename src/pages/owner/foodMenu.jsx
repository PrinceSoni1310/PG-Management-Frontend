import React, { useState } from 'react';
import { MdRestaurant, MdEdit, MdSave } from 'react-icons/md';

export const FoodMenuOwner = () => {
  const [menuData, setMenuData] = useState([
    { day: 'Monday', breakfast: 'Poha', lunch: 'Dal Rice', dinner: 'Chapati Sabzi' },
    { day: 'Tuesday', breakfast: 'Idli', lunch: 'Chole Bhature', dinner: 'Rice Dal' },
    { day: 'Wednesday', breakfast: 'Paratha', lunch: 'Rajma Rice', dinner: 'Roti Paneer' },
    { day: 'Thursday', breakfast: 'Upma', lunch: 'Aloo Gobi', dinner: 'Khichdi' },
    { day: 'Friday', breakfast: 'Sandwich', lunch: 'Paneer Butter Masala', dinner: 'Biryani' },
    { day: 'Saturday', breakfast: 'Dosa', lunch: 'chana masala', dinner: 'Bhindi masala' },
    { day: 'Sunday', breakfast: 'Pancakes', lunch: 'Pizza', dinner: 'Pasta' }
  ]);

  const [editingDay, setEditingDay] = useState(null);
  const [editForm, setEditForm] = useState({ breakfast: '', lunch: '', dinner: '' });

  const handleEdit = (day) => {
    const item = menuData.find(m => m.day === day);
    setEditForm({ breakfast: item.breakfast, lunch: item.lunch, dinner: item.dinner });
    setEditingDay(day);
  };

  const handleSave = () => {
    setMenuData(menuData.map(item =>
      item.day === editingDay ? { ...item, ...editForm } : item
    ));
    setEditingDay(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Food Menu Management
      </h1>

      <div className="space-y-6">
        {menuData.map((item, index) => (
          <div key={index} className="bg-white shadow-md p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <MdRestaurant className="text-orange-500 text-2xl mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">{item.day}</h2>
              </div>
              {editingDay === item.day ? (
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
                >
                  <MdSave className="mr-2" />
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(item.day)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
                >
                  <MdEdit className="mr-2" />
                  Edit
                </button>
              )}
            </div>
            {editingDay === item.day ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-600 mb-2">Breakfast</label>
                  <input
                    type="text"
                    value={editForm.breakfast}
                    onChange={(e) => setEditForm({ ...editForm, breakfast: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">Lunch</label>
                  <input
                    type="text"
                    value={editForm.lunch}
                    onChange={(e) => setEditForm({ ...editForm, lunch: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">Dinner</label>
                  <input
                    type="text"
                    value={editForm.dinner}
                    onChange={(e) => setEditForm({ ...editForm, dinner: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Breakfast</p>
                  <p className="font-medium">{item.breakfast}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lunch</p>
                  <p className="font-medium">{item.lunch}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dinner</p>
                  <p className="font-medium">{item.dinner}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
