export interface IApiError {
	code?: string;
	message: string;
}

export interface IErrorResponse {
	error: IApiError;
}

export interface IFieldError extends IApiError {
	field: string;
}
