import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

const Orders = () => {
  const [sellingOrders, setSellingOrders] = useState([])
  const [buyingOrders, setBuyingOrders] = useState([])
  const [activeTab, setActiveTab] = useState('buying')
  const [loading, setLoading] = useState(false)
  const { currentUser } = useSelector(state => state.user)
  const navigate = useNavigate()
  const { search } = useLocation()

  useEffect(() => {
    const confirmAndFetch = async () => {
      setLoading(true)

      const params = new URLSearchParams(search)
      const paymentIntent = params.get('payment_intent')

      if (paymentIntent) {
        try {
          await axios.put(
            `https://skillbridge-production-cfdd.up.railway.app/api/orders/confirm/${paymentIntent}`,
            {},
            { withCredentials: true }
          )
        } catch (error) {
          console.log(error)
        }
      }

      try {
        const res = await axios.get('https://skillbridge-production-cfdd.up.railway.app/api/orders', {
          withCredentials: true
        })
        setSellingOrders(res.data.sellingOrders)
        setBuyingOrders(res.data.buyingOrders)
      } catch (error) {
        console.log(error)
      }

      setLoading(false)
    }
    confirmAndFetch()
  }, [search])

  const handleContact = async (order) => {
    const sellerId = order.sellerId
    const buyerId = order.buyerId
    const id = sellerId + buyerId

    try {
      const res = await axios.get(
        `https://skillbridge-production-cfdd.up.railway.app/api/conversations/single/${id}`,
        { withCredentials: true }
      )
      navigate(`/message/${res.data.id}`)
    } catch (error) {
      if (error.response?.status === 404) {
        const res = await axios.post(
          'https://skillbridge-production-cfdd.up.railway.app/api/conversations',
          { to: currentUser.isSeller ? buyerId : sellerId },
          { withCredentials: true }
        )
        navigate(`/message/${res.data.id}`)
      }
    }
  }

  const OrderTable = ({ orders }) => (
    orders.length === 0 ? (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-700">No orders here yet</h3>
      </div>
    ) : (
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-4 text-gray-600 font-medium">Image</th>
            <th className="text-left py-4 text-gray-600 font-medium">Title</th>
            <th className="text-left py-4 text-gray-600 font-medium">Price</th>
            <th className="text-left py-4 text-gray-600 font-medium">Status</th>
            <th className="text-left py-4 text-gray-600 font-medium">Contact</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-4">
                <img
                  src={order.img || 'https://via.placeholder.com/100x60'}
                  alt={order.title}
                  className="w-20 h-12 object-cover rounded-lg"
                />
              </td>
              <td className="py-4">
                <p className="font-medium text-gray-800">{order.title}</p>
              </td>
              <td className="py-4">
                <span className="font-bold text-green-600">${order.price}</span>
              </td>
              <td className="py-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                  Completed
                </span>
              </td>
              <td className="py-4">
                <button
                  onClick={() => handleContact(order)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                >
                  Contact
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  )

  if (loading) return <div className="text-center py-20">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto px-10 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Orders</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('buying')}
          className={`pb-3 px-2 font-medium ${
            activeTab === 'buying'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500'
          }`}
        >
          My Purchases ({buyingOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('selling')}
          className={`pb-3 px-2 font-medium ${
            activeTab === 'selling'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500'
          }`}
        >
          My Sales ({sellingOrders.length})
        </button>
      </div>

      {activeTab === 'buying' ? (
        <OrderTable orders={buyingOrders} />
      ) : (
        <OrderTable orders={sellingOrders} />
      )}

    </div>
  )
}

export default Orders