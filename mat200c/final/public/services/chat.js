export function prompt(prompt) {
  fetch("/api/chat/prompt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  })
    .then((response) => {
      console.log(response);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => console.error("Error:", error));
}
