import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'

const MyGigs = () => {
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(false)
  const { currentUser } = useSelector(state => state.user)

  useEffect(() => {
    const fetchMyGigs = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`https://skillbridge-production-cfdd.up.railway.app/api/gigs?userId=${currentUser._id}`)
        setGigs(res.data)
      } catch (error) {
        console.log(error)
      }
      setLoading(false)
    }
    fetchMyGigs()
  }, [currentUser])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gig?')) return

    try {
      await axios.delete(`https://skillbridge-production-cfdd.up.railway.app/api/gigs/${id}`, {
        withCredentials: true
      })
      setGigs(prev => prev.filter(gig => gig._id !== id))
    } catch (error) {
      console.log(error)
    }
  }

  if (loading) return <div className="text-center py-20">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto px-10 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Gigs</h1>
        <Link
          to="/add"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
        >
          + New Gig
        </Link>
      </div>

      {gigs.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-700">No gigs yet</h3>
          <p className="text-gray-500 mt-2">Create your first gig to start selling</p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 text-gray-600 font-medium">Image</th>
              <th className="text-left py-4 text-gray-600 font-medium">Title</th>
              <th className="text-left py-4 text-gray-600 font-medium">Price</th>
              <th className="text-left py-4 text-gray-600 font-medium">Sales</th>
              <th className="text-left py-4 text-gray-600 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {gigs.map(gig => (
              <tr key={gig._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4">
                  <img
                    src={gig.coverImage || 'https://via.placeholder.com/100x60'}
                    alt={gig.title}
                    className="w-20 h-12 object-cover rounded-lg"
                  />
                </td>
                <td className="py-4">
                  <Link to={`/gig/${gig._id}`} className="font-medium text-gray-800 hover:text-green-600">
                    {gig.title}
                  </Link>
                </td>
                <td className="py-4">
                  <span className="font-bold text-green-600">${gig.price}</span>
                </td>
                <td className="py-4 text-gray-600">{gig.sales || 0}</td>
                <td className="py-4">
                  <button
                    onClick={() => handleDelete(gig._id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default MyGigs