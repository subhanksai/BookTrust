import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import "../CSS/main.css";

const UpdateForm = () => {
  const [InputValues, setInputValues] = useState("");

  const [errors, setErrors] = useState({});
  const [isOrderProformaChecked, setIsOrderProformaChecked] = useState(false);
  const [isCustomerIdChecked, setIsCustomerIdChecked] = useState(false);
  const [isInvoiceChecked, setIsInvoiceChecked] = useState(false);
  const [isPaypalInvoiceChecked, setIsPaypalInvoiceChecked] = useState(false);
  const [isUpdateBalance, setIsUpdateBalance] = useState(false); // State to track the checkbox

  const [transactionType, setTransactionType] = useState("no");

  const [outOfRemittanceAmount, setoutOfRemittanceAmount] = useState();
  const [formData, setFormData] = useState({
    remitterCountry: "",
    paymentReferenceNo: "",
    orderProformaNo: "",
    amountPaid: "",
    paypalInvoiceNo: "",
    paypalInvoiceDate: "",
    paypalInvoiceAmount: "",
    currencyType: "",
    paidByPaypal: "",
    exchangeRate: "",
    paypalTransactionId: "",
    bankRemittanceDate: "",
    bankRemittanceAmount: "",
    bankRemittanceNo: "",
    outOfRemittanceForOrder: "",
    firc: "",
    buyercustomerId: "",
    buyerDetails: {
      Name: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      country: "",
      zip: "",
      Phone: "",
      Email: "",
    },
    remittercustomerId: "",
    remitterDetails: {
      Name: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      country: "",
      zip: "",
      Phone: "",
      Email: "",
    },
    osrNo: "",
    osrDate: "",
    edpms: "",
    totalOrderValue: "",
    balanceAmount: "",
    awb: "",
    sb: "",
    sbd: "",

    sbAddress: {
      Name: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      country: "",
      zip: "",
    },
    sbSubmitted: "",
    sbFilingDate: "",
    sbRealisedDate: "",
    IRMfromBank: "",
    ebrc: "",
    yesNoOption: "no",
    portCode: "",
    modeOfPayment: "",
    ReasonforCancellation: "",
    isCancelled: false,
    OrderUpdatedAt: "",
  });
  const [curBalance, setCurBalance] = useState("");

  const [error, setError] = useState("");

  const [prevBalance, setPrevBalance] = useState(formData.balanceAmount);
  const [updateBalance, setupdateBalance] = useState("");

  // function calculateRemainingBalanceForNew(val1, val2, total) {
  //   console.log(val1, val2, total);

  //   const remaining = total - (parseFloat(val1) || 0) - (parseFloat(val2) || 0);
  //   console.log(remaining);

  //   return remaining.toFixed(2);
  // }

  // // Utility function to calculate remaining balance for "Cancel" transaction
  // function calculateRemainingBalanceForCancel(val1, val2, total) {
  //   console.log("Inputs for Cancel:", val1, val2, total);

  //   const numVal1 = parseFloat(val1) || 0;
  //   const numVal2 = parseFloat(val2) || 0;
  //   const numTotal = parseFloat(total) || 0;

  //   const remaining = numTotal + numVal1 + numVal2;
  //   console.log("Remaining Balance for Cancel:", remaining);

  //   return remaining.toFixed(2);
  // }

  // // Handle changes in calculation-related fields
  // const handleCalChange = (e) => {
  //   const { name, value } = e.target;

  //   // Ensure the value is a valid number
  //   const updatedValue = parseFloat(value) || 0;

  //   setFormData((prevData) => {
  //     const updatedData = {
  //       ...prevData,
  //       [name]: updatedValue, // Dynamically update the changed field
  //     };

  //     // Calculate balance based on the "New" transaction logic
  //     updatedData.balanceAmount = calculateRemainingBalanceForNew(
  //       updatedData.edpms,
  //       updatedData.totalOrderValue,
  //       prevBalance
  //     );

  //     return updatedData;
  //   });
  // };

  // // Handle changes in transaction type
  // const handleTransactionTypeChange = (event) => {
  //   const selectedType = event.target.value;
  //   setTransactionType(selectedType); // Update transaction type state

  //   setFormData((prevData) => {
  //     const updatedData = { ...prevData };

  //     if (selectedType === "new") {
  //       // Reset fields for "New" transaction
  //       updatedData.totalOrderValue = 0;
  //       updatedData.edpms = 0;
  //       updatedData.orderProformaNo = "";
  //       updatedData.ReasonforCancellation = "";
  //       updatedData.invoiceNo = "";
  //       updatedData.invoiceDate = "";
  //       updatedData.isCancelled = false;

  //       // updatedData.balanceAmount = calculateRemainingBalanceForNew(
  //       //   0,
  //       //   0,
  //       //   prevBalance
  //       // );
  //     } else if (selectedType === "cancel") {
  //       // Calculate balance for "Cancel" transaction
  //       updatedData.balanceAmount = calculateRemainingBalanceForCancel(
  //         prevData.edpms,
  //         prevData.totalOrderValue,
  //         curBalance
  //       );
  //     }

  //     return updatedData; // Return updated form data
  //   });

  //   // Update the previous balance for reference
  //   setPrevBalance(curBalance || 0);
  // };

  function calculateRemainingBalanceForNew(val1, val2, total) {
    console.log(val1, val2, total);

    const remaining = total - (parseFloat(val1) || 0) - (parseFloat(val2) || 0);
    console.log(remaining);

    return remaining.toFixed(2);
  }

  // Utility function to calculate remaining balance for "Cancel" transaction
  function calculateRemainingBalanceForCancel(val1, val2, total) {
    const numVal1 = parseFloat(val1) || 0;
    const numVal2 = parseFloat(val2) || 0;
    const numTotal = parseFloat(total) || 0;
    const remaining = numTotal + numVal1 + numVal2;
    return remaining.toFixed(2);
  }

  // Handle changes in calculation-related fields
  const handleCalChange = (e) => {
    const { name, value } = e.target;
    console.log("Here", updateBalance);

    // Parse the input value as a valid number
    const updatedValue = parseFloat(value) || 0;

    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: updatedValue, // Update the changed field dynamically
      };

      // Calculate the balance based on transaction type
      const calculateBalance = () => {
        if (transactionType === "new") {
          return calculateRemainingBalanceForNew(
            updatedData.edpms,
            updatedData.totalOrderValue,
            prevBalance
          );
        } else if (transactionType === "update" && isUpdateBalance) {
          return calculateRemainingBalanceForNew(
            updatedData.edpms,
            updatedData.totalOrderValue,
            updateBalance
          );
        }
        return updatedData.balanceAmount; // Default to existing balance if no change
      };

      const newBalance = calculateBalance();
      updatedData.balanceAmount = newBalance; // Update the calculated balance
      setCurBalance(newBalance); // Reflect the balance for UI rendering

      return updatedData; // Return the updated form data
    });
  };

  // Handle transaction type changes
  const handleUpdateBalanceCheckboxChange = (e) => {
    const { checked } = e.target; // Get checkbox checked status
    setIsUpdateBalance(checked);

    setFormData((prevData) => {
      const updatedData = { ...prevData };
      const edpms = parseFloat(prevData.edpms) || 0;
      const totalOrderValue = parseFloat(prevData.totalOrderValue) || 0;
      const currentBalance = parseFloat(curBalance) || 0;

      if (checked) {
        // Calculate cancel balance
        const cancelBalance = calculateRemainingBalanceForCancel(
          edpms,
          totalOrderValue,
          currentBalance
        );
        updatedData.balanceAmount = cancelBalance;

        setCurBalance(cancelBalance);
        setupdateBalance(cancelBalance); // State update

        // Log before the state update reflects
        // console.log("Cancel balance (immediately calculated):", cancelBalance);
        // console.log("State set to:", cancelBalance);

        // Reset fields for update balance calculation
        updatedData.totalOrderValue = 0;
        updatedData.edpms = 0;
      } else {
        // Reset to previous balance
        updatedData.balanceAmount = prevData.balanceAmount || 0;
        setCurBalance(updatedData.balanceAmount);
        console.log("Reset balance to:", updatedData.balanceAmount);
      }

      return updatedData;
    });
  };

  const handleTransactionTypeChange = (event) => {
    const selectedType = event.target.value;
    setTransactionType(selectedType); // Update transaction type state

    setFormData((prevData) => {
      const updatedData = { ...prevData };

      switch (selectedType) {
        case "new":
          // Reset fields for "New" transaction
          updatedData.totalOrderValue = 0;
          updatedData.edpms = 0;
          updatedData.orderProformaNo = "";
          updatedData.ReasonforCancellation = "";
          updatedData.invoiceNo = "";
          updatedData.invoiceDate = "";
          updatedData.isCancelled = false;
          break;

        case "update":
          updatedData.isCancelled = false;
          break;

        case "cancel":
          // Perform calculation for "Cancel" transaction
          const cancelBalance = calculateRemainingBalanceForCancel(
            parseFloat(prevData.edpms) || 0,
            parseFloat(prevData.totalOrderValue) || 0,
            parseFloat(curBalance) || 0
          );
          updatedData.balanceAmount = cancelBalance;
          setCurBalance(cancelBalance);
          updatedData.isCancelled = true;
          break;

        default:
          console.warn("Unhandled transaction type:", selectedType);
      }

      return updatedData; // Return the updated form data
    });

    // Update the previous balance for reference
    setPrevBalance(curBalance || 0);
  };

  // const handleUpdateBalanceCheckboxChange = (e) => {
  //   const { checked } = e.target; // Get the checkbox checked status
  //   setIsUpdateBalance(checked); // Update state with the new checkbox value

  //   setFormData((prevData) => {
  //     const updatedData = { ...prevData };

  //     // If checkbox is checked, calculate the balance using the current fields
  //     if (checked) {
  //       const cancelBalance = calculateRemainingBalanceForCancel(
  //         prevData.edpms,
  //         prevData.totalOrderValue,
  //         curBalance
  //       );
  //       updatedData.balanceAmount = cancelBalance;
  //       setCurBalance(cancelBalance); // Update the balance

  //     } else {
  //       // Optionally, reset balance when unchecked (if needed)
  //       updatedData.balanceAmount = prevData.balanceAmount;
  //       setCurBalance(prevData.balanceAmount);
  //     }
  //     return updatedData;

  //   });
  // };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;

    setFormData((prevState) => {
      if (isChecked) {
        // If checked, copy all relevant fields from buyerDetails to remitterDetails
        return {
          ...prevState,
          remitterDetails: {
            ...prevState.buyerDetails, // Copy everything from buyerDetails to remitterDetails
            remitterAddress: { ...prevState.buyerDetails.buyerAddress }, // Copy address as well
          },
          isSameAsBuyer: true,
        };
      } else {
        // If unchecked, reset both personal and address fields for remitterDetails
        return {
          ...prevState,
          remitterDetails: {
            Name: "",
            Phone: "",
            Email: "",
            remitterAddress: {
              address1: "",
              address2: "",
              city: "",
              state: "",
              zip: "",
            },
          },
          isSameAsBuyer: false,
        };
      }
    });
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    const idParts = id.split(".");

    if (idParts.length > 1) {
      // Update nested object (like buyerDetails.buyerAddress.address1)
      setFormData((prevState) => {
        let updatedState = { ...prevState };
        let nestedObject = updatedState;

        // Traverse through the object based on the parts of the ID
        idParts.forEach((part, index) => {
          if (index === idParts.length - 1) {
            nestedObject[part] = value;
          } else {
            nestedObject = nestedObject[part];
          }
        });

        return updatedState;
      });
    } else {
      // Update flat object (like buyerDetails.Name)
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
    // console.log(formData.ReasonforCancellation);
  };
  //SB Address - Replicate
  const handleSBAddressCheckboxChange = (e) => {
    const isChecked = e.target.checked;

    setFormData((prevState) => {
      if (isChecked) {
        // Copy remitterDetails to sbAddress
        return {
          ...prevState,
          sbAddress: { ...prevState.remitterDetails },
          isSBAddressSameAsRemitter: true,
        };
      } else {
        // Reset sbAddress fields
        return {
          ...prevState,
          sbAddress: {
            Name: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            zip: "",
            Phone: "",
            Email: "",
          },
          isSBAddressSameAsRemitter: false,
        };
      }
    });
  };

  const handleRadioChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      yesNoOption: event.target.value,
    }));
  };
  // Helper function to add identifiers to query parameters
  function addIdentifiersToQuery({
    InputValues,
    isOrderProformaChecked,
    isCustomerIdChecked,
    isInvoiceChecked,
    isPaypalInvoiceChecked, // Ensure this is passed correctly
  }) {
    const data = [];

    // Helper to add identifiers if conditions are met
    const addIdentifier = (isChecked, identifier) => {
      if (isChecked && InputValues && typeof InputValues === "string") {
        data.push({
          identifier, // Identifier (e.g., i1, i2, i3)
          values: InputValues.split(",").map((value) => value.trim()), // Split and trim values
        });
      }
    };

    // Add identifiers based on the checkbox state
    addIdentifier(isOrderProformaChecked, "i1"); // For Order Proforma
    addIdentifier(isCustomerIdChecked, "i2"); // For Customer ID
    addIdentifier(isInvoiceChecked, "i3"); // For Invoice
    addIdentifier(isPaypalInvoiceChecked, "i4"); // For Paypal Invoice

    return data;
  }

  const handleSearch = async (e) => {
    e.preventDefault();

    // Generate identifiers based on user input
    const identifiers = addIdentifiersToQuery({
      InputValues, // Use searchTerm as the input value
      isOrderProformaChecked,
      isCustomerIdChecked,
      isInvoiceChecked,
      isPaypalInvoiceChecked,
    });
    console.log("Generated Identifiers:", identifiers);

    try {
      // Prepare the params object dynamically for the first request
      const params = {};

      // Flatten identifiers into params
      if (identifiers && Array.isArray(identifiers)) {
        identifiers.forEach(({ identifier, values }) => {
          if (identifier && values && values.length > 0) {
            params[identifier] = values.join(","); // Flatten identifiers as comma-separated values
          }
        });
      }

      console.log("Request Params for first call:", params);

      // Send API request with the constructed params
      const response = await axios.get("http://localhost:8085/api/getOrder", {
        params,
      });

      // Ensure response.data.orders exists and is an array before accessing
      if (
        response.data &&
        Array.isArray(response.data.orders) &&
        response.data.orders.length > 0
      ) {
        setFormData(response.data.orders[0]); // Set the first order from the response

        // Prepare params for the second request to get remittercustomerId data
        const secondParams = {};

        // Ensure remittercustomerId exists and is a string
        if (
          response.data.orders[0].remittercustomerId &&
          typeof response.data.orders[0].remittercustomerId === "string"
        ) {
          // Add remittercustomerId to params with key 'i2'
          secondParams["i2"] = response.data.orders[0].remittercustomerId
            .split(",")
            .map((value) => value.trim())
            .join(",");
        }

        console.log("Request Params for second call:", secondParams);

        // Fetch data for the given remittercustomerId
        const secondResponse = await axios.get(
          "http://localhost:8085/api/getOrder",
          {
            params: secondParams,
          }
        );

        if (
          secondResponse.data &&
          Array.isArray(secondResponse.data.orders) &&
          secondResponse.data.orders.length > 0
        ) {
          const existingOrder = secondResponse.data.orders[0]; // Get the first matching order
          console.log("Fetched existing order:", existingOrder);

          // Calculate the updated balance from the fetched order
          let updatedBalance = parseFloat(existingOrder.balanceAmount) || 0; // Ensure it's a valid number
          console.log("Updated Balance:", updatedBalance);

          // Set the current balance
          setCurBalance(updatedBalance);
        } else {
          setError("No order found for the remitter customer.");
        }
      } else {
        setError("Order not found for the provided identifiers.");
      }
    } catch (err) {
      console.error("Error fetching order data:", err);
      setError("Error fetching order data"); // Handle API or network errors
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the updated form data
    const updatedFormData = {
      ...formData,

      ...(transactionType === "cancel" && {
        isCancelled: true,
      }), // Conditionally add isCancelled
    };

    // Remove _id if it's a new or cancel transaction
    if (
      transactionType === "new" ||
      transactionType === "update" ||
      transactionType === "cancel"
    ) {
      delete updatedFormData._id;
    }
    const ISTTime = () => {
      const utcDate = new Date(); // Get the current time in UTC

      // Convert UTC to IST by adding the offset (5 hours 30 minutes)
      const istOffset = 5.5 * 60 * 60000; // 5 hours 30 minutes in milliseconds
      const istTime = new Date(utcDate.getTime() + istOffset);

      return istTime;
    };

    // Correct way to update updatedFormData
    updatedFormData.OrderUpdatedAt = ISTTime();

    console.log(updatedFormData.OrderUpdatedAt);

    // Handle transactions based on type
    if (transactionType === "new" || transactionType === "cancel") {
      // Make a POST request for new or cancel transaction
      axios
        .post("http://localhost:8085/api/create", updatedFormData)
        .then((response) => {
          console.log("Transaction submitted successfully:", response.data);
          alert("Transaction submitted successfully");
          setFormData(updatedFormData); // Update state if necessary
        })
        .catch((error) => {
          console.error("Error submitting transaction:", error);
          alert("Failed to submit transaction. Please try again.");
        });
    } else if (transactionType === "update") {
      // Make a PUT request for updating an existing transaction
      axios
        // .put("http://localhost:8085/api/updateOrder", updatedFormData)
        .post("http://localhost:8085/api/create", updatedFormData)
        .then((response) => {
          console.log("Order updated successfully:", response.data);
          alert("Order updated successfully");
          setFormData(updatedFormData); // Update state if necessary
        })
        .catch((error) => {
          console.error("Error updating order:", error);
          alert("Failed to update order. Please try again.");
        });
    } else {
      alert("Please select a valid transaction type.");
    }
  };

  return (
    <div
      className="container my-5  width"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: "15px",
        width: "1500px",
        marginLeft: "6%",
        padding: "40px",
      }}
    >
      <h2 className="text-center mb-5">Update Order</h2>
      <div className="mb-3">
        <label htmlFor="InputValues" className="form-label">
          Enter Values (comma-separated):
        </label>
        <input
          type="text"
          id="InputValues"
          className="form-control"
          value={InputValues}
          onChange={(e) => setInputValues(e.target.value)}
          placeholder="Enter multiple values separated by commas"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Identify Fields:</label>
        <div>
          <div className="form-check">
            <input
              type="checkbox"
              id="orderProforma"
              className="form-check-input"
              checked={isOrderProformaChecked}
              onChange={() =>
                setIsOrderProformaChecked(!isOrderProformaChecked)
              }
            />
            <label className="form-check-label" htmlFor="orderProforma">
              Order Proforma
            </label>
          </div>

          <div className="form-check">
            <input
              type="checkbox"
              id="customerId"
              className="form-check-input"
              checked={isCustomerIdChecked}
              onChange={() => setIsCustomerIdChecked(!isCustomerIdChecked)}
            />
            <label className="form-check-label" htmlFor="customerId">
              Customer ID (Where Buyer & Remitter are Same)
            </label>
          </div>

          <div className="form-check">
            <input
              type="checkbox"
              id="InvoiceNo"
              className="form-check-input"
              checked={isInvoiceChecked}
              onChange={() => setIsInvoiceChecked(!isInvoiceChecked)}
            />
            <label className="form-check-label" htmlFor="InvoiceNo">
              Invoice No
            </label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              id="PayPalInvoiceNo"
              className="form-check-input"
              checked={isPaypalInvoiceChecked}
              onChange={() =>
                setIsPaypalInvoiceChecked(!isPaypalInvoiceChecked)
              }
            />
            <label className="form-check-label" htmlFor="PayPalInvoiceNo">
              Paypal Invoice No
            </label>
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleSearch}>
          Submit
        </button>
      </div>

      <div className="mb-3">
        <label className="form-label">Transaction Type:</label>
        <div className="form-check form-check-inline">
          <input
            type="radio"
            id="newTransaction"
            name="transactionType"
            value="new"
            className="form-check-input"
            checked={transactionType === "new"}
            onChange={handleTransactionTypeChange}
          />
          <label className="form-check-label" htmlFor="newTransaction">
            New Order
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            type="radio"
            id="updateTransaction"
            name="transactionType"
            value="update"
            className="form-check-input"
            checked={transactionType === "update"}
            onChange={handleTransactionTypeChange}
          />
          <label className="form-check-label" htmlFor="updateTransaction">
            Update Order
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            type="radio"
            id="CancelOrder"
            name="transactionType"
            value="cancel"
            className="form-check-input"
            checked={transactionType === "cancel"}
            onChange={handleTransactionTypeChange}
            disabled={!(isInvoiceChecked || isPaypalInvoiceChecked)}
          />
          <label className="form-check-label" htmlFor="CancelOrder">
            Cancel Order
          </label>
        </div>{" "}
        {transactionType === "update" && (
          <div className="form-check">
            <input
              type="checkbox"
              id="updateBalance"
              className="form-check-input"
              checked={isUpdateBalance} // Bind checkbox state
              onChange={handleUpdateBalanceCheckboxChange} // Handle change event
            />
            <label className="form-check-label" htmlFor="updateBalance">
              Update Charges!
            </label>
          </div>
        )}
      </div>

      <form
        className="row g-3 bg-light p-4 rounded shadow "
        onSubmit={handleSubmit}
      >
        <div>
          {/* Your component's UI */}
          <div className="col-md-4 custom-label text-with-border">
            <h4
              htmlFor="balanceAmount"
              className={`fontkind ${
                curBalance > 0 ? "text-success" : "text-danger"
              }`}
            >
              Balance Amount:&nbsp; &nbsp;
              {curBalance !== undefined ? curBalance : "N/A"}
            </h4>
          </div>
          {/* More UI elements */}
        </div>

        {(transactionType === "cancel" || formData.ReasonforCancellation) && (
          <>
            <div className="mb-3">
              <label htmlFor="ReasonforCancellation" className="form-label">
                Reason For Cancellation
              </label>
              <textarea
                className="form-control"
                id="ReasonforCancellation"
                value={formData.ReasonforCancellation}
                rows="3"
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </>
        )}

        {/* Row 1 */}
        <div className="col-md-1">
          <label htmlFor="slNo" className="form-label">
            SL.NO.
          </label>
          <input
            type="text"
            className="form-control"
            id="slNo"
            value={formData.slNo}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="orderProformaNo" className="form-label">
            Order Proforma No.
          </label>
          <input
            type="text"
            className={`form-control ${
              errors.orderProformaNo ? "is-invalid" : ""
            }`}
            id="orderProformaNo"
            value={formData.orderProformaNo}
            onChange={handleChange}
          />
          {errors.orderProformaNo && (
            <div className="invalid-feedback">{errors.orderProformaNo}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="modeOfPayment" className="form-label">
            Mode of Payment
          </label>
          <select
            className="form-control"
            name="modeOfPayment"
            value={formData.modeOfPayment} // Use selectedMode here
            onChange={handleChange}
            // Use handleModeChange
            disabled={true}
          >
            <option value="">Select Mode</option>
            <option value="PAYPAL">PAYPAL</option>
            <option value="SWIFT">SWIFT</option>
            <option value="NRE">NRE</option>
            <option value="FOREIGN BRANCH">Foreign Branch</option>
          </select>
        </div>

        {formData.modeOfPayment === "SWIFT" && (
          <>
            <div className="col-md-3">
              <label htmlFor="amountPaid" className="form-label">
                Amount Paid
              </label>
              <input
                type="text"
                className="form-control"
                id="amountPaid"
                value={formData.amountPaid}
                onChange={handleChange}
                disabled={true}
              />
            </div>
            <div className="col-md-1">
              <label htmlFor="currencyType" className="form-label">
                Currency
              </label>
              <input
                type="text"
                placeholder="USD, EU"
                className="form-control"
                id="currencyType"
                value={formData.currencyType}
                onChange={handleChange}
                disabled={true}
              />
            </div>
          </>
        )}

        {formData.modeOfPayment === "PAYPAL" && (
          <>
            <div className="col-md-4">
              <label htmlFor="paypalInvoiceNo" className="form-label">
                PayPal Invoice No.
              </label>
              <input
                type="text"
                className="form-control"
                id="paypalInvoiceNo"
                value={formData.paypalInvoiceNo}
                onChange={handleChange}
                disabled={true}
              />
            </div>

            <div className="col-md-3">
              <label htmlFor="paypalInvoiceDate" className="form-label">
                PayPal Invoice Date
              </label>
              <input
                type="date"
                className="form-control"
                id="paypalInvoiceDate"
                value={
                  formData.paypalInvoiceDate
                    ? new Date(formData.paypalInvoiceDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={handleChange}
                disabled={true}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="paypalInvoiceAmount" className="form-label">
                PayPal Invoice Amount
              </label>
              <input
                type="number"
                className="form-control"
                id="paypalInvoiceAmount"
                value={formData.paypalInvoiceAmount}
                onChange={handleChange}
                disabled={true}
              />
            </div>
            <div className="col-md-1">
              <label htmlFor="currencyType" className="form-label">
                Currency
              </label>
              <input
                type="text"
                placeholder="USD, EU"
                className="form-control"
                id="currencyType"
                value={formData.currencyType}
                onChange={handleChange}
                disabled={true}
              />
            </div>

            <div className="col-md-3">
              <label htmlFor="paidByPaypal" className="form-label">
                Paid by PayPal
              </label>
              <input
                type="text"
                className="form-control"
                id="paidByPaypal"
                value={formData.paidByPaypal}
                onChange={handleChange}
                disabled={true}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="exchangeRate" className="form-label">
                Exchange Rate
              </label>
              <input
                type="text"
                className="form-control"
                id="exchangeRate"
                value={formData.exchangeRate}
                onChange={handleChange}
                disabled={true}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="paypalTransactionId" className="form-label">
                PayPal Transaction ID
              </label>
              <input
                type="text"
                className="form-control"
                id="paypalTransactionId"
                value={formData.paypalTransactionId}
                onChange={handleChange}
                disabled={true}
              />
            </div>
          </>
        )}

        <div></div>
        {/* Additional Fields */}
        <div className="col-md-3">
          <label htmlFor="bankRemittanceDate" className="form-label">
            Bank Remittance Date
          </label>
          <input
            type="date"
            className="form-control"
            id="bankRemittanceDate"
            value={
              formData.bankRemittanceDate
                ? new Date(formData.bankRemittanceDate)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={handleChange}
            disabled={true}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="bankRemittanceAmount" className="form-label">
            Bank Remittance Amount
          </label>
          <input
            type="number"
            className="form-control"
            id="bankRemittanceAmount"
            value={formData.bankRemittanceAmount}
            onChange={handleChange}
            disabled={true}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="bankRemittanceNo" className="form-label">
            Bank Remittance No.
          </label>
          <input
            type="text"
            className="form-control"
            id="bankRemittanceNo"
            value={formData.bankRemittanceNo}
            onChange={handleChange}
            disabled={true}
          />
        </div>
        {formData.modeOfPayment === "PAYPAL" && (
          <>
            {" "}
            <div className="col-md-4">
              <label htmlFor="outOfRemittanceForOrder" className="form-label">
                Out of Remittance for Order
              </label>
              <div
                id="outOfRemittanceForOrder"
                className="form-control bg-light"
                style={{
                  border: "1px solid #ced4da",
                  padding: "0.375rem 0.75rem",
                }}
              >
                {/* Display the dynamically updated value of outOfRemittanceForOrder */}
                {formData.outOfRemittanceForOrder || "N/A"}
              </div>
            </div>
            <div className="col-md-4">
              <label htmlFor="firc" className="form-label">
                FIRC
              </label>
              <input
                type="text"
                className="form-control"
                id="firc"
                value={formData.firc}
                disabled={true}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        <div></div>

        {/* Buyer Details Section */}
        <div>
          <fieldset disabled={true}>
            <h4 className="mt-3">Buyer Details</h4>
            <div className="row">
              {/* Buyer Customer ID */}
              <div className="col-md-2">
                <label htmlFor="buyercustomerId" className="form-label">
                  Buyer Customer ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="buyercustomerId"
                  value={formData.buyercustomerId}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Buyer Address Section */}
            <div className="address-section mt-2 mb-5">
              <div className="row">
                {/* Buyer Name */}
                <div className="col-md-4 mb-2">
                  <label htmlFor="buyerDetails.Name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="buyerDetails.Name"
                    value={formData.buyerDetails.Name}
                    onChange={handleChange}
                  />
                </div>

                {/* Address 1 */}
                <div className="col-md-6">
                  <label htmlFor="buyerDetails.address1" className="form-label">
                    Address 1
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="buyerDetails.address1"
                    value={formData.buyerDetails.address1}
                    onChange={handleChange}
                  />
                </div>

                {/* Address 2 */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="buyerDetails.address2" className="form-label">
                    Address 2
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="buyerDetails.address2"
                    value={formData.buyerDetails.address2}
                    onChange={handleChange}
                  />
                </div>

                {/* City */}
                <div className="col-md-4">
                  <label htmlFor="buyerDetails.city" className="form-label">
                    City
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="buyerDetails.city"
                    value={formData.buyerDetails.city}
                    onChange={handleChange}
                  />
                </div>

                {/* State */}
                <div className="col-md-4">
                  <label htmlFor="buyerDetails.state" className="form-label">
                    State
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="buyerDetails.state"
                    value={formData.buyerDetails.state}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="buyerDetails.country" className="form-label">
                    Country
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="buyerDetails.country"
                    value={formData.buyerDetails.country}
                    onChange={handleChange}
                  />
                </div>

                {/* ZIP Code */}
                <div className="col-md-4 mt-2">
                  <label htmlFor="buyerDetails.zip" className="form-label">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="buyerDetails.zip"
                    value={formData.buyerDetails.zip}
                    onChange={handleChange}
                  />
                </div>

                {/* Buyer Phone */}
                <div className="col-md-3 mt-2">
                  <label htmlFor="buyerDetails.Phone" className="form-label">
                    Phone
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="buyerDetails.Phone"
                    value={formData.buyerDetails.Phone}
                    onChange={handleChange}
                  />
                </div>

                {/* Buyer Email */}
                <div className="col-md-4 mt-2">
                  <label htmlFor="buyerDetails.Email" className="form-label">
                    Email (Optional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="buyerDetails.Email"
                    value={formData.buyerDetails.Email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        <div className="form-check ms-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="sameAddress"
            checked={formData.isSameAsBuyer}
            onChange={handleCheckboxChange}
            disabled={true}
          />
          <label className="form-check-label" htmlFor="sameAddress">
            Remitter Address is the same as Buyer Address
          </label>
        </div>

        {/* Remitter Address Section */}
        <div>
          <h4 className="mb-3 mt-3">Remitter Details</h4>
          <fieldset disabled={true}>
            <div className="col-md-2">
              <label htmlFor="remittercustomerId" className="form-label">
                Remitter Customer ID
              </label>
              <input
                type="text"
                className="form-control"
                id="remittercustomerId"
                value={formData.remittercustomerId}
                onChange={handleChange}
              />
            </div>

            {/* Remitter Address Section */}
            <div className="address-section mt-3 mb-5">
              <div className="col-md-4">
                <label htmlFor="remitterDetails.Name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="remitterDetails.Name"
                  value={formData.remitterDetails.Name}
                  onChange={handleChange}
                />
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label
                    htmlFor="remitterDetails.address1"
                    className="form-label"
                  >
                    Address 1
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="remitterDetails.address1"
                    value={formData.remitterDetails.address1}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label
                    htmlFor="remitterDetails.address2"
                    className="form-label"
                  >
                    Address 2
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="remitterDetails.address2"
                    value={formData.remitterDetails.address2}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="remitterDetails.city" className="form-label">
                    City
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="remitterDetails.city"
                    value={formData.remitterDetails.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="remitterDetails.state" className="form-label">
                    State
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="remitterDetails.state"
                    value={formData.remitterDetails.state}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label
                    htmlFor="remitterDetails.country"
                    className="form-label"
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="remitterDetails.country"
                    value={formData.remitterDetails.country}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mt-2">
                  <label htmlFor="remitterDetails.zip" className="form-label">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="remitterDetails.zip"
                    value={formData.remitterDetails.zip}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mt-2">
                  <label htmlFor="remitterDetails.Phone" className="form-label">
                    Phone
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="remitterDetails.Phone"
                    value={formData.remitterDetails.Phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mt-2">
                  <label htmlFor="remitterDetails.Email" className="form-label">
                    Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="remitterDetails.Email"
                    value={formData.remitterDetails.Email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        <div className="col-md-3">
          <label htmlFor="osrNo" className="form-label">
            OSR Number
          </label>
          <input
            type="text"
            className="form-control"
            id="osrNo"
            value={formData.osrNo}
            onChange={handleChange}
            disabled={true}
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="osrDate" className="form-label">
            OSR Date
          </label>
          <input
            type="date"
            className="form-control"
            id="osrDate"
            value={
              formData.osrDate
                ? new Date(formData.osrDate).toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange}
            disabled={true}
          />
        </div>
        <div></div>
        <div className="col-md-4">
          <label htmlFor="invoiceNo" className="form-label">
            Invoice Number
          </label>
          <input
            type="text"
            className="form-control"
            id="invoiceNo"
            value={formData.invoiceNo}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="invoiceDate" className="form-label">
            Invoice Date
          </label>
          <input
            type="date"
            className="form-control"
            id="invoiceDate"
            value={
              formData.invoiceDate
                ? new Date(formData.invoiceDate).toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="edpms" className="form-label">
            EDPMS/ Bank Charges/ Other Expenses
          </label>
          <input
            type="text"
            className="form-control"
            id="edpms"
            name="edpms"
            value={formData.edpms}
            onChange={handleCalChange}
            disabled={formData.isCancelled === true} // Use conditional logic for the 'disabled' attribute
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="totalOrderValue" className="form-label">
            Total Order Value
          </label>
          <input
            type="text"
            name="totalOrderValue"
            className="form-control"
            id="totalOrderValue"
            value={formData.totalOrderValue}
            onChange={handleCalChange}
            disabled={formData.isCancelled === true}
          />
        </div>

        <div className="col-md-2">
          <label htmlFor="awb" className="form-label">
            AWB
          </label>
          <input
            type="text"
            className="form-control"
            id="awb"
            value={formData.awb}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <label htmlFor="sb" className="form-label">
            Shipping Bill
          </label>
          <input
            type="String"
            className="form-control"
            id="sb"
            value={formData.sb}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <label htmlFor="sbd" className="form-label">
            Shipping Bill Date
          </label>
          <input
            type="date"
            className="form-control"
            id="sbd"
            value={
              formData.sbd
                ? new Date(formData.sbd).toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange}
          />
        </div>
        <div className="form-check ms-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="sameSBAddress"
            checked={formData.isSBAddressSameAsRemitter}
            onChange={handleSBAddressCheckboxChange}
          />
          <label className="form-check-label" htmlFor="sameSBAddress">
            Shipping Bill Address is the same as Remitter Address
          </label>
        </div>

        <div className="address-section">
          <h4>Shipping Bill Address</h4>
          <div className="row">
            <div className="col-md-4">
              <label htmlFor="sbAddress.Name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="sbAddress.Name"
                value={formData.sbAddress.Name}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="sbAddress.address1" className="form-label">
                Address 1
              </label>
              <input
                type="text"
                className="form-control"
                id="sbAddress.address1"
                value={formData.sbAddress.address1}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="sbAddress.address2" className="form-label">
                Address 2
              </label>
              <input
                type="text"
                className="form-control"
                id="sbAddress.address2"
                value={formData.sbAddress.address2}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="sbAddress.city" className="form-label">
                City
              </label>
              <input
                type="text"
                className="form-control"
                id="sbAddress.city"
                value={formData.sbAddress.city}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="sbAddress.state" className="form-label">
                State
              </label>
              <input
                type="text"
                className="form-control"
                id="sbAddress.state"
                value={formData.sbAddress.state}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="sbAddress.country" className="form-label">
                Country
              </label>
              <input
                type="text"
                className="form-control"
                id="sbAddress.country"
                value={formData.sbAddress.country}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="sbAddress.zip" className="form-label">
                ZIP Code
              </label>
              <input
                type="text"
                className="form-control"
                id="sbAddress.zip"
                value={formData.sbAddress.zip}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <label className="form-label">Port Code</label>
          <select
            className="form-control"
            name="portCode"
            value={formData.portCode}
            onChange={handleChange}
          >
            <option value="">Select Mode</option> {/* Default empty option */}
            <option value="INBLR4">INBLR4</option>
            <option value="INMAA1">INMAA1</option>
          </select>
        </div>

        {/* Yes/No Radio Buttons */}
        <div className="col-md-6">
          <label className="form-label">Is the information submitted?</label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="yesNoOption"
              id="yesOption"
              value="yes"
              checked={formData.yesNoOption === "yes"}
              onChange={handleRadioChange}
            />
            <label className="form-check-label" htmlFor="yesOption">
              Yes
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="yesNoOption"
              id="noOption"
              value="no"
              checked={formData.yesNoOption === "no"}
              onChange={handleRadioChange}
            />
            <label className="form-check-label" htmlFor="noOption">
              No
            </label>
          </div>
        </div>
        <div className="col-md-6">
          <label htmlFor="sbFilingDate" className="form-label">
            SB Filing Date
          </label>
          <input
            type="date"
            className="form-control"
            id="sbFilingDate"
            value={
              formData.sbFilingDate
                ? new Date(formData.sbFilingDate).toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="sbRealisedDate" className="form-label">
            SB RealisedDate
          </label>
          <input
            type="date"
            className="form-control"
            id="sbRealisedDate"
            value={
              formData.sbRealisedDate
                ? new Date(formData.sbRealisedDate).toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="IRMfromBank" className="form-label">
            IRM from Bank
          </label>
          <input
            type="text"
            className="form-control"
            id="IRMfromBank"
            value={formData.IRMfromBank}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="ebrc" className="form-label">
            eBRC
          </label>
          <input
            type="text"
            className="form-control"
            id="ebrc"
            value={formData.ebrc}
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <div className="col-12 text-center mt-5 mb-5 d-grid gap-2">
          <button type="submit" className="btn btn-success px-4 ">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
export default UpdateForm;