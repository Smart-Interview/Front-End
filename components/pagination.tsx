import React from 'react';

// Define the types for the pageable and other props
interface Pageable {
    pageNumber: number;
    pageSize: number;
}

interface PaginationProps {
    pageable: Pageable;
    totalPages: number;
    totalElements: number;
    onPageChange: (page: number) => void; // Function to handle page changes
}

const Pagination: React.FC<PaginationProps> = ({ pageable, totalPages, totalElements, onPageChange }) => {
    const { pageNumber, pageSize } = pageable;

    // Disable "Next" button if on the last page, disable "Previous" if on the first page
    const isLastPage = pageNumber + 1 === totalPages;
    const isFirstPage = pageNumber === 0;

    return (
        <div className="flex justify-center items-center space-x-4 mt-4">
            <button
                className="px-3 py-1 border rounded"
                onClick={() => onPageChange(pageNumber - 1)}
                disabled={isFirstPage}
            >
                Previous
            </button>

            <span className="text-sm">
                Page {pageNumber + 1} of {totalPages}
            </span>

            <button
                className="px-3 py-1 border rounded"
                onClick={() => onPageChange(pageNumber + 1)}
                disabled={isLastPage}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
