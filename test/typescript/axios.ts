import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInstance,
  AxiosAdapter,
  Cancel,
  CancelToken,
  CancelTokenSource,
  Canceler
} from '../../';

const config: AxiosRequestConfig = {
  url: '/user',
  method: 'get',
  baseURL: 'https://api.example.com/',
  transformRequest: (data: any) => '{"foo":"bar"}',
  transformResponse: [
    (data: any) => ({ baz: 'qux' })
  ],
  headers: { 'X-FOO': 'bar' },
  params: { id: 12345 },
  paramsSerializer: (params: any) => 'id=12345',
  data: { foo: 'bar' },
  timeout: 10000,
  withCredentials: true,
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },
  responseType: 'json',
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  onUploadProgress: (progressEvent: any) => {},
  onDownloadProgress: (progressEvent: any) => {},
  maxContentLength: 2000,
  validateStatus: (status: number) => status >= 200 && status < 300,
  maxRedirects: 5,
  proxy: {
    host: '127.0.0.1',
    port: 9000
  },
  cancelToken: new axios.CancelToken((cancel: Canceler) => {})
};

const handleResponse = (response: AxiosResponse) => {
  console.log(response.data);
  console.log(response.status);
  console.log(response.statusText);
  console.log(response.headers);
  console.log(response.config);
};

const handleError = (error: AxiosError) => {
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else {
    console.log(error.message);
  }
};

axios(config)
  .then(handleResponse)
  .catch(handleError);

axios.get('/user?id=12345')
  .then(handleResponse)
  .catch(handleError);

axios.get('/user', { params: { id: 12345 } })
  .then(handleResponse)
  .catch(handleError);

axios.head('/user')
  .then(handleResponse)
  .catch(handleError);

axios.delete('/user')
  .then(handleResponse)
  .catch(handleError);

axios.post('/user', { foo: 'bar' })
  .then(handleResponse)
  .catch(handleError);

axios.post('/user', { foo: 'bar' }, { headers: { 'X-FOO': 'bar' } })
  .then(handleResponse)
  .catch(handleError);

axios.put('/user', { foo: 'bar' })
  .then(handleResponse)
  .catch(handleError);

axios.patch('/user', { foo: 'bar' })
  .then(handleResponse)
  .catch(handleError);

// Typed methods
interface User {
  id: number;
  name: string;
}

const handleUserResponse = (response: AxiosResponse<User>) => {
	console.log(response.data.id);
	console.log(response.data.name);
	console.log(response.status);
	console.log(response.statusText);
	console.log(response.headers);
	console.log(response.config);
};

axios.get<User>('/user?id=12345')
	.then(handleUserResponse)
	.catch(handleError);

axios.get<User>('/user', { params: { id: 12345 } })
	.then(handleUserResponse)
	.catch(handleError);

axios.head<User>('/user')
	.then(handleResponse)
	.catch(handleError);

axios.delete<User>('/user')
	.then(handleResponse)
	.catch(handleError);

axios.post<User>('/user', { foo: 'bar' })
	.then(handleUserResponse)
	.catch(handleError);

axios.post<User>('/user', { foo: 'bar' }, { headers: { 'X-FOO': 'bar' } })
	.then(handleUserResponse)
	.catch(handleError);

axios.put<User>('/user', { foo: 'bar' })
	.then(handleUserResponse)
	.catch(handleError);

axios.patch<User>('/user', { foo: 'bar' })
	.then(handleUserResponse)
	.catch(handleError);

// Instances
