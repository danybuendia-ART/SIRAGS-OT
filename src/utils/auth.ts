export const getCurrentUser = () => {
    const info = localStorage.getItem("user");

    if (!info) return null;

    return JSON.parse(info);
}