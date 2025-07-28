import { useEffect, useState } from "react";
import JewelryModel from "../../models/JewelryModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchJewelry } from "./Components/SearchJewelry";
import { PaginationControls } from "../Utils/Pagination";
import { Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";

export const SearchJewelryPage = () => {
  const [jewelries, setJewelries] = useState<JewelryModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [jewelryPerPage] = useState(5);
  const [totalAmountOfJewelry, setTotalAmountOfJewelry] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [searchUrl, setSearchUrl] = useState('');
  const [categorySelection, setCategorySelection] = useState('Jewelry Category');

  useEffect(() => {
    const fetchJewelries = async () => {
      const baseUrl: string =`http://localhost:8080/api/jewelries`;
      let url: string;

      if (searchUrl === '') {
        url = `${baseUrl}?page=${currentPage - 1}&size=${jewelryPerPage}`;
      } else {
        let searchWithPage = searchUrl.replace('<pageNumber>', `${currentPage - 1}`);

        url = baseUrl + searchWithPage;
      }

      console.log(" Fetching from:", url);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }

        const responseData = await response.json();
        const embeddedJewelries = responseData._embedded?.jewelries || [];

        const loadedJewelries: JewelryModel[] = embeddedJewelries.map((jewelry: any) => {
          const selfLink = jewelry._links?.self?.href;
          const id = selfLink ? parseInt(selfLink.split("/").pop()) : 0;
        
          console.log("✔ Extracted ID:", id); // ✅ this should NOT be undefined now
        
          return {
            id,
            name: jewelry.name,
            brand: jewelry.brand,
            description: jewelry.description,
            stock_quantity: jewelry.stock_quantity,
            price: jewelry.price,
            category: jewelry.category,
            img: jewelry.img,
          };
        });
        
        

        setJewelries(loadedJewelries);

        if (responseData.page) {
          setTotalAmountOfJewelry(responseData.page.totalElements);
          setTotalPages(responseData.page.totalPages);
        } else {
          setTotalAmountOfJewelry(loadedJewelries.length);
          setTotalPages(1);
        }

        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        setHttpError(error.message);
      }
    };

    fetchJewelries();
    window.scrollTo(0, 0);
  }, [currentPage, searchUrl]);

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

  const searchHandleChange = () => {
    setCurrentPage(1);
    if (search.trim() === '') {
      setSearchUrl('');
    } else {
      setSearchUrl(`/search/byName?name=${encodeURIComponent(search)}&page=0&size=${jewelryPerPage}`);
    }
    setCategorySelection('Jewelry category')
  };

  const categoryField = (value: string) => {
    setCurrentPage(1);
    if (
      value.toLowerCase() === 'set' ||
      value.toLowerCase() === 'earring' ||
      value.toLowerCase() === 'necklace' ||
      value.toLowerCase() === 'bracelet'
    ){
    
      setCategorySelection(value);
      setSearchUrl(`/search/byCategory?category=${encodeURIComponent(value)}&page=0&size=${jewelryPerPage}`);
    } else {
      setCategorySelection('All');
      setSearchUrl(`?page=0&size=${jewelryPerPage}`);
    }
  };
  
  
  const indexOfLastJewelry: number = currentPage * jewelryPerPage;
  const indexOfFirstJewelry: number = indexOfLastJewelry - jewelryPerPage;
  let lastItem = jewelryPerPage * currentPage <= totalAmountOfJewelry ?
    jewelryPerPage * currentPage : totalAmountOfJewelry;
    
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      {/* Search and Category Filter */}
      <div className="row mt-5">
        <div className="col-6">
          <div className="d-flex">
          <input
      className="form-control me-2"
      type="search"
      placeholder="Search"
      aria-label="Search"
      value={search}
      onChange={e => setSearch(e.target.value)}
      onKeyDown={(e) => {
      if (e.key === 'Enter') {
      searchHandleChange();
    }
  }}
/>

            <button
              className="btn btn-outline-success"
              onClick={searchHandleChange}
            >
              Search
            </button>
          </div>
        </div>
        <div className="col-4">
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false">
            {categorySelection}
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li onClick={() =>categoryField('All') }>
                <a className="dropdown-item" href="#">
                  All
                  </a>
              </li>
              <li onClick={() =>categoryField('Set') }>
                <a className="dropdown-item" href="#">
                  Set
                  </a>
              </li>
              <li onClick={() =>categoryField('Earring') }>
                <a className="dropdown-item" href="#">
                  Earrings
                  </a>
              </li>
              <li onClick={() =>categoryField('Necklace') }>
                <a className="dropdown-item" href="#">
                  Necklace
                  </a>
              </li>
              <li onClick={() =>categoryField('Bracelet') }>
                <a className="dropdown-item" href="#">
                  Bracelet
                  </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    {totalAmountOfJewelry > 0 ?
    <>
      <div className="mt-3">
        <h5>Number of results: {totalAmountOfJewelry}</h5>
        <p>
          Showing{" "}
          {Math.min((currentPage - 1) * jewelryPerPage + 1, totalAmountOfJewelry)} to{" "}
          {Math.min(currentPage * jewelryPerPage, totalAmountOfJewelry)} of{" "}
          {totalAmountOfJewelry} items
        </p>
      </div>
    
      {jewelries.map((jewelry) => (
        <SearchJewelry jewelry={jewelry} key={jewelry.id} />
      ))}
      </>
      :
      <div className='m-5'>
        <h3>
          Can't find what you are looking for?
        </h3>
        <Link to="/messages" className="btn main-color btn-md px-4 me-md-2 fw-bold text-white">
        Jewelry Services
        </Link>
    </div>
}
      {/* Pagination */}
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

