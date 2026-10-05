const API = 'http://localhost:5000/api';

export async function api(path, options = {}) {
  const isWorker = path.startsWith('/worker');
  const token = localStorage.getItem(isWorker ? 'workerToken' : 'adminToken');

  const headers = {
    ...(options.headers || {})
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
    throw new Error(data.message || 'Something went wrong.');
  }

  return data;
}

export { API };
