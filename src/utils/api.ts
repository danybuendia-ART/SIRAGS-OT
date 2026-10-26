import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_API_KEY_ENCRYPT;
const API_URL = (import.meta.env.VITE_API_PROXY_TARGET || "/api").replace(/\/$/, "");

const buildUrl = (endpoint: string) => {
  if (!endpoint) return API_URL;
  if (/^https?:\/\//i.test(endpoint)) return endpoint;
  return `${API_URL}/${endpoint.replace(/^\//, "")}`;
};

export async function apiRequest<T extends object, R = any>(
  endpoint: string,
  dataArray: T | null = null,
  method: "POST" | "GET" = "POST"
): Promise<R> {
  try {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (method !== "GET" && dataArray) {
      // 🔒 Cifrado antes de enviar
      const plainText = JSON.stringify(dataArray);
      const encrypted = CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();
      options.body = JSON.stringify({ payload: encrypted });
    }

    const response = await fetch(buildUrl(endpoint), options);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const json = await response.json();

    // 🔓 Si la respuesta viene cifrada, la desencriptamos
    if (json.encryptedResponse) {
      return decryptData(json.encryptedResponse) as R;
    }

    return json as R;
  } catch (error) {
    console.error("Error en apiRequest:", error);
    throw error;
  }
}


export async function apiUploadFile<R = any>(
  endpoint: string,
  file: File,
  extraData: Record<string, any> = {}
): Promise<R> {
  try {
    const formData = new FormData();

    // 🔒 Cifrar los metadatos antes de enviarlos
    const plainText = JSON.stringify(extraData);
    const encrypted = CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();

    formData.append("payload", encrypted); // metadatos cifrados
    formData.append(
      "action",
      typeof extraData.action === "string" ? extraData.action : "evidences",
    );
    formData.append("archivo", file); // archivo real
    const response = await fetch(buildUrl(endpoint), {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const json = await response.json();

    // 🔓 Si la respuesta viene cifrada, la desencriptamos
    if (json.encryptedResponse) {
      return decryptData(json.encryptedResponse) as R;
    }

    return json as R;
  } catch (error) {
    console.error("Error en apiUploadFile:", error);
    throw error;
  }
}

export async function uploadFiles<R = any>(
  endpoint: string,
  files: File[],                // uno o varios archivos
  extraData: Record<string, any> = {}
): Promise<R[]> {
  try {
    const plainText = JSON.stringify(extraData);
    const encrypted = CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();

    // Subir cada archivo en paralelo
    const responses = await Promise.all(
      files.map(async (file) => {
        const formData = new FormData();
        formData.append("payload", encrypted);
        formData.append(
          "action",
          typeof extraData.action === "string" ? extraData.action : "evidences"
        );
        formData.append("archivo", file);

        const response = await fetch(buildUrl(endpoint), {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const json = await response.json();

        if (json.encryptedResponse) {
          return decryptData(json.encryptedResponse) as R;
        }

        return json as R;
      })
    );

    return responses;
  } catch (error) {
    console.error("Error en uploadFiles:", error);
    throw error;
  }
}
export function decryptData(encryptedText: string) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
}
