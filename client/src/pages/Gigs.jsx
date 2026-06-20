import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'

const GigCard = ({ gig }) => (
  <Link to={`/gig/${gig._id}`} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
    <img
      src={gig.coverImage || 'https://via.placeholder.com/300x200'}
      alt={gig.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{gig.title}</h3>
      <div className="flex items-center gap-1 mb-3">
        <span className="text-yellow-400">⭐</span>
        <span className="text-sm font-medium">{gig.rating || 0}</span>
        <span className="text-sm text-gray-400">({gig.starNumber || 0})</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">Starting at</span>
        <span className="font-bold text-green-600 text-lg">${gig.price}</span>
      </div>
    </div>
  </Link>
)

const Gigs = () => {
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(false)
  const [sort, setSort] = useState('createdAt')
  const { search } = useLocation()

 useEffect(() => {
  const fetchGigs = async () => {
    setLoading(true)
    try {
      const res = await axios.get(
        `http://localhost:5000/api/gigs${search ? search + '&' : '?'}sort=${sort}`
      )
      setGigs(res.data)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }
  fetchGigs()
}, [search, sort])

  return (
    <div className="max-w-6xl mx-auto px-10 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">All Services</h1>
          <p className="text-gray-500 mt-1">Explore our wide range of services</p>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm">Sort by:</span>
          <select
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="createdAt">Newest</option>
            <option value="sales">Best Selling</option>
            <option value="price">Price</option>
          </select>
        </div>
      </div>

      {/* Gigs Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading gigs...</div>
      ) : gigs.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700">No gigs found</h3>
          <p className="text-gray-500 mt-2">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gigs.map(gig => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>
      )}

    </div>
  )
}

export default Gigs