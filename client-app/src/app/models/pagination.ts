export interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export class PaginatedResult<T> {
    // data por ejemplo es un array de usuarios o activities
    data: T;
    pagination: Pagination;

    constructor(data: T, pagination: Pagination) {
        this.data = data;
        this.pagination = pagination;
    }
}
// creamos un pagingParams para pedir al servidor
export class PagingParams {

    pageNumber;
    pageSize;

    constructor(pageNumber = 1, pageSize= 2) {
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
}
