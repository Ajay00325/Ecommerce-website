import { Skeleton } from '@mui/material';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';

const PaymentForm = ({ clientSecret, totalPrice }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setErrorMessage("");

        const { error: submitError } = await elements.submit();

        if (submitError) {
            setErrorMessage(submitError.message);
            return;
        }

        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
               return_url: "https://ecommerce-website-snowy-eight.vercel.app/order-confirm",
            },
        });

        if (error) {
            setErrorMessage(error.message);
        }
    };

    const paymentElementOptions = {
        layout: "tabs",
    };

    const isLoading = !clientSecret || !stripe || !elements;

    return (
        <div className="min-h-screen py-8">
            <form
                onSubmit={handleSubmit}
                className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md"
            >
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Payment Information
                </h2>

                {isLoading ? (
                    <Skeleton height={200} />
                ) : (
                    <>
                        {clientSecret && (
                            <PaymentElement options={paymentElementOptions} />
                        )}

                        {errorMessage && (
                            <div className="text-red-500 mt-3 text-center">
                                {errorMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-3 rounded-lg mt-6 font-semibold hover:bg-gray-800 transition duration-200 disabled:opacity-50"
                            disabled={!stripe || isLoading}
                        >
                            {isLoading
                                ? "Processing..."
                                : `Pay ₹${Number(totalPrice).toFixed(2)}`}
                        </button>
                    </>
                )}
            </form>
        </div>
    );
};

export default PaymentForm;