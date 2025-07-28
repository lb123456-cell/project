import { Link } from "react-router-dom";
import ReviewModel from "../../models/ReviewModel";
import { Review } from "../Utils/Review";

export const LatestReviews: React.FC<{
  reviews: ReviewModel[];
  jewelryId: number | undefined; // ✅ fixed typo here
  mobile: boolean;
}> = (props) => {
  return (
    <div className={props.mobile ? "mt-3" : "row mt-5"}>
      <div className={props.mobile ? "" : "col-sm-2 col-md-2"}>
        <h2>Latest Reviews:</h2>
      </div>
      <div className="col-sm-10 col-md-10">
        {props.reviews.length > 0 ? (
          <>
            {props.reviews.slice(0, 3).map((eachReview, index) => {
            console.log("Review key test:", eachReview.id);
            return <Review review={eachReview} key={eachReview.id}></Review>;
            })}

            <div className="m-3">
              <Link
                type="button"
                className="btn main-color mtn-md text-white"
                to={`/reviewlist/${props.jewelryId}`} 
              >
                Reach all reviews.
              </Link>
            </div>
          </>
        ) : (
          <div className="m-3">
            <p className="lead">
              Currently there are no Reviews for this Jewelry.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
