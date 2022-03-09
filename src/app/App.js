import React, { useState } from "react";
import { Kushki } from "@kushki/js";
import axios from "axios";
import logokushki from "./img/logokushki";
import "./App.css";

const chargeAmount = 49.99;
const chargeCurrency = "USD";
//const MERCHANT_ID = "20000000100177388000";
const MERCHANT_ID = "20000000106212540000"

const testCards = {
  approved: {
    cardNumber: "5451 9515 7492 5480",
    cardName: "Juan Pérez",
    cvc: "123",
    expiryMonth: "11",
    expiryYear: "22",
  },
  declinedFrontEnd: {
    cardNumber: "4574 4412 1519 0335",
    cardName: "Juan Pérez",
    cvc: "123",
    expiryMonth: "11",
    expiryYear: "22",
  },
  declinedBackEnd: {
    cardNumber: "4349 0030 0004 7015",
    cardName: "Juan Pérez",
    cvc: "123",
    expiryMonth: "11",
    expiryYear: "22",
  }
};

const App = () => {

  const kushki = new Kushki({
    merchantId: MERCHANT_ID,
    inTestEnvironment: true
  });

  const [data, setData] = useState({
    cardName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
  });

  const [token, setToken] = useState ("");
  const [error, setError] = useState (undefined);
  const [loading, setLoading] = useState  (false);
  const [success, setSuccess] = useState (undefined);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(undefined);
    setToken("");

    kushki.requestToken(
      {
        amount: chargeAmount,
        currency: chargeCurrency,
        card: {
          name: data.cardName,
          number: data.cardNumber.replace(/ /g, ""),
          cvc: data.cvc,
          expiryMonth: data.expiryMonth,
          expiryYear: data.expiryYear,
        },
      },
      (response) => {
        if(!response.code){
          setToken(response.token);
          
          axios
            .post("https://kushki-backend-examples.vercel.app/api/cards", {
              amount: chargeAmount,
              token: response.token,
            })
            .then((response) => {
              console.log(response.data);
              setSuccess(response.data);
            })
            .catch((error) => {
              try {
                if (error.response.data) {
                  setError(error.response.data.message);
                } else {
                  console.error(error);
                }
              } catch (error) {
                setError("Intente nuevamente.");
              }
              
            })
            .finally(() => {
              setLoading(false);
            });
        }
        else{
          setLoading(false);
          setError(response.message);
        }        
      }
    );
  };

  const handleTestApproved = () => {
    const { approved } = testCards;
    setData({
      cardName: approved.cardName,
      cardNumber: approved.cardNumber,
      expiryMonth: approved.expiryMonth,
      expiryYear: approved.expiryYear,
      cvc: approved.cvc
    });
  };

  const handleTestDeclinedFrontEnd = () => {
    const { declinedFrontEnd } = testCards;
    setData({
      cardName: declinedFrontEnd.cardName,
      cardNumber: declinedFrontEnd.cardNumber,
      expiryMonth: declinedFrontEnd.expiryMonth,
      expiryYear: declinedFrontEnd.expiryYear,
      cvc: declinedFrontEnd.cvc
    });
  };

  const handleTestDeclinedBackEnd = () => {
    const { declinedBackEnd } = testCards;
    setData({
      cardName: declinedBackEnd.cardName,
      cardNumber: declinedBackEnd.cardNumber,
      expiryMonth: declinedBackEnd.expiryMonth,
      expiryYear: declinedBackEnd.expiryYear,
      cvc: declinedBackEnd.cvc
    });
  };

  const resetExample = () => {
    setSuccess(undefined);
    setToken("");
  };

  return (
    <div className="mainApp" >
    {!success ? (
  
      <div>

        <div className="contentWrapper">
            <h3>PAGOS ÚNICOS CON TARJETAS DE CRÉDITO</h3>

            <div className="logo">{logokushki}</div>

            <form className="paymentForm" onSubmit={handleSubmit}>
              <div className="form">
                <label>Número de tarjeta</label>
                <input
                  placeholder="Número de tarjeta"
                  type="text"
                  name="cardNumber"
                  value={data.cardNumber}
                  onChange={handleChange}
                  minLength="16"
                  maxLength="16"
                  required
                >
                </input>
              </div>
              <div className="form">
                <label>Nombre de tarjeta</label>
                <input
                  placeholder="Nombre de tarjeta"
                  type="text"
                  name="cardName"
                  value={data.cardName}
                  onChange={handleChange}
                  required
                >
                </input>
              </div>
              <div className="formDateExpiryCVC">

                <div className="itemDateExpiyCVC">
                  <label>Mes</label>
                  <input
                    placeholder="MM"
                    type="number"
                    min="1"
                    max="12"
                    name="expiryMonth"
                    value={data.expiryMonth}
                    onChange={handleChange}
                    required
                  >
                  </input>
                </div>

                <div className="itemDateExpiyCVC">
                  <label>Año</label>
                  <input
                    placeholder="YY"
                    type="number"
                    min="22"
                    max="30"
                    name="expiryYear"
                    value={data.expiryYear}
                    onChange={handleChange}
                    required
                  >
                  </input>
                </div>

                <div className="itemDateExpiyCVC">
                  <label>CVC</label>
                  <input
                    placeholder="CVC"
                    type="text"
                    name="cvc"
                    value={data.cvc}
                    onChange={handleChange}
                    minLength="3"
                    maxLength="7"
                    required
                  >
                  </input>
                </div>
              </div>
              <button id="btnSubmit" 
              type="submit">
                {loading ? (
                  `Procesando...`
                ) : (
                  `Quiero pagar $${chargeAmount}`
                )}
                </button>
            </form>
            
            {token && (
              <div className="marginTop1rem">
                <b>Token obtenido:</b> {token}
              </div>
            )}

            {error && (
              <div className="marginTop1rem">
                <b className="textRed">Error:</b> {error}
              </div>
            )}
            
        </div>
        
        <div className="contentBtnTest">
          <p>
            Por favor, seleccione el tipo de transacción de prueba.
          </p>
          <div>
            <button type="button" onClick={handleTestApproved}>Transacción aprobada</button>
            <button type="button" onClick={handleTestDeclinedFrontEnd}>Transacción declinada en solicitud de token</button>
            <button type="button" onClick={handleTestDeclinedBackEnd}>Transacción declinada </button>
          </div>
        </div>
      </div>
    ) : (
      <div className="contentWrapper">
        <div className="success">
          <p>Hola <strong>{success['details']['cardHolderName']}</strong> el resultado es: <span className="success-title">{success['details']['responseText']}</span></p>

          <p><strong>Número de Ticket:</strong> {success['ticketNumber']}</p>
          <p><strong>Número de Tarjeta:</strong> {success['details']['maskedCardNumber']}</p>
          <p><strong>Monto:</strong> {success['details']['requestAmount']}</p>
          <p><strong>Comercio:</strong> {success['details']['merchantName']}</p>
          <p><strong>País:</strong> {success['details']['cardCountry']}</p>
          <p>Gracias por preferir a <strong>KUSHKI</strong>. Hasta vernos de nuevo.
          </p>

          <div className="contentBtnTest">
              <button type="button" onClick={resetExample}>
                Intentar de nuevo
              </button>
          </div>

        </div>
      </div>
    )} 
    </div>
  );

};

export default App;
