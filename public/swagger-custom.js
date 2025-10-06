(function () {
  function addYamlLinkInline() {
    var title = document.querySelector('.swagger-ui .info .title');
    if (!title) return;
    if (document.getElementById('openapi-yaml-inline')) return;

    // Asigură layout pe o singură linie: titlu la stânga, link la dreapta
    title.classList.add('title-with-yaml-link');

    var a = document.createElement('a');
    a.id = 'openapi-yaml-inline';
    a.href = '/openapi.yaml';
    a.textContent = 'Deschide openapi.yaml (tab nou)';
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
    title.appendChild(a);
  }

  var observer = new MutationObserver(function () {
    addYamlLinkInline();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  addYamlLinkInline();
})();


