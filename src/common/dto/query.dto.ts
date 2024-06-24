export type QueryDto = {
    sortBy: string
    sortDirection: number | string
    pageNumber: number
    pageSize: number
    searchLoginTerm: string | null
    searchEmailTerm: string | null
    searchNameTerm: string | null
}