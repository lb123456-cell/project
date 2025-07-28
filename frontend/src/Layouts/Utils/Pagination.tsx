export const PaginationControls: React.FC<{
    currentPage: number;
    totalPages: number;
    paginate: (pageNumber: number) => void;
  }> = (props) => {
    
    const pageNumbers: number[] = [];
  
    // Logic for determining which pages to show
    if (props.currentPage === 1) {
      pageNumbers.push(props.currentPage);
      if (props.totalPages >= props.currentPage + 1) {
        pageNumbers.push(props.currentPage + 1);
      }
      if (props.totalPages >= props.currentPage + 2) {
        pageNumbers.push(props.currentPage + 2);
      }
    } else if (props.currentPage > 1) {
      if (props.currentPage >= 3) {
        pageNumbers.push(props.currentPage - 2);
        pageNumbers.push(props.currentPage - 1);
      } else {
        pageNumbers.push(props.currentPage - 1);
      }
      pageNumbers.push(props.currentPage);
  
      if (props.totalPages >= props.currentPage + 1) {
        pageNumbers.push(props.currentPage + 1);
      }
      if (props.totalPages >= props.currentPage + 2) {
        pageNumbers.push(props.currentPage + 2);
      }
    }
  
    return (
      <nav aria-label="Pagination">
        <ul className="pagination">
          {/* First Page */}
          <li className="page-item" onClick={() => props.paginate(1)}>
            <button className="page-link">First Page</button>
          </li>
  
          {/* Page Numbers */}
          {pageNumbers.map((number) => (
            <li
              key={number}
              onClick={() => props.paginate(number)}
              className={`page-item ${props.currentPage === number ? 'active' : ''}`}
            >
              <button className="page-link">{number}</button>
            </li>
          ))}
  
          {/* Last Page */}
          <li className="page-item" onClick={() => props.paginate(props.totalPages)}>
            <button className="page-link">Last Page</button>
          </li>
        </ul>
      </nav>
    );
  };
  