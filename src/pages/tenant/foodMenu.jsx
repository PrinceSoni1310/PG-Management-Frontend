import React, { useState, useEffect } from 'react';
import { MdRestaurant, MdToday, MdDateRange, MdCalendarToday, MdRefresh } from 'react-icons/md';
import { foodAPI } from '../../services/api';

export const FoodMenuTenant = () => {
  const [menus, setMenus] = useState([]);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pgId, setPgId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showFullWeek, setShowFullWeek] = useState(false);

  // Fetch PG ID from localStorage
  useEffect(() => {
    const storedPgId = localStorage.getItem('pgId') ||
      JSON.parse(localStorage.getItem('user') || '{}')?.pgId;
    if (storedPgId) {
      setPgId(storedPgId);
      fetchFoodMenus(storedPgId);
    } else {
      setError('PG not found');
      setLoading(false);
    }
  }, []);

  const fetchFoodMenus = async (id) => {
    try {
      setLoading(true);
      const response = await foodAPI.getFood(id);
      const pgMenus = response.data.data || [];
      setMenus(pgMenus);
      determineCurrentMenu(pgMenus);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching food menus:', err);
      setError('Failed to fetch food menus');
    } finally {
      setLoading(false);
    }
  };

  const determineCurrentMenu = (menuList) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = DAYS[today.getDay()];

    // Only menus whose date range covers today
    const activeMenus = menuList.filter(menu => {
      const start = new Date(menu.startDate);
      const end = new Date(menu.endDate);
      // normalize to date-only for comparison
      return today >= new Date(start.getFullYear(), start.getMonth(), start.getDate()) &&
             today <= new Date(end.getFullYear(), end.getMonth(), end.getDate());
    });

    if (activeMenus.length === 0) { setCurrentMenu(null); return; }

    // Weekly — extract today's day entry
    const weeklyMenu = activeMenus.find(m => m.menuType === 'weekly');
    if (weeklyMenu) {
      const todayMenu = weeklyMenu.weeklyMenu?.find(d => d.day === todayName) || null;
      setCurrentMenu({ ...weeklyMenu, displayType: 'weekly', todayMenu });
      return;
    }

    // Monthly — find the correct week by day-of-month, then today's day entry
    const monthlyMenu = activeMenus.find(m => m.menuType === 'monthly');
    if (monthlyMenu) {
      const weekIndex = Math.min(Math.floor((today.getDate() - 1) / 7), 3);
      const currentWeek = monthlyMenu.monthlyMenu?.[weekIndex];
      const todayMenu = currentWeek?.weeklyMenu?.find(d => d.day === todayName) || null;
      setCurrentMenu({ ...monthlyMenu, displayType: 'monthly', todayMenu, currentWeekIndex: weekIndex });
      return;
    }

    setCurrentMenu(null);
  };

  const getMenuIcon = (menuType) => {
    switch (menuType) {
      case 'daily': return MdToday;
      case 'weekly': return MdDateRange;
      case 'monthly': return MdCalendarToday;
      default: return MdRestaurant;
    }
  };

  const getMenuTypeLabel = (menuType) => {
    switch (menuType) {
      case 'weekly': return "Today's Menu";
      case 'monthly': return "Today's Menu";
      default: return 'Menu';
    }
  };

  if (loading) {
    return (
      <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-300">Loading food menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Food Menu
        </h1>
        <div className="flex items-center space-x-4">
          {lastUpdated && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {lastUpdated.toLocaleString()}
            </span>
          )}
          <button
            onClick={() => pgId && fetchFoodMenus(pgId)}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            <MdRefresh className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {!currentMenu ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <MdRestaurant className="text-gray-300 dark:text-gray-500 text-6xl mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">No active food menu available</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Please check back later or contact your PG owner</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Menu Header */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {React.createElement(getMenuIcon(currentMenu.displayType), {
                  className: "text-blue-500 dark:text-blue-400 text-3xl mr-4"
                })}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{currentMenu.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300">{currentMenu.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {getMenuTypeLabel(currentMenu.displayType)} • Valid until {new Date(currentMenu.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Content */}
          {currentMenu.displayType === 'daily' && currentMenu.dailyMenu && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Today's Menu</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Breakfast</h4>
                  <p className="text-gray-700 dark:text-gray-300">{currentMenu.dailyMenu.breakfast || 'Not available'}</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Lunch</h4>
                  <p className="text-gray-700 dark:text-gray-300">{currentMenu.dailyMenu.lunch || 'Not available'}</p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Dinner</h4>
                  <p className="text-gray-700 dark:text-gray-300">{currentMenu.dailyMenu.dinner || 'Not available'}</p>
                </div>
              </div>
            </div>
          )}

          {currentMenu.displayType === 'weekly' && currentMenu.todayMenu && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{currentMenu.todayMenu.day}'s Menu</h3>
                <button
                  onClick={() => setShowFullWeek(prev => !prev)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <MdDateRange />
                  {showFullWeek ? 'Show Today Only' : 'View Full Week'}
                </button>
              </div>

              {!showFullWeek ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Breakfast</h4>
                    <p className="text-gray-700 dark:text-gray-300">{currentMenu.todayMenu.breakfast || 'Not available'}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Lunch</h4>
                    <p className="text-gray-700 dark:text-gray-300">{currentMenu.todayMenu.lunch || 'Not available'}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Dinner</h4>
                    <p className="text-gray-700 dark:text-gray-300">{currentMenu.todayMenu.dinner || 'Not available'}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentMenu.weeklyMenu.map((dayMenu, index) => (
                    <div key={index} className={`border rounded-lg p-4 ${
                      dayMenu.day === currentMenu.todayMenu.day
                        ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                    }`}>
                      <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        {dayMenu.day}
                        {dayMenu.day === currentMenu.todayMenu.day && (
                          <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">Today</span>
                        )}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Breakfast:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{dayMenu.breakfast || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Lunch:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{dayMenu.lunch || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Dinner:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{dayMenu.dinner || '-'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentMenu.displayType === 'weekly' && !currentMenu.todayMenu && currentMenu.weeklyMenu && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Weekly Menu</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentMenu.weeklyMenu.map((dayMenu, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                    <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">{dayMenu.day}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Breakfast:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{dayMenu.breakfast || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Lunch:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{dayMenu.lunch || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Dinner:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{dayMenu.dinner || '-'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentMenu.displayType === 'monthly' && currentMenu.monthlyMenu && (() => {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const todayName = days[today.getDay()];
            const weekIndex = currentMenu.currentWeekIndex ?? Math.min(Math.floor((today.getDate() - 1) / 7), 3);
            const currentWeek = currentMenu.monthlyMenu[weekIndex];
            const todayEntry = currentMenu.todayMenu;
            return (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Today's Menu <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({currentWeek?.weekLabel})</span>
                  </h3>
                  <button
                    onClick={() => setShowFullWeek(prev => !prev)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <MdDateRange />
                    {showFullWeek ? 'Show Today Only' : 'View Full Month'}
                  </button>
                </div>
                {!showFullWeek ? (
                  todayEntry ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                        <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Breakfast</h4>
                        <p className="text-gray-700 dark:text-gray-300">{todayEntry.breakfast || 'Not available'}</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Lunch</h4>
                        <p className="text-gray-700 dark:text-gray-300">{todayEntry.lunch || 'Not available'}</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Dinner</h4>
                        <p className="text-gray-700 dark:text-gray-300">{todayEntry.dinner || 'Not available'}</p>
                      </div>
                    </div>
                  ) : <p className="text-gray-500 dark:text-gray-400">No menu for today</p>
                ) : (
                  <div className="space-y-4">
                    {currentMenu.monthlyMenu.map(week => (
                      <div key={week.weekNumber}>
                        <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-400 mb-2">{week.weekLabel}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {week.weeklyMenu?.map((dayMenu, i) => (
                            <div key={i} className={`border rounded-lg p-3 ${
                              week.weekNumber === weekIndex + 1 && dayMenu.day === todayName
                                ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                            }`}>
                              <p className="font-medium text-xs text-gray-800 dark:text-gray-100 mb-1 flex items-center gap-1">
                                {dayMenu.day}
                                {week.weekNumber === weekIndex + 1 && dayMenu.day === todayName && (
                                  <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">Today</span>
                                )}
                              </p>
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
            );
          })()}
        </div>
      )}
    </div>
  );
};
