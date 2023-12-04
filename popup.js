document.addEventListener("DOMContentLoaded", function () {
  const linksList = document.getElementById("linksList");
  const addLinkButton = document.getElementById("addLink");
  const openAllButton = document.getElementById("openAll");
  const newLinkInput = document.getElementById("newLink");

  // Load links from storage
  chrome.storage.sync.get({ links: [] }, function (data) {
    const links = data.links;
    updateLinksList(links);

    // Add a link
    addLinkButton.addEventListener("click", function () {
      const newLink = newLinkInput.value.trim();
      if (newLink) {
        links.push(newLink);
        updateLinksList(links);
        saveLinks(links);
        newLinkInput.value = ""; // Clear the input field after adding
      }
    });

    // Remove a link
    linksList.addEventListener("click", function (event) {
      console.log("event.target.tagName", event.target.tagName);
      if (event.target.tagName === "IMG") {
        const indexToRemove = event.target.dataset.index;
        if (indexToRemove !== undefined) {
          links.splice(indexToRemove, 1);
          updateLinksList(links);
          saveLinks(links);
        }
      }
    });

    // Open all links
    openAllButton.addEventListener("click", function () {
      for (const link of links) {
        chrome.tabs.create({ url: link });
      }
    });
  });
});

function updateLinksList(links) {
  const linksList = document.getElementById("linksList");
  linksList.innerHTML = "";
  for (let i = 0; i < links.length; i++) {
    const listItem = document.createElement("li");
    const listItemText = document.createElement("div");
    listItemText.textContent = links[i];
    listItemText.addEventListener("click", function (event) {
      event.stopPropagation
      chrome.tabs.create({ url: links[i] });
    });

    const deleteButton = document.createElement("img");
    deleteButton.id = "delLink";
    deleteButton.src = "images/del.png";
    deleteButton.dataset.index = i; // Set the index as a data attribute
    listItem.appendChild(listItemText);
    listItem.appendChild(deleteButton);
    linksList.appendChild(listItem);
  }
}

function saveLinks(links) {
  chrome.storage.sync.set({ links: links });
}
