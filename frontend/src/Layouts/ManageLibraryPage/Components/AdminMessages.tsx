import { useOktaAuth } from "@okta/okta-react"
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import MessageModel from "../../../models/MessageModel";
import { PaginationControls } from "../../Utils/Pagination";
import { AdmingMessage } from "./AdminMessage";
import AdminMessageRequest from "../../../models/AdminMessageRequest";

export const AdminMessages = () => {
    const { authState } = useOktaAuth();

    //Normal Loading Pieces
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);

    //Messages endpoint State
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messagesPerPage] = useState(5);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    //Recall useEffect
    const [btnSubmit, setBtnSubmit] = useState(false);

    useEffect(() => {
        const fetchUserMessages = async () => {
            if (authState && authState.isAuthenticated){
                const url = `http//localhost:8080/api/messages/secure/search/findByClosed?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const messagesResponse = await fetch(url, requestOptions);
                if(!messagesResponse.ok){
                    throw new Error('Something went wrong!');
                }
    
                const messagesResponseJson = await messagesResponse.json();
                console.log("Response from backend:", messagesResponseJson);

                // Handle correct format
                if (messagesResponseJson.content && messagesResponseJson.totalPages !== undefined) {
                setMessages(messagesResponseJson.content);
                setTotalPages(messagesResponseJson.totalPages);
                } else {
                setMessages([]);
                setTotalPages(0);
                }

            }
            setIsLoadingMessages(false);
        };
    
        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            setHttpError(error.message);
        });
    
        window.scrollTo(0, 0);
    }, [authState, currentPage, btnSubmit]);
    

    if (isLoadingMessages){
        return (
            <SpinnerLoading/>
        );
    }
    if (httpError){
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    async function submitResponseToQuestion(id: number, response: string){
        const url = `http://localhost:8080/api/messages/secure/admin/message`;
        if(authState && authState?.isAuthenticated && id !==null && response !== ''){
            const messageAdminRequestModel: AdminMessageRequest = new AdminMessageRequest(id, response);
            const requestOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageAdminRequestModel),
            };

            const messageAdminRequestModelResponse = await fetch(url, requestOptions);
            if (!messageAdminRequestModelResponse.ok) {
                throw new Error('Something went wrong!');
            }
            setBtnSubmit(!btnSubmit);
        }
    }


    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return(
        <div className='mt-3'>
            {messages.length > 0 ?
                <>
                    <h5>Pending Q/A:</h5>
                    {messages.map(message => (
                        <AdmingMessage message={message} key={message.id} submitResponseToQuestion={submitResponseToQuestion}/>
                    ))}
                </>  
                :
                <h5>No pending Q/A</h5>  
        }
        {totalPages > 1 && <PaginationControls currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}