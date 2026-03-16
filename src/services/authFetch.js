// auth fetch wrapper to automatically include JWT token from context/localStorage and set content-type header
export async function authFetch(url, options = {}, token = null) {

  //Find token from argument or context/localStorage
  const resolvedToken = token || (typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null);

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (resolvedToken) {
    headers['Authorization'] = `Bearer ${resolvedToken}`;
  }

  const res = await fetch(url, { ...options, headers });

  return res;
}
