const BASE_URL = "http://localhost:8080/api";

export async function fetchWorkspaces() {
  const res = await fetch(`${BASE_URL}/workspace`);
  if (!res.ok) throw new Error("Failed to fetch workspaces");
  return res.json();
}

export async function fetchRoomsByWorkspace(workspaceId) {
  const res = await fetch(`${BASE_URL}/rooms/workspace/${workspaceId}`);
  if (!res.ok) throw new Error("Failed to fetch rooms");
  return res.json();
}
