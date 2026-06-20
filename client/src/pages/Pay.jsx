import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import CheckoutForm from '../components/CheckoutForm'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const Pay = () => {
  const [clientSecret, setClientSecret] = useState('')
  const { id } = useParams()

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await axios.post(
          `http://localhost:5000/api/orders/create-payment-intent`,
          { gigId: id },
          { withCredentials: true }
        )
        setClientSecret(res.data.clientSecret)
      } catch (error) {
        console.log(error)
      }
    }
    createPaymentIntent()
  }, [id])

  const appearance = { theme: 'stripe' }
  const options = { clientSecret, appearance }

  return (
    <div className="max-w-lg mx-auto px-10 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Complete Payment</h1>
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  )
}

export default Pay