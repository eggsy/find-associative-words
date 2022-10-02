export const getSocketUrl = () => {
  if (!document?.location?.href)
    throw Error("Can't read document, make sure you're on browser.");
  return `ws://${document.location.hostname}:9876`;
};
