import { useEffect, useState } from "react";
import ReviewModel from "../../../models/ReviewModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Review } from "../../Utils/Review";
import { PaginationControls } from "../../Utils/Pagination";

export const ReviewListPage = () => {
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewPerPage] = useState(5);
  const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const jewelryId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const fetchJewelryReviews = async () => {
      try {
        const reviewUrl = `http://localhost:8080/api/reviews/search/findByJewelryId?jewelryId=${jewelryId}&page=${currentPage - 1}&size=${reviewPerPage}`;
        const response = await fetch(reviewUrl);

        if (!response.ok) {
          throw new Error("Something went wrong!");
        }

        const responseJson = await response.json();

        const responseData = responseJson._embedded?.reviews ?? [];
        const totalElements = responseJson.page?.totalElements ?? 0;
        const totalPages = responseJson.page?.totalPages ?? 1;

        setTotalAmountOfReviews(totalElements);
        setTotalPages(totalPages);

        const loadedReviews: ReviewModel[] = [];

        for (const key in responseData) {
          loadedReviews.push({
            id: responseData[key].id,
            userEmail: responseData[key].userEmail,
            date: responseData[key].date,
            rating: responseData[key].rating,
            jewelry_id: responseData[key].jewelryId, 
            reviewDescription: responseData[key].reviewDescription,
          });
        }

        setReviews(loadedReviews);
      } catch (error: any) {
        setHttpError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJewelryReviews();
  }, [currentPage, jewelryId]);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

const actualTotal = reviews.length;
const indexOfFirstReview = (currentPage - 1) * reviewPerPage;
const indexOfLastReview = Math.min(indexOfFirstReview + reviewPerPage, actualTotal);

const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

return (
  <div className="container m-5">
    <div>
      <h3>Comments: ({actualTotal})</h3>
    </div>
    <p>Showing {reviews.length} of {actualTotal} items</p>

      <div className="row">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Review review={review} key={review.id} />
          ))
        ) : (
          <p>No reviews available for this jewelry item.</p>
        )}
      </div>

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
    </div>
  );
};
