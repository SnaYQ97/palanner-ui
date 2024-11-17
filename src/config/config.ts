// environments
export const getApiUrl = () => {
  const hostname = document.location.hostname;
  return `http://${hostname}:3000`;
}
