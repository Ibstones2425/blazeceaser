// ============================================================
// BLAZE CEASER — Template SDK
//
// Include in every template HTML file:
//   <script src="/js/blaze-sdk.js"></script>
//
// Rules for your template:
//   1. Your form must have:   <form id="blaze-form">
//   2. Your submit button:    <button type="button" onclick="BlazeSubmit()">Submit</button>
//
// That's all. BlazeSubmit() validates, collects answers,
// and sends them to the parent page. Never call Firebase directly.
// ============================================================

(function () {

  window.BlazeSubmit = function () {
    const form = document.getElementById("blaze-form");

    if (!form) {
      console.error("[Blaze SDK] No <form id='blaze-form'> found in this template.");
      return;
    }

    // Run native HTML5 validation
    if (!form.checkValidity()) {
      form.reportValidity();
      window.parent.postMessage({ type: "BLAZE_INVALID" }, "*");
      return;
    }

    // Collect all named field values
    const fd = new FormData(form);
    const answers = {};
    for (const [key, val] of fd.entries()) {
      answers[key] = val;
    }

    // Send to parent frame — parent saves to Firestore
    window.parent.postMessage({ type: "BLAZE_ANSWERS", answers }, "*");

    // Lock form against double submission
    form.querySelectorAll("input, textarea, select, button").forEach(el => {
      el.disabled = true;
    });
  };

  // Tell parent frame the template has loaded
  function ready() {
    window.parent.postMessage({ type: "BLAZE_READY" }, "*");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }

})();
