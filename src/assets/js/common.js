function toggleHeader() {
  const $header = document.getElementsByTagName('header')[0];
  if (!$header.style.width || $header.style.width === '0px') {
    $header.style.width = '100%';
  } else {
    $header.style.width = '0px';
  }
}

/* document.addEventListener('DOMContentLoaded', function() {
  toggleHeader();
}); */
