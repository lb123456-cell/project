import { useEffect, useState } from "react";
import JewelryModel from "../../../models/JewelryModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { PaginationControls } from "../../Utils/Pagination";
import { ChangeQuantityOfJewelry } from "./ChangeQuantityOfJewelry";

export const ChangeQuantityOfJewelries = () => {
  const [jewelries, setJewelries] = useState<JewelryModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [jewelriesPerPage] = useState(5);
  const [totalAmountOfJewelries, setTotalAmountOfJewelries] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [jewelryDelete, setJewelryDelete] = useState(false);

  useEffect(() => {
    const fetchJewelries = async () => {
      try {
        const baseUrl = `http://localhost:8080/api/jewelries?page=${currentPage - 1}&size=${jewelriesPerPage}`;
        const response = await fetch(baseUrl);

        if (!response.ok) {
          throw new Error("Something went wrong while fetching jewelries!");
        }

        const responseJson = await response.json();
        const embeddedJewelries = responseJson._embedded?.jewelries || [];

        // Set total items and pages safely
        setTotalAmountOfJewelries(responseJson.page?.totalElements || 0);
        setTotalPages(responseJson.page?.totalPages || 0);

        const loadedJewelries: JewelryModel[] = embeddedJewelries.map(
          (item: any) => ({
            id: item.id,
            name: item.name,
            brand: item.brand,
            description: item.description,
            stockQuantity: item.stockQuantity, // Fixed casing
            price: item.price,
            category: item.category,
            img: item.img,
          })
        );

        setJewelries(loadedJewelries);
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        setHttpError(error.message);
      }
    };

    fetchJewelries();
  }, [currentPage, jewelriesPerPage, jewelryDelete]);

  const indexOfLastJewelry = currentPage * jewelriesPerPage;
  const indexOfFirstJewelry = indexOfLastJewelry - jewelriesPerPage;
  const lastItem =
    jewelriesPerPage * currentPage <= totalAmountOfJewelries
      ? jewelriesPerPage * currentPage
      : totalAmountOfJewelries;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const deleteJewelry = () => setJewelryDelete(!jewelryDelete);  

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

  return (
    <div className="container mt-5">
      {totalAmountOfJewelries > 0 ? (
        <>
          <div className="mt-3">
            <h3>Number of results: ({totalAmountOfJewelries})</h3>
          </div>
          <p>
            {indexOfFirstJewelry + 1} to {lastItem} of {totalAmountOfJewelries}{" "}
            items:
          </p>
          {jewelries.map(jewelry=> (
            <ChangeQuantityOfJewelry jewelry={jewelry} key={jewelry.id} deleteJewelry={deleteJewelry}/>
          ))}
        </>
      ) : (
        <h5>Add a jewelry before changing the quantity</h5>
      )}
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
