import { useState, useEffect } from "react";
import JewelryModel from "../../models/JewelryModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";
import { useParams } from 'react-router-dom';
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../models/ReviewRequestModel";

export const JewelryCheckoutPage = () => {
  const { authState } = useOktaAuth();
  const { id } = useParams<{ id: string }>();
  console.log("ID from URL:", id)

  const [jewelry, setJewelry] = useState<JewelryModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);

  const [isReviewLeft, setIsReviewLeft] = useState(false);
  const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

  const [currentLoansCount, setCurrentLoansCount] = useState(0);
  const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

  const [checkedOutCount, setCheckedOutCount] = useState(0);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isLoadingJewelryCheckedOut, setIsLoadingJewelryCheckedOut] = useState(true);


  const [dispalyError, setDisplayError ] = useState(false);
  
  useEffect(() => {
    const fetchJewelry = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/jewelries/${id}`);
        if (!response.ok) throw new Error("Something went wrong!");

        const responseJson = await response.json();
        const loadedJewelry: JewelryModel = {
          id: responseJson.id,
          name: responseJson.name,
          brand: responseJson.brand,
          description: responseJson.description,
          stockQuantity: responseJson.stockQuantity,
          price: responseJson.price,
          category: responseJson.category,
          img: responseJson.img,
          stockQuantityAvailable: responseJson.stockQuantityAvailable 
        };
        

        setJewelry(loadedJewelry);
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        setHttpError(error.message);
      }
    };

    fetchJewelry();
  }, [isCheckedOut]);

  useEffect(() => {
    const fetchJewelryReviews = async () => {
      try {
        const reviewUrl = `http://localhost:8080/api/reviews/search/findByJewelryId?jewelryId=${id}`;
        const response = await fetch(reviewUrl);
        if (!response.ok) throw new Error("Something went wrong!");

        const responseJson = await response.json();
        const responseData = responseJson._embedded.reviews;

        const loadedReviews: ReviewModel[] = [];
        let weightedStarReviews = 0;

        for (const key in responseData) {
          loadedReviews.push({
            id: responseData[key].id,
            userEmail: responseData[key].userEmail,
            date: responseData[key].date,
            rating: responseData[key].rating,
            jewelry_id: responseData[key].jewelry_Id,
            reviewDescription: responseData[key].reviewDescription,
          });
          weightedStarReviews += responseData[key].rating;
        }

        if (loadedReviews.length > 0) {
          const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
          setTotalStars(Number(round));
        }

        setReviews(loadedReviews);
        setIsLoadingReview(false);
      } catch (error: any) {
        setIsLoadingReview(false);
        setHttpError(error.message);
      }
    };

    fetchJewelryReviews();
  }, [isReviewLeft]);

  useEffect(() => {
    const fetchUserReviewJewelry = async () => {
      if (authState?.isAuthenticated && jewelry?.id) {
        const url =`http://localhost:8080/api/reviews/secure/user/jewelry?jewelryId=${jewelry.id}`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json'
          }
        };
        const userReview = await fetch(url, requestOptions);
        if (!userReview.ok) {
          throw new Error('Something went wrong');
        }
        const userReviewResponseJson = await userReview.json();
        setIsReviewLeft(userReviewResponseJson);
      }
      setIsLoadingUserReview(false);
    };

    fetchUserReviewJewelry().catch((error: any) => {
      setIsLoadingUserReview(false);
      setHttpError(error.message);
    });
  }, [authState, jewelry?.id]);

  useEffect(() => {
    const fetchCheckedOutCount = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/jewelries/checkout/count?jewelryId=${id}`);
        if (response.ok) {
          const count = await response.json();
          setCheckedOutCount(count);
        }
      } catch (error) {
        console.error("Error fetching checked out count", error);
      }
    };

    fetchCheckedOutCount();
  }, [id]);

  useEffect(() => {
    const fetchUserCurrentLoansCount = async () => {
      if (authState?.isAuthenticated) {
        const url = `http://localhost:8080/api/jewelries/secure/currentloans/count`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const response = await fetch(url, requestOptions);
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }

        const json = await response.json();
        setCurrentLoansCount(json);
      }
      setIsLoadingCurrentLoansCount(false);
    };

    fetchUserCurrentLoansCount().catch((error: any) => {
      setIsLoadingCurrentLoansCount(false);
      setHttpError(error.message);
    });
  }, [isCheckedOut, authState]);

  useEffect(() => {
    const fetchUserCheckedOutJewelry = async () => {
      if (authState?.isAuthenticated && jewelry?.id) {
        const url = `http://localhost:8080/api/jewelries/secure/ischeckedout/byuser?jewelryId=${jewelry.id}`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json'
          }
        };

        const jewelryCheckedOut = await fetch(url, requestOptions);

        if (!jewelryCheckedOut.ok) {
          throw new Error('Something went wrong!');
        }

        const isCheckedOutResult = await jewelryCheckedOut.json();
        setIsCheckedOut(isCheckedOutResult);
      }
      setIsLoadingJewelryCheckedOut(false);
    };

    fetchUserCheckedOutJewelry().catch((error: any) => {
      setIsLoadingJewelryCheckedOut(false);
      setHttpError(error.message);
    });
  }, [authState, jewelry?.id]);

  async function refreshJewelryAndCount() {
    try {
      const response = await fetch(`http://localhost:8080/api/jewelries/${id}`);
      if (response.ok) {
        const data = await response.json();
        setJewelry({
          id: data.id,
          name: data.name,
          brand: data.brand,
          description: data.description,
          stockQuantity: data.stockQuantity,
          price: data.price,
          category: data.category,
          img: data.img,
          stockQuantityAvailable: data.stockQuantityAvailable 
        });
        
      }

      const countRes = await fetch(`http://localhost:8080/api/jewelries/checkout/count?jewelryId=${id}`);
      if (countRes.ok) {
        const count = await countRes.json();
        setCheckedOutCount(count);
      }
    } catch (error) {
      console.error("Failed to refresh data after checkout", error);
    }
  }

  async function checkoutJewelry() {
    const url = `http://localhost:8080/api/jewelries/secure/checkout?jewelryId=${jewelry?.id}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    const checkoutResponse = await fetch(url, requestOptions);
    if (!checkoutResponse.ok) {
      setDisplayError(true);
      throw new Error('Something went wrong!');
    }
    setDisplayError(false);
    setIsCheckedOut(true);
    await refreshJewelryAndCount();
  }

  if (isLoading || isLoadingReview || isLoadingCurrentLoansCount || isLoadingJewelryCheckedOut || isLoadingUserReview) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  async function SubmitReview(starInput: number, reviewDescription: string) {
    let jewelryId: number = 0;
    if (jewelry?.id) {
      jewelryId = jewelry.id;
    }
    const reviewRequestModel = new ReviewRequestModel(starInput, jewelryId, reviewDescription);
    const url = `http://localhost:8080/api/reviews/secure`;
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewRequestModel)
    };
    const returnResponse = await fetch(url, requestOptions);
    if (!returnResponse.ok) {
      throw new Error('Something went wrong!');
    }
    setIsReviewLeft(true);
  }

  return (
    <div>
      {/* Desktop */}
      <div className="container d-none d-lg-block">
        {dispalyError && <div className='alert alert-danger mt-3' role='alert'>
          Please pay outstanding fees and/or return late jewelry(ies).
          </div>
        }
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            <img src={jewelry?.img ?? "/Pictures/1.2.jpg"} width="226" height="349" alt="Jewelry" />
          </div>
          <div className="col-4 col-md-4 container">
            <div className="ml-2">
              <h2>{jewelry?.name}</h2>
              <h5 className="text-primary">{jewelry?.brand}</h5>
              <p className="lead">{jewelry?.description}</p>
              <p><strong>Price:</strong> ${jewelry?.price}</p>
              <StarsReview rating={totalStars} size={32} />
            </div>
          </div>
          <CheckoutAndReviewBox
            jewelry={jewelry}
            mobile={false}
            currentLoansCount={currentLoansCount}
            checkedOutCount={checkedOutCount}
            isAuthenticated={authState?.isAuthenticated}
            isCheckedOut={isCheckedOut}
            checkoutJewelry={checkoutJewelry}
            isReviewLeft={isReviewLeft}
            submitReview={SubmitReview}
            refreshLoansCount={() => setIsCheckedOut(prev => !prev)}
            refreshCheckedOutCount={refreshJewelryAndCount}
            />
        </div>
        <hr />
        <LatestReviews reviews={reviews} jewelryId={jewelry?.id} mobile={false} />
      </div>

      {/* Mobile */}
      <div className="container d-lg-none mt-5">
      {dispalyError && <div className='alert alert-danger mt-3' role='alert'>
          Please pay outstanding fees and/or return late jewelry(ies).
          </div>
        }
        <div className="d-flex justify-content-center align-items-center">
          <img src={jewelry?.img ?? "/Pictures/1.1.jpg"} width="226" height="349" alt="Jewelry" />
        </div>
        <div className="mt-4">
          <div className="ml-2">
            <h2>{jewelry?.name}</h2>
            <h5 className="text-primary">{jewelry?.brand}</h5>
            <p className="lead">{jewelry?.description}</p>
            <p><strong>Price:</strong> ${jewelry?.price}</p>
            <StarsReview rating={totalStars} size={32} />
          </div>
        </div>
        <CheckoutAndReviewBox
  jewelry={jewelry}
  mobile={true}
  currentLoansCount={currentLoansCount}
  checkedOutCount={checkedOutCount}
  isAuthenticated={authState?.isAuthenticated}
  isCheckedOut={isCheckedOut}
  checkoutJewelry={checkoutJewelry}
  isReviewLeft={isReviewLeft}
  submitReview={SubmitReview}
  refreshLoansCount={() => setIsCheckedOut(prev => !prev)}
  refreshCheckedOutCount={refreshJewelryAndCount}
/>

        <hr />
        <LatestReviews reviews={reviews} jewelryId={jewelry?.id} mobile={true} />
      </div>
    </div>
  );
};
