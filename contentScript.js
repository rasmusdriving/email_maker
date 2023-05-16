// Create the button
var button = document.createElement('button');
button.id = 'my-text-inserter-button';
button.textContent = 'A';
button.style.display = 'none';
button.style.position = 'fixed';
button.style.borderRadius = '50%';
button.style.backgroundColor = 'lightpink';
button.style.zIndex = '10000';
document.body.appendChild(button);

// Function to position the button next to a text box
var activeTextbox = null;
function positionButton() {
  if (activeTextbox) {
    var rect = activeTextbox.getBoundingClientRect();
    button.style.top = (window.scrollY + rect.top) + 'px';
    button.style.left = (window.scrollX + rect.left + rect.width) + 'px';
    button.style.display = 'block';
  } else {
    button.style.display = 'none';
  }
}

// Get iframe document
function getIframeDocument(iframe) {
  var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
  return iframeDocument;
}

// Update the button's position when a DOM change occurs
var observer = new MutationObserver(function() {
  positionButton();
});
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  characterData: true
});

// Detect when a text box gains focus
document.addEventListener('focusin', function(event) {
  var element = document.activeElement;
  if (element.tagName.toLowerCase() === 'textarea' || 
      (element.tagName.toLowerCase() === 'input' && element.type === 'text') ||
      element.isContentEditable) {
    activeTextbox = element;
    positionButton();
  } else if (element.tagName.toLowerCase() === 'iframe') {
    var iframeDocument = getIframeDocument(element);
    if (iframeDocument) {
      iframeDocument.addEventListener('focusin', function(event) {
        var iframeElement = iframeDocument.activeElement;
        if (iframeElement.isContentEditable) {
          activeTextbox = iframeElement;
          positionButton();
        }
      }, true);
    }
  }
});

// Detect when a text box loses focus
document.addEventListener('focusout', function(event) {
  activeTextbox = null;
  positionButton();
}, true);

// Update the button's position when the page is scrolled or resized
var debounceTimeout = null;
window.addEventListener('scroll', function() {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(positionButton, 100);
});
window.addEventListener('resize', function() {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(positionButton, 100);
});

// Add an action for the button
button.addEventListener('click', function() {
  if (activeTextbox) {
    var textToInsert = 'Text to be inserted';
    if (activeTextbox.tagName.toLowerCase() === 'textarea' || activeTextbox.tagName.toLowerCase() === 'input') {
      activeTextbox.value += textToInsert;
    } else if (activeTextbox.isContentEditable) {
      var event = new InputEvent('input', { bubbles: true });
      activeTextbox.textContent += textToInsert;
      activeTextbox.dispatchEvent(event);
    }
  }
});
