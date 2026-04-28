import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

// Layout & Components
import ProtectedLayout from "./components/ProtectedLayout";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import HomePageOne from "./pages/HomePageOne";
import ReportPage from "./pages/ReportPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ErrorPage from "./pages/ErrorPage";
import TreasurePage from "./pages/TreasurePage";
import TransactionPage from "./pages/TransactionPage";

// Services & API
import api from "./api/axios";
import { loadUserFunction } from "./features/auth/authService";
import { fetchAllExpenseData } from "./features/expense/expenseService";

function App() {
  const dispatch = useDispatch();
  
  // Treasury and Global State
  const [treasuryData, setTreasuryData] = useState({ totalBalance: 0, recentLogs: [] });
  const [globalLoading, setGlobalLoading] = useState(true);

  /**
   * loadAppData - Defined with useCallback so it can be passed 
   * safely to child components for refreshing.
   */
  const loadAppData = useCallback(async () => {
    try {
      // Parallel fetch for everything
      await Promise.all([
        dispatch(fetchAllExpenseData("monthly")),
        api.get("/treasury/status").then(res => setTreasuryData(res.data))
      ]);
    } catch (err) {
      toast.error("Failed to sync financial records");
      console.error(err);
    } finally {
      setGlobalLoading(false);
    }
  }, [dispatch]);

  // Handle Auth and Initial Data Load
  useEffect(() => {
    const initApp = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        await loadUserFunction(dispatch);
        await loadAppData(); // Load data only if token exists
      } else {
        dispatch({ type: 'auth/setInitialized' });
        setGlobalLoading(false);
      }
    };
    initApp();
  }, [dispatch, loadAppData]);

  if (globalLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <RouteScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path='/sign-in' element={<SignInPage />} />
        <Route path='/sign-up' element={<SignUpPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path='/' element={<HomePageOne treasury={treasuryData} refresh={loadAppData} />} />
          <Route path='/add-balance' element={<TreasurePage treasury={treasuryData} refresh={loadAppData} />} />
          <Route path='/balance-list' element={<TransactionPage treasury={treasuryData} refresh={loadAppData} />} />
          <Route path='/reports' element={<ReportPage />} />
          <Route path='*' element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;