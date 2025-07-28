import React from 'react';
import './App.css';
import { Navbar } from './Layouts/NavbarAndFooter/Navbar';
import { Footer } from './Layouts/NavbarAndFooter/Footer';
import { HomePage } from './Layouts/HomePage/HomePage';
import { SearchJewelryPage } from './Layouts/SearchJewelryPage/SearchJewelryPage';
import { JewelryCheckoutPage } from './Layouts/JewelryCheckoutPage/JewelryCheckoutPage';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { oktaConfig } from './Jew/oktaConfig';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security, LoginCallback } from '@okta/okta-react';
import LoginWidget from './Auth/LoginWidget';
import { ReviewListPage } from './Layouts/JewelryCheckoutPage/ReviewListPage/ReviewListPage';
import { ShelfPage } from './Layouts/ShelfPage/ShelfPage';
import RequireAuth from './Layouts/HomePage/Components/RequireAuth';
import { MessagesPage } from './Layouts/MessagesPage/MessagesPage';
import { ManageJewelryPage } from './Layouts/ManageLibraryPage/ManageJewelryPage';
import { PaymentPage } from './Layouts/PaymentPage/PaymentPage';

const oktaAuth = new OktaAuth(oktaConfig);

export const App = () => {
  const history = useNavigate();

  const customAuthHandler = () => {
    history('/login');
  };

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: string) => {
    history(toRelativeUrl(originalUri || '/', window.location.origin), {
      replace: true,
    });
  };

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
        <Navbar />
        <div className='flex-grow-1'>
          <Routes>
            <Route path='/' element={<Navigate to='/home' />} />
            <Route path='/home' element={<HomePage />} />
            <Route path='/search' element={<SearchJewelryPage />} />
            <Route path='/reviewlist/:jewelryId' element={<ReviewListPage />} />
            <Route path='/checkout/:id' element={<JewelryCheckoutPage />} />
            <Route path='/login' element={<LoginWidget config={oktaConfig} />} />
            <Route path='/login/callback' element={<LoginCallback />} />
            <Route path='/home/search' element={<SearchJewelryPage />} />
            <Route
              path='/shelf'
              element={
                <RequireAuth>
                  <ShelfPage />
                </RequireAuth>
              }
            />
            <Route
              path='/messages'
              element={
                <RequireAuth>
                  <MessagesPage />
                </RequireAuth>
              }
            />
            <Route
              path='/admin'
              element={
                <RequireAuth>
                  <ManageJewelryPage />
                </RequireAuth>
              }
            />
            <Route
              path='/fees'
              element={
                <RequireAuth>
                  <PaymentPage />
                </RequireAuth>
              }
            />
          </Routes>
        </div>
        <Footer />
      </Security>
    </div>
  );
};
