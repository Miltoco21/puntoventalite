// src/Components/Botones/estilosBotones.js

export const estilosBoton = {
  backgroundColor: "#6200EA",
  color: "white",
  padding: "15px 20px", // Ajustamos el padding para darle mayor altura
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "16px",
  width: "100%",  // Para que los botones ocupen todo el ancho disponible en su Grid
  height: "50px",  // Asignamos una altura consistente
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": {
    backgroundColor: "#3700B3",
  },
};

export const estilosBotonSecundario = {
  backgroundColor: "#6c757d",
  color: "white",
  padding: "15px 20px", // Consistencia en el padding
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "16px",
  width: "100%",  // Ancho 100% para ocupar el Grid
  height: "50px", // Misma altura para consistencia
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": {
    backgroundColor: "#5a6268",
  },
};
