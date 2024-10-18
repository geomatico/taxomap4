export class HttpError extends Error {
  constructor(public statusCode: number, public text: string, public payload?: any) {
    super();
  }
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * Base type for all requests.
 *
 * It separates the URL in two components: `baseUrl` and `path` since we usually have a configuration
 * for API base URLs, and then we attach paths to it. It is always possible to provide the full URL
 * as `baseUrl` and skip `path`.
 */
export type BaseRequest = {
  baseUrl: string
  path?: string
  headers?: Record<string, string>
}

export type GetRequest = BaseRequest & {
  queryParams?: Record<string, string>
}

export type PostRequest<RequestType> = BaseRequest & {
  body?: RequestType
}

export type PutRequest<RequestType> = PostRequest<RequestType>;

export type DeleteRequest = BaseRequest;

/**
 * Perform an HTTP GET request for a JSON resource.
 * @param request The request to perform.
 */
export const get = <ResponseType>(request: GetRequest): Promise<ResponseType> =>
  fetchJson({method: 'GET', ...request});

/**
 * Perform an HTTP POST request to a JSON resource.
 * @param request The request to perform.
 */
export const post = <RequestType, ResponseType>(request: PostRequest<RequestType>): Promise<ResponseType> =>
  fetchJson({method: 'POST', ...request});

/**
 * Perform an HTTP PUT request to a JSON resource.
 * @param request The request to perform.
 */
export const put = <RequestType, ResponseType>(request: PutRequest<RequestType>): Promise<ResponseType> =>
  fetchJson({method: 'PUT', ...request});

/**
 * Perform an HTTP DELETE request to a JSON resource.
 * @param request The request to perform.
 */
// delete is keyword :(
export const destroy = (request: DeleteRequest): Promise<void> =>
  fetchJson({method: 'DELETE', ...request});

/**
 * Performs an HTTP request for a JSON resource. It is there for added flexibility in certain cases
 * but usually the `get`/`post`/`put`/`delete` methods here should be cleaner to use.
 *
 * @param baseUrl Base URL
 * @param path Path to attach to the base URL, if any.
 * @param method HTTP method to use for the request.
 * @param queryParams Query params; in theory only for `GET`.
 * @param headers Extra headers to use for the request; useful for authorization for example. Required headers for
 * JSON (such as `Content-Type` or `Accept`) are already handled within.
 * @param body HTTP payload for the request; in theory only for `POST`, `PUT`.
 */
export const fetchJson = async <RequestType, ResponseType>({baseUrl, path, method, queryParams, headers, body}: {
  baseUrl: string,
  path?: string,
  method: HttpMethod,
  queryParams?: Record<string, string>,
  headers?: Record<string, string>,
  body?: RequestType,
}): Promise<ResponseType> => {
  const url = buildUrl(baseUrl, path, queryParams);
  const request: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      // TODO change when implementing PATCH
      'Accept': 'application/json',
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined
  };

  const response = await fetch(url, request);

  if (response.status === 204 || Number(response.headers.get('content-length')) === 0) {
    return undefined as ResponseType;
  } else if (response.status >= 200 && response.status < 300 && response.ok) {
    return response.json();
  } else {
    // WARNING this can't be expressed in Typescript, but: Statuses other than 2xx are rejected with an HttpError.
    const httpError = new HttpError(response.status, await response.text());
    try {
      httpError.payload = JSON.parse(httpError.payload);
    } catch {
      // Fine, can't parse response as JSON, will assume plain text
    }
    throw httpError;
  }
};

const buildUrl = (baseUrl: string, path?: string, queryParams?: Record<string, string>) => {
  let url = baseUrl;
  if (!baseUrl.endsWith('/') && path !== undefined) {
    url += '/';
  }
  url += path || '';
  if (queryParams) {
    url += '?' + new URLSearchParams(queryParams).toString();
  }
  return url;
};
