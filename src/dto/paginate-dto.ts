export interface PaginateInputDTO {
    filter?: string
    pageSize: number
    page: number
}

export interface PaginateMetaDTO {
    total: number
    page: number
    pageSize: number
    totalPages: number
}