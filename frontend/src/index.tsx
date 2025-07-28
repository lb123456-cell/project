import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51Rp4iVRsa7d4zOo8D0vRvB7ZLR6oluZydQLkWz5MDNx2gUXuABsNqqSuOiQt2BTpOXmWUpzPYflGsJLZVENTU45Y00M6PIzFFo');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
  <Elements stripe={stripePromise}>
    <App />
    </Elements>
  </BrowserRouter>
);
