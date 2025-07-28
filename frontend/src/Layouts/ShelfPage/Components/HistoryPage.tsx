import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import HistoryModel from "../../../models/HistoryModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { PaginationControls } from '../../Utils/Pagination';
import fallbackImg from './../../../Pictures/1.3.webp'; // ✅ Import fallback image properly

export const HistoryPage = () => {
    const { authState } = useOktaAuth();
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);
    const [histories, setHistories] = useState<HistoryModel[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUserHistory = async () => {
            if (authState && authState.isAuthenticated) {
            const url = `http://localhost:8080/api/histories/search/findByUserEmail?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage - 1}&size=5`;
            const requestOptions = {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json'
                }
            };
            const historyResponse = await fetch(url, requestOptions);
            if (!historyResponse.ok) {
                throw new Error('Something went wrong!');
            }

            const historyResponseJson = await historyResponse.json();
            const loadedHistories: HistoryModel[] = historyResponseJson._embedded.histories.map((item: any) =>
                new HistoryModel(
                item.id,
                item.userEmail,
                item.checkoutDate,
                item.returnDate,
                item.name,
                item.brand,
                item.description,
                item.img
                )
            );          
            setHistories(loadedHistories);
            setTotalPages(historyResponseJson.page.totalPages || 0);
            }
            setIsLoadingHistory(false);
        };

        fetchUserHistory().catch((error: any) => {
            setIsLoadingHistory(false);
            setHttpError(error.message);
        });
    }, [authState, currentPage]);

    if (isLoadingHistory) return <SpinnerLoading />;
    if (httpError) return <div className='container m-5'><p>{httpError}</p></div>;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className='mt-2'>
            {histories.length > 0 ? (
                <>
                    <h5>Recent History:</h5>
                    {histories.map(history => (
                        <div key={history.id}>
                            <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
                                <div className='row g-0'>
                                    <div className='col-md-2 d-flex align-items-center justify-content-center'>
                                        <img
                                            src={history.img || fallbackImg}
                                            width='123'
                                            height='196'
                                            alt='Jewelry'
                                            className="img-fluid rounded"
                                        />
                                    </div>
                                    <div className='col'>
                                        <div className='card-body'>
                                            <h5 className='card-title'>{String(history.brand)}</h5>
                                            <h4>{String(history.name)}</h4>
                                            <p className='card-text'>Checked out on: {String(history.checkoutDate)}</p>
                                            <p className='card-text'>Returned on: {String(history.returnDate)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </div>
                    ))}
                </>
            ) : (
                <>
                    <h3 className='mt-3'>Currently no history:</h3>
                    <Link className='btn btn-primary' to={'/search'}>Search for new piece</Link>
                </>
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
