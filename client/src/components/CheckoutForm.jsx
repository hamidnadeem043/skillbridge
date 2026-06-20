import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useState } from 'react'

const CheckoutForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [message, setMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        confirmParams: {
  return_url: 'https://skillbridge-gamma-eight.vercel.app/orders'
}
      }
    })

    if (error) {
      setMessage(error.message)
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      <button
        disabled={isLoading || !stripe || !elements}
        className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Pay Now'}
      </button>
      {message && <p className="text-red-500 text-sm">{message}</p>}
    </form>
  )
}

export default CheckoutForm