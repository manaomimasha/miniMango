function deleteNote(noteId) {
  // Mostrar confirmación
  if (confirm("¿Estás seguro de que quieres eliminar esta nota?")) {
    // Hacer petición DELETE
    fetch(`/notes/delete/${noteId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        // Mostrar toast de éxito
        // showToast();

        // Recargar la página después de 2 segundos
        setTimeout(() => {
          location.reload();
        }, 2000);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Mostrar toast de error
        showErrorToast();
      });
  }
}

function showToast(message = "Operación exitosa") {
  const toast = new bootstrap.Toast(
    document.getElementById("notificationToast")
  );
  // Actualizar el mensaje si es necesario
  const toastBody = document.querySelector("#notificationToast .toast-body");
  if (toastBody) {
    toastBody.textContent = message;
  }
  toast.show();
  // console.log("showToast se esta ejecutando");
}

function showToastForEdit() {
  const toast = new bootstrap.Toast(
    document.getElementById("notificationToastEdit")
  );
  toast.show();
}

function showErrorToast(message = "Error al procesar la solicitud") {
  const toastContainer = document.querySelector(".toast-container");
  const errorToast = document.createElement("div");
  errorToast.className = "toast bg-danger text-white";
  errorToast.innerHTML = `
      <div class="toast-body d-flex align-items-center">
        <i class="fas fa-exclamation-circle me-2"></i>
        ${message}
      </div>
    `;

  toastContainer.appendChild(errorToast);
  const toast = new bootstrap.Toast(errorToast);
  toast.show();

  errorToast.addEventListener("hidden.bs.toast", () => {
    errorToast.remove();
  });
}

function oneditNote(id) {
  console.log("id of note to edit:", id);

  const title = document.getElementById("title").value;
  console.log(title);
  const description = document.getElementById("description").value;
  console.log(description);

  fetch(`/notes/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // showToastForEdit();
        showToast(data.message || "Nota actualizada exitosamente");

        setTimeout(() => location.reload(), 2000);
        setTimeout(() => {
          window.location.href = "/notes/all-notes";
        }, 2000);
      } else {
        showErrorToast(data.error || "Error al actualizar la nota");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showErrorToast("Error de conexión");
    });
}

// Auto-dismiss alerts
$(document).ready(function () {
  $(".alert[data-auto-dismiss]").each(function () {
    const delay = $(this).data("auto-dismiss");
    setTimeout(() => {
      $(this).fadeOut();
    }, delay);
  });
});
