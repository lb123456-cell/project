import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import MessageModel from "../../../models/MessageModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { PaginationControls } from "../../Utils/Pagination";

export const Messages = () => {
    const { authState } = useOktaAuth();

    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);

    // Messages
    const [messages, setMessages] = useState<MessageModel[]>([]);

    // Pagination
    const [messagesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUserMessages = async () => {
            if (authState?.isAuthenticated && authState?.idToken?.claims?.email) {
                const email = authState.idToken.claims.email;
                const url = `http://localhost:8080/api/messages/search/findByClosed?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };

                try {
                    const messagesResponse = await fetch(url, requestOptions);
                    if (!messagesResponse.ok) {
                        throw new Error('Something went wrong while fetching messages.');
                    }

                    const messagesResponseJson = await messagesResponse.json();
                    setMessages(messagesResponseJson._embedded.messages);
                    setTotalPages(messagesResponseJson.page.totalPages);
                } catch (error: any) {
                    setHttpError(error.message);
                } finally {
                    setIsLoadingMessages(false);
                }
            }
        };

        fetchUserMessages();
        window.scrollTo(0, 0);
    }, [authState, currentPage, messagesPerPage]);

    if (isLoadingMessages) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p className="text-danger">{httpError}</p>
            </div>
        );
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="mt-2">
            {messages.length > 0 ? (
                <>
                    <h5>Current Q/A:</h5>
                    {messages.map((message) => (
                        <div key={message.id}>
                            <div className="card mt-2 shadow p-3 bg-body rounded">
                                <h5>Case #{message.id} : {message.title}</h5>
                                <h6>{message.userEmail}</h6>
                                <p>{message.question}</p>
                                <hr />
                            </div>
                            <div>
                                <h5>Response:</h5>
                                {message.response && message.adminEmail ? (
                                    <>
                                        <h6>{message.adminEmail} (admin)</h6>
                                        <p>{message.response}</p>
                                    </>
                                ) : (
                                    <p><i>Pending response from administration. Please be patient.</i></p>
                                )}
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <h5>All questions you submit will be shown here</h5>
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
