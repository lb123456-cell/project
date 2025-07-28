import { Link, NavLink } from "react-router-dom";
import type { OktaAuth, AuthState } from '@okta/okta-auth-js';
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { useOktaAuth } from "@okta/okta-react";

export const Navbar = () => {
  const { oktaAuth, authState }: {
    oktaAuth: OktaAuth,
    authState: AuthState | null
  } = useOktaAuth();

  if (!authState) {
    return <SpinnerLoading />;
  }

  const handleLogout = async () => {
    await oktaAuth.signOut({
      postLogoutRedirectUri: window.location.origin
    });
  };
  

    return (
        <nav className='navbar navbar-expand-lg navbar-dark py-3 main-color'>
    <div className='container-fluid'>
      <span className='navbar-brand'>Jewelry Store</span>
      <button className='navbar-toggler' type='button'
        data-bs-toggle='collapse' data-bs-target='#navbarNavDropdown'
        aria-controls='navbarNavDropdown' aria-expanded='false'
        aria-label='Toggle Navigation'>
        <span className='navbar-toggler-icon'></span>
      </button>
  
      <div className='collapse navbar-collapse' id='navbarNavDropdown'>
        <ul className='navbar-nav'>
          <li className='nav-item'>
            <NavLink className='nav-link' to="/home">Home</NavLink>
          </li>
          <li className='nav-item'>
            <NavLink className='nav-link' to="/search">Search Jewelry</NavLink>
          </li>
          {authState.isAuthenticated &&
          <li className='nav-item'>
            <NavLink className='nav-link' to='/shelf'>Shelf</NavLink>
          </li> 
          }
          {authState.isAuthenticated &&
          <li className='nav-item'>
            <NavLink className='nav-link' to='/fees'>Pay fees</NavLink>
          </li> 
          }
          {authState.isAuthenticated && authState.accessToken?.claims?.userType === 'admin' &&
          <li className='nav-item'>
            <NavLink className='nav-link' to='/admin'>Admin</NavLink>
          </li>
          }
        </ul>
        <ul className='navbar-nav ms-auto'>
          {!authState.isAuthenticated ?
          <li className='nav-item m-1'>
          <Link className='btn btn-outline-light' to="/login">Sign in</Link>
          </li>
          :
          <li>
            <button className='btn btn-outline-light' onClick={handleLogout}>Log Out</button>
          </li>
} 
        </ul>
      </div>
    </div>
  </nav>
    )
}
export {};
