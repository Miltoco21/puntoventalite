import React, { useState, useEffect } from "react";
import { Button, Container, Step, StepLabel, Stepper, Paper } from "@mui/material";
import axios from "axios";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";

const steps = ["Paso 1", "Paso 2", "Paso 3", "Paso 4", "Paso 5"];

const StepperSI = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [data, setData] = useState({
    step1: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
    step6: {},
  });

  useEffect(() => {
    const storedData = localStorage.getItem("stepperData");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const handleNext = (stepData) => {
    const updatedData = { ...data, [`step${activeStep + 1}`]: stepData };
    setData(updatedData);
    localStorage.setItem("stepperData", JSON.stringify(updatedData));
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const postData = {
        step1: data.step1,
        step2: data.step2,
        step3: data.step3,
        step4: data.step4,
        step5: data.step5,
      };

      const response = await axios.post(
        "https://www.easyposdev.somee.com/api/ProductosTmp/AddProducto",
        postData
      );

      console.log("Server Response:", response.data);

      setData({
        step1: {},
        step2: {},
        step3: {},
        step4: {},
        step5: {},
        step6: {},
      });

      setDialogMessage("Producto guardado con éxito");
      setOpen(true);
    } catch (error) {
      console.error("Error:", error);
      setDialogMessage("Error al guardar");
      setOpen(true);
    }
  };

  const handleSaveStep5 = async (stepData) => {
    try {
      const updatedData = { ...data, step5: stepData };
      setData(updatedData);
      localStorage.setItem("stepperData", JSON.stringify(updatedData));
      
      await handleSubmit(); // Envía los datos al servidor
    } catch (error) {
      console.error("Error:", error);
      setDialogMessage("Error al guardar");
      setOpen(true);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <Step1 data={data.step1} onNext={handleNext} />;
      case 1:
        return <Step2 data={data.step2} onNext={handleNext} />;
      case 2:
        return <Step3 data={data.step3} onNext={handleNext} />;
      case 3:
        return <Step4 data={data.step4} onNext={handleNext} />;
      case 4:
        return <Step5 data={data.step5} onNext={handleNext} onSave={handleSaveStep5} />;
      case 5:
        return <Step6 data={data.step6} onNext={handleNext} />;
      default:
        return "Unknown step";
    }
  };

  return (
    <Container>
      <Paper sx={{ display: "flex", justifyContent: "center", marginBottom: "5px" }}>
        {/* <Typography variant="h5"> PRODUCTOS CON CÓDIGO</Typography> */}
      </Paper>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <p>Todos los pasos han sido completados!!.</p>
          </div>
        ) : (
          <div>
            {getStepContent(activeStep)}
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Volver
              </Button>
              {activeStep === steps.length - 1 && (
                <Button variant="contained" color="primary" margin="dense" onClick={handleSubmit}>
                  Enviar
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default StepperSI;
