const API_URL: string = import.meta.env.VITE_MBM_API_SERVER_URL;

export async function adminGET(path: string) {
  return await fetch(`${API_URL}/admin/${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function adminPOST(path: string, body: Record<string, any>) {
  return await fetch(`${API_URL}/admin/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function adminPUT(path: string, body: Record<string, any>) {
  return await fetch(`${API_URL}/admin/${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function adminDELETE(path: string) {
  return await fetch(`${API_URL}/admin/${path}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
