export interface ApiResponse<T = any> {
    sucess: boolean,
    message: string,
    data?: T,
    erors?: any
}