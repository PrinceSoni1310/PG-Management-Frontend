import axios from "axios";

const PaymentButton = ({ amount, pgId, month, year }) => {
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");

      // 1. Create Order
      const { data } = await axios.post(
        "http://localhost:3000/api/payment/order",
        { amount, pgId, month, year },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 2. Razorpay options
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.order_id,
        name: "PG Management",
        description: "Rent Payment",

        handler: async function (response) {
          // 3. Verify Payment
          await axios.post(
            "http://localhost:3000/api/payment/verify",
            response,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          alert("Payment Successful ✅");
        },

        modal: {
          ondismiss: () => {
            alert("Payment Cancelled ❌");
          },
        },

        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
      alert("Payment Failed ❌");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-green-600 text-white px-6 py-2 rounded-lg"
    >
      Pay ₹{amount}
    </button>
  );
};

export default PaymentButton;