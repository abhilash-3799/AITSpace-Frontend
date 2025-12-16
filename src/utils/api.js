export async function apiGet(url) {
    const res = await fetch(url);
    return res.json();
}