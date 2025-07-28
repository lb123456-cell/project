import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { LoansModal } from "./LoansModal";

export const Loans = () => {
  const { authState } = useOktaAuth();
  const [httpError, setHttpError] = useState<string | null>(null);

  const [shelfCurrentLoans, setShelfCurrentLoans] = useState<ShelfCurrentLoans[]>([]);
  const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);
  const [checkout, setCheckout] = useState(false);

  useEffect(() => {
    const fetchUserCurrentLoans = async () => {
      if (authState && authState?.isAuthenticated) {
        const url = `http://localhost:8080/api/jewelries/secure/currentLoans`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json',
          },
        };
  
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Something went wrong!');
        }
  
        const responseJson = await response.json();
        setShelfCurrentLoans(responseJson);
      }
      setIsLoadingUserLoans(false);
    };
  
    fetchUserCurrentLoans().catch((error: any) => {
      setIsLoadingUserLoans(false);
      setHttpError(error.message);
    });
  
    window.scrollTo(0, 0);
  }, [authState, checkout]);
  

  async function returnJewelry(jewelryId: number) {
    const url = `http://localhost:8080/api/jewelries/secure/return?jewelryId=${jewelryId}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json'
      }
    };
    const returnResponse = await fetch(url, requestOptions);
    if (!returnResponse.ok) {
      throw new Error('Something went wrong!');
    }
    setCheckout(!checkout);
  }
  

  if (isLoadingUserLoans) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className='container m-5'>
        <p>{httpError}</p>
      </div>
    );
  }


  async function renewLoan(jewelryId: number) {
    const token = authState?.accessToken?.accessToken;
    if (!token) {
      throw new Error("No access token available.");
    }
  
    const url = `http://localhost:8080/api/jewelries/secure/renew/loan?jewelryId=${jewelryId}`;
  
    const requestOptions = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  
    const returnResponse = await fetch(url, requestOptions);
    if (!returnResponse.ok) {
      throw new Error('Something went wrong while renewing the loan!');
    }
  
    setCheckout(!checkout); 
  }
  
  return (
    <div className='container'>
      {/* Desktop */}
      <div className='d-none d-lg-block mt-2'>
        {shelfCurrentLoans.length > 0 ? (
          <>
            <h5>Current Loans:</h5>
            {shelfCurrentLoans.map(shelfCurrentLoans => (
              <div key={shelfCurrentLoans.jewelry.id}>
                <div className='row mt-3 mb-3'>
                  <div className='col-4 col-md-4 container'>
                    {shelfCurrentLoans.jewelry?.img ? (
                      <img
                        src={shelfCurrentLoans.jewelry.img}
                        width='226'
                        height='349'
                        alt='Jewelry'
                      />
                    ) : (
                      <img
                        src={require('./../../../Pictures/1.1.jpg')}
                        width='226'
                        height='349'
                        alt='Jewelry'
                      />
                    )}
                  </div>

                  <div className='card col-3 col-md-3 container d-flex'>
                    <div className='card-body'>
                      <div className='mt-3'>
                        <h4>Loan Options</h4>

                        {shelfCurrentLoans.daysLeft > 0 && (
                          <p className='text-secondary'>
                            Due in {shelfCurrentLoans.daysLeft} days.
                          </p>
                        )}

                        {shelfCurrentLoans.daysLeft === 0 && (
                          <p className='text-success'>Due Today.</p>
                        )}

                        {shelfCurrentLoans.daysLeft < 0 && (
                          <p className='text-danger'>
                            Past due by {Math.abs(shelfCurrentLoans.daysLeft)} days.
                          </p>
                        )}

                        <div className='list-group mt-3'>
                          <button
                            className='list-group-item list-group-item-action'
                            aria-current='true'
                            data-bs-toggle='modal'
                            data-bs-target={`#modal${shelfCurrentLoans.jewelry.id}`}
                          >
                            Manage Loan
                          </button>
                          <Link to={'/search'} className='list-group-item list-group-item-action'>
                            Search more pieces?
                          </Link>
                        </div>
                      </div>
                      <hr />
                      <p className='mt-3'>
                        Help others find their piece by reviewing your loan.
                      </p>
                      <Link className='btn btn-primary' to={`/checkout/${shelfCurrentLoans.jewelry.id}`}>
                        Leave a review
                      </Link>
                    </div>
                  </div>
                </div>
                <hr />
                <LoansModal shelfCurrentLoan={shelfCurrentLoans} mobile={false} returnJewelry={returnJewelry}
                renewLoan={renewLoan}/>
              </div>
            ))}
          </>
        ) : (
          <>
            <h3 className='mt-3'>Currently no Loans</h3>
            <Link className='btn btn-primary' to={`/search`}>
              Search for a new piece
            </Link>
          </>
        )}
      </div>

      {/* Mobile */}
      <div className='container d-lg-none mt-2'>
        {shelfCurrentLoans.length > 0 ? (
          <>
            <h5 className='mb-3'>Current Loans:</h5>
            {shelfCurrentLoans.map(shelfCurrentLoans => (
              <div key={shelfCurrentLoans.jewelry.id}>
                  <div className='d-flex justify-contetn-center align-items-center'>
                    {shelfCurrentLoans.jewelry?.img ? (
                      <img
                        src={shelfCurrentLoans.jewelry.img}
                        width='226'
                        height='349'
                        alt='Jewelry'
                      />
                    ) : (
                      <img
                        src={require('./../../../Pictures/1.1.jpg')}
                        width='226'
                        height='349'
                        alt='Jewelry'
                      />
                    )}
                  </div>

                  <div className='card d-flex mt-5 mb-3'>
                    <div className='card-body container'>
                      <div className='mt-3'>
                        <h4>Loan Options</h4>

                        {shelfCurrentLoans.daysLeft > 0 && (
                          <p className='text-secondary'>
                            Due in {shelfCurrentLoans.daysLeft} days.
                          </p>
                        )}

                        {shelfCurrentLoans.daysLeft === 0 && (
                          <p className='text-success'>Due Today.</p>
                        )}

                        {shelfCurrentLoans.daysLeft < 0 && (
                          <p className='text-danger'>
                            Past due by {Math.abs(shelfCurrentLoans.daysLeft)} days.
                          </p>
                        )}

                        <div className='list-group mt-3'>
                          <button
                            className='list-group-item list-group-item-action'
                            aria-current='true'
                            data-bs-toggle='modal'
                            data-bs-target={`#mobilemodal${shelfCurrentLoans.jewelry.id}`}
                          >
                            Manage Loan
                          </button>
                          <Link to={'/search'} className='list-group-item list-group-item-action'>
                            Search more pieces?
                          </Link>
                        </div>
                      </div>
                      <hr />
                      <p className='mt-3'>
                        Help others find their piece by reviewing your loan.
                      </p>
                      <Link className='btn btn-primary' to={`/checkout/${shelfCurrentLoans.jewelry.id}`}>
                        Leave a review
                      </Link>
                    </div>
                  </div>
                <hr />
                <LoansModal shelfCurrentLoan={shelfCurrentLoans} mobile={true} returnJewelry={returnJewelry}
                renewLoan={renewLoan}/>
              </div>
            ))}
          </>
        ) : (
          <>
            <h3 className='mt-3'>Currently no Loans</h3>
            <Link className='btn btn-primary' to={`/search`}>
              Search for a new piece
            </Link>
        </>
        )}
    </div>
    </div>
  );
};