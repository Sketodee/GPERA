"use client"
import { getUserCount, UserCountState} from '@/actions/user';
import { startTransition, useActionState, useEffect, useState } from 'react';
import ActiveUserComp from './ActiveUserComp';
import InactiveUserComp from './InactiveUserComp';

const initialState: UserCountState = {
  message: undefined, 
  error: undefined, 
  activeCount: 0,
  inactiveCount: 0
}

export default function DashboardComp() {

  const [state, action, pending] = useActionState(getUserCount, initialState)

  const [activeTab, setActiveTab] = useState('users');
  // Separate pagination states for each tab
  const [activeUsersPage, setActiveUsersPage] = useState(1);
  const [pendingUsersPage, setPendingUsersPage] = useState(1);
  const [counts, setCounts] = useState({ active: 0 , inactive: 0 });

  useEffect(() => {
    startTransition(() => {
        action();
      });
  }, [action]);
  


  
  // Separate total pages for each tab
  const totalActivePages = Math.ceil(state?.activeCount/2); //set this to the total count divided by 10 
  const totalPendingPages = Math.ceil(state?.inactiveCount/2); 
  

  // Get current page based on active tab
  const getCurrentPage = () => activeTab === 'users' ? activeUsersPage : pendingUsersPage;
  
  // Get total pages based on active tab
  const getTotalPages = () => activeTab === 'users' ? totalActivePages : totalPendingPages;

  // Handle page change based on active tab
  const handlePageChange = (page: number) => {
    if (activeTab === 'users') {
      setActiveUsersPage(page);
    } else {
      setPendingUsersPage(page);
    }
  };

  // Generate pagination numbers for current tab
  const getPageNumbers = () => {
    const currentPage = getCurrentPage();
    const totalPages = getTotalPages();
    const pageNumbers = [];
    const maxVisiblePages = 3;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(currentPage - halfVisible, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 mb-8 text-sm text-gray-600">
          Manage users and approve pending registration requests
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4">
          <div className="w-1/2">
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full py-3 px-4 rounded-t-lg text-sm font-medium flex items-center justify-center space-x-2
                ${activeTab === 'users' 
                  ? 'bg-white text-blue-600 border-t border-r border-l border-gray-200' 
                  : 'bg-gray-100 text-gray-500 hover:text-gray-700'}`}
            >
              {/* <User className="h-5 w-5" /> */}
              <span>Active Users ({state?.activeCount})</span>
            </button>
          </div>
          <div className="w-1/2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`w-full py-3 px-4 rounded-t-lg text-sm font-medium flex items-center justify-center space-x-2
                ${activeTab === 'pending' 
                  ? 'bg-white text-blue-600 border-t border-r border-l border-gray-200' 
                  : 'bg-gray-100 text-gray-500 hover:text-gray-700'}`}
            >

              <span>Pending Approval ({state?.inactiveCount})</span>
            </button>
          </div>
        </div>

        {/* Content Panel */}
        <div className="h-[50vh] overflow-y-auto">
          {activeTab === "users" ?
             <ActiveUserComp userPage = {activeUsersPage} /> :
             <InactiveUserComp userPage = {pendingUsersPage} />
          }
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center">
            <p className="text-sm text-gray-700">
              Showing page <span className="font-sm">{getCurrentPage()}</span> of{' '}
              <span className="font-sm">{getTotalPages()}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(getCurrentPage() - 1)}
              disabled={getCurrentPage() <= 1}
              className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-xs font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              {/* <ChevronLeft className="h-4 w-4 mr-1" /> */}
              Prev
            </button>
            
            <div className="flex space-x-1">
              {getPageNumbers().map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 text-xs font-semibold ${
                    getCurrentPage() === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                  } rounded-md`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(getCurrentPage() + 1)}
              disabled={getCurrentPage() >= getTotalPages()}
              className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-xs font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
              {/* <ChevronRight className="h-4 w-4 ml-1" /> */}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}