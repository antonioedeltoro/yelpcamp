(function () {
  "use strict"; // Enable strict mode for better error checking

  bsCustomFileInput.init(); // Initialize custom file input for Bootstrap

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".validated-form");

  // Loop over the forms and prevent submission if invalid
  Array.from(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        // Check if the form is valid
        if (!form.checkValidity()) {
          event.preventDefault(); // Prevent form submission
          event.stopPropagation(); // Stop event propagation
        }

        form.classList.add("was-validated"); // Add Bootstrap validation class
      },
      false
    );
  });
})(); // Immediately invoke the function expression (IIFE)
