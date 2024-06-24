(function () {
  "use strict";

  // Initialize Bootstrap custom file input
  bsCustomFileInput.init();

  // Fetch all forms with the 'validated-form' class
  const forms = document.querySelectorAll(".validated-form");

  // Loop over each form
  Array.from(forms).forEach(function (form) {
    // Add submit event listener to each form
    form.addEventListener(
      "submit",
      function (event) {
        // Check if the form is not valid
        if (!form.checkValidity()) {
          // Prevent form submission
          event.preventDefault();
          event.stopPropagation();
        }

        // Add 'was-validated' class to the form to apply Bootstrap validation styles
        form.classList.add("was-validated");
      },
      false
    );
  });
})();
