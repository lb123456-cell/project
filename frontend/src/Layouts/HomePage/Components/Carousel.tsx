import { useEffect, useState } from "react";
import JewelryModel from "../../../models/JewelryModel";
import { ReturnJewelry } from "./ReturnJewelry";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";

declare var bootstrap: any;

export const Carousel = () => {
  const [jewelries, setJewelries] = useState<JewelryModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJewelries = async () => {
      try {
        const baseUrl: string = `http://localhost:8080/api/jewelries`;
        const url: string = `${baseUrl}?page=0&size=20`;
  
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }
  
        const responseJson = await response.json();
        const responseData = responseJson._embedded?.jewelries || [];
  
        const loadedJewelries: JewelryModel[] = responseData
          .map((jewelry: any) => ({
            id: jewelry.id,
            name: jewelry.name,
            brand: jewelry.brand,
            description: jewelry.description,
            stock_quantity: jewelry.stock_quantity,
            price: jewelry.price,
            category: jewelry.category,
            img: jewelry.img,
          }))
          .filter((j: { id: null | undefined; }) => j.id !== undefined && j.id !== null);
  
        console.log("✅ Loaded jewelries:", loadedJewelries);
        setJewelries(loadedJewelries);
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        setHttpError(error.message);
      }
    };
  
    fetchJewelries();
  }, []);

  const limitedJewelries = jewelries.slice(0, 9);

  const groupedJewelries: JewelryModel[][] = [];
  for (let i = 0; i < limitedJewelries.length; i += 3) {
    groupedJewelries.push(limitedJewelries.slice(i, i + 3));
  }

  useEffect(() => {
    const carouselElement = document.getElementById("carouselExampleControls");
    if (carouselElement && typeof bootstrap !== "undefined") {
      const carousel =
        bootstrap.Carousel.getInstance(carouselElement) ||
        new bootstrap.Carousel(carouselElement, {
          interval: false,
          ride: false,
          pause: true,
        });
      carousel.pause();
    }
  }, [jewelries]);

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
    <div className="container mt-5" style={{ height: 550 }}>
      <div className="homepage-carousel-tittle text-center">
        <h3>Discover your next favorite piece of jewelry</h3>
      </div>

      {/* Desktop Carousel */}
      <div
        id="carouselExampleControls"
        className="carousel carousel-dark slide mt-5 d-none d-lg-block"
        data-bs-ride="false"
        data-bs-interval="false"
      >
        <div className="carousel-inner">
          {groupedJewelries.map((group: JewelryModel[], index: number) => (
            <div
              className={`carousel-item ${index === 0 ? "active" : ""}`}
              key={index}
            >
              <div className="row d-flex justify-content-center align-items-center">
                {group.map((jewelry: JewelryModel) => (
                  <ReturnJewelry jewelry={jewelry} key={jewelry.id} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Mobile view */}
      <div className="d-lg-none mt-3">
        <div className="row d-flex justify-content-center align-items-center">
          {jewelries?.[7] && (
            <ReturnJewelry jewelry={jewelries[7]} key={jewelries[7].id} />
          )}
        </div>
      </div>

      {/* View More */}
      <div className="homepage-carousel-tittle mt-5">
        <Link className="btn btn-outline-secondary btn-lg" to="/search">
          View More
        </Link>
      </div>
    </div>
  );
};
