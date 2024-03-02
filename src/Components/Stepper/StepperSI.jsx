/* eslint-disable no-unused-vars */
// StepperComponent.js
import React, { useState, useEffect } from "react";
import { Button, Container, Step, StepLabel, Stepper,Paper,Typography } from "@mui/material";
import axios from "axios";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";



const steps = ["Paso 1", "Paso 2", "Paso 3", "Paso 4", "Paso 5" ];

const StepperSI = () => {
  const [activeStep, setActiveStep] = useState(0);

  const [data, setData] = useState({
    step1: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
    step6: {},
  });

  useEffect(() => {
    // Load data from local storage if available
    const storedData = localStorage.getItem("stepperData");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const handleNext = (stepData) => {
    // Update the data object with the data from the current step
    const updatedData = { ...data, [`step${activeStep + 1}`]: stepData };
    setData(updatedData);

    if (activeStep === steps.length - 1) {
      // Log the complete data when the last step is reached
      console.log("Complete Data Submitted:", updatedData);

      // Send the complete data to the server using Axios
      axios
        .post("your-api-endpoint", updatedData)
        .then((response) => {
          // Handle the response from the server
        })
        .catch((error) => {
          // Handle any errors
        });
    } else {
      // Save the data for the current step and proceed to the next step
      localStorage.setItem("stepperData", JSON.stringify(updatedData));
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    // Assuming 'data' contains the collected data from all steps
    console.log("Submitting Data:", data);

    // Send the data to the server using Axios (replace with your API endpoint)
    axios
      .post("your-api-endpoint", data)
      .then((response) => {
        // Handle the response from the server if needed
        console.log("Server Response:", response.data);

        // Optionally, you can reset the form or perform any other actions
        // after a successful submission.

        // For example, you can reset the data and step state:
        setData({
          step1: {},
          step2: {},
          step3: {},
          step4: {},
          step5: {},
        });
        setActiveStep(0);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error:", error);
      });
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
        return <Step5 data={data.step5} onNext={handleNext} />;
      case 5:
        return <Step6 data={data.step6} onNext={handleNext}/>;
      default:
        return "Unknown step";
    }
  };

  return (
    <Container>
      <Paper sx={{ display: "flex", justifyContent: "center" ,marginBottom:"5px"}}>
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
                volver
              </Button>
              
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    margin="dense"
                    onClick={() => handleNext({})}
                  >
                    Enviar
                  </Button>
                ) : null}
              
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default StepperSI;
