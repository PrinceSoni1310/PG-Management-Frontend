import React, { useState, useEffect } from 'react';
import { MdRestaurant, MdEdit, MdSave, MdDelete, MdAdd, MdCalendarToday, MdDateRange, MdWarning, MdToday } from 'react-icons/md';
import { foodAPI } from '../../services/api';
import { toast } from 'react-toastify';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const WEEKS = [
  { weekNumber: 1, weekLabel: '1st Week' },
  { weekNumber: 2, weekLabel: '2nd Week' },
  { weekNumber: 3, weekLabel: '3rd Week' },
  { weekNumber: 4, weekLabel: '4th Week' },
];

const emptyWeeklyMenu = () => DAYS.map(day => ({ day, breakfast: '', lunch: '', dinner: '' }));
const emptyMonthlyMenu = () => WEEKS.map(w => ({ ...w, weeklyMenu: emptyWeeklyMenu() }));

const getTodaysMenuFromMenus = (menuList) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = DAY_NAMES[today.getDay()];

  const isActive = (menu) => {
    const start = new Date(menu.startDate);
    const end = new Date(menu.endDate);
    return today >= new Date(start.getFullYear(), start.getMonth(), start.getDate()) &&
           today <= new Date(end.getFullYear(), end.getMonth(), end.getDate());
  };

  const weekly = menuList.find(m => m.menuType === 'weekly' && isActive(m));
  if (weekly) {
    const entry = weekly.weeklyMenu?.find(d => d.day === todayName);
    return entry ? { ...entry, source: 'weekly', menuTitle: weekly.title } : null;
  }

  const monthly = menuList.find(m => m.menuType === 'monthly' && isActive(m));
  if (monthly) {
    const weekIndex = Math.min(Math.floor((today.getDate() - 1) / 7), 3);
    const entry = monthly.monthlyMenu?.[weekIndex]?.weeklyMenu?.find(d => d.day === todayName);
    return entry ? { ...entry, source: 'monthly', menuTitle: monthly.title, weekLabel: monthly.monthlyMenu[weekIndex]?.weekLabel } : null;
  }

  return null;
};

