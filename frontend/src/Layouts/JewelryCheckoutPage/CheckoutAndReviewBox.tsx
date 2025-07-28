import { Link } from "react-router-dom";
import JewelryModel from "../../models/JewelryModel";
import { useOktaAuth } from "@okta/okta-react";
import { LeaveAReview } from "../Utils/LeaveAReview";

interface Props {
  jewelry: JewelryModel | undefined;
  mobile: boolean;
  checkedOutCount: number;
  currentLoansCount: number;
  isAuthenticated: any;
  isCheckedOut: boolean;
  checkoutJewelry: () => Promise<void>;
  isReviewLeft: boolean;
  submitReview: (starInput: number, reviewDescription: string) => Promise<void>;
  refreshLoansCount: () => void;
  refreshCheckedOutCount: () => void;
}

export const CheckoutAndReviewBox: React.FC<Props> = ({
  jewelry,
  mobile,
  checkedOutCount,
  currentLoansCount,
  isAuthenticated,
  isCheckedOut,
  checkoutJewelry,
  isReviewLeft,
  submitReview,
  refreshLoansCount,
  refreshCheckedOutCount,
}) => {
  const { authState } = useOktaAuth();

  const total = jewelry?.stockQuantity ?? 0;
  const available = total - checkedOutCount;
  const isAvailable = available > 0;

  function buttonRender() {
    if (!jewelry) return <p>No jewelry found.</p>;

    if (isAuthenticated) {
      if (!isCheckedOut && currentLoansCount < 5) {
        return (
          <>
            <button
              onClick={async () => {
                try {
                  await checkoutJewelry();
                  await refreshLoansCount();
                  await refreshCheckedOutCount();
                } catch (err: any) {
                  alert("❌ Checkout failed: " + (err.message || "Unknown error"));
                  console.error(err);
                }
              }}
              className="btn btn-success btn-lg me-2"
            >
              Checkout
            </button>
            
          </>
        );
      } else if (isCheckedOut) {
        return <p><b>Jewelry checked out. Enjoy!</b></p>;
      } else {
        return <p className="text-danger">Too many jewelries checked out.</p>;
      }
    }
    return <Link to="/login" className="btn btn-success btn-lg">Sign in</Link>;
  }

  function reviewRender() {
    if (isAuthenticated && !isReviewLeft) {
      return (
        <div className="mt-3">
          <LeaveAReview submitReview={submitReview} />
        </div>
      );
    } else if (isAuthenticated && isReviewLeft) {
      return (
        <div className="mt-3">
          <b>Thank you for your review!</b>
        </div>
      );
    }
    return (
      <div>
        <hr />
        <p>Sign in to be able to leave a review.</p>
      </div>
    );
  }

  return (
    <div className={mobile ? "card d-flex mt-5" : "card col-3 container d-flex mb-5"}>
      <div className="card-body container">
        <div className="mt-3">
          <p>
            <b>{currentLoansCount}/5</b> Jewelries checked out
          </p>
          <hr />
          {isAvailable ? (
            <h4 className="text-success">Available</h4>
          ) : (
            <h4 className="text-danger">Wait List</h4>
          )}
          <div className="row">
            <p className="col-6 lead">
              <b>{total}</b> total
            </p>
            <p className="col-6 lead">
              <b>{available > 0 ? available : 0}</b> left
            </p>
          </div>
        </div>
        {buttonRender()}
        <hr />
        <p className="mt-3">
          This number can change until placing order has been completed.
        </p>
        {reviewRender()}
      </div>
    </div>
  );
};