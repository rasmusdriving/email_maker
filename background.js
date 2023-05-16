chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.method === "fetchData") {
        fetch(request.url)
          .then(response => response.json())
          .then(data => sendResponse({data: data}))
          .catch(error => sendResponse({error: error}));
        return true;  // Will respond asynchronously.
      }
    });
  