export const FoodMenuOwner = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMenuType, setSelectedMenuType] = useState('weekly');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [pgId, setPgId] = useState(null);

  const [menuForm, setMenuForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    menuType: 'weekly',
    weeklyMenu: emptyWeeklyMenu(),
    monthlyMenu: emptyMonthlyMenu()
  });

  useEffect(() => {
    const storedPgId = localStorage.getItem('selectedPgId');
    if (storedPgId) {
      setPgId(storedPgId);
      fetchMenus(storedPgId);
    } else {
      setError('PG not found');
      setLoading(false);
    }
  }, []);

  const fetchMenus = async (id) => {
    try {
      setLoading(true);
      const response = await foodAPI.getAllFood();
      const allMenus = response.data.data || [];
      setMenus(allMenus.filter(menu => menu.pgId === id));
      setError(null);
    } catch (err) {
      setError('Failed to fetch menus');
    } finally {
      setLoading(false);
    }
  };

  // Check if a menu of this type already exists (not the one being edited)
  const existingMenuOfType = (type) =>
    menus.find(m => m.menuType === type && (!editingMenu || m._id !== editingMenu._id));

  const handleMenuTypeChange = (type) => {
    setSelectedMenuType(type);
    setShowCreateForm(false);
    setEditingMenu(null);
  };

  const handleCreateMenu = () => {
    if (existingMenuOfType(selectedMenuType)) {
      toast.error(`A ${selectedMenuType} menu already exists. Please edit or delete it first.`);
      return;
    }
    setEditingMenu(null);
    setMenuForm({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      menuType: selectedMenuType,
      weeklyMenu: emptyWeeklyMenu(),
      monthlyMenu: emptyMonthlyMenu()
    });
    setShowCreateForm(true);
  };

  const handleEditMenu = (menu) => {
    setEditingMenu(menu);
    setMenuForm({
      title: menu.title || '',
      description: menu.description || '',
      startDate: menu.startDate ? new Date(menu.startDate).toISOString().split('T')[0] : '',
      endDate: menu.endDate ? new Date(menu.endDate).toISOString().split('T')[0] : '',
      menuType: menu.menuType,
      weeklyMenu: menu.weeklyMenu?.length ? menu.weeklyMenu : emptyWeeklyMenu(),
      monthlyMenu: menu.monthlyMenu?.length ? menu.monthlyMenu : emptyMonthlyMenu()
    });
    setSelectedMenuType(menu.menuType);
    setShowCreateForm(true);
  };

  const handleSaveMenu = async () => {
    if (!menuForm.title || !menuForm.startDate || !menuForm.endDate) {
      toast.error('Please fill in title, start date and end date');
      return;
    }
    try {
      const menuData = { ...menuForm, pgId, startDate: new Date(menuForm.startDate), endDate: new Date(menuForm.endDate) };
      if (editingMenu) {
        await foodAPI.updateFood(editingMenu._id, menuData);
        toast.success('Menu updated successfully');
      } else {
        await foodAPI.createFood(menuData);
        toast.success('Menu created successfully');
      }
      setShowCreateForm(false);
      setEditingMenu(null);
      fetchMenus(pgId);
    } catch (error) {
      toast.error('Failed to save menu');
    }
  };

  const handleDeleteMenu = async (menuId) => {
    if (!window.confirm('Are you sure you want to delete this menu?')) return;
    try {
      await foodAPI.deleteFood(menuId);
      toast.success('Menu deleted successfully');
      fetchMenus(pgId);
    } catch (error) {
      toast.error('Failed to delete menu');
    }
  };

  const updateWeeklyMenu = (dayIndex, meal, value) => {
    const updated = [...menuForm.weeklyMenu];
    updated[dayIndex] = { ...updated[dayIndex], [meal]: value };
    setMenuForm(prev => ({ ...prev, weeklyMenu: updated }));
  };

  const updateMonthlyMenu = (weekIndex, dayIndex, meal, value) => {
    const updated = menuForm.monthlyMenu.map((week, wi) => {
      if (wi !== weekIndex) return week;
      const updatedDays = week.weeklyMenu.map((day, di) => {
        if (di !== dayIndex) return day;
        return { ...day, [meal]: value };
      });
      return { ...week, weeklyMenu: updatedDays };
    });
    setMenuForm(prev => ({ ...prev, monthlyMenu: updated }));
  };

  const filteredMenus = menus.filter(menu => menu.menuType === selectedMenuType);
  const existing = existingMenuOfType(selectedMenuType);

  if (loading) {
    return (
      <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
        <div className="text-center dark:text-gray-200">Loading menus...</div>
      </div>
    );
  }

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Food Menu Management</h1>
        {!showCreateForm && (
          <button
            onClick={handleCreateMenu}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 flex items-center gap-2"
          >
            <MdAdd /> Create Menu
          </button>
        )}
      </div>

      {/* Tabs — only Weekly and Monthly */}
      <div className="flex gap-4 mb-6">
        {[
          { type: 'weekly', label: 'Weekly Menu', icon: MdDateRange },
          { type: 'monthly', label: 'Monthly Menu', icon: MdCalendarToday }
        ].map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={() => handleMenuTypeChange(type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
              selectedMenuType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Icon /> {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* TODAY'S MENU — auto-derived from active weekly/monthly menu */}
      {(() => {
        const todayEntry = getTodaysMenuFromMenus(menus);
        const now = new Date();
        const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayName = DAY_NAMES[now.getDay()];
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <MdToday className="text-green-500 dark:text-green-400 text-2xl" />
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Today's Menu — {todayName}</h2>
                {todayEntry && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    From: {todayEntry.menuTitle}{todayEntry.weekLabel ? ` (${todayEntry.weekLabel})` : ''}
                  </p>
                )}
              </div>
            </div>
            {todayEntry ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Breakfast</h4>
                  <p className="text-gray-700 dark:text-gray-300">{todayEntry.breakfast || 'Not set'}</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Lunch</h4>
                  <p className="text-gray-700 dark:text-gray-300">{todayEntry.lunch || 'Not set'}</p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Dinner</h4>
                  <p className="text-gray-700 dark:text-gray-300">{todayEntry.dinner || 'Not set'}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No active menu covers today. Create a weekly or monthly menu with today's date in range.
              </p>
            )}
          </div>
        );
      })()}

      {/* Existing menu warning when trying to create */}
      {existing && !showCreateForm && (
        <div className="flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded-lg mb-6">
          <MdWarning className="text-xl shrink-0" />
          <p className="text-sm">A {selectedMenuType} menu already exists. You can only have one at a time. Edit or delete the existing one below.</p>
        </div>
      )}

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {editingMenu ? 'Edit' : 'Create'} {selectedMenuType === 'weekly' ? 'Weekly' : 'Monthly'} Menu
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input
                type="text"
                value={menuForm.title}
                onChange={(e) => setMenuForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Menu title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <input
                type="text"
                value={menuForm.description}
                onChange={(e) => setMenuForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Menu description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                value={menuForm.startDate}
                onChange={(e) => setMenuForm(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
              <input
                type="date"
                value={menuForm.endDate}
                onChange={(e) => setMenuForm(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Weekly Form */}
          {selectedMenuType === 'weekly' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Weekly Menu</h3>
              {menuForm.weeklyMenu.map((dayMenu, index) => (
                <div key={dayMenu.day} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">{dayMenu.day}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['breakfast', 'lunch', 'dinner'].map(meal => (
                      <div key={meal}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">{meal}</label>
                        <input
                          type="text"
                          value={dayMenu[meal]}
                          onChange={(e) => updateWeeklyMenu(index, meal, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder={`Enter ${meal}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Monthly Form */}
          {selectedMenuType === 'monthly' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Monthly Menu</h3>
              {menuForm.monthlyMenu.map((week, weekIndex) => (
                <div key={week.weekNumber} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h4 className="font-semibold text-base mb-4 text-blue-700 dark:text-blue-400">{week.weekLabel}</h4>
                  <div className="space-y-3">
                    {week.weeklyMenu.map((dayMenu, dayIndex) => (
                      <div key={dayMenu.day} className="border border-gray-100 dark:border-gray-700 rounded p-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{dayMenu.day}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {['breakfast', 'lunch', 'dinner'].map(meal => (
                            <div key={meal}>
                              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 capitalize">{meal}</label>
                              <input
                                type="text"
                                value={dayMenu[meal]}
                                onChange={(e) => updateMonthlyMenu(weekIndex, dayIndex, meal, e.target.value)}
                                className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                                placeholder={meal}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSaveMenu}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <MdSave /> Save Menu
            </button>
            <button
              onClick={() => { setShowCreateForm(false); setEditingMenu(null); }}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Menu List */}
      <div className="space-y-4">
        {filteredMenus.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center border border-gray-200 dark:border-gray-700">
            <MdRestaurant className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No {selectedMenuType} menu found.</p>
            <button
              onClick={handleCreateMenu}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Menu
            </button>
          </div>
        ) : (
          filteredMenus.map(menu => (
            <div key={menu._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{menu.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{menu.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(menu.startDate).toLocaleDateString()} - {new Date(menu.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditMenu(menu)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-1 text-sm"
                  >
                    <MdEdit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMenu(menu._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1 text-sm"
                  >
                    <MdDelete size={16} /> Delete
                  </button>
                </div>
              </div>

              {/* Weekly Preview */}
              {menu.menuType === 'weekly' && menu.weeklyMenu && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                  {menu.weeklyMenu.map(dayMenu => (
                    <div key={dayMenu.day} className="border border-gray-200 dark:border-gray-600 rounded p-3">
                      <h5 className="font-medium mb-2 text-gray-900 dark:text-gray-100 text-sm">{dayMenu.day}</h5>
                      <div className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                        <div><strong>B:</strong> {dayMenu.breakfast || 'Not set'}</div>
                        <div><strong>L:</strong> {dayMenu.lunch || 'Not set'}</div>
                        <div><strong>D:</strong> {dayMenu.dinner || 'Not set'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Monthly Preview */}
              {menu.menuType === 'monthly' && menu.monthlyMenu && (
                <div className="space-y-3 mt-2">
                  {menu.monthlyMenu.map(week => (
                    <div key={week.weekNumber}>
                      <h5 className="font-semibold text-sm text-blue-700 dark:text-blue-400 mb-2">{week.weekLabel}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {week.weeklyMenu?.map(dayMenu => (
                          <div key={dayMenu.day} className="border border-gray-200 dark:border-gray-600 rounded p-2">
                            <p className="font-medium text-xs text-gray-800 dark:text-gray-100 mb-1">{dayMenu.day}</p>
                            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-0.5">
                              <div><strong>B:</strong> {dayMenu.breakfast || '-'}</div>
                              <div><strong>L:</strong> {dayMenu.lunch || '-'}</div>
                              <div><strong>D:</strong> {dayMenu.dinner || '-'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
